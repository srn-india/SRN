import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import AdminDashboard from '../pages/AdminDashboard';

vi.mock('../context/AuthContext', () => ({ useAuth: () => ({ user: { id: 'admin', role: 'ADMIN', firstName: 'Admin', email: 'admin@example.com' }, API_BASE: 'http://localhost:4000', logout: vi.fn() }) }));

const donation = { id: 'donation-1', userId: 'donor-1', type: 'DONATION', status: 'PENDING', amount: 1500, utrNumber: 'UTR123', purpose: '[UPI] Education', referrerName: 'Referral Person', createdAt: new Date().toISOString(), user: { id: 'donor-1', firstName: 'Test', lastName: 'Donor', email: 'donor@example.com' } };

beforeEach(() => {
  vi.stubGlobal('localStorage', { getItem: () => 'test-token' });
  vi.stubGlobal('fetch', vi.fn(async url => ({ ok: true, json: async () => ({ data: String(url).includes('/admin/all') ? [donation] : { emailSent: true } }) })));
  vi.spyOn(window, 'confirm').mockReturnValue(true);
  vi.spyOn(window, 'alert').mockImplementation(() => {});
});

describe('Admin donation review', () => {
  it('submits corrected details and the explanation before emailing the receipt', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><AdminDashboard /></MemoryRouter>);
    await user.click(screen.getByRole('button', { name: 'Payment Reviews' }));
    await user.click(await screen.findByRole('button', { name: 'Review & Approve' }));
    const modal = within(screen.getByRole('dialog'));
    await user.clear(modal.getByLabelText('Verified amount (₹)'));
    await user.type(modal.getByLabelText('Verified amount (₹)'), '1200');
    await user.type(modal.getByLabelText('Admin note / reason for corrections'), 'Verified bank amount');
    await user.click(modal.getByRole('button', { name: 'Approve & Email Receipt' }));
    await waitFor(() => expect(fetch).toHaveBeenCalledWith('http://localhost:4000/api/manual-payments/admin/donation-1/approve', expect.objectContaining({ method: 'PATCH', body: JSON.stringify({ adminNote: 'Verified bank amount', corrections: { amount: 1200, utrNumber: 'UTR123', purpose: '[UPI] Education' } }) })));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });
});

it('downloads the complete donation workbook independently of the current review filter', async () => {
  const user = userEvent.setup();
  const blob = new Blob(['workbook']);
  vi.stubGlobal('fetch', vi.fn(async url => ({ ok: true, blob: async () => blob, json: async () => ({ data: String(url).includes('/admin/all') ? [donation] : {} }) })));
  const createUrl = vi.fn(() => 'blob:donations');
  vi.stubGlobal('URL', Object.assign(URL, { createObjectURL: createUrl, revokeObjectURL: vi.fn() }));
  const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
  render(<MemoryRouter><AdminDashboard /></MemoryRouter>);
  await user.click(screen.getByRole('button', { name: 'Payment Reviews' }));
  expect(await screen.findByText('Referral Person')).toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: 'Download Donations Excel' }));
  await waitFor(() => expect(click).toHaveBeenCalled());
  expect(fetch).toHaveBeenCalledWith('http://localhost:4000/api/manual-payments/admin/donations/export', expect.objectContaining({ credentials: 'include', headers: { Authorization: 'Bearer test-token' } }));
  expect(createUrl).toHaveBeenCalledWith(blob);
  expect(click.mock.instances[0].download).toMatch(/^SRN_Donations_.*\.xlsx$/);
});
it('reports an export failure without downloading an invalid workbook', async () => {
  const user = userEvent.setup();
  vi.stubGlobal('fetch', vi.fn(async url => ({ ok: !String(url).includes('/donations/export'), json: async () => ({ data: String(url).includes('/admin/all') ? [] : {} }) })));
  render(<MemoryRouter><AdminDashboard /></MemoryRouter>);
  await user.click(screen.getByRole('button', { name: 'Payment Reviews' }));
  const button = await screen.findByRole('button', { name: 'Download Donations Excel' });
  expect(button).toBeEnabled();
  await user.click(button);
  await waitFor(() => expect(window.alert).toHaveBeenCalledWith('Could not download donations. Please try again.'));
  expect(button).toBeEnabled();
});
