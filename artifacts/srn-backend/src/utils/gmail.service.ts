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
 * Loads Gmail OAuth credentials from GMAIL_TOKEN_B64, GMAIL_CREDENTIALS_JSON, token.json, token.pickle file, or environment variables.
 */
export function getGmailCredentials(): GmailCredentials | null {
  if (cachedCredentials) {
    return cachedCredentials;
  }

  // 1. Check GMAIL_CREDENTIALS_JSON (raw JSON string)
  const rawJson = process.env.GMAIL_CREDENTIALS_JSON;
  if (rawJson && rawJson.trim().startsWith('{')) {
    try {
      const parsed = JSON.parse(rawJson.trim());
      if (parsed.refresh_token && parsed.client_id) {
        cachedCredentials = parsed;
        logger.info('Loaded Gmail OAuth credentials from GMAIL_CREDENTIALS_JSON.');
        return cachedCredentials;
      }
    } catch (e: any) {
      logger.warn(`Failed to parse GMAIL_CREDENTIALS_JSON: ${e.message}`);
    }
  }

  // 2. Check GMAIL_TOKEN_B64 (could be base64 JSON, raw JSON, or base64 pickle)
  const b64 = process.env.GMAIL_TOKEN_B64;
  if (b64 && b64.trim()) {
    let trimmed = b64.trim();
    // Strip leading and trailing quotes if the user entered quotes in Render dashboard
    if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
      trimmed = trimmed.slice(1, -1).trim();
    }
    const cleanB64 = trimmed.replace(/\s+/g, '');

    // Raw JSON directly pasted into GMAIL_TOKEN_B64
    if (trimmed.startsWith('{')) {
      try {
        const parsed = JSON.parse(trimmed);
        if (parsed.refresh_token && parsed.client_id) {
          cachedCredentials = parsed;
          logger.info('Loaded Gmail OAuth credentials from raw JSON in GMAIL_TOKEN_B64.');
          return cachedCredentials;
        }
      } catch {}
    }

    // Try JSON decode from base64
    try {
      const decodedUtf8 = Buffer.from(cleanB64, 'base64').toString('utf8');
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

    // Try Python pickle decode
    const fromPickle = extractFromPickle(cleanB64);
    if (fromPickle && (fromPickle.refresh_token || fromPickle.client_id)) {
      cachedCredentials = fromPickle;
      logger.info('Loaded Gmail OAuth credentials from base64-encoded token.pickle.');
      return cachedCredentials;
    }
  }

  // 3. Try reading local token.json or token.pickle from disk if present
  const diskPaths = [
    path.resolve(process.cwd(), 'token.json'),
    path.resolve(process.cwd(), '..', 'token.json'),
    path.resolve(process.cwd(), '..', '..', 'token.json'),
    process.env.GMAIL_TOKEN_PICKLE_PATH,
    path.resolve(process.cwd(), 'token.pickle'),
    path.resolve(process.cwd(), '..', 'token.pickle'),
    path.resolve(process.cwd(), '..', '..', 'token.pickle'),
  ].filter(Boolean) as string[];

  for (const p of diskPaths) {
    if (fs.existsSync(p)) {
      try {
        if (p.endsWith('.json')) {
          const content = fs.readFileSync(p, 'utf8');
          const parsed = JSON.parse(content);
          if (parsed.refresh_token && parsed.client_id) {
            cachedCredentials = parsed;
            logger.info(`Loaded Gmail OAuth credentials from disk JSON: ${p}`);
            return cachedCredentials;
          }
        } else {
          const fileData = fs.readFileSync(p);
          const b64Str = fileData.toString('base64');
          const fromPickle = extractFromPickle(b64Str);
          if (fromPickle && (fromPickle.refresh_token || fromPickle.client_id)) {
            cachedCredentials = fromPickle;
            logger.info(`Loaded Gmail OAuth credentials from disk file: ${p}`);
            return cachedCredentials;
          }
        }
      } catch (e: any) {
        logger.warn(`Could not read credentials from ${p}: ${e.message}`);
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
 * Diagnostics information for debugging configuration state.
 */
export function getGmailDiagnostics() {
  const creds = getGmailCredentials();
  return {
    isConfigured: isGmailOAuthConfigured(),
    has_GMAIL_TOKEN_B64: !!process.env.GMAIL_TOKEN_B64,
    has_GMAIL_CREDENTIALS_JSON: !!process.env.GMAIL_CREDENTIALS_JSON,
    has_GMAIL_CLIENT_ID: !!process.env.GMAIL_CLIENT_ID,
    has_GMAIL_CLIENT_SECRET: !!process.env.GMAIL_CLIENT_SECRET,
    has_GMAIL_REFRESH_TOKEN: !!process.env.GMAIL_REFRESH_TOKEN,
    has_EMAIL_HOST: !!process.env.EMAIL_HOST,
    emailHost: process.env.EMAIL_HOST || '(not set)',
    credsSummary: creds ? {
      hasClientId: !!creds.client_id,
      clientIdPrefix: creds.client_id ? creds.client_id.substring(0, 15) + '...' : null,
      hasClientSecret: !!creds.client_secret,
      hasRefreshToken: !!creds.refresh_token,
    } : null,
  };
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
  // Set refresh_token only so OAuth2Client always automatically fetches a fresh access token
  client.setCredentials({
    refresh_token: creds.refresh_token,
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
  let accessTokenResp = await client.getAccessToken();
  let accessToken = accessTokenResp.token;

  if (!accessToken) {
    throw new Error('Failed to obtain Google access token from refresh token.');
  }

  let response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ raw }),
  });

  // If token expired (401), force refresh and retry once
  if (response.status === 401) {
    logger.warn('Gmail API returned 401. Refreshing access token and retrying...');
    const refreshRes = await client.refreshAccessToken();
    accessToken = refreshRes.credentials.access_token;
    response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ raw }),
    });
  }

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
