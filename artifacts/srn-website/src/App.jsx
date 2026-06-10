import { useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { AnimatePresence, MotionConfig } from "framer-motion";
import { Analytics } from "@vercel/analytics/react";
import { LanguageProvider } from "./context/LanguageContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SplashScreen from "./components/SplashScreen";
import SmoothScroll from "./components/SmoothScroll";
import PageTransition from "./components/PageTransition";
import Home from "./pages/Home";
import Sangathan from "./pages/Sangathan";
import Uddeshya from "./pages/Uddeshya";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { AuthProvider } from "./context/AuthContext";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import Placeholder from "./pages/Placeholder";
import Events from "./pages/Events";
import Forums from "./pages/Forums";
import Initiatives from "./pages/Initiatives";
import Media from "./pages/Media";
import Donate from "./pages/Donate";
import BecomeMember from "./pages/BecomeMember";
import AuthSuccess from "./pages/AuthSuccess";
import Contact from "./pages/Contact";
import NationalPresident from "./pages/NationalPresident";
import Sansrakshak from "./pages/Sanrakshak";
import AboutTeam from "./pages/AboutTeam";

function Layout({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar isOpen={menuOpen} setIsOpen={setMenuOpen} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

function AuthLayout({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar isOpen={menuOpen} setIsOpen={setMenuOpen} />
      <main className="flex-1">{children}</main>
      {/* No Footer on auth pages */}
    </div>
  );
}

function NoNavLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-black">
      <main className="flex-1 flex flex-col">{children}</main>
    </div>
  );
}

export default function App() {
  const [splashDone, setSplashDone] = useState(() => {
    // Skip splash screen only if returning from OAuth redirect
    return window.location.pathname.startsWith("/auth/success");
  });

  return (
    <MotionConfig reducedMotion="user">
      <>
      {/* Splash screen — shown on fresh load */}
      <AnimatePresence>
        {!splashDone && (
          <SplashScreen onDone={() => setSplashDone(true)} />
        )}
      </AnimatePresence>

      {/* Main app */}
      <LanguageProvider>
        <AuthProvider>
          <BrowserRouter basename={import.meta.env.BASE_URL}>
            <SmoothScroll>
              <PageTransition>
                <Routes>
                  {/* Standard pages — with Footer */}
              <Route path="/" element={<Layout><Home /></Layout>} />
              <Route path="/sangathan" element={<Layout><Sangathan /></Layout>} />
              <Route path="/uddeshya" element={<Layout><Uddeshya /></Layout>} />
              <Route path="/about" element={<Layout><Placeholder title="About Us" /></Layout>} />
              <Route path="/events" element={<Layout><Events /></Layout>} />
              <Route path="/forums" element={<Layout><Forums /></Layout>} />
              <Route path="/become-member" element={<Layout><BecomeMember /></Layout>} />
              <Route path="/donate" element={<Layout><Donate /></Layout>} />
              <Route path="/leadership/founding-presidents" element={<Layout><Placeholder title="Founding Presidents" /></Layout>} />
              <Route path="/organisation/sansrakshak" element={<Layout><Sansrakshak /></Layout>} />
              <Route path="/organisation/national-president" element={<Layout><NationalPresident /></Layout>} />
              <Route path="/initiatives" element={<Layout><Initiatives /></Layout>} />
              <Route path="/about-team" element={<Layout><AboutTeam /></Layout>} />
              <Route path="/media" element={<Layout><Media /></Layout>} />
              <Route path="/volunteer" element={<Layout><Placeholder title="Volunteer" /></Layout>} />
              <Route path="/contact" element={<Layout><Contact /></Layout>} />

              {/* Auth pages — no Navbar, no Footer */}
              <Route path="/login" element={<NoNavLayout><Login /></NoNavLayout>} />
              <Route path="/signup" element={<NoNavLayout><Signup /></NoNavLayout>} />
              <Route path="/auth/success" element={<NoNavLayout><AuthSuccess /></NoNavLayout>} />

              {/* Dashboard pages — with Navbar, no Footer */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <AuthLayout>
                      <Dashboard />
                    </AuthLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin-dashboard" 
                element={
                  <ProtectedRoute requireRole="ADMIN">
                    <AuthLayout>
                      <AdminDashboard />
                    </AuthLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <AuthLayout>
                      <Profile />
                    </AuthLayout>
                  </ProtectedRoute>
                } 
              />

              {/* 404 */}
            <Route path="*" element={
              <Layout>
                <div className="flex-1 flex flex-col items-center justify-center py-20">
                  <h1 className="text-6xl font-bold text-[#5C1010]">404</h1>
                  <p className="text-[#7A5C45] mt-4 text-xl">Page Not Found</p>
                  <Link to="/" className="mt-8 px-6 py-3 bg-[#E8622A] text-white rounded-full font-semibold hover:bg-[#C04A18] transition-all">Go Home</Link>
                </div>
              </Layout>
            } />
          </Routes>
        </PageTransition>
      </SmoothScroll>
    </BrowserRouter>
        </AuthProvider>
      </LanguageProvider>
      <Analytics />
      </>
    </MotionConfig>
  );
}
