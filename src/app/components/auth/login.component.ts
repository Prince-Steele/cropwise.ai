import { Component } from '@angular/core';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-login',
  template: `
    <div class="auth-container">
      <h2>Login to CropWise</h2>
      <button (click)="loginWithGoogle()">Sign in with Google</button>
      <p>Supabase handles secure authentication automatically.</p>
    </div>
  `,
  styles: [`
    .auth-container { max-width: 400px; margin: 40px auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; text-align: center; }
    button { padding: 10px 20px; background-color: #2e7d32; color: white; border: none; border-radius: 4px; cursor: pointer; }
    button:hover { background-color: #1b5e20; }
  `]
})
export class LoginComponent {
  constructor(private supabase: SupabaseService) {}

  async loginWithGoogle() {
    const { error } = await this.supabase.auth.signInWithOAuth({
      provider: 'google',
    });
    
    if (error) {
      console.error('Login error:', error);
    }
  }
}
