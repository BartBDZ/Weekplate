import { Component, inject, OnInit, signal, computed } from '@angular/core';
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
      const plan = planId
        ? await this.plannerService.getPlan(planId)
        : await this.plannerService.getOrCreatePlan(this.plannerService.getWeekStart());
      this.plan.set(plan);

      // Wygeneruj opcje dni tygodnia na podstawie week_start planu
      const weekStart = plan.week_start
        ? new Date(plan.week_start + 'T00:00:00')
        : this.plannerService.getWeekStart();
      const days: DayOption[] = [];
      const dayNames = ['Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota', 'Niedziela'];
      for (let i = 0; i < 7; i++) {
        const d = this.plannerService.addDays(weekStart, i);
        const str = this.plannerService.toDateStr(d);
        days.push({
          label: `${dayNames[i]} (${d.getDate()}.${d.getMonth() + 1})`,
          value: str,
        });
      }
      this.dayOptions.set(days);
      this.selectedDay.set(days[0].value);

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
    const plan = this.plan();
    if (!plan) return;

    this.loading.set(true);
    try {
      let fromDate: string | undefined;
      let toDate: string | undefined;

      if (this.filterMode() === 'day') {
        fromDate = this.selectedDay();
        toDate = this.selectedDay();
      }

      const items = await this.plannerService.getShoppingIngredients(plan.id, fromDate, toDate);
      this.ingredients.set(items);
    } finally {
      this.loading.set(false);
    }
  }

  async toggleIngredient(ing: ShoppingIngredient) {
    const plan = this.plan();
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
