import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private readonly supabase: SupabaseClient;

  constructor() {
    if (!this.hasValidSupabaseConfig()) {
      throw new Error('Supabase is not configured. Set supabaseUrl and supabaseAnonKey in the Angular environment files.');
    }

    this.supabase = createClient(environment.supabaseUrl, environment.supabaseAnonKey);
  }

  get auth() {
    return this.supabase.auth;
  }

  get client() {
    return this.supabase;
  }

  async getToken(): Promise<string | null> {
    const { data: { session } } = await this.auth.getSession();
    return session?.access_token || null;
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
