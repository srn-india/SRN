import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import * as AuthContext from '../context/AuthContext';

// Mock contexts
vi.mock('../context/AuthContext', () => ({
  useAuth: vi.fn()
}));

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
  }
}));

// Mock global fetch for membership API
global.fetch = vi.fn();

describe('Dashboard Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state when loading is true', () => {
    vi.mocked(AuthContext.useAuth).mockReturnValue({
      loading: true,
      user: null
    });

    const { container } = render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    // Should render the spinner
    expect(container.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('renders nothing if not loading and no user (redirects in useEffect)', () => {
    vi.mocked(AuthContext.useAuth).mockReturnValue({
      loading: false,
      user: null
    });

    const { container } = render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('renders user details and fetches membership when authenticated', async () => {
    vi.mocked(AuthContext.useAuth).mockReturnValue({
      loading: false,
      user: {
        firstName: 'Ansh',
        lastName: 'Johnson',
        profilePicture: null
      },
      logout: vi.fn(),
      API_BASE: 'http://localhost:4000'
    });

    // Mock the membership fetch response
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        data: {
          id: '12345678',
          status: 'ACTIVE',
          endDate: '2026-12-31T00:00:00Z'
        }
      })
    });

    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    // Verify user greeting
    expect(screen.getByText('Hello, Ansh')).toBeInTheDocument();
    expect(screen.getByText('Impact Score')).toBeInTheDocument();
    
    // Verify membership fetch was called
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('http://localhost:4000/api/users/membership', expect.any(Object));
    });

    // Verify membership status renders
    await waitFor(() => {
      expect(screen.getByText(/Active Member/i)).toBeInTheDocument();
    });
  });

  it('shows activate membership button if no active membership', async () => {
    vi.mocked(AuthContext.useAuth).mockReturnValue({
      loading: false,
      user: {
        firstName: 'Ansh',
        lastName: 'Johnson'
      },
      API_BASE: 'http://localhost:4000'
    });

    // Mock fetch with no membership data
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: null })
    });

    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Activate Membership/i)).toBeInTheDocument();
    });
  });
});
