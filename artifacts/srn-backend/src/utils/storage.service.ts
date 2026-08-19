import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

const BUCKET = 'payment-reports';
const SIGNED_URL_EXPIRY_SECONDS = 30 * 24 * 60 * 60; // 30 days

/**
 * Uploads a payment report to the private Supabase bucket and returns a signed URL.
 * 
 * Note: Uses upsert: true. If a webhook retries, the same filename will be overwritten, 
 * which is intended for idempotency in filename generation.
 */
export async function uploadPaymentReport(filename: string, buffer: Buffer): Promise<string> {
  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error('Supabase credentials are not configured in environment variables.');
  }

  const path = `reports/${filename}`;

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(path, buffer, {
      contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      upsert: true,
    });

  if (uploadError) {
    throw new Error(`Failed to upload payment report: ${uploadError.message}`);
  }

  const { data: signedUrlData, error: signedUrlError } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(path, SIGNED_URL_EXPIRY_SECONDS);

  if (signedUrlError || !signedUrlData) {
    throw new Error(`Failed to create signed URL: ${signedUrlError?.message}`);
  }

  return signedUrlData.signedUrl;
}
