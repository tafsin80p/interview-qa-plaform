import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '@/integrations/supabase/client';
import { ADMIN_EMAIL, isAdminEmail } from '@/constants/admin';

interface AuthError {
  message: string;
  status?: number;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  loading: boolean;
  isBlocked: boolean;
  emailVerified: boolean;
  signUp: (email: string, password: string, displayName: string) => Promise<{ data: { user: User | null; session: Session | null } | null; error: AuthError | null }>;
  signIn: (email: string, password: string) => Promise<{ data: { user: User | null; session: Session | null } | null; error: AuthError | null }>;
  signInWithOAuth: (provider: 'google' | 'github') => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isBlocked, setIsBlocked] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);

  const checkAdminRole = async (userId: string, userEmail?: string) => {
    // Only the specific admin email can be admin
    if (!isAdminEmail(userEmail)) {
      setIsAdmin(false);
      return;
    }

    // If Supabase is not configured, still allow admin access for the admin email
    if (!isSupabaseConfigured) {
      setIsAdmin(true);
      return;
    }

    // Verify admin role in database, or create it if it doesn't exist
    try {
      const { data: existingRole, error: fetchError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .eq('role', 'admin')
        .maybeSingle();
      
      if (existingRole) {
        setIsAdmin(true);
      } else if (!fetchError || fetchError.code === 'PGRST116') {
        // Auto-grant admin role to the admin email if it doesn't exist
        const { error: insertError } = await supabase
          .from('user_roles')
          .insert({
            user_id: userId,
            role: 'admin',
          });
        
        if (!insertError) {
          setIsAdmin(true);
        } else {
          console.error('Failed to grant admin role:', insertError);
          // Still allow admin if email matches (fallback)
          setIsAdmin(true);
        }
      } else {
        console.error('Failed to check admin role:', fetchError);
        // Still allow admin if email matches (fallback)
        setIsAdmin(true);
      }
    } catch (err) {
      console.error('Exception checking admin role:', err);
      // Still allow admin if email matches (fallback)
      setIsAdmin(true);
    }
  };

  useEffect(() => {
    let mounted = true;
    let subscription: { unsubscribe: () => void } | null = null;
    let timeoutId: NodeJS.Timeout | null = null;

    // Set a maximum timeout to ensure loading always completes
    timeoutId = setTimeout(() => {
      if (mounted) {
        console.warn('Auth initialization timeout - setting loading to false');
        setLoading(false);
      }
    }, 5000); // 5 second timeout

    const initializeAuth = async () => {
      if (!isSupabaseConfigured) {
        if (mounted) {
          if (timeoutId) clearTimeout(timeoutId);
          setLoading(false);
        }
        return;
      }

      try {
        const { data: authData } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            if (!mounted) return;
            
            setSession(session);
            setUser(session?.user ?? null);
            
            if (session?.user) {
              // Check if user is blocked
              try {
                const { data: profile } = await supabase
                  .from('profiles')
                  .select('is_blocked, email_verified')
                  .eq('user_id', session.user.id)
                  .single() as { data: { is_blocked?: boolean; email_verified?: boolean } | null; error: unknown };

                if ((profile as { is_blocked?: boolean } | null)?.is_blocked) {
                  setIsBlocked(true);
                  setUser(null);
                  setSession(null);
                  if (mounted && timeoutId) {
                    clearTimeout(timeoutId);
                    setLoading(false);
                  }
                  return;
                } else {
                  setIsBlocked(false);
                  setEmailVerified((profile as { email_verified?: boolean } | null)?.email_verified || false);
                }
              } catch (err) {
                console.error('Error checking user block status:', err);
                setIsBlocked(false);
              }

              // Handle OAuth user - update profile with display name from provider
              if (event === 'SIGNED_IN' && session.user.user_metadata) {
                const displayName = session.user.user_metadata.full_name || 
                                  session.user.user_metadata.name ||
                                  session.user.user_metadata.user_name ||
                                  session.user.email?.split('@')[0];
                
                if (displayName) {
                  // Update profile with display name from OAuth provider
                  await supabase
                    .from('profiles')
                    .upsert({
                      user_id: session.user.id,
                      display_name: displayName,
                    }, {
                      onConflict: 'user_id'
                    });
                }
              }
              
              setTimeout(() => {
                if (mounted) {
                  checkAdminRole(session.user.id, session.user.email);
                }
              }, 0);
            } else {
              setIsAdmin(false);
              setIsBlocked(false);
              setEmailVerified(false);
            }
            if (mounted && timeoutId) {
              clearTimeout(timeoutId);
              setLoading(false);
            }
          }
        );
        subscription = { unsubscribe: authData.subscription.unsubscribe };

        // Get initial session with timeout
        try {
          const sessionTimeout = setTimeout(() => {
            if (mounted && timeoutId) {
              clearTimeout(timeoutId);
              setLoading(false);
            }
          }, 3000);

          const { data: sessionData } = await supabase.auth.getSession();
          clearTimeout(sessionTimeout);
          
          if (!mounted) return;
          
          if (sessionData && sessionData.session) {
            const { session } = sessionData;
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user) {
              // Check if user is blocked
              try {
                const { data: profile } = await supabase
                  .from('profiles')
                  .select('is_blocked, email_verified')
                  .eq('user_id', session.user.id)
                  .single() as { data: { is_blocked?: boolean; email_verified?: boolean } | null; error: unknown };

                if ((profile as { is_blocked?: boolean } | null)?.is_blocked) {
                  setIsBlocked(true);
                  setUser(null);
                  setSession(null);
                } else {
                  setIsBlocked(false);
                  setEmailVerified((profile as { email_verified?: boolean } | null)?.email_verified || false);
                  checkAdminRole(session.user.id, session.user.email);
                }
              } catch (err) {
                console.error('Error checking user block status:', err);
                setIsBlocked(false);
                checkAdminRole(session.user.id, session.user.email);
              }
            }
          }
          if (mounted && timeoutId) {
            clearTimeout(timeoutId);
            setLoading(false);
          }
        } catch (err) {
          console.error('Error getting session:', err);
          if (mounted && timeoutId) {
            clearTimeout(timeoutId);
            setLoading(false);
          }
        }
      } catch (err) {
        console.error('Error initializing auth:', err);
        if (mounted && timeoutId) {
          clearTimeout(timeoutId);
          setLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
      if (timeoutId) clearTimeout(timeoutId);
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);

  const signUp = async (email: string, password: string, displayName: string) => {
    if (!isSupabaseConfigured) {
      return { data: null, error: { message: 'Supabase is not configured. Please set up your .env file.' } };
    }

    const redirectUrl = `${window.location.origin}/`;
    const normalizedEmail = email.toLowerCase().trim();
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email: normalizedEmail,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            display_name: displayName,
          },
        },
      });

      // Create profile if user was created successfully
      if (!error && data.user) {
        try {
          // Profile should be auto-created by trigger, but ensure it exists
          await supabase
            .from('profiles')
            .upsert({
              user_id: data.user.id,
              display_name: displayName || normalizedEmail.split('@')[0],
              email_verified: false,
              is_blocked: false,
              violation_count: 0,
            }, {
              onConflict: 'user_id'
            });
        } catch (profileError) {
          console.error('Error creating user profile:', profileError);
          // Don't fail signup if profile creation fails - trigger should handle it
        }

        // Send confirmation email if signup successful
        if (data.user.email) {
          try {
            const { sendConfirmationEmail } = await import('@/lib/email');
            const confirmationLink = `${redirectUrl}?token=${data.session?.access_token || 'confirm'}`;
            await sendConfirmationEmail(data.user.email, confirmationLink);
          } catch (emailError) {
            console.error('Error sending confirmation email:', emailError);
            // Don't fail signup if email sending fails
          }
        }

        // If signup successful and it's the admin email, grant admin role
        if (isAdminEmail(normalizedEmail)) {
          // Grant admin role immediately
          try {
            await supabase
              .from('user_roles')
              .insert({
                user_id: data.user.id,
                role: 'admin',
              });
          } catch (err) {
            console.error('Failed to grant admin role on signup:', err);
          }
        }
      }

      return { data, error };
    } catch (err) {
      console.error('Error during signup:', err);
      const error = err as Error;
      return { 
        data: null, 
        error: { 
          message: error?.message || 'Failed to create account. Please try again.' 
        } 
      };
    }
  };

  const signIn = async (email: string, password: string) => {
    if (!isSupabaseConfigured) {
      return { data: null, error: { message: 'Supabase is not configured. Please set up your .env file.' } };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.toLowerCase().trim(),
      password,
    });
    return { data, error };
  };

  const signInWithOAuth = async (provider: 'google' | 'github') => {
    if (!isSupabaseConfigured) {
      console.error('Supabase is not configured. OAuth login requires database connection.');
      return;
    }

    const redirectUrl = `${window.location.origin}/`;
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: redirectUrl,
      },
    });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

    return (
      <AuthContext.Provider value={{ user, session, isAdmin, loading, isBlocked, emailVerified, signUp, signIn, signInWithOAuth, signOut }}>
        {children}
      </AuthContext.Provider>
    );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
