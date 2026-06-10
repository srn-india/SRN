import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Profile from '../pages/Profile';
import * as AuthContext from '../context/AuthContext';

// Mock the Auth context
vi.mock('../context/AuthContext', () => ({
  useAuth: vi.fn()
}));

// Mock ResizeObserver for framer-motion
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

describe('Profile Component', () => {
  it('renders loading state initially', () => {
    vi.mocked(AuthContext.useAuth).mockReturnValue({ loading: true, user: null, updateProfile: vi.fn() });
    
    render(
      <BrowserRouter>
        <Profile />
      </BrowserRouter>
    );

    expect(document.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('renders profile data successfully', async () => {
    vi.mocked(AuthContext.useAuth).mockReturnValue({
      loading: false,
      user: {
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        phone: '1234567890',
        district: 'Test District',
        state: 'Test State',
        profilePicture: 'https://example.com/avatar.jpg',
        role: 'MEMBER'
      },
      updateProfile: vi.fn()
    });

    render(
      <BrowserRouter>
        <Profile />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByDisplayValue('Test')).toBeInTheDocument();
      expect(screen.getByDisplayValue('User')).toBeInTheDocument();
      expect(screen.getByDisplayValue('1234567890')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Test District')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Test State')).toBeInTheDocument();
    });
  });

  it('submits updated profile correctly', async () => {
    const updateProfileMock = vi.fn().mockResolvedValue({});
    
    vi.mocked(AuthContext.useAuth).mockReturnValue({
      loading: false,
      user: { firstName: 'Test', lastName: 'User', email: 'test@example.com', role: 'MEMBER' },
      updateProfile: updateProfileMock
    });

    render(
      <BrowserRouter>
        <Profile />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByDisplayValue('Test')).toBeInTheDocument();
    });

    const firstNameInput = screen.getByDisplayValue('Test');
    fireEvent.change(firstNameInput, { target: { value: 'Updated' } });

    const submitBtn = screen.getByRole('button', { name: /Save Changes/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(updateProfileMock).toHaveBeenCalledWith(expect.objectContaining({
        firstName: 'Updated'
      }));
    });
  });
});

