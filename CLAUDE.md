# Weekplate — Project Brief

Aplikacja do zarządzania przepisami i planowania posiłków dla rodziny.

---

## Stack technologiczny

| Warstwa | Technologia |
|---|---|
| Frontend | Angular |
| Baza danych | Supabase (PostgreSQL) |
| Backend / AI | Supabase Edge Functions + Claude API (Anthropic) |
| Hosting frontend | Vercel (docelowo) |
| Autentykacja | Supabase Auth |

---

## Co już zostało zrobione

- [x] Projekt Supabase założony (nazwa: **Weekplate**)
- [x] Supabase CLI zainstalowany i podłączony (`supabase link`)
- [x] Folder projektu `mealo/` zainicjowany (`supabase init`)
- [x] Edge Function `parse-recipe` utworzona (`supabase/functions/parse-recipe/index.ts`)
- [x] Klucz Anthropic API ustawiony w Supabase secrets (`ANTHROPIC_API_KEY`)
- [ ] Tabele SQL — gotowe do wklejenia w Supabase SQL Editor (patrz niżej)
- [ ] Deploy Edge Function (`supabase functions deploy parse-recipe`)
- [ ] Projekt Angular (`ng new weekplate`)

---

## Funkcjonalności aplikacji

### 1. Baza przepisów (widok główny)
- Lista wszystkich przepisów z nazwą i tagami
- Filtrowanie po tagach
- Wyszukiwarka tekstowa
- Kliknięcie w przepis → widok szczegółowy

### 2. Widok szczegółowy przepisu
- Zdjęcie (jeśli dostępne)
- Lista składników
- Instrukcje krok po kroku (uproszczone)
- Link do oryginalnej strony przepisu
- Przycisk **"Dodaj do listy zakupów"**

### 3. Lista zakupów
- Użytkownik dodaje przepisy do listy zakupów
- Aplikacja agreguje składniki ze wszystkich dodanych przepisów
- Grupowanie po kategorii (warzywa, nabiał, mięso itp.)
- Możliwość odznaczania kupionych pozycji

### 4. Dodawanie nowego przepisu
- Użytkownik wkleja link do przepisu (np. kwestiasmaku.com)
- Edge Function pobiera stronę
- Próbuje wyciągnąć dane przez **Schema.org JSON-LD** (szybko, bez kosztów)
- Jeśli brak JSON-LD → fallback na **Claude AI** (parsuje HTML, wyciąga składniki i upraszcza instrukcje)
- AI automatycznie nadaje tagi (np. "wegetariańskie", "szybkie", "obiad")
- Przepis trafia do wspólnej bazy danych

---

## Schemat bazy danych

Wklej w **Supabase → SQL Editor** i kliknij **Run**:

```sql
-- Składniki (wspólna pula)
create table ingredients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  unit text,
  category text,
  created_at timestamptz default now()
);

-- Tagi
create table tags (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  color text default '#888888'
);

-- Przepisy
create table recipes (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  source_url text,
  notes text,
  instructions text,
  prep_minutes int,
  servings int,
  image_url text,
  last_scraped_at timestamptz,
  created_at timestamptz default now()
);

-- Składniki w przepisie
create table recipe_ingredients (
  id uuid primary key default gen_random_uuid(),
  recipe_id uuid references recipes(id) on delete cascade,
  ingredient_id uuid references ingredients(id) on delete cascade,
  quantity numeric,
  unit_override text
);

-- Tagi na przepisie
create table recipe_tags (
  recipe_id uuid references recipes(id) on delete cascade,
  tag_id uuid references tags(id) on delete cascade,
  primary key (recipe_id, tag_id)
);

-- Profile użytkowników
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  avatar_url text
);

-- Plany posiłków
create table meal_plans (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references profiles(id) on delete cascade,
  week_start date not null,
  name text,
  created_at timestamptz default now()
);

-- Pozycje w planie
create table meal_plan_items (
  id uuid primary key default gen_random_uuid(),
  plan_id uuid references meal_plans(id) on delete cascade,
  recipe_id uuid references recipes(id) on delete cascade,
  day_of_week text not null,
  meal_type text not null
);
```

### Row Level Security (RLS)

```sql
-- Włącz RLS
alter table profiles enable row level security;
alter table meal_plans enable row level security;
alter table meal_plan_items enable row level security;
alter table recipes enable row level security;
alter table ingredients enable row level security;
alter table tags enable row level security;
alter table recipe_tags enable row level security;
alter table recipe_ingredients enable row level security;

-- Przepisy, składniki, tagi — widoczne dla wszystkich zalogowanych
create policy "Przepisy widoczne dla zalogowanych"
  on recipes for select using (auth.role() = 'authenticated');

create policy "Składniki widoczne dla zalogowanych"
  on ingredients for select using (auth.role() = 'authenticated');

create policy "Tagi widoczne dla zalogowanych"
  on tags for select using (auth.role() = 'authenticated');

create policy "Recipe tags widoczne dla zalogowanych"
  on recipe_tags for select using (auth.role() = 'authenticated');

create policy "Recipe ingredients widoczne dla zalogowanych"
  on recipe_ingredients for select using (auth.role() = 'authenticated');

-- Przepisy — każdy zalogowany może dodawać/edytować
create policy "Zalogowani mogą dodawać przepisy"
  on recipes for insert with check (auth.role() = 'authenticated');

create policy "Zalogowani mogą edytować przepisy"
  on recipes for update using (auth.role() = 'authenticated');

-- Profile — każdy widzi i edytuje tylko swój
create policy "Własny profil"
  on profiles for select using (auth.uid() = id);

create policy "Edycja własnego profilu"
  on profiles for update using (auth.uid() = id);

-- Plany — każdy widzi tylko swoje
create policy "Własne plany"
  on meal_plans for all using (profile_id = auth.uid());

-- Pozycje w planie — przez plan_id
create policy "Własne pozycje w planie"
  on meal_plan_items for all using (
    plan_id in (
      select id from meal_plans where profile_id = auth.uid()
    )
  );
```

---

## Edge Function: parse-recipe

Plik: `supabase/functions/parse-recipe/index.ts`

**Logika działania:**
1. Przyjmuje `{ url: string }` w body requestu
2. Pobiera HTML strony przepisu
3. Próbuje wyciągnąć dane przez Schema.org JSON-LD (`source: "schema"`)
4. Jeśli brak → wysyła HTML do Claude API (`source: "ai"`)
5. Zwraca ustrukturyzowany JSON:

```json
{
  "source": "schema" | "ai",
  "name": "Chili con carne",
  "ingredients": ["500g mielonej wołowiny", "1 puszka fasoli"],
  "instructions": "1. Podsmaż cebulę...",
  "prep_minutes": 45,
  "servings": 4,
  "image_url": "https://..."
}
```

**Deploy:**
```powershell
supabase secrets set ANTHROPIC_API_KEY=sk-ant-TWOJ_KLUCZ
supabase functions deploy parse-recipe
```

**Test:**
```powershell
curl -X POST https://TWOJ_PROJECT_REF.supabase.co/functions/v1/parse-recipe `
  -H "Content-Type: application/json" `
  -d '{"url": "https://www.kwestiasmaku.com/dania_dla_dwojga/chili_con_carne/przepis.html"}'
```

---

## Następne kroki

- [ ] Wkleić SQL (tabele + RLS) w Supabase SQL Editor
- [ ] `supabase functions deploy parse-recipe`
- [ ] Przetestować Edge Function przez curl
- [ ] `ng new weekplate` — nowy projekt Angular
- [ ] Zainstalować `@supabase/supabase-js` w projekcie Angular
- [ ] Skonfigurować `SupabaseService` z URL i kluczem anon
- [ ] Zbudować widok listy przepisów
- [ ] Zbudować widok szczegółowy przepisu
- [ ] Zbudować formularz dodawania przepisu (z parsowaniem linku)
- [ ] Zbudować listę zakupów
- [ ] Supabase Auth — logowanie dla rodziny
- [ ] Deploy na Vercel

---

## Zmienne środowiskowe Angular (environment.ts)

```typescript
export const environment = {
  production: false,
  supabaseUrl: 'https://TWOJ_PROJECT_REF.supabase.co',
  supabaseKey: 'TWOJ_ANON_KEY', // Supabase Dashboard → Settings → API → anon public
};
```

Klucz `anon` jest bezpieczny do użycia we frontendzie — RLS pilnuje dostępu do danych.
Klucz `ANTHROPIC_API_KEY` nigdy nie trafia do Angulara — jest tylko w Supabase secrets.
