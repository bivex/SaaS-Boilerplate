/**
 * Copyright (c) 2025 Bivex
 *
 * Author: Bivex
 * Available for contact via email: support@b-b.top
 * For up-to-date contact information:
 * https://github.com/bivex
 *
 * Created: 2025-12-24T01:00:00
 * Last Updated: 2025-12-24T01:00:00
 *
 * Licensed under the MIT License.
 * Commercial licensing available upon request.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { authClient } from '@/libs/auth-client';

// Configuration for session management
const SESSION_CONFIG = {
  refreshThreshold: 15 * 60 * 1000, // Refresh when 15 minutes left
  checkInterval: 60 * 1000, // Check every minute
};

// Global session state to prevent duplicate requests
let globalSession: any = null;
let globalLoading = true;
let sessionPromise: Promise<any> | null = null;
const sessionSubscribers = new Set<(session: any, loading: boolean) => void>();

function notifySubscribers(session: any, loading: boolean) {
  globalSession = session;
  globalLoading = loading;
  sessionSubscribers.forEach(callback => callback(session, loading));
}

function subscribeToSession(callback: (session: any, loading: boolean) => void) {
  sessionSubscribers.add(callback);
  // Send current state immediately
  callback(globalSession, globalLoading);

  return () => {
    sessionSubscribers.delete(callback);
  };
}

async function fetchSession(): Promise<any> {
  if (sessionPromise) {
    return sessionPromise;
  }

  sessionPromise = (async () => {
    try {
      const result = await authClient.getSession();
      const session = result.data;

      // Check if session is expired
      if (session?.session?.expiresAt && new Date(session.session.expiresAt) < new Date()) {
        return null; // Expired session
      }

      return session;
    } catch (error) {
      console.error('Error fetching session:', error);
      return null;
    } finally {
      sessionPromise = null;
    }
  })();

  return sessionPromise;
}

async function refreshSession(): Promise<any> {
  try {
    const result = await authClient.refreshSession();
    return result.data;
  } catch (error) {
    console.error('Error refreshing session:', error);
    // On refresh failure, clear session
    notifySubscribers(null, false);
    return null;
  }
}

function shouldRefreshSession(session: any): boolean {
  if (!session?.session?.expiresAt) return false;

  const expiresAt = new Date(session.session.expiresAt);
  const now = new Date();
  const timeLeft = expiresAt.getTime() - now.getTime();

  return timeLeft <= SESSION_CONFIG.refreshThreshold;
}

export function useSession() {
  const [session, setSession] = useState<any>(globalSession);
  const [loading, setLoading] = useState(globalLoading);
  const refreshTimerRef = useRef<NodeJS.Timeout>();
  const checkTimerRef = useRef<NodeJS.Timeout>();

  const updateSession = useCallback((newSession: any, newLoading: boolean) => {
    setSession(newSession);
    setLoading(newLoading);
  }, []);

  // Schedule session refresh
  const scheduleRefresh = useCallback((sessionData: any) => {
    if (!sessionData?.session?.expiresAt) return;

    const expiresAt = new Date(sessionData.session.expiresAt);
    const now = new Date();
    const timeLeft = expiresAt.getTime() - now.getTime();

    // Clear existing timers
    if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);

    if (timeLeft > SESSION_CONFIG.refreshThreshold) {
      // Schedule refresh when we hit the threshold
      const refreshTime = timeLeft - SESSION_CONFIG.refreshThreshold;
      refreshTimerRef.current = setTimeout(async () => {
        const refreshedSession = await refreshSession();
        notifySubscribers(refreshedSession, false);

        // Schedule next refresh if successful
        if (refreshedSession) {
          scheduleRefresh(refreshedSession);
        }
      }, Math.max(0, refreshTime));
    }
  }, []);

  // Periodic session check
  const scheduleCheck = useCallback(() => {
    if (checkTimerRef.current) clearInterval(checkTimerRef.current);

    checkTimerRef.current = setInterval(async () => {
      const currentSession = await fetchSession();

      // Check if session needs refresh
      if (currentSession && shouldRefreshSession(currentSession)) {
        const refreshedSession = await refreshSession();
        notifySubscribers(refreshedSession, false);

        if (refreshedSession) {
          scheduleRefresh(refreshedSession);
        }
      }
    }, SESSION_CONFIG.checkInterval);
  }, [scheduleRefresh]);

  useEffect(() => {
    // Subscribe to global session state
    const unsubscribe = subscribeToSession(updateSession);

    // Initial session fetch if not already loading
    if (globalLoading && !sessionPromise) {
      fetchSession().then(fetchedSession => {
        notifySubscribers(fetchedSession, false);

        if (fetchedSession) {
          scheduleRefresh(fetchedSession);
          scheduleCheck();
        }
      });
    } else if (session) {
      scheduleRefresh(session);
      scheduleCheck();
    }

    return () => {
      unsubscribe();
      if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
      if (checkTimerRef.current) clearInterval(checkTimerRef.current);
    };
  }, [updateSession, scheduleRefresh, scheduleCheck]);

  return { session, loading };
}

export function useUser() {
  const { session, loading } = useSession();
  return { user: session?.user || null, loading };
}

export function useSignOut() {
  const signOut = useCallback(async () => {
    try {
      await authClient.signOut();
      // Clear global session state
      notifySubscribers(null, false);
      window.location.href = '/';
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  }, []);

  return { signOut };
}
