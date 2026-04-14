import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthError, User } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$: Observable<User | null> = this.currentUserSubject.asObservable();
  private readonly initPromise: Promise<void>;

  constructor(private supabaseService: SupabaseService) {
    this.initPromise = this.initAuth();
  }

  private async initAuth() {
    // Get initial session
    const { data: { session } } = await this.supabaseService.auth.getSession();
    this.currentUserSubject.next(session?.user || null);

    // Listen to changes
    this.supabaseService.auth.onAuthStateChange((_event, session) => {
      this.currentUserSubject.next(session?.user || null);
    });
  }

  async ensureSessionLoaded(): Promise<void> {
    await this.initPromise;
  }

  // Provide observable for current user
  getCurrentUser(): Observable<User | null> {
    return this.currentUser$;
  }

  // Method returns true if logged in
  get isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }

  async login(email: string, password: string): Promise<User> {
    const { data, error } = await this.supabaseService.auth.signInWithPassword({
      email: email.trim(),
      password
    });

    if (error) {
      throw new Error(this.mapAuthError(error));
    }

    if (!data.user) {
      throw new Error('Sign-in succeeded but no user session was returned.');
    }

    this.currentUserSubject.next(data.user);
    return data.user;
  }

  async signup(email: string, password: string, displayName: string): Promise<{ requiresEmailConfirmation: boolean }> {
    const { data, error } = await this.supabaseService.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          full_name: displayName.trim()
        }
      }
    });

    if (error) {
      throw new Error(this.mapAuthError(error));
    }

    this.currentUserSubject.next(data.user || null);
    return {
      requiresEmailConfirmation: !data.session
    };
  }

  getCurrentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  async logout(): Promise<void> {
    const { error } = await this.supabaseService.auth.signOut();
    if (error) {
      throw new Error(this.mapAuthError(error));
    }
    this.currentUserSubject.next(null);
  }

  private mapAuthError(error: AuthError): string {
    const normalizedMessage = error.message.toLowerCase();

    if (normalizedMessage.includes('invalid login credentials')) {
      return 'Invalid email or password.';
    }

    if (normalizedMessage.includes('email not confirmed')) {
      return 'Please confirm your email address before logging in.';
    }

    if (normalizedMessage.includes('already registered')) {
      return 'An account with that email already exists.';
    }

    if (normalizedMessage.includes('password')) {
      return error.message;
    }

    return error.message || 'Authentication failed.';
  }
}
