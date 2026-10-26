import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import AdminDashboard from '../pages/AdminDashboard';
const auth = vi.hoisted(() => ({ user: { id: 'admin', role: 'ADMIN', firstName: 'Admin' }, API_BASE: 'http://localhost:4000', logout: vi.fn() }));
vi.mock('../context/AuthContext', () => ({ useAuth: () => auth }));
const donor = { id: 'target', firstName: 'Test', lastName: 'Donor', email: 'donor@example.com', avatar: 'https://example.com/old.png' };
beforeEach(() => {
  auth.user.role = 'ADMIN';
  vi.stubGlobal('localStorage', { getItem: () => 'test-token' });
  vi.stubGlobal('fetch', vi.fn(async (url, options) => ({ ok: true, json: async () => ({ data: options?.method === 'PATCH' ? { ...donor, avatar: 'https://example.com/new.png' } : String(url).includes('/admin/users') ? { users: [donor], pagination: { page: 1, totalPages: 2 } } : {} }) })));
});
afterEach(() => vi.unstubAllGlobals());
const openEditor = async user => {
  render(<MemoryRouter><AdminDashboard /></MemoryRouter>);
  await user.click(screen.getByRole('button', { name: 'Manage Users' }));
  await user.click(await screen.findByRole('button', { name: 'Update Profile Image' }));
  return within(screen.getByRole('dialog'));
};
describe('Admin profile image management', () => {
  it('rejects unsupported uploads without calling the avatar API', async () => {
    const user = userEvent.setup({ applyAccept: false });
    const modal = await openEditor(user);
    await user.upload(modal.getByLabelText('New profile image'), new File(['pdf'], 'file.pdf', { type: 'application/pdf' }));
    expect(await modal.findByRole('alert')).toHaveTextContent('Choose a PNG or JPEG');
    expect(modal.getByRole('button', { name: 'Save Profile Image' })).toBeDisabled();
    expect(fetch.mock.calls.some(([, options]) => options?.method === 'PATCH')).toBe(false);
  });

  it('uploads a selected photo for the chosen user and refreshes the displayed image', async () => {
    const user = userEvent.setup();
    const modal = await openEditor(user);
    const file = new File(['image'], 'photo.png', { type: 'image/png' });
    await user.upload(modal.getByLabelText('New profile image'), file);
    await user.click(modal.getByRole('button', { name: 'Save Profile Image' }));
    await waitFor(() => expect(fetch).toHaveBeenCalledWith('http://localhost:4000/api/admin/users/target/avatar', expect.objectContaining({ method: 'PATCH', credentials: 'include', body: expect.any(FormData), headers: { Authorization: 'Bearer test-token' } })));
    const call = fetch.mock.calls.find(([, options]) => options?.method === 'PATCH');
    expect(call[1].body.get('avatar')).toBe(file);
    await waitFor(() => expect(screen.getByAltText('Test Donor')).toHaveAttribute('src', 'https://example.com/new.png'));
  });
  it('does not expose user image editing to a non-admin', () => {
    auth.user.role = 'USER';
    render(<MemoryRouter><AdminDashboard /></MemoryRouter>);
    expect(screen.queryByRole('button', { name: 'Manage Users' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Update Profile Image' })).not.toBeInTheDocument();
  });
  it('shows upload failures without replacing the existing image', async () => {
    const user = userEvent.setup();
    const modal = await openEditor(user);
    fetch.mockImplementationOnce(async () => ({ ok: false, json: async () => ({ message: 'Storage unavailable' }) }));
    await user.upload(modal.getByLabelText('New profile image'), new File(['image'], 'photo.png', { type: 'image/png' }));
    await user.click(modal.getByRole('button', { name: 'Save Profile Image' }));
    expect(await modal.findByRole('alert')).toHaveTextContent('Storage unavailable');
    expect(screen.getByAltText('Test Donor')).toHaveAttribute('src', donor.avatar);
  });
  it('loads the next page of users', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><AdminDashboard /></MemoryRouter>);
    await user.click(screen.getByRole('button', { name: 'Manage Users' }));
    await user.click(await screen.findByRole('button', { name: 'Next users' }));
    await waitFor(() => expect(fetch).toHaveBeenCalledWith('http://localhost:4000/api/admin/users?page=2&limit=10', expect.anything()));
  });
});
