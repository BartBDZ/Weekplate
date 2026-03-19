import {
  Component,
  computed,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { PlannerService, MealPlan, MealPlanItem } from '../../services/planner.service';
import { RecipeService, Recipe } from '../../services/recipe.service';
import { AddMealDialogComponent, AddMealResult } from './add-meal-dialog/add-meal-dialog.component';

export interface EventPlacement {
  item: MealPlanItem;
  col: number;   // 0-indexed, CSS grid column = col+1
  span: number;  // CSS grid span
  row: number;   // 0-indexed event row, CSS grid row = row+2
}

@Component({
  selector: 'app-planner',
  imports: [
    CommonModule,
    RouterLink,
    ButtonModule,
    TooltipModule,
    ToastModule,
    AddMealDialogComponent,
  ],
  providers: [MessageService],
  templateUrl: './planner.component.html',
  styleUrl: './planner.component.scss',
})
export class PlannerComponent implements OnInit, OnDestroy {
  private el = inject(ElementRef);
  private plannerService = inject(PlannerService);
  private recipeService = inject(RecipeService);
  private messageService = inject(MessageService);

  plan = signal<MealPlan | null>(null);
  private planMap = signal<Map<string, MealPlan>>(new Map());
  items = signal<MealPlanItem[]>([]);
  loading = signal(true);
  recentRecipes = signal<Recipe[]>([]);
  favoriteRecipes = signal<Recipe[]>([]);
  ingredientCount = signal(0);

  dialogVisible = signal(false);
  dialogTargetDate = signal<string | null>(null);
  dialogPreRecipe = signal<Recipe | null>(null);

  quickAddRecipe = signal<Recipe | null>(null);
  surpriseState = signal<{ dateStr: string; recipe: Recipe } | null>(null);

  // Drag state
  dragItem = signal<MealPlanItem | null>(null);
  dragRecipe = signal<Recipe | null>(null);
  dragOverCol = signal<number | null>(null);

  // Resize state
  resizingItem = signal<MealPlanItem | null>(null);
  private resizeStartX = 0;
  private resizeStartDuration = 0;

  private weekStartDate = signal<Date>(this.plannerService.getWeekStart());

  weekDays = computed(() => {
    const start = this.weekStartDate();
    return Array.from({ length: 7 }, (_, i) => this.plannerService.addDays(start, i));
  });

  // ─── Event placement algorithm ────────────────────────────────────────────

  eventsWithPlacement = computed((): EventPlacement[] => {
    const weekStart = this.weekStartDate();
    const sorted = [...this.items()].sort((a, b) => {
      const aDur = a.duration_days || 1;
      const bDur = b.duration_days || 1;
      if (bDur !== aDur) return bDur - aDur;
      return a.planned_date.localeCompare(b.planned_date);
    });

    const rowOccupancy: boolean[][] = [];
    const result: EventPlacement[] = [];

    for (const item of sorted) {
      const itemDate = new Date(item.planned_date + 'T00:00:00');
      const startOffset = Math.round(
        (itemDate.getTime() - weekStart.getTime()) / 86_400_000
      );

      if (startOffset >= 7) continue;

      const col = Math.max(0, startOffset);
      const skipStart = startOffset < 0 ? -startOffset : 0;
      const span = Math.min((item.duration_days || 1) - skipStart, 7 - col);

      if (span <= 0) continue;

      let rowIdx = 0;
      while (true) {
        if (!rowOccupancy[rowIdx]) rowOccupancy[rowIdx] = new Array(7).fill(false);
        const fits = !Array.from({ length: span }, (_, i) => col + i)
          .some(c => rowOccupancy[rowIdx][c]);

        if (fits) {
          for (let c = col; c < col + span; c++) rowOccupancy[rowIdx][c] = true;
          result.push({ item, col, span, row: rowIdx });
          break;
        }
        rowIdx++;
      }
    }

    return result;
  });

  maxEventRows = computed(() => {
    const p = this.eventsWithPlacement();
    return p.length === 0 ? 1 : Math.max(...p.map(e => e.row)) + 1;
  });

  gridTemplateRows = computed(() =>
    `auto repeat(${Math.max(1, this.maxEventRows())}, 40px) auto`
  );

  addButtonGridRow = computed(() => this.maxEventRows() + 2);

  // ─── Stats ────────────────────────────────────────────────────────────────

  /** All dates covered by any meal (including multi-day spans) */
  private coveredDates = computed(() => {
    const covered = new Set<string>();
    for (const item of this.items()) {
      const start = new Date(item.planned_date + 'T00:00:00');
      const dur = item.duration_days || 1;
      for (let i = 0; i < dur; i++) {
        covered.add(this.plannerService.toDateStr(this.plannerService.addDays(start, i)));
      }
    }
    return covered;
  });

  filledDaysCount = computed(() => {
    const covered = this.coveredDates();
    return this.weekDays().filter(d => covered.has(this.plannerService.toDateStr(d))).length;
  });

  totalMeals = computed(() => this.items().length);

  ingredientDayFilled(day: Date): boolean {
    return this.coveredDates().has(this.plannerService.toDateStr(day));
  }

  get weekLabel(): string {
    const start = this.weekStartDate();
    const end = this.plannerService.addDays(start, 6);
    const fmt = (d: Date) => d.toLocaleDateString('pl-PL', { day: 'numeric', month: 'long' });
    return `${fmt(start)} – ${fmt(end)} ${end.getFullYear()}`;
  }

  // ─── Lifecycle ────────────────────────────────────────────────────────────

  async ngOnInit() {
    await Promise.all([
      this.loadWeek(this.weekStartDate()),
      this.loadRecentRecipes(),
      this.loadFavoriteRecipes(),
    ]);
  }

  ngOnDestroy() {
    document.removeEventListener('mousemove', this.boundResizeMove);
    document.removeEventListener('mouseup', this.boundResizeUp);
  }

  private async loadRecentRecipes() {
    try {
      const all = await this.recipeService.getAll();
      this.recentRecipes.set(all.slice(0, 10));
    } catch {}
  }

  private async loadFavoriteRecipes() {
    try {
      const favs = await this.recipeService.getFavoriteRecipes();
      this.favoriteRecipes.set(favs);
    } catch {}
  }

  private async loadWeek(viewStart: Date) {
    this.loading.set(true);
    try {
      const viewEnd = this.plannerService.addDays(viewStart, 6);
      const week1 = this.plannerService.getWeekStart(viewStart);
      const week2 = this.plannerService.getWeekStart(viewEnd);
      const week1Str = this.plannerService.toDateStr(week1);
      const week2Str = this.plannerService.toDateStr(week2);

      const newPlanMap = new Map<string, MealPlan>();
      const allItems: MealPlanItem[] = [];

      const plan1 = await this.plannerService.getOrCreatePlan(week1);
      newPlanMap.set(week1Str, plan1);
      allItems.push(...await this.plannerService.getItems(plan1.id));

      if (week1Str !== week2Str) {
        const plan2 = await this.plannerService.getOrCreatePlan(week2);
        newPlanMap.set(week2Str, plan2);
        allItems.push(...await this.plannerService.getItems(plan2.id));
      }

      this.plan.set(plan1);
      this.planMap.set(newPlanMap);
      this.items.set(allItems);
      await this.refreshIngredientCount();
    } catch {
      this.messageService.add({ severity: 'error', summary: 'Błąd', detail: 'Nie udało się załadować planu' });
      this.surpriseState.set(null);
    } finally {
      this.loading.set(false);
    }
  }

  private getPlanForDate(dateStr: string): MealPlan | null {
    const date = new Date(dateStr + 'T00:00:00');
    const monday = this.plannerService.getWeekStart(date);
    const mondayStr = this.plannerService.toDateStr(monday);
    return this.planMap().get(mondayStr) ?? this.plan();
  }

  // ─── Week / day navigation ────────────────────────────────────────────────

  prevWeek() {
    const s = this.plannerService.addDays(this.weekStartDate(), -7);
    this.weekStartDate.set(s);
    this.loadWeek(s);
  }

  nextWeek() {
    const s = this.plannerService.addDays(this.weekStartDate(), 7);
    this.weekStartDate.set(s);
    this.loadWeek(s);
  }

  goToday() {
    const s = this.plannerService.getWeekStart();
    this.weekStartDate.set(s);
    this.loadWeek(s);
  }

  prevDay() {
    const s = this.plannerService.addDays(this.weekStartDate(), -1);
    this.weekStartDate.set(s);
    this.loadWeek(s);
  }

  nextDay() {
    const s = this.plannerService.addDays(this.weekStartDate(), 1);
    this.weekStartDate.set(s);
    this.loadWeek(s);
  }

  // ─── Day helpers ──────────────────────────────────────────────────────────

  isToday(date: Date): boolean {
    const t = new Date();
    return date.getDate() === t.getDate() &&
      date.getMonth() === t.getMonth() &&
      date.getFullYear() === t.getFullYear();
  }

  isPast(date: Date): boolean {
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    return date < t;
  }

  dayName(date: Date): string {
    return date.toLocaleDateString('pl-PL', { weekday: 'long' });
  }

  dayLabel(date: Date): string {
    const d = date.getDate();
    const m = date.toLocaleDateString('pl-PL', { month: 'short' }).replace('.', '');
    return `${d} ${m}`;
  }

  isDragOverCol(colIndex: number): boolean {
    return this.dragOverCol() === colIndex;
  }

  toDateStr(date: Date): string {
    return this.plannerService.toDateStr(date);
  }

  get surpriseDayLabel(): string {
    const state = this.surpriseState();
    if (!state) return '';
    const d = new Date(state.dateStr + 'T00:00:00');
    return d.toLocaleDateString('pl-PL', { weekday: 'long', day: 'numeric', month: 'long' });
  }

  // ─── Surprise (Zaskocz mnie) ──────────────────────────────────────────────

  pickSurprise(day: Date) {
    const recipes = this.recentRecipes();
    if (!recipes.length) return;
    const dateStr = this.plannerService.toDateStr(day);
    const recipe = recipes[Math.floor(Math.random() * recipes.length)];
    this.surpriseState.set({ dateStr, recipe });
  }

  reshuffleSurprise() {
    const state = this.surpriseState();
    if (!state) return;
    const others = this.recentRecipes().filter(r => r.id !== state.recipe.id);
    const pool = others.length > 0 ? others : this.recentRecipes();
    const recipe = pool[Math.floor(Math.random() * pool.length)];
    this.surpriseState.set({ ...state, recipe });
  }

  acceptSurprise() {
    const state = this.surpriseState();
    if (!state) return;
    this.dialogTargetDate.set(state.dateStr);
    this.dialogPreRecipe.set(state.recipe);
    this.surpriseState.set(null);
    this.dialogVisible.set(true);
  }

  // ─── Dialog ───────────────────────────────────────────────────────────────

  onDayClick(day: Date) {
    this.dialogTargetDate.set(this.plannerService.toDateStr(day));
    this.dialogPreRecipe.set(this.quickAddRecipe());
    this.quickAddRecipe.set(null);
    this.dialogVisible.set(true);
  }

  onQuickAddSelect(recipe: Recipe) {
    this.quickAddRecipe.set(
      this.quickAddRecipe()?.id === recipe.id ? null : recipe
    );
  }

  async onMealConfirmed(result: AddMealResult) {
    if (!this.dialogTargetDate()) return;
    const plan = this.getPlanForDate(this.dialogTargetDate()!);
    if (!plan) return;

    try {
      const item = await this.plannerService.addItem(
        plan.id, result.recipeId, this.dialogTargetDate()!, result.durationDays,
      );
      this.items.update(list => [...list, item]);

      const selections = [
        ...result.selectedIngredientIds.map(id => this.plannerService.updateSelection(plan.id, id, true)),
        ...result.excludedIngredientIds.map(id => this.plannerService.updateSelection(plan.id, id, false)),
      ];
      await Promise.all(selections);
      await this.refreshIngredientCount();
      this.messageService.add({ severity: 'success', summary: 'Dodano', detail: `${item.recipe?.name} dodane do planu.` });
    } catch {
      this.messageService.add({ severity: 'error', summary: 'Błąd', detail: 'Nie udało się dodać dania.' });
    }
  }

  async removeItem(itemId: string, recipeId: string) {
    const item = this.items().find(i => i.id === itemId);
    const recipeName = item?.recipe?.name ?? 'Danie';
    const planId = item?.plan_id ?? this.plan()?.id;
    try {
      await this.plannerService.removeItem(itemId, planId, recipeId);
      this.items.update(list => list.filter(i => i.id !== itemId));
      await this.refreshIngredientCount();
      this.messageService.add({ severity: 'error', summary: 'Usunięto', detail: `${recipeName} usunięte z planu.` });
    } catch {
      this.messageService.add({ severity: 'error', summary: 'Błąd', detail: 'Nie udało się usunąć dania.' });
    }
  }

  // ─── Drag & Drop (grid-level handlers) ────────────────────────────────────

  onMealDragStart(event: DragEvent, item: MealPlanItem) {
    if (this.resizingItem()) { event.preventDefault(); return; }
    this.dragItem.set(item);
    this.dragRecipe.set(null);
    event.dataTransfer!.effectAllowed = 'move';
  }

  onRecipeDragStart(event: DragEvent, recipe: Recipe) {
    this.dragRecipe.set(recipe);
    this.dragItem.set(null);
    event.dataTransfer!.effectAllowed = 'copy';
  }

  onDragEnd() {
    this.dragItem.set(null);
    this.dragRecipe.set(null);
    this.dragOverCol.set(null);
  }

  onGridDragOver(event: DragEvent, day: Date, colIndex: number) {
    event.preventDefault();
    this.dragOverCol.set(colIndex);
  }

  onGridDragLeave(event: DragEvent) {
    const wrap = event.currentTarget as HTMLElement;
    if (!wrap.contains(event.relatedTarget as Node)) {
      this.dragOverCol.set(null);
    }
  }

  async onDayDrop(event: DragEvent, day: Date) {
    event.preventDefault();
    const dateStr = this.plannerService.toDateStr(day);

    if (this.dragItem()) {
      await this.moveItemToDay(this.dragItem()!, dateStr);
    } else if (this.dragRecipe()) {
      this.quickAddToDay(this.dragRecipe()!, dateStr);
    }

    this.dragItem.set(null);
    this.dragRecipe.set(null);
    this.dragOverCol.set(null);
  }

  private async moveItemToDay(item: MealPlanItem, newDate: string) {
    if (item.planned_date === newDate) return;
    try {
      await this.plannerService.moveItem(item.id, newDate);
      this.items.update(list =>
        list.map(i => i.id === item.id ? { ...i, planned_date: newDate } : i)
      );
    } catch {
      this.messageService.add({ severity: 'error', summary: 'Błąd', detail: 'Nie udało się przenieść dania' });
    }
  }

  private quickAddToDay(recipe: Recipe, dateStr: string) {
    this.dialogTargetDate.set(dateStr);
    this.dialogPreRecipe.set(recipe);
    this.dialogVisible.set(true);
  }

  // ─── Resize ───────────────────────────────────────────────────────────────

  startResize(event: MouseEvent, item: MealPlanItem) {
    event.preventDefault();
    event.stopPropagation();
    this.resizingItem.set(item);
    this.resizeStartX = event.clientX;
    this.resizeStartDuration = item.duration_days || 1;
    document.addEventListener('mousemove', this.boundResizeMove);
    document.addEventListener('mouseup', this.boundResizeUp);
  }

  private boundResizeMove = (event: MouseEvent) => {
    const item = this.resizingItem();
    if (!item) return;
    const grid = this.el.nativeElement.querySelector('.calendar-grid') as HTMLElement;
    if (!grid) return;
    const colWidth = grid.getBoundingClientRect().width / 7;
    const delta = event.clientX - this.resizeStartX;
    const deltaDays = Math.round(delta / colWidth);
    const newDuration = Math.max(1, this.resizeStartDuration + deltaDays);
    this.items.update(list =>
      list.map(i => i.id === item.id ? { ...i, duration_days: newDuration } : i)
    );
  };

  private boundResizeUp = async () => {
    const item = this.resizingItem();
    if (item) {
      const current = this.items().find(i => i.id === item.id);
      if (current) {
        try {
          await this.plannerService.resizeItem(current.id, current.duration_days || 1);
        } catch {
          this.messageService.add({ severity: 'error', summary: 'Błąd', detail: 'Nie udało się zmienić czasu trwania' });
        }
      }
    }
    this.resizingItem.set(null);
    document.removeEventListener('mousemove', this.boundResizeMove);
    document.removeEventListener('mouseup', this.boundResizeUp);
  };

  private async refreshIngredientCount() {
    const from = this.plannerService.toDateStr(this.weekStartDate());
    const to = this.plannerService.toDateStr(this.plannerService.addDays(this.weekStartDate(), 6));
    const ingIds = new Set<string>();
    for (const plan of this.planMap().values()) {
      const ings = await this.plannerService.getShoppingIngredients(plan.id, from, to);
      ings.forEach(i => ingIds.add(i.ingredient_id));
    }
    this.ingredientCount.set(ingIds.size);
  }
}
