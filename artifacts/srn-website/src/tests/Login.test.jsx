import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from '../pages/Login';
import * as AuthContext from '../context/AuthContext';
import * as LanguageContext from '../context/LanguageContext';

// Mock contexts
vi.mock('../context/AuthContext', () => ({
  useAuth: vi.fn()
}));

vi.mock('../context/LanguageContext', () => ({
  useLanguage: vi.fn()
}));

// Mock framer-motion components to avoid ResizeObserver issues
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    h2: ({ children, ...props }) => <h2 {...props}>{children}</h2>,
    p: ({ children, ...props }) => <p {...props}>{children}</p>,
    button: ({ children, ...props }) => <button {...props}>{children}</button>,
    img: ({ src, alt, ...props }) => <img src={src} alt={alt} {...props} />
  }
}));

describe('Login Component', () => {
  const mockLogin = vi.fn();
  
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Default language mock
    vi.mocked(LanguageContext.useLanguage).mockReturnValue({
      t: {
        login: {
          title: 'Sign In',
          emailLabel: 'Email Address',
          emailPlaceholder: 'Enter your email',
          passwordLabel: 'Password',
          passwordPlaceholder: 'Enter your password',
          submitBtn: 'Sign In',
          forgotPassword: 'Forgot Password?',
          googleBtn: 'Sign in with Google',
          noAccount: 'Don\'t have an account? Sign up',
          backToHome: 'Back to Home'
        }
      }
    });

    // Default auth mock
    vi.mocked(AuthContext.useAuth).mockReturnValue({
      login: mockLogin,
      verifyOtp: vi.fn(),
      verify2FA: vi.fn(),
      API_BASE: 'http://localhost:4000'
    });
  });

  it('renders the login form correctly', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    expect(screen.getByRole('heading', { name: 'Sign In' })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument();
  });

  it('shows validation error for invalid email', async () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    const emailInput = screen.getByPlaceholderText('Enter your email');
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });

    const submitBtn = screen.getByRole('button', { name: 'Sign In' });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText('Invalid email address')).toBeInTheDocument();
    });
    
    // login API should not be called
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it('submits the form successfully with valid data', async () => {
    mockLogin.mockResolvedValue({}); // Simulate successful login

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    const emailInput = screen.getByPlaceholderText('Enter your email');
    const passwordInput = screen.getByPlaceholderText('Enter your password');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    const submitBtn = screen.getByRole('button', { name: 'Sign In' });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
    });
  });

  it('shows OTP screen if account requires OTP', async () => {
    mockLogin.mockResolvedValue({ requiresOtp: true, email: 'test@example.com' });

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    const emailInput = screen.getByPlaceholderText('Enter your email');
    const passwordInput = screen.getByPlaceholderText('Enter your password');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    const submitBtn = screen.getByRole('button', { name: 'Sign In' });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText('Verify Your Email')).toBeInTheDocument();
      expect(screen.getByText('Enter the 6-digit code sent to test@example.com')).toBeInTheDocument();
    });
  });
});
