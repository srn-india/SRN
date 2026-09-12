import { OAuth2Client } from 'google-auth-library';
import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';
// @ts-ignore
import MailComposer from 'nodemailer/lib/mail-composer';
import logger from './logger';

export interface GmailCredentials {
  token?: string;
  refresh_token?: string;
  client_id?: string;
  client_secret?: string;
  token_uri?: string;
  scopes?: string[];
  user_email?: string;
}

let cachedCredentials: GmailCredentials | null = null;
let cachedOAuth2Client: OAuth2Client | null = null;

/**
 * Attempts to extract credentials from a python pickle binary buffer using python3.
 */
function extractFromPickle(b64Data: string): GmailCredentials | null {
  try {
    const pythonScript = `
import pickle, base64, json, sys, io

b64 = sys.argv[1]
raw = base64.b64decode(b64)

class SafeUnpickler(pickle.Unpickler):
    def find_class(self, module, name):
        try:
            return super().find_class(module, name)
        except Exception:
            class Dummy: pass
            return Dummy

unpickler = SafeUnpickler(io.BytesIO(raw))
creds = unpickler.load()

data = {
    'token': getattr(creds, 'token', None),
    'refresh_token': getattr(creds, 'refresh_token', None),
    'client_id': getattr(creds, 'client_id', None),
    'client_secret': getattr(creds, 'client_secret', None),
    'token_uri': getattr(creds, 'token_uri', 'https://oauth2.googleapis.com/token'),
    'scopes': getattr(creds, 'scopes', []),
}
print(json.dumps(data))
`;
    const stdout = execFileSync('python3', ['-c', pythonScript, b64Data], {
      encoding: 'utf8',
      timeout: 5000,
    });
    return JSON.parse(stdout.trim());
  } catch (err: any) {
    logger.warn(`Failed to unpack pickle via python3: ${err.message}`);
    return null;
  }
}


/**
 * Loads Gmail OAuth credentials from GMAIL_TOKEN_B64, token.pickle file, or environment variables.
 */
export function getGmailCredentials(): GmailCredentials | null {
  if (cachedCredentials) {
    return cachedCredentials;
  }

  const b64 = process.env.GMAIL_TOKEN_B64;
  if (b64 && b64.trim()) {
    const trimmed = b64.trim();
    // 1. Try JSON decode first
    try {
      const decodedUtf8 = Buffer.from(trimmed, 'base64').toString('utf8');
      if (decodedUtf8.trim().startsWith('{')) {
        const parsed = JSON.parse(decodedUtf8);
        if (parsed.refresh_token || parsed.client_id) {
          cachedCredentials = parsed;
          logger.info('Loaded Gmail OAuth credentials from base64-encoded JSON.');
          return cachedCredentials;
        }
      }
    } catch {
      // Not utf8 JSON, proceed to pickle extraction
    }

    // 2. Try Python pickle decode
    const fromPickle = extractFromPickle(trimmed);
    if (fromPickle && (fromPickle.refresh_token || fromPickle.client_id)) {
      cachedCredentials = fromPickle;
      logger.info('Loaded Gmail OAuth credentials from base64-encoded token.pickle.');
      return cachedCredentials;
    }
  }

  // 3. Try reading local token.pickle if present
  const picklePaths = [
    process.env.GMAIL_TOKEN_PICKLE_PATH,
    path.resolve(process.cwd(), 'token.pickle'),
    path.resolve(process.cwd(), '..', 'token.pickle'),
    path.resolve(process.cwd(), '..', '..', 'token.pickle'),
  ].filter(Boolean) as string[];

  for (const p of picklePaths) {
    if (fs.existsSync(p)) {
      try {
        const fileData = fs.readFileSync(p);
        const b64Str = fileData.toString('base64');
        const fromPickle = extractFromPickle(b64Str);
        if (fromPickle && (fromPickle.refresh_token || fromPickle.client_id)) {
          cachedCredentials = fromPickle;
          logger.info(`Loaded Gmail OAuth credentials from disk file: ${p}`);
          return cachedCredentials;
        }
      } catch (e: any) {
        logger.warn(`Could not read pickle from ${p}: ${e.message}`);
      }
    }
  }

  // 4. Try standard individual environment variables
  const clientId = process.env.GMAIL_CLIENT_ID || process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GMAIL_CLIENT_SECRET || process.env.GOOGLE_CLIENT_SECRET;
  const refreshToken = process.env.GMAIL_REFRESH_TOKEN || process.env.GOOGLE_REFRESH_TOKEN;

  if (clientId && clientSecret && refreshToken) {
    cachedCredentials = {
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
    };
    logger.info('Loaded Gmail OAuth credentials from discrete environment variables.');
    return cachedCredentials;
  }

  return null;
}

/**
 * Returns true if Gmail OAuth API is configured and ready.
 */
export function isGmailOAuthConfigured(): boolean {
  const creds = getGmailCredentials();
  return !!(creds && creds.client_id && creds.client_secret && creds.refresh_token);
}

/**
 * Returns an OAuth2Client configured with our credentials.
 */
function getOAuth2Client(): OAuth2Client {
  if (cachedOAuth2Client) {
    return cachedOAuth2Client;
  }

  const creds = getGmailCredentials();
  if (!creds || !creds.client_id || !creds.client_secret) {
    throw new Error('Gmail OAuth credentials not configured.');
  }

  const client = new OAuth2Client(creds.client_id, creds.client_secret);
  client.setCredentials({
    refresh_token: creds.refresh_token,
    access_token: creds.token,
  });

  cachedOAuth2Client = client;
  return client;
}

export interface SendGmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
  attachments?: any[];
}

/**
 * Sends an email directly via the official Gmail REST API (users.messages.send).
 * Bypasses SMTP entirely for ~200ms latency.
 */
export async function sendGmailViaAPI(options: SendGmailOptions): Promise<{ messageId: string; threadId?: string }> {
  const { to, subject, html, attachments } = options;
  const creds = getGmailCredentials();

  const fromEmail = options.from || process.env.EMAIL_FROM || process.env.EMAIL_USER || 'no-reply@srnindia.org';
  const mailComposer = new (MailComposer as any)({
    from: `"Sashakt Rashtra Nirman" <${fromEmail}>`,
    to,
    subject,
    html,
    attachments,
  });

  const messageBuffer: Buffer = await mailComposer.compile().build();
  const raw = messageBuffer.toString('base64url');

  const client = getOAuth2Client();
  const accessTokenResp = await client.getAccessToken();
  const accessToken = accessTokenResp.token;

  if (!accessToken) {
    throw new Error('Failed to obtain Google access token from refresh token.');
  }

  const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ raw }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    logger.error(`Gmail API send failed [HTTP ${response.status}]: ${errorText}`);
    throw new Error(`Gmail API error: ${response.statusText} - ${errorText}`);
  }

  const data: any = await response.json();
  logger.info(`Email successfully dispatched via Gmail API! ID: ${data.id}`);
  return {
    messageId: data.id,
    threadId: data.threadId,
  };
}
