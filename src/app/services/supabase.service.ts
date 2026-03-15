import { Injectable } from '@angular/core';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

const MOCK_USER_STORAGE_KEY = 'cropwise_mock_user';

type AuthChangeCallback = (event: string, session: { user: User | null; access_token?: string } | null) => void;

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient | null = null;
  private authChangeCallbacks: AuthChangeCallback[] = [];
  private readonly isConfigured: boolean;

  constructor() {
    this.isConfigured = this.hasValidSupabaseConfig();

    if (this.isConfigured) {
      this.supabase = createClient(environment.supabaseUrl, environment.supabaseAnonKey);
    }
  }

  get auth() {
    if (this.supabase) {
      return this.supabase.auth;
    }

    return {
      getSession: async () => ({
        data: { session: this.getMockSession() },
        error: null
      }),
      onAuthStateChange: (callback: AuthChangeCallback) => {
        this.authChangeCallbacks.push(callback);
        return {
          data: {
            subscription: {
              unsubscribe: () => {
                this.authChangeCallbacks = this.authChangeCallbacks.filter((item) => item !== callback);
              }
            }
          }
        };
      },
      signOut: async () => {
        this.clearMockUser();
        this.emitAuthChange('SIGNED_OUT');
        return { error: null };
      },
      signInWithOAuth: async () => ({
        data: null,
        error: new Error('Supabase OAuth is not configured in this environment.')
      })
    };
  }

  get client() {
    return this.supabase;
  }

  async getToken(): Promise<string | null> {
    const { data: { session } } = await this.auth.getSession();
    return session?.access_token || null;
  }

  setMockUser(email: string, displayName?: string): User {
    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = this.getStoredMockUser();
    const fullName = displayName?.trim()
      || (existingUser?.email === normalizedEmail ? this.resolveStoredName(existingUser) : '')
      || this.deriveDisplayName(normalizedEmail);
    const mockUser = {
      id: `mock-${normalizedEmail.replace(/[^a-z0-9]/g, '-')}`,
      email: normalizedEmail,
      aud: 'authenticated',
      role: 'authenticated',
      app_metadata: {},
      created_at: new Date().toISOString(),
      user_metadata: {
        full_name: fullName
      }
    } as User;

    localStorage.setItem(MOCK_USER_STORAGE_KEY, JSON.stringify(mockUser));
    this.emitAuthChange('SIGNED_IN');
    return mockUser;
  }

  private emitAuthChange(event: string): void {
    const session = this.getMockSession();
    this.authChangeCallbacks.forEach((callback) => callback(event, session));
  }

  private getMockSession(): { user: User | null; access_token?: string } | null {
    const user = this.getStoredMockUser();
    if (!user) {
      return null;
    }

    return {
      user,
      access_token: 'mock-access-token'
    };
  }

  private clearMockUser(): void {
    localStorage.removeItem(MOCK_USER_STORAGE_KEY);
  }

  private getStoredMockUser(): User | null {
    const stored = localStorage.getItem(MOCK_USER_STORAGE_KEY);
    if (!stored) {
      return null;
    }

    try {
      return JSON.parse(stored) as User;
    } catch {
      return null;
    }
  }

  private resolveStoredName(user: User): string {
    const metadata = user.user_metadata as { full_name?: string; name?: string } | undefined;
    return metadata?.full_name || metadata?.name || '';
  }

  private deriveDisplayName(email: string): string {
    const localPart = email.split('@')[0] || 'Farmer';
    return localPart
      .replace(/[._-]+/g, ' ')
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ') || 'Farmer';
  }

  private hasValidSupabaseConfig(): boolean {
    return Boolean(
      environment.supabaseUrl &&
      environment.supabaseAnonKey &&
      !environment.supabaseUrl.includes('YOUR_') &&
      !environment.supabaseAnonKey.includes('YOUR_') &&
      /^https?:\/\//.test(environment.supabaseUrl)
    );
  }
}
