import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  Output,
  signal,
  SimpleChanges,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { CheckboxModule } from 'primeng/checkbox';
import { DividerModule } from 'primeng/divider';
import { SkeletonModule } from 'primeng/skeleton';
import { BadgeModule } from 'primeng/badge';
import { RecipeService, Recipe } from '../../../services/recipe.service';
import { PlannerService, ShoppingIngredient } from '../../../services/planner.service';
import { ExpandUnitPipe } from '../../../pipes/expand-unit.pipe';

export interface AddMealResult {
  recipeId: string;
  durationDays: number;
  selectedIngredientIds: string[];
  excludedIngredientIds: string[];
}

@Component({
  selector: 'app-add-meal-dialog',
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    CheckboxModule,
    DividerModule,
    SkeletonModule,
    BadgeModule,
    ExpandUnitPipe,
  ],
  templateUrl: './add-meal-dialog.component.html',
  styleUrl: './add-meal-dialog.component.scss',
})
export class AddMealDialogComponent implements OnChanges {
  private recipeService = inject(RecipeService);
  private plannerService = inject(PlannerService);

  @Input() visible = false;
  @Input() planId: string | null = null;
  @Input() targetDate: string | null = null; // YYYY-MM-DD
  @Input() preSelectedRecipe: Recipe | null = null;

  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() confirmed = new EventEmitter<AddMealResult>();

  step = signal<1 | 2>(1);
  loading = signal(false);
  openedWithPreselection = signal(false);

  // Krok 1
  recipes = signal<Recipe[]>([]);
  searchQuery = signal('');
  selectedRecipe = signal<Recipe | null>(null);
  durationDays = signal(1);

  // Krok 2
  ingredients = signal<(ShoppingIngredient & { selected: boolean })[]>([]);
  loadingIngredients = signal(false);

  get filteredRecipes(): Recipe[] {
    const q = this.searchQuery().toLowerCase();
    return this.recipes().filter(r =>
      !q || r.name.toLowerCase().includes(q)
    );
  }

  get targetDateLabel(): string {
    if (!this.targetDate) return '';
    const d = new Date(this.targetDate + 'T00:00:00');
    return d.toLocaleDateString('pl-PL', { weekday: 'long', day: 'numeric', month: 'long' });
  }

  get allChecked(): boolean {
    return this.ingredients().every(i => i.selected);
  }

  get groupedIngredients(): { category: string; items: (ShoppingIngredient & { selected: boolean })[] }[] {
    const groups = new Map<string, (ShoppingIngredient & { selected: boolean })[]>();
    for (const ing of this.ingredients()) {
      const cat = ing.category ?? 'Inne';
      if (!groups.has(cat)) groups.set(cat, []);
      groups.get(cat)!.push(ing);
    }
    return Array.from(groups.entries()).map(([category, items]) => ({ category, items }));
  }

  async ngOnChanges(changes: SimpleChanges) {
    if (changes['visible']?.currentValue === true) {
      if (this.preSelectedRecipe) {
        this.openedWithPreselection.set(true);
        this.selectedRecipe.set(this.preSelectedRecipe);
        await this.goToStep2();
      } else if (this.recipes().length === 0) {
        this.loading.set(true);
        try {
          const all = await this.recipeService.getAll();
          this.recipes.set(all);
        } finally {
          this.loading.set(false);
        }
      }
    }
    if (changes['visible']?.currentValue === false) {
      this.reset();
    }
  }

  selectRecipe(recipe: Recipe) {
    this.selectedRecipe.set(recipe);
  }

  async goToStep2() {
    const recipe = this.selectedRecipe();
    if (!recipe) return;

    this.step.set(2);
    this.loadingIngredients.set(true);

    try {
      // Pobierz składniki bezpośrednio z przepisu
      const full = await this.recipeService.getById(recipe.id);
      const riList = (full as any)?.recipe_ingredients ?? [];
      const mapped = riList.map((ri: any) => ({
        ingredient_id: ri.ingredients.id,
        name: ri.ingredients.name,
        category: ri.ingredients.category,
        total_quantity: ri.quantity,
        unit: ri.unit_override ?? ri.ingredients.unit,
        checked: true,
        note: null,
        sources: [recipe.name],
        selected: true,
      }));
      this.ingredients.set(mapped);
    } finally {
      this.loadingIngredients.set(false);
    }
  }

  toggleAll(checked: boolean) {
    this.ingredients.update(list => list.map(i => ({ ...i, selected: checked })));
  }

  toggleIngredient(ingredientId: string) {
    this.ingredients.update(list =>
      list.map(i => i.ingredient_id === ingredientId ? { ...i, selected: !i.selected } : i)
    );
  }

  confirm() {
    const recipe = this.selectedRecipe();
    if (!recipe) return;

    this.confirmed.emit({
      recipeId: recipe.id,
      durationDays: this.durationDays(),
      selectedIngredientIds: this.ingredients()
        .filter(i => i.selected)
        .map(i => i.ingredient_id),
      excludedIngredientIds: this.ingredients()
        .filter(i => !i.selected)
        .map(i => i.ingredient_id),
    });
    this.close();
  }

  goBack() {
    this.step.set(1);
  }

  close() {
    this.visibleChange.emit(false);
  }

  private reset() {
    this.step.set(1);
    this.selectedRecipe.set(null);
    this.durationDays.set(1);
    this.searchQuery.set('');
    this.ingredients.set([]);
    this.openedWithPreselection.set(false);
  }
}
