import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { SkeletonModule } from 'primeng/skeleton';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { Recipe, RecipeService, Tag } from '../../services/recipe.service';

@Component({
  selector: 'app-recipes',
  imports: [
    RouterLink,
    FormsModule,
    ButtonModule,
    CardModule,
    InputTextModule,
    TagModule,
    SkeletonModule,
    IconFieldModule,
    InputIconModule,
  ],
  templateUrl: './recipes.component.html',
  styleUrl: './recipes.component.scss',
})
export class RecipesComponent implements OnInit {
  private recipeService = inject(RecipeService);
  private route = inject(ActivatedRoute);

  recipes = signal<Recipe[]>([]);
  allTags = signal<Tag[]>([]);
  favoriteIds = signal<Set<string>>(new Set());
  loading = signal(true);
  searchQuery = signal('');
  selectedTags = signal<string[]>([]);
  tagsExpanded = signal(false);

  readonly TAGS_VISIBLE_DEFAULT = 5;

  get filtered(): Recipe[] {
    const q = this.searchQuery().toLowerCase();
    const tags = this.selectedTags();
    return this.recipes().filter(r => {
      const matchesSearch = !q || r.name.toLowerCase().includes(q);
      const matchesTags = tags.length === 0 || tags.every(t =>
        r.tags?.some(rt => rt.id === t)
      );
      return matchesSearch && matchesTags;
    });
  }

  async ngOnInit() {
    const preselectedTag = this.route.snapshot.queryParamMap.get('tag');
    try {
      const [recipes, tags, favIds] = await Promise.all([
        this.recipeService.getAll(),
        this.recipeService.getTags(),
        this.recipeService.getFavoriteIds(),
      ]);
      this.recipes.set(recipes);
      this.allTags.set(tags);
      this.favoriteIds.set(new Set(favIds));
      if (preselectedTag) this.selectedTags.set([preselectedTag]);
    } finally {
      this.loading.set(false);
    }
  }

  isFavorite(id: string): boolean {
    return this.favoriteIds().has(id);
  }

  async toggleFavorite(event: Event, recipeId: string) {
    event.preventDefault();
    event.stopPropagation();
    const added = await this.recipeService.toggleFavorite(recipeId);
    this.favoriteIds.update(set => {
      const next = new Set(set);
      if (added) next.add(recipeId); else next.delete(recipeId);
      return next;
    });
  }

  toggleTag(id: string) {
    const current = this.selectedTags();
    this.selectedTags.set(
      current.includes(id) ? current.filter(t => t !== id) : [...current, id]
    );
  }

  isTagSelected(id: string): boolean {
    return this.selectedTags().includes(id);
  }
}
