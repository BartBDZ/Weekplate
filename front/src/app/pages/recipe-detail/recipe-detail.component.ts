import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmationService, MessageService } from 'primeng/api';
import { RecipeService } from '../../services/recipe.service';
import { SupabaseService } from '../../services/supabase.service';
import { ExpandUnitPipe } from '../../pipes/expand-unit.pipe';

interface Ingredient {
  name: string;
  quantity: number | null;
  unit: string | null;
}

interface RecipeDetail {
  id: string;
  name: string;
  source_url: string | null;
  instructions: string | null;
  prep_minutes: number | null;
  servings: number | null;
  image_url: string | null;
  rating: number | null;
  source_type: string | null;
  source_name: string | null;
  instructions_data: { name: string; steps: string[] }[] | null;
  created_at: string;
  tags: { id: string; name: string; color: string }[];
  ingredients: Ingredient[];
}

@Component({
  selector: 'app-recipe-detail',
  imports: [ButtonModule, RouterLink, ConfirmDialogModule, TooltipModule, ExpandUnitPipe],
  providers: [ConfirmationService],
  templateUrl: './recipe-detail.component.html',
  styleUrl: './recipe-detail.component.scss',
})
export class RecipeDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private recipeService = inject(RecipeService);
  private supabase = inject(SupabaseService).client;
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);

  recipe = signal<RecipeDetail | null>(null);
  loading = signal(true);
  deleting = signal(false);
  isFavorite = signal(false);
  rating: number | null = null;
  hoverRating = 0;
  completedSteps = new Set<number>();

  toggleStep(index: number) {
    if (this.completedSteps.has(index)) {
      this.completedSteps.delete(index);
    } else {
      this.completedSteps.add(index);
    }
    this.completedSteps = new Set(this.completedSteps);
  }

  async saveRating(value: number) {
    this.rating = value;
    await this.supabase
      .from('recipes')
      .update({ rating: value })
      .eq('id', this.recipe()!.id);
  }

  confirmDelete() {
    this.confirmationService.confirm({
      message: `Czy na pewno chcesz usunąć przepis <b>"${this.recipe()!.name}"</b>?<br><b><u>Tej operacji nie można cofnąć!</u></b>`,
      header: 'Usuń przepis',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Usuń',
      rejectLabel: 'Anuluj',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => this.deleteRecipe(),
    });
  }

  async deleteRecipe() {
    this.deleting.set(true);
    const { error } = await this.supabase
      .from('recipes')
      .delete()
      .eq('id', this.recipe()!.id);
    this.deleting.set(false);
    if (error) { this.messageService.add({ severity: 'error', summary: 'Błąd', detail: error.message, life: 5000 }); return; }
    this.router.navigate(['/recipes']);
  }

  get instructionLines(): { type: 'section' | 'step'; text: string; index?: number }[] {
    const data = this.recipe()?.instructions_data;
    if (!data?.length) return [];
    const lines: { type: 'section' | 'step'; text: string; index?: number }[] = [];
    let stepIndex = 0;
    for (const section of data) {
      if (section.name) lines.push({ type: 'section', text: section.name });
      for (const step of section.steps) {
        lines.push({ type: 'step', text: step, index: stepIndex++ });
      }
    }
    return lines;
  }

  async toggleFavorite() {
    const id = this.recipe()?.id;
    if (!id) return;
    const added = await this.recipeService.toggleFavorite(id);
    this.isFavorite.set(added);
  }

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    try {
      const [data, favIds] = await Promise.all([
        this.recipeService.getById(id),
        this.recipeService.getFavoriteIds(),
      ]);
      const favSet = new Set(favIds);
      this.isFavorite.set(favSet.has(id));
      if (!data) { this.router.navigate(['/recipes']); return; }
      const raw: any = data;
      this.recipe.set({
        ...raw,
        tags: raw.recipe_tags?.map((rt: any) => rt.tags).filter(Boolean) ?? [],
        ingredients: raw.recipe_ingredients?.map((ri: any) => ({
          name: ri.ingredients?.name ?? '',
          quantity: ri.quantity ?? null,
          unit: ri.unit_override ?? ri.ingredients?.unit ?? null,
        })) ?? [],
      });
      this.rating = raw.rating ?? null;
    } catch (e: any) {
      this.messageService.add({ severity: 'error', summary: 'Błąd', detail: e.message ?? 'Błąd ładowania.', life: 5000 });
    } finally {
      this.loading.set(false);
    }
  }
}
