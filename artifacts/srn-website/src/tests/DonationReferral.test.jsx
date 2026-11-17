import { beforeEach, expect, it, vi } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Donate from '../pages/Donate';

vi.mock('../context/LanguageContext', () => ({ useLanguage: () => ({ lang: 'en' }) }));
vi.mock('../context/AuthContext', () => {
  const donor = { firstName: 'Test', lastName: 'Donor', email: 'donor@example.com', phone: '9876543210', state: 'Delhi', district: 'Delhi', avatar: 'photo.png' };
  return { useAuth: () => ({ user: donor, API_BASE: 'http://localhost:4000' }) };
});
vi.mock('browser-image-compression', () => ({ default: async file => file }));
vi.mock('../components/ProfileCompletionModal', () => ({ default: () => null }));
beforeEach(() => {
  vi.stubGlobal('localStorage', { getItem: () => 'token' });
  vi.stubGlobal('fetch', vi.fn(async url => ({ ok: true, json: async () => String(url).includes('upload-screenshot') ? { url: 'https://example.com/proof.png' } : { success: true } })));
  URL.createObjectURL = vi.fn(() => 'blob:proof');
  vi.spyOn(window, 'alert').mockImplementation(() => {});
});
it.each([['UPI', '  सीमा शर्मा  '], ['Bank', 'Referral Person'], ['UPI', '']])('submits an optional referrer with %s donations', async (method, referral) => {
  const user = userEvent.setup();
  const { container } = render(<MemoryRouter><Donate /></MemoryRouter>);
  const field = screen.getByLabelText('Referred by (optional)');
  expect(field).not.toBeRequired();
  expect(field).toHaveAttribute('maxlength', '150');
  if (referral) await user.type(field, referral);
  if (method === 'Bank') await user.click(screen.getByRole('button', { name: 'Bank', exact: true }));
  const utr = await screen.findByPlaceholderText(method === 'Bank' ? 'e.g. CBINR52024123456' : '12-digit UTR (e.g. 426812345678)');
  await user.type(utr, '123456789012');
  await user.upload(container.querySelector('input[type="file"]'), new File(['proof'], 'proof.png', { type: 'image/png' }));
  await screen.findByAltText('Screenshot preview');
  fireEvent.submit(container.querySelector('form'));
  await waitFor(() => expect(fetch.mock.calls.some(([url]) => url.endsWith('/submit'))).toBe(true));
  const [, options] = fetch.mock.calls.find(([url]) => url.endsWith('/submit'));
  expect(JSON.parse(options.body)).toMatchObject({ referrerName: referral.trim(), type: 'DONATION', utrNumber: '123456789012' });
});
