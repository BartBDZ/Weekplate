import { inject, Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { AuthService } from './auth.service';

export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface Recipe {
  id: string;
  name: string;
  source_url: string | null;
  notes: string | null;
  instructions: string | null;
  prep_minutes: number | null;
  servings: number | null;
  image_url: string | null;
  rating: number | null;
  source_name: string | null;
  source_type: string | null;
  created_at: string;
  tags?: Tag[];
}

const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF2dGRkbHdxcHNhY2toaHRrZGpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4NTA3NzYsImV4cCI6MjA4OTQyNjc3Nn0.1LHVVp7kWwota2weg5JiVCTGr17ezunHhs9V3bf0jLw';

@Injectable({ providedIn: 'root' })
export class RecipeService {
  private db = inject(SupabaseService).client;
  private auth = inject(AuthService);

  async getAll(): Promise<Recipe[]> {
    const { data, error } = await this.db
      .from('recipes')
      .select(`*, recipe_tags(tags(id, name, color))`)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return (data ?? []).map((r: any) => ({
      ...r,
      tags: r.recipe_tags?.map((rt: any) => rt.tags).filter(Boolean) ?? [],
    }));
  }

  async getById(id: string): Promise<Recipe | null> {
    const { data, error } = await this.db
      .from('recipes')
      .select(`
        *,
        recipe_tags(tags(id, name, color)),
        recipe_ingredients(quantity, unit_override, ingredients(id, name, unit, category))
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data ? {
      ...data,
      tags: data.recipe_tags?.map((rt: any) => rt.tags).filter(Boolean) ?? [],
    } : null;
  }

  async getTags(): Promise<Tag[]> {
    const { data, error } = await this.db.from('tags').select('*').order('name');
    if (error) throw error;
    return data ?? [];
  }

  async getFavoriteIds(): Promise<string[]> {
    const userId = this.auth.user()?.id;
    if (!userId) return [];
    const { data } = await this.db
      .from('recipe_favorites')
      .select('recipe_id')
      .eq('profile_id', userId);
    return (data ?? []).map((r: any) => r.recipe_id as string);
  }

  async getFavoriteRecipes(): Promise<Recipe[]> {
    const userId = this.auth.user()?.id;
    if (!userId) return [];
    const { data } = await this.db
      .from('recipe_favorites')
      .select('recipe_id, recipes(*, recipe_tags(tags(id, name, color)))')
      .eq('profile_id', userId)
      .order('created_at', { ascending: false });
    return (data ?? [])
      .map((f: any) => f.recipes)
      .filter(Boolean)
      .map((r: any) => ({ ...r, tags: r.recipe_tags?.map((rt: any) => rt.tags).filter(Boolean) ?? [] }));
  }

  async toggleFavorite(recipeId: string): Promise<boolean> {
    const userId = this.auth.user()?.id;
    if (!userId) return false;
    const { data: existing } = await this.db
      .from('recipe_favorites')
      .select('id')
      .eq('profile_id', userId)
      .eq('recipe_id', recipeId)
      .maybeSingle();
    if (existing) {
      await this.db.from('recipe_favorites').delete().eq('id', existing.id);
      return false;
    } else {
      await this.db.from('recipe_favorites').insert({ profile_id: userId, recipe_id: recipeId });
      return true;
    }
  }

  async parseFromUrl(url: string): Promise<any> {
    const res = await fetch(
      'https://qvtddlwqpsackhhtkdjd.supabase.co/functions/v1/parse-recipe',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${ANON_KEY}`,
        },
        body: JSON.stringify({ url }),
      }
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  }
}
