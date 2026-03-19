import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { SelectButtonModule } from 'primeng/selectbutton';
import { InputTextModule } from 'primeng/inputtext';
import { DividerModule } from 'primeng/divider';
import { SkeletonModule } from 'primeng/skeleton';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { BadgeModule } from 'primeng/badge';
import { MessageService } from 'primeng/api';
import { PlannerService, MealPlan, ShoppingIngredient } from '../../services/planner.service';
import { ExpandUnitPipe } from '../../pipes/expand-unit.pipe';

type FilterMode = 'week' | 'day';

interface DayOption {
  label: string;
  value: string; // YYYY-MM-DD
}

@Component({
  selector: 'app-shopping',
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    ButtonModule,
    CheckboxModule,
    SelectButtonModule,
    InputTextModule,
    DividerModule,
    SkeletonModule,
    ToastModule,
    TooltipModule,
    BadgeModule,
    ExpandUnitPipe,
  ],
  providers: [MessageService],
  templateUrl: './shopping.component.html',
  styleUrl: './shopping.component.scss',
})
export class ShoppingComponent implements OnInit {
  private plannerService = inject(PlannerService);
  private messageService = inject(MessageService);
  private route = inject(ActivatedRoute);

  plan = signal<MealPlan | null>(null);
  allPlans = signal<MealPlan[]>([]);
  ingredients = signal<ShoppingIngredient[]>([]);
  loading = signal(true);

  filterMode = signal<FilterMode>('week');
  selectedDay = signal<string>('');

  filterOptions = [
    { label: 'Wszystkie zakupy', value: 'week' as FilterMode },
    { label: 'Wybrany dzień', value: 'day' as FilterMode },
  ];

  dayOptions = signal<DayOption[]>([]);

  get uncheckedCount(): number {
    return this.ingredients().filter(i => i.checked).length;
  }

  get groupedIngredients(): { category: string; items: ShoppingIngredient[] }[] {
    const groups = new Map<string, ShoppingIngredient[]>();
    for (const ing of this.ingredients()) {
      const cat = ing.category ?? 'Inne';
      if (!groups.has(cat)) groups.set(cat, []);
      groups.get(cat)!.push(ing);
    }
    return Array.from(groups.entries()).map(([category, items]) => ({ category, items }));
  }

  get categoryIcon(): (cat: string) => string {
    const icons: Record<string, string> = {
      'mięso': 'pi-box',
      'warzywa': 'pi-leaf',
      'nabiał': 'pi-circle',
      'owoce': 'pi-sun',
      'pieczywo': 'pi-inbox',
      'przyprawy': 'pi-star',
      'przetwory': 'pi-server',
      'inne': 'pi-tag',
    };
    return (cat: string) => 'pi ' + (icons[cat.toLowerCase()] ?? 'pi-tag');
  }

  async ngOnInit() {
    const planId = this.route.snapshot.queryParamMap.get('planId');

    try {
      // Załaduj wszystkie plany użytkownika
      const allPlans = await this.plannerService.getAllPlans();
      this.allPlans.set(allPlans);

      // Ustal bieżący plan (z query param lub bieżący tydzień)
      let currentPlan: MealPlan;
      if (planId) {
        currentPlan = await this.plannerService.getPlan(planId);
      } else {
        currentPlan = await this.plannerService.getOrCreatePlan(this.plannerService.getWeekStart());
      }
      this.plan.set(currentPlan);

      // Zbierz unikalne daty ze WSZYSTKICH planów
      const allItemsArrays = await Promise.all(allPlans.map(p => this.plannerService.getItems(p.id)));
      const dateSet = new Set<string>();
      for (const items of allItemsArrays) {
        for (const item of items) {
          const dur = item.duration_days || 1;
          const start = new Date(item.planned_date + 'T00:00:00');
          for (let i = 0; i < dur; i++) {
            dateSet.add(this.plannerService.toDateStr(this.plannerService.addDays(start, i)));
          }
        }
      }

      // Tylko dziś i przyszłe dni z zaplanowanymi daniami
      const todayStr = this.plannerService.toDateStr(new Date());
      const futureDates = Array.from(dateSet).sort().filter(d => d >= todayStr);
      const days: DayOption[] = futureDates.map(dateStr => {
        const d = new Date(dateStr + 'T00:00:00');
        const label = d.toLocaleDateString('pl-PL', { weekday: 'long', day: 'numeric', month: 'short' });
        return { label, value: dateStr };
      });
      this.dayOptions.set(days);

      // Domyślnie dziś (jeśli ma dania), inaczej najbliższy przyszły dzień
      this.selectedDay.set(days[0]?.value ?? '');

      await this.loadIngredients();
    } catch {
      this.messageService.add({ severity: 'error', summary: 'Błąd', detail: 'Nie udało się załadować listy zakupów' });
    } finally {
      this.loading.set(false);
    }
  }

  async onFilterChange() {
    await this.loadIngredients();
  }

  async onDayChange() {
    await this.loadIngredients();
  }

  private async loadIngredients() {
    this.loading.set(true);
    try {
      if (this.filterMode() === 'day') {
        const dateStr = this.selectedDay();
        if (!dateStr) { this.ingredients.set([]); return; }

        const plan = this.planForDay(dateStr);

        if (!plan) { this.ingredients.set([]); return; }
        const items = await this.plannerService.getShoppingIngredients(plan.id, dateStr, dateStr);
        this.ingredients.set(items);
      } else {
        // Wszystkie zakupy — tylko bieżący plan (ten z planId lub bieżący tydzień)
        const plan = this.plan();
        if (!plan) { this.ingredients.set([]); return; }
        const items = await this.plannerService.getShoppingIngredients(plan.id);
        this.ingredients.set(items);
      }
    } finally {
      this.loading.set(false);
    }
  }

  private planForDay(dateStr: string): MealPlan | null {
    return this.allPlans().find(p => {
      // week covers [week_start, week_start + 6 days]
      return dateStr >= p.week_start && dateStr <= this.addDays(p.week_start, 6);
    }) ?? this.plan();
  }

  private addDays(dateStr: string, days: number): string {
    const d = new Date(dateStr + 'T00:00:00');
    d.setDate(d.getDate() + days);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  async toggleIngredient(ing: ShoppingIngredient) {
    const plan = this.filterMode() === 'day' ? this.planForDay(this.selectedDay()) : this.plan();
    if (!plan) return;

    const newChecked = !ing.checked;

    // Optimistic update
    this.ingredients.update(list =>
      list.map(i =>
        i.ingredient_id === ing.ingredient_id ? { ...i, checked: newChecked } : i
      )
    );

    try {
      await this.plannerService.updateSelection(plan.id, ing.ingredient_id, newChecked);
    } catch {
      // Revert
      this.ingredients.update(list =>
        list.map(i =>
          i.ingredient_id === ing.ingredient_id ? { ...i, checked: !newChecked } : i
        )
      );
      this.messageService.add({ severity: 'error', summary: 'Błąd', detail: 'Nie udało się zapisać' });
    }
  }

  async checkAll() {
    await this.setAllChecked(true);
  }

  async uncheckAll() {
    await this.setAllChecked(false);
  }

  private async setAllChecked(checked: boolean) {
    const plan = this.plan();
    if (!plan) return;

    this.ingredients.update(list => list.map(i => ({ ...i, checked })));

    await Promise.all(
      this.ingredients().map(i =>
        this.plannerService.updateSelection(plan.id, i.ingredient_id, checked)
      )
    );
  }

  clearBought() {
    // Tylko lokalnie — odznaczone zostają "znikają" z widoku
    this.ingredients.update(list => list.filter(i => i.checked));
  }
}
