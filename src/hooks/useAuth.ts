/**
 * Copyright (c) 2025 Bivex
 *
 * Author: Bivex
 * Available for contact via email: support@b-b.top
 * For up-to-date contact information:
 * https://github.com/bivex
 *
 * Created: 2025-12-24T01:00:00
 * Last Updated: 2025-12-24T00:49:20
 *
 * Licensed under the MIT License.
 * Commercial licensing available upon request.
 */

import type { AuthSessionResponse } from '@/types/Auth';
import { useCallback, useEffect, useRef, useState } from 'react';
import { authClient } from '@/libs/auth-client';
import { trpc } from '@/trpc/client';

// Configuration for session management
const SESSION_CONFIG = {
  refreshThreshold: 15 * 60 * 1000, // Refresh when 15 minutes left
  checkInterval: 60 * 1000, // Check every minute
};

// Global session state to prevent duplicate requests
let globalSession: { session: any; user: any; organization?: any } | null = null;
let globalLoading = true;
let sessionPromise: Promise<{ session: any; user: any } | null> | null = null;
const sessionSubscribers = new Set<(session: { session: any; user: any; organization?: any } | null, loading: boolean) => void>();

function notifySubscribers(session: AuthSessionResponse['data'], loading: boolean) {
  globalSession = session;
  globalLoading = loading;
  sessionSubscribers.forEach(callback => callback(session, loading));
}

function subscribeToSession(callback: (session: { session: any; user: any; organization?: any } | null, loading: boolean) => void) {
  sessionSubscribers.add(callback);
  // Send current state immediately
  callback(globalSession, globalLoading);

  return () => {
    sessionSubscribers.delete(callback);
  };
}

async function fetchSession(): Promise<{ session: any; user: any; organization?: any } | null> {
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

async function refreshSession(): Promise<{ session: any; user: any; organization?: any } | null> {
  try {
    // Get a fresh session from the server
    const result = await authClient.getSession();
    const session = result.data;

    // Check if session is expired
    if (session?.session?.expiresAt && new Date(session.session.expiresAt) < new Date()) {
      return null; // Expired session
    }

    return session;
  } catch (error) {
    console.error('Error refreshing session:', error);
    // On refresh failure, clear session
    notifySubscribers(null, false);
    return null;
  }
}

function shouldRefreshSession(session: { session: any; user: any; organization?: any } | null): boolean {
  if (!session?.session?.expiresAt) {
    return false;
  }

  const expiresAt = new Date(session.session.expiresAt);
  const now = new Date();
  const timeLeft = expiresAt.getTime() - now.getTime();

  return timeLeft <= SESSION_CONFIG.refreshThreshold;
}

export function useSession() {
  const [session, setSession] = useState<{ session: any; user: any; organization?: any } | null>(globalSession);
  const [loading, setLoading] = useState(globalLoading);
  const refreshTimerRef = useRef<NodeJS.Timeout | null>(null);
  const checkTimerRef = useRef<NodeJS.Timeout | null>(null);

  const updateSession = useCallback((newSession: { session: any; user: any; organization?: any } | null, newLoading: boolean) => {
    setSession(newSession);
    setLoading(newLoading);
  }, []);

  // Schedule session refresh
  const scheduleRefresh = useCallback((sessionData: { session: any; user: any; organization?: any } | null) => {
    if (!sessionData?.session?.expiresAt) {
      return;
    }

    const expiresAt = new Date(sessionData.session.expiresAt);
    const now = new Date();
    const timeLeft = expiresAt.getTime() - now.getTime();

    // Clear existing timers
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
    }

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
    if (checkTimerRef.current) {
      clearInterval(checkTimerRef.current);
    }

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
      fetchSession().then((fetchedSession) => {
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
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current);
      }
      if (checkTimerRef.current) {
        clearInterval(checkTimerRef.current);
      }
    };
  }, [updateSession, scheduleRefresh, scheduleCheck, session]);

  return { session, loading };
}

export function useUser() {
  const { session, loading } = useSession();
  return { user: session?.user || null, loading };
}

export function useSignOut() {
  const signOut = useCallback(async () => {
    try {
      // Sign out on the server
      await authClient.signOut();

      // Clear the session promise cache to force a fresh fetch
      sessionPromise = null;

      // Clear global session state
      notifySubscribers(null, false);

      // Redirect to home page (full reload to clear all state)
      window.location.href = '/';
    } catch (error) {
      console.error('Error signing out:', error);
      // Even if sign-out fails, clear local state and redirect
      sessionPromise = null;
      notifySubscribers(null, false);
      window.location.href = '/';
    }
  }, []);

  return { signOut };
}

// Manually refresh the session state
export async function refreshSessionState(): Promise<{ session: any; user: any; organization?: any } | null> {
  // Clear the session promise cache to force a fresh fetch
  sessionPromise = null;

  const session = await fetchSession();
  notifySubscribers(session, false);
  return session;
}

// Test utility function to reset global state
export function __resetGlobalStateForTesting() {
  globalSession = null;
  globalLoading = true;
  sessionPromise = null;
  sessionSubscribers.clear();
}

// Google account linking hooks
export function useGoogleLinking() {
  const { data: linkStatus, refetch: refetchLinkStatus } = trpc.auth.isGoogleLinked.useQuery();
  const linkMutation = trpc.auth.linkGoogleAccount.useMutation();
  const unlinkMutation = trpc.auth.unlinkGoogleAccount.useMutation();

  const isLinked = linkStatus?.linked ?? null;
  const loading = linkMutation.isPending || unlinkMutation.isPending;

  const linkGoogleAccount = useCallback(async () => {
    try {
      await linkMutation.mutateAsync();
      await refetchLinkStatus();
      return { success: true };
    } catch (error) {
      console.error('Error linking Google account:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Failed to link Google account' };
    }
  }, [linkMutation, refetchLinkStatus]);

  const unlinkGoogleAccount = useCallback(async () => {
    try {
      await unlinkMutation.mutateAsync();
      await refetchLinkStatus();
      return { success: true };
    } catch (error) {
      console.error('Error unlinking Google account:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Failed to unlink Google account' };
    }
  }, [unlinkMutation, refetchLinkStatus]);

  return {
    isLinked,
    loading,
    linkGoogleAccount,
    unlinkGoogleAccount,
    refetchLinkStatus,
  };
}
