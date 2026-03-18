import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'welcome',
    pathMatch: 'full',
  },
  {
    path: 'welcome',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/welcome/welcome.component').then(m => m.WelcomeComponent),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: 'recipes',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/recipes/recipes.component').then(m => m.RecipesComponent),
  },
  {
    path: 'recipes/add',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/add-recipe/add-recipe.component').then(m => m.AddRecipeComponent),
  },
  {
    path: 'recipes/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/recipe-detail/recipe-detail.component').then(m => m.RecipeDetailComponent),
  },
  {
    path: 'shopping',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/shopping/shopping.component').then(m => m.ShoppingComponent),
  },
  {
    path: 'planner',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/planner/planner.component').then(m => m.PlannerComponent),
  },
];
