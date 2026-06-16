import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8080";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/me`, { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        if (data?.data?.user) {
          setUser(data.data.user);
          return data.data.user;
        }
      }
    } catch (err) {
      console.error("Auth check failed:", err);
    }
    return null;
  };

  useEffect(() => {
    // On mount, check if user is already logged in via cookie
    checkAuth().finally(() => setLoading(false));
  }, []);

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
    setUser(data.data.user);
    return data.data.user;
  };

  const logout = async () => {
    await fetch(`${API_BASE}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    localStorage.removeItem("accessToken");
    setUser(null);
  };

  const updateProfile = async (updates) => {
    // Optimistically update the frontend user state
    setUser(prev => ({ ...prev, ...updates }));
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