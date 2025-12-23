/**
 * Copyright (c) 2025 Bivex
 *
 * Author: Bivex
 * Available for contact via email: support@b-b.top
 * For up-to-date contact information:
 * https://github.com/bivex
 *
 * Created: 2025-12-23T22:45:00
 * Last Updated: 2025-12-23T20:23:12
 *
 * Licensed under the MIT License.
 * Commercial licensing available upon request.
 */

import { useEffect, useState } from 'react';
import { authClient } from '@/libs/auth-client';

export function useSession() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      try {
        const result = await authClient.getSession();
        setSession(result.data);
      } catch (error) {
        console.error('Error getting session:', error);
      } finally {
        setLoading(false);
      }
    };

    getSession();
  }, []);

  return { session, loading };
}

export function useUser() {
  const { session, loading } = useSession();
  return { user: session?.user, loading };
}

export function useSignOut() {
  const signOut = async () => {
    try {
      await authClient.signOut();
      window.location.href = '/';
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return { signOut };
}
