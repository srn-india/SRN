import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Events from '../pages/Events';
import * as LanguageContext from '../context/LanguageContext';

// Mock language context
vi.mock('../context/LanguageContext', () => ({
  useLanguage: vi.fn()
}));

// Mock framer-motion components and fade-in hook
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    h1: ({ children, ...props }) => <h1 {...props}>{children}</h1>,
    p: ({ children, ...props }) => <p {...props}>{children}</p>,
  }
}));

vi.mock('../hooks/useFadeIn', () => ({
  useFadeIn: () => ({ current: null })
}));

describe('Events Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Default mock to English
    vi.mocked(LanguageContext.useLanguage).mockReturnValue({
      lang: 'en'
    });

    // Mock scrollTo
    window.scrollTo = vi.fn();
  });

  it('renders the header and hero section correctly in English', () => {
    render(
      <BrowserRouter>
        <Events />
      </BrowserRouter>
    );

    expect(screen.getAllByText('Upcoming Events')[0]).toBeInTheDocument();
    expect(screen.getByText(/Connect, Engage &/i)).toBeInTheDocument();
    expect(screen.getByText(/Join our nationwide movement/i)).toBeInTheDocument();
  });

  it('renders the hardcoded events list', () => {
    render(
      <BrowserRouter>
        <Events />
      </BrowserRouter>
    );

    expect(screen.getByText('National Youth Empowerment Rally')).toBeInTheDocument();
    expect(screen.getByText('Leadership Summit 2026')).toBeInTheDocument();
    expect(screen.getByText('Grassroots Policy Discussion')).toBeInTheDocument();
    
    // Verify locations render
    expect(screen.getByText('New Delhi, India')).toBeInTheDocument();
    expect(screen.getByText('Mumbai Convention Centre')).toBeInTheDocument();
  });

  it('renders content in Hindi when language is set to hi', () => {
    vi.mocked(LanguageContext.useLanguage).mockReturnValue({
      lang: 'hi'
    });

    render(
      <BrowserRouter>
        <Events />
      </BrowserRouter>
    );

    expect(screen.getAllByText('आगामी कार्यक्रम')[0]).toBeInTheDocument();
    expect(screen.getByText('राष्ट्रीय युवा सशक्तिकरण रैली')).toBeInTheDocument();
    expect(screen.getByText('नेतृत्व शिखर सम्मेलन 2026')).toBeInTheDocument();
    expect(screen.getByText('जमीनी स्तर पर नीतिगत चर्चा')).toBeInTheDocument();
  });

  it('renders the call to action section', () => {
    render(
      <BrowserRouter>
        <Events />
      </BrowserRouter>
    );

    expect(screen.getByText('Want to Host a Local Event?')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Become an Organizer/i })).toBeInTheDocument();
  });
});
