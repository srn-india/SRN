import { createContext, useContext, useState, useEffect, useCallback } from "react";

const AuthContext = createContext(null);

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8080";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const cached = localStorage.getItem("srn_cached_user");
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(() => {
    const cached = localStorage.getItem("srn_cached_user");
    if (cached) return false;
    const token = localStorage.getItem("accessToken");
    return Boolean(token);
  });

  const checkAuth = useCallback(async () => {
    try {
      const headers = {};
      const token = localStorage.getItem("accessToken");
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch(`${API_BASE}/api/auth/me`, { 
        headers,
        credentials: "include" 
      });
      if (res.ok) {
        const data = await res.json();
        if (data?.data?.user) {
          setUser(data.data.user);
          localStorage.setItem("srn_cached_user", JSON.stringify(data.data.user));
          return data.data.user;
        }
      } else if (res.status === 401) {
        localStorage.removeItem("srn_cached_user");
        localStorage.removeItem("accessToken");
        setUser(null);
      }
    } catch (err) {
      console.error("Auth check failed:", err);
    } finally {
      setLoading(false);
    }
    return null;
  }, []);

  useEffect(() => {
    // On mount, verify session
    checkAuth();
  }, [checkAuth]);

  const login = async (email, password) => {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Login failed");
    
    if (data.data?.requiresOtp) {
      return data.data; // { requiresOtp: true, email: ... }
    }
    
    if (data.data?.requires2FA) {
      return data.data; // { requires2FA: true, tempAuthToken: ... }
    }
    
    if (data.data?.accessToken) {
      localStorage.setItem("accessToken", data.data.accessToken);
    }
    if (data.data?.user) {
      localStorage.setItem("srn_cached_user", JSON.stringify(data.data.user));
    }
    setUser(data.data.user);
    return data.data.user;
  };

  const register = async (formData) => {
    const res = await fetch(`${API_BASE}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Registration failed");
    
    if (data.data?.requiresOtp) {
      return data.data;
    }
    
    if (data.data?.accessToken) {
      localStorage.setItem("accessToken", data.data.accessToken);
    }
    if (data.data?.user) {
      localStorage.setItem("srn_cached_user", JSON.stringify(data.data.user));
    }
    setUser(data.data.user);
    return data.data.user;
  };

  const verifyOtp = async (email, otp) => {
    const res = await fetch(`${API_BASE}/api/auth/verify-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, otp }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Invalid OTP");
    
    if (data.data?.accessToken) {
      localStorage.setItem("accessToken", data.data.accessToken);
    }
    if (data.data?.user) {
      localStorage.setItem("srn_cached_user", JSON.stringify(data.data.user));
    }
    setUser(data.data.user);
    return data.data.user;
  };

  const logout = async () => {
    await fetch(`${API_BASE}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    localStorage.removeItem("accessToken");
    localStorage.removeItem("srn_cached_user");
    setUser(null);
  };

  const updateProfile = async (updates) => {
    // Optimistically update the frontend user state
    setUser(prev => {
      const next = { ...prev, ...updates };
      localStorage.setItem("srn_cached_user", JSON.stringify(next));
      return next;
    });
    try {
      await fetch(`${API_BASE}/api/users/profile`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(updates),
      });
    } catch(err) {
      console.log("Failed to persist profile update:", err);
    }
  };

  const verify2FA = async (tempAuthToken, totpToken) => {
    const res = await fetch(`${API_BASE}/api/auth/login/2fa`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ tempAuthToken, totpToken }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Invalid 2FA token");
    
    if (data.data?.accessToken) {
      localStorage.setItem("accessToken", data.data.accessToken);
    }
    setUser(data.data.user);
    return data.data.user;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, checkAuth, updateProfile, verifyOtp, verify2FA, API_BASE }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);