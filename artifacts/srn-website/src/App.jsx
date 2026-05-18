import { useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { LanguageProvider } from "./context/LanguageContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SplashScreen from "./components/SplashScreen";
import Home from "./pages/Home";
import Sangathan from "./pages/Sangathan";
import Uddeshya from "./pages/Uddeshya";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { AuthProvider } from "./context/AuthContext";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Placeholder from "./pages/Placeholder";
import Donate from "./pages/Donate";
import BecomeMember from "./pages/BecomeMember";

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

export default function App() {
  const [splashDone, setSplashDone] = useState(false);

  return (
    <>
      {/* Splash screen — shown once on first load */}
      <AnimatePresence>
        {!splashDone && (
          <SplashScreen onDone={() => setSplashDone(true)} />
        )}
      </AnimatePresence>

      {/* Main app */}
      <LanguageProvider>
        <AuthProvider>
          <BrowserRouter basename={import.meta.env.BASE_URL}>
            <Routes>
              {/* Standard pages — with Footer */}
              <Route path="/" element={<Layout><Home /></Layout>} />
              <Route path="/sangathan" element={<Layout><Sangathan /></Layout>} />
              <Route path="/uddeshya" element={<Layout><Uddeshya /></Layout>} />
              <Route path="/about" element={<Layout><Placeholder title="About Us" /></Layout>} />
              <Route path="/events" element={<Layout><Placeholder title="Events" /></Layout>} />
              <Route path="/forums" element={<Layout><Placeholder title="Forums" /></Layout>} />
              <Route path="/become-member" element={<Layout><BecomeMember /></Layout>} />
              <Route path="/donate" element={<Layout><Donate /></Layout>} />
              <Route path="/leadership/founding-presidents" element={<Layout><Placeholder title="Founding Presidents" /></Layout>} />
              <Route path="/margdarshak-mandal" element={<Layout><Placeholder title="Margdarshak Mandal" /></Layout>} />
              <Route path="/initiatives" element={<Layout><Placeholder title="Our Initiatives" /></Layout>} />
              <Route path="/media" element={<Layout><Placeholder title="Media & Gallery" /></Layout>} />
              <Route path="/volunteer" element={<Layout><Placeholder title="Volunteer" /></Layout>} />
              <Route path="/contact" element={<Layout><Placeholder title="Contact Us" /></Layout>} />

              {/* Auth pages — no Footer */}
              <Route path="/login" element={<AuthLayout><Login /></AuthLayout>} />
              <Route path="/signup" element={<AuthLayout><Signup /></AuthLayout>} />
              <Route path="/dashboard" element={<AuthLayout><Dashboard /></AuthLayout>} />
              <Route path="/profile" element={<AuthLayout><Profile /></AuthLayout>} />

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
        </BrowserRouter>
        </AuthProvider>
      </LanguageProvider>
    </>
  );
}
