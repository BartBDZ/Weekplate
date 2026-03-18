import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from './supabase.service';
import type { User } from '@supabase/supabase-js';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private supabase = inject(SupabaseService).client;
  private router = inject(Router);

  user = signal<User | null>(null);
  initialized = signal(false);

  constructor() {
    this.supabase.auth.getSession().then(({ data }) => {
      this.user.set(data.session?.user ?? null);
      this.initialized.set(true);
    });

    this.supabase.auth.onAuthStateChange((_, session) => {
      this.user.set(session?.user ?? null);
    });
  }

  async signIn(email: string, password: string) {
    const { error } = await this.supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    this.router.navigate(['/recipes']);
  }

  async signOut() {
    await this.supabase.auth.signOut();
    this.router.navigate(['/login']);
  }

  async getSession() {
    const { data } = await this.supabase.auth.getSession();
    return data.session;
  }
}
