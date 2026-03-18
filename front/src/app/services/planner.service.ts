import { inject, Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { AuthService } from './auth.service';

export interface MealPlan {
  id: string;
  profile_id: string;
  week_start: string;
  name: string | null;
}

export interface MealPlanItem {
  id: string;
  plan_id: string;
  recipe_id: string;
  planned_date: string;
  duration_days: number;
  recipe?: {
    id: string;
    name: string;
    image_url: string | null;
  };
}

export interface ShoppingIngredient {
  ingredient_id: string;
  name: string;
  category: string | null;
  total_quantity: number | null;
  unit: string | null;
  checked: boolean;
  note: string | null;
  sources: string[]; // nazwy przepisów
}

export interface ShoppingSelection {
  id: string;
  plan_id: string;
  ingredient_id: string;
  checked: boolean;
  note: string | null;
}

@Injectable({ providedIn: 'root' })
export class PlannerService {
  private db = inject(SupabaseService).client;
  private auth = inject(AuthService);

  /** Zwraca lub tworzy plan dla danego tygodnia (week_start = poniedziałek) */
  async getOrCreatePlan(weekStart: Date): Promise<MealPlan> {
    const userId = this.auth.user()?.id;
    if (!userId) throw new Error('Niezalogowany');

    const weekStartStr = this.toDateStr(weekStart);

    // Upewnij się że profil istnieje (meal_plans FK → profiles)
    await this.db
      .from('profiles')
      .upsert({ id: userId }, { onConflict: 'id', ignoreDuplicates: true });

    const { data: existing } = await this.db
      .from('meal_plans')
      .select('*')
      .eq('profile_id', userId)
      .eq('week_start', weekStartStr)
      .maybeSingle();

    if (existing) return existing as MealPlan;

    const { data, error } = await this.db
      .from('meal_plans')
      .insert({ profile_id: userId, week_start: weekStartStr })
      .select()
      .single();

    if (error) throw error;
    return data as MealPlan;
  }

  /** Pobiera plan po ID */
  async getPlan(planId: string): Promise<MealPlan> {
    const { data, error } = await this.db
      .from('meal_plans')
      .select('*')
      .eq('id', planId)
      .single();

    if (error) throw error;
    return data as MealPlan;
  }

  /** Pobiera wszystkie dania z planu */
  async getItems(planId: string): Promise<MealPlanItem[]> {
    const { data, error } = await this.db
      .from('meal_plan_items')
      .select(`
        id, plan_id, recipe_id, planned_date, duration_days,
        recipes(id, name, image_url)
      `)
      .eq('plan_id', planId);

    if (error) throw error;
    return (data ?? []).map((item: any) => ({
      ...item,
      recipe: item.recipes,
    }));
  }

  /** Dodaje danie do planu */
  async addItem(planId: string, recipeId: string, plannedDate: string, durationDays: number): Promise<MealPlanItem> {
    const { data, error } = await this.db
      .from('meal_plan_items')
      .insert({
        plan_id: planId,
        recipe_id: recipeId,
        planned_date: plannedDate,
        duration_days: durationDays,
      })
      .select(`id, plan_id, recipe_id, planned_date, duration_days, recipes(id, name, image_url)`)
      .single();

    if (error) throw error;
    return { ...(data as any), recipe: (data as any).recipes };
  }

  /** Przesuwa danie (drag & drop) */
  async moveItem(itemId: string, newDate: string): Promise<void> {
    const { error } = await this.db
      .from('meal_plan_items')
      .update({ planned_date: newDate })
      .eq('id', itemId);

    if (error) throw error;
  }

  /** Zmienia czas trwania dania (resize) */
  async resizeItem(itemId: string, newDuration: number): Promise<void> {
    const { error } = await this.db
      .from('meal_plan_items')
      .update({ duration_days: newDuration })
      .eq('id', itemId);

    if (error) throw error;
  }

  /** Usuwa danie z planu i czyści shopping_selections dla składników, które już nie są w żadnym innym daniu */
  async removeItem(itemId: string, planId?: string, recipeId?: string): Promise<void> {
    const { error } = await this.db
      .from('meal_plan_items')
      .delete()
      .eq('id', itemId);

    if (error) throw error;

    if (planId && recipeId) {
      await this.cleanupSelectionsAfterRemoval(planId, recipeId);
    }
  }

  private async cleanupSelectionsAfterRemoval(planId: string, recipeId: string): Promise<void> {
    const { data: recipeIngs } = await this.db
      .from('recipe_ingredients')
      .select('ingredient_id')
      .eq('recipe_id', recipeId);

    if (!recipeIngs || recipeIngs.length === 0) return;

    const removedIngIds = recipeIngs.map((ri: any) => ri.ingredient_id as string);

    // Sprawdź które składniki są jeszcze w pozostałych daniach planu
    const { data: remainingItems } = await this.db
      .from('meal_plan_items')
      .select('recipes(recipe_ingredients(ingredient_id))')
      .eq('plan_id', planId);

    const stillNeededIds = new Set<string>();
    for (const item of remainingItems ?? []) {
      for (const ri of (item as any).recipes?.recipe_ingredients ?? []) {
        stillNeededIds.add(ri.ingredient_id);
      }
    }

    const idsToClean = removedIngIds.filter(id => !stillNeededIds.has(id));
    if (idsToClean.length > 0) {
      await this.db
        .from('shopping_selections')
        .delete()
        .eq('plan_id', planId)
        .in('ingredient_id', idsToClean);
    }
  }

  /** Pobiera zagregowane składniki dla zakresu dat */
  async getShoppingIngredients(planId: string, fromDate?: string, toDate?: string): Promise<ShoppingIngredient[]> {
    let query = this.db
      .from('meal_plan_items')
      .select(`
        planned_date, duration_days, recipe_id,
        recipes(
          name,
          recipe_ingredients(
            quantity, unit_override,
            ingredients(id, name, unit, category)
          )
        )
      `)
      .eq('plan_id', planId);

    if (fromDate) query = query.gte('planned_date', fromDate);
    if (toDate) query = query.lte('planned_date', toDate);

    const { data, error } = await query;
    if (error) throw error;

    // Pobierz zaznaczenia (checked/unchecked)
    const { data: selections } = await this.db
      .from('shopping_selections')
      .select('*')
      .eq('plan_id', planId);

    const selMap = new Map<string, ShoppingSelection>(
      (selections ?? []).map((s: ShoppingSelection) => [s.ingredient_id, s])
    );

    // Agreguj składniki
    const aggregated = new Map<string, ShoppingIngredient>();

    for (const item of data ?? []) {
      const recipe = (item as any).recipes;
      if (!recipe) continue;

      for (const ri of recipe.recipe_ingredients ?? []) {
        const ing = ri.ingredients;
        if (!ing) continue;

        const existing = aggregated.get(ing.id);
        const qty = ri.quantity ?? 0;
        const sel = selMap.get(ing.id);

        if (existing) {
          existing.total_quantity = (existing.total_quantity ?? 0) + qty;
          if (!existing.sources.includes(recipe.name)) {
            existing.sources.push(recipe.name);
          }
        } else {
          aggregated.set(ing.id, {
            ingredient_id: ing.id,
            name: ing.name,
            category: ing.category,
            total_quantity: qty || null,
            unit: ri.unit_override ?? ing.unit,
            checked: sel?.checked ?? true,
            note: sel?.note ?? null,
            sources: [recipe.name],
          });
        }
      }
    }

    return Array.from(aggregated.values()).sort((a, b) =>
      (a.category ?? 'z').localeCompare(b.category ?? 'z')
    );
  }

  /** Aktualizuje zaznaczenie składnika na liście zakupów */
  async updateSelection(planId: string, ingredientId: string, checked: boolean, note?: string): Promise<void> {
    const { error } = await this.db
      .from('shopping_selections')
      .upsert(
        { plan_id: planId, ingredient_id: ingredientId, checked, note: note ?? null },
        { onConflict: 'plan_id,ingredient_id' }
      );

    if (error) throw error;
  }

  /** Pomocnicze: poniedziałek danego tygodnia */
  getWeekStart(date: Date = new Date()): Date {
    const d = new Date(date);
    const day = d.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    d.setDate(d.getDate() + diff);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  toDateStr(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  addDays(date: Date, days: number): Date {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
  }
}
