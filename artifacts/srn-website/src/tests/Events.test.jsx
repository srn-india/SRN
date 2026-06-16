import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Events from '../pages/Events';
import * as LanguageContext from '../context/LanguageContext';
import * as AuthContext from '../context/AuthContext';

// Mock language context
vi.mock('../context/LanguageContext', () => ({
  useLanguage: vi.fn()
}));

// Mock the Auth context
vi.mock('../context/AuthContext', () => ({
  useAuth: vi.fn()
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

    vi.mocked(AuthContext.useAuth).mockReturnValue({
      user: null
    });

    // Mock scrollTo
    window.scrollTo = vi.fn();

    // Mock global.fetch
    global.fetch = vi.fn().mockImplementation(async () => {
      const isEnglish = LanguageContext.useLanguage().lang === 'en';
      const mockEvents = isEnglish ? [
        {
          id: '1',
          title: 'National Youth Empowerment Rally',
          description: 'A rally to empower the youth.',
          location: 'New Delhi, India',
          date: '2026-08-15T10:00:00Z',
          imageUrl: '',
          capacity: '5000+'
        },
        {
          id: '2',
          title: 'Leadership Summit 2026',
          description: 'Summit for new leaders.',
          location: 'Mumbai Convention Centre',
          date: '2026-09-10T09:00:00Z',
          imageUrl: '',
          capacity: '1000'
        },
        {
          id: '3',
          title: 'Grassroots Policy Discussion',
          description: 'Grassroots discussions on key policies.',
          location: 'Virtual',
          date: '2026-07-20T14:00:00Z',
          imageUrl: '',
          capacity: '200'
        }
      ] : [
        {
          id: '1',
          title: 'राष्ट्रीय युवा सशक्तिकरण रैली',
          description: 'युवाओं को सशक्त बनाने के लिए रैली।',
          location: 'नई दिल्ली, भारत',
          date: '2026-08-15T10:00:00Z',
          imageUrl: '',
          capacity: '5000+'
        },
        {
          id: '2',
          title: 'नेतृत्व शिखर सम्मेलन 2026',
          description: 'नए नेताओं के लिए शिखर सम्मेलन।',
          location: 'मुंबई कन्वेंशन सेंटर',
          date: '2026-09-10T09:00:00Z',
          imageUrl: '',
          capacity: '1000'
        },
        {
          id: '3',
          title: 'जमीनी स्तर पर नीतिगत चर्चा',
          description: 'प्रमुख नीतियों पर जमीनी स्तर पर चर्चा।',
          location: 'वर्चुअल',
          date: '2026-07-20T14:00:00Z',
          imageUrl: '',
          capacity: '200'
        }
      ];

      return {
        ok: true,
        json: async () => ({ success: true, data: mockEvents })
      };
    });
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

  it('renders the hardcoded events list', async () => {
    render(
      <BrowserRouter>
        <Events />
      </BrowserRouter>
    );

    expect(await screen.findByText('National Youth Empowerment Rally')).toBeInTheDocument();
    expect(screen.getByText('Leadership Summit 2026')).toBeInTheDocument();
    expect(screen.getByText('Grassroots Policy Discussion')).toBeInTheDocument();
    
    // Verify locations render
    expect(screen.getByText('New Delhi, India')).toBeInTheDocument();
    expect(screen.getByText('Mumbai Convention Centre')).toBeInTheDocument();
  });

  it('renders content in Hindi when language is set to hi', async () => {
    vi.mocked(LanguageContext.useLanguage).mockReturnValue({
      lang: 'hi'
    });

    render(
      <BrowserRouter>
        <Events />
      </BrowserRouter>
    );

    expect(screen.getAllByText('आगामी कार्यक्रम')[0]).toBeInTheDocument();
    expect(await screen.findByText('राष्ट्रीय युवा सशक्तिकरण रैली')).toBeInTheDocument();
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
