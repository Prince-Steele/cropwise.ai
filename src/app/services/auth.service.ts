import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$: Observable<User | null> = this.currentUserSubject.asObservable();

  constructor(private supabaseService: SupabaseService) {
    this.initAuth();
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

  // Provide observable for current user
  getCurrentUser(): Observable<User | null> {
    return this.currentUser$;
  }

  // Method returns true if logged in
  get isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }

  async login(email: string): Promise<User> {
    const user = this.supabaseService.setMockUser(email);
    this.currentUserSubject.next(user);
    return user;
  }

  async logout(): Promise<void> {
    try {
      await this.supabaseService.auth.signOut();
    } catch {
      // Ignore sign-out failures when auth is not configured.
    } finally {
      this.currentUserSubject.next(null);
    }
  }
}
