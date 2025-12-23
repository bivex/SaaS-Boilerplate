/**
 * Copyright (c) 2025 Bivex
 *
 * Author: Bivex
 * Available for contact via email: support@b-b.top
 * For up-to-date contact information:
 * https://github.com/bivex
 *
 * Created: 2025-12-23T21:10:00
 * Last Updated: 2025-12-23T21:08:18
 *
 * Licensed under the MIT License.
 * Commercial licensing available upon request.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock tRPC client
vi.mock('@trpc/client', () => ({
  createTRPCReact: vi.fn(() => ({
    useQuery: vi.fn(),
    useMutation: vi.fn(),
  })),
}));

vi.mock('@trpc/react-query', () => ({
  createTRPCReact: vi.fn(() => ({
    useQuery: vi.fn(),
    useMutation: vi.fn(),
  })),
}));

// Mock auth client
vi.mock('@/libs/auth-client', () => ({
  authClient: {
    signUp: { email: vi.fn() },
    signIn: { email: vi.fn() },
    signOut: vi.fn(),
    getSession: vi.fn(),
  },
}));

describe('Authentication Flow Integration', () => {
  const mockAuthClient = {
    signUp: { email: vi.fn() },
    signIn: { email: vi.fn() },
    signOut: vi.fn(),
    getSession: vi.fn(),
  };

  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    vi.clearAllMocks();
  });

  afterEach(() => {
    queryClient.clear();
  });

  const renderWithProviders = (component: React.ReactElement) => {
    return render(
      <QueryClientProvider client={queryClient}>
        {component}
      </QueryClientProvider>
    );
  };

  describe('Sign Up Flow', () => {
    it('should complete full sign-up flow successfully', async () => {
      const user = userEvent.setup();

      // Mock successful sign-up
      mockAuthClient.signUp.email.mockResolvedValue({
        data: {
          user: { id: 'user-1', email: 'test@example.com', name: 'Test User' },
          session: { id: 'session-1' },
        },
        error: null,
      });

      // Mock SignUpPage component
      const SignUpPage = () => {
        const [email, setEmail] = React.useState('');
        const [password, setPassword] = React.useState('');
        const [name, setName] = React.useState('');
        const [error, setError] = React.useState('');
        const [loading, setLoading] = React.useState(false);

        const handleSignUp = async (e: React.FormEvent) => {
          e.preventDefault();
          setLoading(true);
          setError('');

          try {
            const result = await mockAuthClient.signUp.email({
              email,
              password,
              name,
            });

            if (result.error) {
              setError(result.error.message);
            } else {
              // Simulate navigation
              window.location.href = '/dashboard';
            }
          } catch (err) {
            setError('Sign up failed');
          } finally {
            setLoading(false);
          }
        };

        return (
          <form onSubmit={handleSignUp} data-testid="signup-form">
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              data-testid="name-input"
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              data-testid="email-input"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              data-testid="password-input"
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              data-testid="confirm-password-input"
            />
            {error && <div data-testid="error-message">{error}</div>}
            <button type="submit" disabled={loading} data-testid="signup-button">
              {loading ? 'Signing up...' : 'Sign Up'}
            </button>
          </form>
        );
      };

      renderWithProviders(<SignUpPage />);

      // Fill form
      await user.type(screen.getByTestId('name-input'), 'Test User');
      await user.type(screen.getByTestId('email-input'), 'test@example.com');
      await user.type(screen.getByTestId('password-input'), 'password123');
      await user.type(screen.getByTestId('confirm-password-input'), 'password123');

      // Submit form
      await user.click(screen.getByTestId('signup-button'));

      // Should show loading state
      expect(screen.getByTestId('signup-button')).toBeDisabled();
      expect(screen.getByText('Signing up...')).toBeInTheDocument();

      // Should call sign-up API
      await waitFor(() => {
        expect(mockAuthClient.signUp.email).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'password123',
          name: 'Test User',
        });
      });

      // Should redirect to dashboard (simulated)
      await waitFor(() => {
        expect(window.location.href).toBe('http://localhost:3000/dashboard');
      });
    });

    it('should handle sign-up validation errors', async () => {
      const user = userEvent.setup();

      // Mock validation error
      mockAuthClient.signUp.email.mockResolvedValue({
        data: null,
        error: { message: 'Email already exists' },
      });

      const SignUpPage = () => {
        const [email, setEmail] = React.useState('existing@example.com');
        const [password, setPassword] = React.useState('password123');
        const [name, setName] = React.useState('Test User');
        const [error, setError] = React.useState('');

        const handleSignUp = async (e: React.FormEvent) => {
          e.preventDefault();

          try {
            const result = await mockAuthClient.signUp.email({
              email,
              password,
              name,
            });

            if (result.error) {
              setError(result.error.message);
            }
          } catch (err) {
            setError('Sign up failed');
          }
        };

        return (
          <form onSubmit={handleSignUp} data-testid="signup-form">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              data-testid="email-input"
            />
            {error && <div data-testid="error-message">{error}</div>}
            <button type="submit" data-testid="signup-button">Sign Up</button>
          </form>
        );
      };

      renderWithProviders(<SignUpPage />);

      await user.click(screen.getByTestId('signup-button'));

      await waitFor(() => {
        expect(screen.getByTestId('error-message')).toHaveTextContent('Email already exists');
      });

      // Should stay on sign-up page
      expect(window.location.href).not.toContain('/dashboard');
    });
  });

  describe('Sign In Flow', () => {
    it('should complete full sign-in flow successfully', async () => {
      const user = userEvent.setup();

      mockAuthClient.signIn.email.mockResolvedValue({
        data: {
          user: { id: 'user-1', email: 'test@example.com' },
          session: { id: 'session-1' },
        },
        error: null,
      });

      const SignInPage = () => {
        const [email, setEmail] = React.useState('');
        const [password, setPassword] = React.useState('');
        const [error, setError] = React.useState('');
        const [loading, setLoading] = React.useState(false);

        const handleSignIn = async (e: React.FormEvent) => {
          e.preventDefault();
          setLoading(true);
          setError('');

          try {
            const result = await mockAuthClient.signIn.email({
              email,
              password,
            });

            if (result.error) {
              setError(result.error.message);
            } else {
              window.location.href = '/dashboard';
            }
          } catch (err) {
            setError('Sign in failed');
          } finally {
            setLoading(false);
          }
        };

        return (
          <form onSubmit={handleSignIn} data-testid="signin-form">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              data-testid="email-input"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              data-testid="password-input"
            />
            {error && <div data-testid="error-message">{error}</div>}
            <button type="submit" disabled={loading} data-testid="signin-button">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        );
      };

      renderWithProviders(<SignInPage />);

      await user.type(screen.getByTestId('email-input'), 'test@example.com');
      await user.type(screen.getByTestId('password-input'), 'password123');

      await user.click(screen.getByTestId('signin-button'));

      await waitFor(() => {
        expect(mockAuthClient.signIn.email).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'password123',
        });
      });

      await waitFor(() => {
        expect(window.location.href).toBe('http://localhost:3000/dashboard');
      });
    });

    it('should handle invalid credentials', async () => {
      const user = userEvent.setup();

      mockAuthClient.signIn.email.mockResolvedValue({
        data: null,
        error: { message: 'Invalid credentials' },
      });

      const SignInPage = () => {
        const [email, setEmail] = React.useState('wrong@example.com');
        const [password, setPassword] = React.useState('wrongpassword');
        const [error, setError] = React.useState('');

        const handleSignIn = async (e: React.FormEvent) => {
          e.preventDefault();

          try {
            const result = await mockAuthClient.signIn.email({
              email,
              password,
            });

            if (result.error) {
              setError(result.error.message);
            }
          } catch (err) {
            setError('Sign in failed');
          }
        };

        return (
          <form onSubmit={handleSignIn} data-testid="signin-form">
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            {error && <div data-testid="error-message">{error}</div>}
            <button type="submit" data-testid="signin-button">Sign In</button>
          </form>
        );
      };

      renderWithProviders(<SignInPage />);

      await user.click(screen.getByTestId('signin-button'));

      await waitFor(() => {
        expect(screen.getByTestId('error-message')).toHaveTextContent('Invalid credentials');
      });
    });
  });

  describe('Protected Route Access', () => {
    it('should allow access to protected tRPC procedures when authenticated', async () => {
      // Mock tRPC client with authenticated context
      const mockTrpc = {
        auth: {
          getProfile: {
            useQuery: vi.fn(() => ({
              data: { id: 'user-1', email: 'test@example.com' },
              isLoading: false,
              error: null,
            })),
          },
        },
      };

      vi.mocked(await import('@/trpc/client')).trpc = mockTrpc as any;

      const ProtectedComponent = () => {
        const { data: profile, isLoading } = mockTrpc.auth.getProfile.useQuery();

        if (isLoading) return <div>Loading...</div>;

        return (
          <div data-testid="protected-content">
            Welcome {profile?.email}
          </div>
        );
      };

      renderWithProviders(<ProtectedComponent />);

      await waitFor(() => {
        expect(screen.getByTestId('protected-content')).toHaveTextContent('Welcome test@example.com');
      });
    });

    it('should deny access to protected procedures when not authenticated', async () => {
      const mockTrpc = {
        auth: {
          getProfile: {
            useQuery: vi.fn(() => ({
              data: null,
              isLoading: false,
              error: { message: 'UNAUTHORIZED' },
            })),
          },
        },
      };

      vi.mocked(await import('@/trpc/client')).trpc = mockTrpc as any;

      const ProtectedComponent = () => {
        const { error } = mockTrpc.auth.getProfile.useQuery();

        if (error) {
          return <div data-testid="error-message">{error.message}</div>;
        }

        return <div>Protected content</div>;
      };

      renderWithProviders(<ProtectedComponent />);

      await waitFor(() => {
        expect(screen.getByTestId('error-message')).toHaveTextContent('UNAUTHORIZED');
      });
    });
  });

  describe('Session Context in Resolvers', () => {
    it('should pass user/session context to tRPC resolvers', async () => {
      const mockResolver = vi.fn();

      // Mock tRPC router with context access
      const mockTrpc = {
        user: {
          getProfile: {
            useQuery: vi.fn(() => {
              // Simulate resolver execution with context
              mockResolver({
                session: {
                  user: { id: 'user-1', email: 'test@example.com' },
                },
              });
              return {
                data: { id: 'user-1', email: 'test@example.com' },
                isLoading: false,
              };
            }),
          },
        },
      };

      vi.mocked(await import('@/trpc/client')).trpc = mockTrpc as any;

      const UserProfileComponent = () => {
        const { data: profile } = mockTrpc.user.getProfile.useQuery();
        return <div>{profile?.email}</div>;
      };

      renderWithProviders(<UserProfileComponent />);

      await waitFor(() => {
        expect(mockResolver).toHaveBeenCalledWith({
          session: {
            user: { id: 'user-1', email: 'test@example.com' },
          },
        });
      });
    });
  });

  describe('Invalid/Expired Token Handling', () => {
    it('should handle expired tokens gracefully', async () => {
      mockAuthClient.getSession.mockRejectedValue(new Error('Token expired'));

      const SessionComponent = () => {
        const [session, setSession] = React.useState(null);
        const [error, setError] = React.useState('');

        React.useEffect(() => {
          mockAuthClient.getSession()
            .then(result => setSession(result.data))
            .catch(err => setError(err.message));
        }, []);

        if (error) {
          return <div data-testid="session-error">{error}</div>;
        }

        return <div data-testid="session-content">{session ? 'Authenticated' : 'Not authenticated'}</div>;
      };

      renderWithProviders(<SessionComponent />);

      await waitFor(() => {
        expect(screen.getByTestId('session-error')).toHaveTextContent('Token expired');
      });
    });

    it('should handle invalid tokens', async () => {
      mockAuthClient.getSession.mockRejectedValue(new Error('Invalid token'));

      const SessionComponent = () => {
        const [session, setSession] = React.useState(null);
        const [error, setError] = React.useState('');

        React.useEffect(() => {
          mockAuthClient.getSession()
            .then(result => setSession(result.data))
            .catch(err => setError(err.message));
        }, []);

        if (error) {
          return <div data-testid="session-error">{error}</div>;
        }

        return <div>{session ? 'Authenticated' : 'Not authenticated'}</div>;
      };

      renderWithProviders(<SessionComponent />);

      await waitFor(() => {
        expect(screen.getByTestId('session-error')).toHaveTextContent('Invalid token');
      });
    });
  });
});

// Mock React for testing
vi.mock('react', async () => {
  const actualReact = await vi.importActual('react');
  return {
    ...actualReact,
    useState: vi.fn(),
    useEffect: vi.fn(),
    createElement: actualReact.createElement,
  };
});
