import { Component, inject, signal, effect } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ChipModule } from 'primeng/chip';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageService } from 'primeng/api';
import { RecipeService } from '../../services/recipe.service';
import { SupabaseService } from '../../services/supabase.service';
import { expandUnit } from '../../pipes/expand-unit.pipe';

export interface InstructionSection {
  name: string;
  steps: string[];
}

export interface ParsedIngredient {
  name: string;
  quantity: number | null;
  unit: string | null;
  category: string | null;
  display: string;
}

type Step = 'url' | 'edit';
type Method = 'url' | 'manual';

@Component({
  selector: 'app-add-recipe',
  imports: [
    FormsModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    ChipModule,
    ProgressSpinnerModule,
  ],
  templateUrl: './add-recipe.component.html',
  styleUrl: './add-recipe.component.scss',
})
export class AddRecipeComponent {
  private recipeService = inject(RecipeService);
  private supabase = inject(SupabaseService).client;
  private router = inject(Router);
  private messageService = inject(MessageService);

  constructor() {
    effect(() => {
      document.body.style.overflow = (this.loading() || this.saving()) ? 'hidden' : '';
    });
  }

  step = signal<Step>('url');
  method = signal<Method>('url');
  loading = signal(false);
  saving = signal(false);
  parseSource = signal<'schema' | 'ai' | null>(null);

  url = '';
  name = '';
  ingredients: ParsedIngredient[] = [];
  sections: InstructionSection[] = [{ name: '', steps: [''] }];
  prep_minutes: number | null = null;
  servings: number | null = null;
  image_url = '';
  tags: string[] = [];
  newIngredient = '';
  newTag = '';

  // Sekcje
  addSection() {
    this.sections = [...this.sections, { name: '', steps: [''] }];
  }

  removeSection(si: number) {
    this.sections = this.sections.filter((_, i) => i !== si);
  }

  addStep(si: number) {
    this.sections = this.sections.map((s, i) =>
      i === si ? { ...s, steps: [...s.steps, ''] } : s
    );
  }

  removeStep(si: number, ki: number) {
    this.sections = this.sections.map((s, i) =>
      i === si ? { ...s, steps: s.steps.filter((_, j) => j !== ki) } : s
    );
  }

  updateStep(si: number, ki: number, value: string) {
    this.sections = this.sections.map((s, i) =>
      i === si ? { ...s, steps: s.steps.map((st, j) => j === ki ? value : st) } : s
    );
  }

  updateSectionName(si: number, value: string) {
    this.sections = this.sections.map((s, i) =>
      i === si ? { ...s, name: value } : s
    );
  }

  goBack() {
    this.url = '';
    this.name = '';
    this.ingredients = [] as ParsedIngredient[];
    this.sections = [{ name: '', steps: [''] }];
    this.prep_minutes = null;
    this.servings = null;
    this.image_url = '';
    this.tags = [];
    this.parseSource.set(null);
    this.step.set('url');
  }

  goManual() {
    this.parseSource.set(null);
    this.step.set('edit');
  }

  async parseUrl() {
    if (!this.url.trim()) return;
    this.loading.set(true);
    try {
      const result = await this.recipeService.parseFromUrl(this.url.trim());
      if (result.error) throw new Error(result.error);
      this.name = result.name ?? '';
      this.ingredients = result.ingredients ?? [];
      this.sections = result.instructions_data ?? [{ name: '', steps: [''] }];
      this.prep_minutes = result.prep_minutes ?? null;
      this.servings = result.servings ?? null;
      this.image_url = result.image_url ?? '';
      this.tags = result.tags ?? [];
      this.parseSource.set(result.source);
      this.step.set('edit');
    } catch (e: any) {
      this.messageService.add({ severity: 'error', summary: 'Błąd', detail: e.message ?? 'Nie udało się pobrać przepisu.', life: 5000 });
    } finally {
      this.loading.set(false);
    }
  }

  formatIngredient(ing: ParsedIngredient): string {
    const parts = [];
    if (ing.quantity) parts.push(ing.quantity);
    if (ing.unit) parts.push(expandUnit(ing.unit, ing.quantity));
    parts.push(ing.name);
    return parts.join(' ');
  }

  addIngredient() {
    const val = this.newIngredient.trim();
    if (val) {
      this.ingredients = [...this.ingredients, { name: val, quantity: null, unit: null, category: null, display: val }];
      this.newIngredient = '';
    }
  }

  removeIngredient(i: number) {
    this.ingredients = this.ingredients.filter((_, idx) => idx !== i);
  }

  removeTag(tag: string) {
    this.tags = this.tags.filter(t => t !== tag);
  }

  addTag() {
    const val = this.newTag.trim().toLowerCase();
    if (val && !this.tags.includes(val)) {
      this.tags = [...this.tags, val];
      this.newTag = '';
    }
  }

  async save() {
    if (!this.name.trim()) return;
    this.saving.set(true);

    const instructions_data = this.sections
      .map(s => ({ name: s.name, steps: s.steps.filter(st => st.trim()) }))
      .filter(s => s.steps.length > 0);

    try {
      const { data: recipe, error: recipeErr } = await this.supabase
        .from('recipes')
        .insert({
          name: this.name.trim(),
          source_url: this.url || null,
          source_type: this.parseSource() ?? 'manual',
          source_name: this.url ? new URL(this.url).hostname.replace(/^www\./, '') : null,
          instructions_data,
          prep_minutes: this.prep_minutes,
          servings: this.servings,
          image_url: this.image_url || null,
          last_scraped_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (recipeErr) throw recipeErr;

      for (const ing of this.ingredients) {
        const { data: existing } = await this.supabase
          .from('ingredients').select('id').eq('name', ing.name).maybeSingle();
        let ingId: string;
        if (existing) {
          ingId = existing.id;
          // Uzupełnij kategorię jeśli brakuje
          if (ing.category) {
            await this.supabase.from('ingredients').update({ category: ing.category, unit: ing.unit }).eq('id', ingId);
          }
        } else {
          const { data: newIng, error: ingErr } = await this.supabase
            .from('ingredients')
            .insert({ name: ing.name, unit: ing.unit ?? null, category: ing.category ?? null })
            .select().single();
          if (ingErr) throw ingErr;
          ingId = newIng.id;
        }
        await this.supabase.from('recipe_ingredients').insert({
          recipe_id: recipe.id,
          ingredient_id: ingId,
          quantity: ing.quantity ?? null,
          unit_override: ing.unit ?? null,
        });
      }

      for (const tagName of this.tags) {
        const { data: existing } = await this.supabase
          .from('tags').select('id').eq('name', tagName).maybeSingle();
        let tagId: string;
        if (existing) {
          tagId = existing.id;
        } else {
          const { data: newTag, error: tagErr } = await this.supabase
            .from('tags').insert({ name: tagName }).select().single();
          if (tagErr) throw tagErr;
          tagId = newTag.id;
        }
        await this.supabase.from('recipe_tags').insert({ recipe_id: recipe.id, tag_id: tagId });
      }

      this.router.navigate(['/recipes', recipe.id]);
    } catch (e: any) {
      this.messageService.add({ severity: 'error', summary: 'Błąd zapisu', detail: e.message ?? 'Nie udało się zapisać przepisu.', life: 5000 });
    } finally {
      this.saving.set(false);
    }
  }
}
