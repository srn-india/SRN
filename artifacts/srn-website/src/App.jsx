import { useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
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
import AdminEventDetails from "./pages/AdminEventDetails";
import Contact from "./pages/Contact";
import NationalPresident from "./pages/NationalPresident";
import Sansrakshak from "./pages/Sanrakshak";
import AboutTeam from "./pages/AboutTeam";
import AdvisoryBoard from "./pages/AdvisoryBoard";
import Complaints from "./pages/Complaints";
import ComplaintDetails from "./pages/ComplaintDetails";
import ApplicationDetails from "./pages/ApplicationDetails";
import ArticleDetails from "./pages/ArticleDetails";
import RequestPosting from "./pages/RequestPosting";
import JanSamwad from "./pages/JanSamwad";
import JanmatAapKiAawaz from "./pages/JanmatAapKiAawaz";
import JanYachikaye from "./pages/JanYachikaye";
import { Phone, X } from "lucide-react";
import { useLanguage } from "./context/LanguageContext";
import { Toaster } from "./components/ui/toaster";

// ── Phone Popup — rendered at root to avoid all stacking context issues ──────
function PhonePopup({ show, onClose }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{ position: "fixed", inset: 0, zIndex: 99999, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 1rem", backgroundColor: "rgba(30,15,5,0.80)", backdropFilter: "blur(6px)" }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            style={{ background: "#FDF5EC", borderRadius: "1rem", padding: "2rem", width: "100%", maxWidth: "22rem", boxShadow: "0 25px 50px rgba(0,0,0,0.5)", position: "relative", border: "1px solid #E8D5B8" }}
          >
            <button
              onClick={onClose}
              style={{ position: "absolute", top: "1rem", right: "1rem", background: "#FFF9F2", border: "none", cursor: "pointer", padding: "0.375rem", borderRadius: "9999px", color: "#5C3A1E", display: "flex" }}
            >
              <X size={20} />
            </button>

            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", marginTop: "0.5rem" }}>
              <div style={{ width: "4rem", height: "4rem", borderRadius: "9999px", background: "rgba(232,98,42,0.1)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1rem" }}>
                <Phone size={32} color="#E8622A" />
              </div>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 700, fontFamily: "serif", color: "#2C1810", marginBottom: "0.5rem" }}>
                Call Us
              </h3>
              <p style={{ color: "#7A5C45", fontSize: "0.875rem", marginBottom: "1.5rem" }}>
                Reach out to us for any inquiries or support.
              </p>
              <a
                href="tel:+917652012487"
                style={{ width: "100%", padding: "0.875rem 0", background: "rgba(232,98,42,0.1)", border: "1px solid rgba(232,98,42,0.3)", borderRadius: "0.75rem", color: "#E8622A", fontWeight: 600, fontSize: "1.125rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", textDecoration: "none", transition: "all 0.2s" }}
              >
                <Phone size={20} />
                +91 76520 12487
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Layout({ children, onPhoneClick }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar isOpen={menuOpen} setIsOpen={setMenuOpen} onPhoneClick={onPhoneClick} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

function AuthLayout({ children, onPhoneClick }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar isOpen={menuOpen} setIsOpen={setMenuOpen} onPhoneClick={onPhoneClick} />
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

function AdminLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 flex flex-col">{children}</main>
    </div>
  );
}

export default function App() {
  const [splashDone, setSplashDone] = useState(() => {
    // Skip splash screen only if returning from OAuth redirect
    return window.location.pathname.startsWith("/auth/success");
  });
  const [showPhonePopup, setShowPhonePopup] = useState(false);

  return (
    <MotionConfig reducedMotion="user">
      <>
      {/* Splash screen — shown on fresh load */}
      <AnimatePresence>
        {!splashDone && (
          <SplashScreen onDone={() => setSplashDone(true)} />
        )}
      </AnimatePresence>

      {/* ── Phone Popup — OUTSIDE all layout wrappers, always on top ── */}
      <PhonePopup show={showPhonePopup} onClose={() => setShowPhonePopup(false)} />

      {/* Main app */}
      <LanguageProvider>
        <AuthProvider>
          <BrowserRouter basename={import.meta.env.BASE_URL}>
            <SmoothScroll>
              <PageTransition>
                <Routes>
                  {/* Standard pages — with Footer */}
              <Route path="/" element={<Layout onPhoneClick={() => setShowPhonePopup(true)}><Home /></Layout>} />
              <Route path="/sangathan" element={<Layout onPhoneClick={() => setShowPhonePopup(true)}><Sangathan /></Layout>} />
              <Route path="/uddeshya" element={<Layout onPhoneClick={() => setShowPhonePopup(true)}><Uddeshya /></Layout>} />
              <Route path="/about" element={<Layout onPhoneClick={() => setShowPhonePopup(true)}><Placeholder title="About Us" /></Layout>} />
              <Route path="/events" element={<Layout onPhoneClick={() => setShowPhonePopup(true)}><Events /></Layout>} />
              <Route path="/forums" element={<Layout onPhoneClick={() => setShowPhonePopup(true)}><Forums /></Layout>} />
              <Route path="/become-member" element={<Layout onPhoneClick={() => setShowPhonePopup(true)}><BecomeMember /></Layout>} />
              <Route path="/donate" element={<Layout onPhoneClick={() => setShowPhonePopup(true)}><Donate /></Layout>} />
              <Route path="/leadership/founding-presidents" element={<Layout onPhoneClick={() => setShowPhonePopup(true)}><Placeholder title="Founding Presidents" /></Layout>} />
              <Route path="/organisation/sansrakshak" element={<Layout onPhoneClick={() => setShowPhonePopup(true)}><Sansrakshak /></Layout>} />
              <Route path="/organisation/national-president" element={<Layout onPhoneClick={() => setShowPhonePopup(true)}><NationalPresident /></Layout>} />
              <Route path="/organisation/advisory-board" element={<Layout onPhoneClick={() => setShowPhonePopup(true)}><AdvisoryBoard /></Layout>} />
              <Route path="/initiatives" element={<Layout onPhoneClick={() => setShowPhonePopup(true)}><Initiatives /></Layout>} />
              <Route path="/about-team" element={<Layout onPhoneClick={() => setShowPhonePopup(true)}><AboutTeam /></Layout>} />
              <Route path="/media" element={<Layout onPhoneClick={() => setShowPhonePopup(true)}><Media /></Layout>} />
              <Route path="/volunteer" element={<Layout onPhoneClick={() => setShowPhonePopup(true)}><Placeholder title="Volunteer" /></Layout>} />
              <Route path="/contact" element={<Layout onPhoneClick={() => setShowPhonePopup(true)}><Contact /></Layout>} />
              <Route path="/complaints" element={<Layout onPhoneClick={() => setShowPhonePopup(true)}><Complaints /></Layout>} />
              <Route path="/request-posting" element={<Layout onPhoneClick={() => setShowPhonePopup(true)}><RequestPosting /></Layout>} />
              <Route path="/jan-samwad" element={<Layout onPhoneClick={() => setShowPhonePopup(true)}><JanSamwad /></Layout>} />
              <Route path="/janmat-aap-ki-aawaz" element={<Layout onPhoneClick={() => setShowPhonePopup(true)}><JanmatAapKiAawaz /></Layout>} />
              <Route path="/jan-yachikaye" element={<Layout onPhoneClick={() => setShowPhonePopup(true)}><JanYachikaye /></Layout>} />

              {/* Auth pages — no Navbar, no Footer */}
              <Route path="/login" element={<NoNavLayout><Login /></NoNavLayout>} />
              <Route path="/signup" element={<NoNavLayout><Signup /></NoNavLayout>} />
              <Route path="/auth/success" element={<NoNavLayout><AuthSuccess /></NoNavLayout>} />

              {/* Dashboard pages — with Navbar, no Footer */}

              <Route 
                path="/admin-dashboard/application/:id" 
                element={
                  <ProtectedRoute requireRole="ADMIN">
                    <NoNavLayout>
                      <ApplicationDetails />
                    </NoNavLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <AuthLayout onPhoneClick={() => setShowPhonePopup(true)}>
                      <Dashboard />
                    </AuthLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute requireRole="ADMIN">
                    <NoNavLayout><AdminDashboard /></NoNavLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/events/:id" 
                element={
                  <ProtectedRoute requireRole="ADMIN">
                    <NoNavLayout><AdminEventDetails /></NoNavLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin-dashboard" 
                element={
                  <ProtectedRoute requireRole="ADMIN">
                    <AdminLayout>
                      <AdminDashboard />
                    </AdminLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin-dashboard/complaint/:id" 
                element={
                  <ProtectedRoute requireRole="ADMIN">
                    <NoNavLayout>
                      <ComplaintDetails />
                    </NoNavLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin-dashboard/article/:id" 
                element={
                  <ProtectedRoute requireRole="ADMIN">
                    <NoNavLayout>
                      <ArticleDetails />
                    </NoNavLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <AuthLayout onPhoneClick={() => setShowPhonePopup(true)}>
                      <Profile />
                    </AuthLayout>
                  </ProtectedRoute>
                } 
              />

              {/* 404 */}
            <Route path="*" element={
              <Layout onPhoneClick={() => setShowPhonePopup(true)}>
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
      <Toaster />
      </>
    </MotionConfig>
  );
}
