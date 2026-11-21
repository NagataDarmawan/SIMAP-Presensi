'use client';

import { useState, useEffect, useCallback } from 'react';
import { authService } from '@/services/auth.service';
import { Admin } from '@/types/auth';

export function useAuth() {
  const [user, setUser] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    try {
      const res = await authService.getProfile();
      setUser(res?.success && res.data ? res.data : null);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;

    const verifySession = async () => {
      try {
        const res = await authService.getProfile();
        if (!active) return;
        setUser(res?.success && res.data ? res.data : null);
      } catch {
        if (!active) return;
        setUser(null);
      } finally {
        if (active) setLoading(false);
      }
    };

    void verifySession();
    return () => {
      active = false;
    };
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } finally {
      setUser(null);
      window.location.href = '/login';
    }
  }, []);

  return { user, loading, logout, checkAuth };
}