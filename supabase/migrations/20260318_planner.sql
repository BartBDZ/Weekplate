-- Migracja: Planner + Shopping selections
-- Wklej w Supabase → SQL Editor i kliknij Run

-- 1. Rozszerzenie meal_plan_items o datę i czas trwania
ALTER TABLE meal_plan_items
  ADD COLUMN IF NOT EXISTS planned_date date,
  ADD COLUMN IF NOT EXISTS duration_days int NOT NULL DEFAULT 1;

-- Usuń NOT NULL z nieużywanych już kolumn
ALTER TABLE meal_plan_items
  ALTER COLUMN day_of_week DROP NOT NULL,
  ALTER COLUMN meal_type DROP NOT NULL;

-- Usuń stare kolumny day_of_week i meal_type jeśli nie są używane
-- (opcjonalnie, zakomentuj jeśli wolisz je zostawić)
-- ALTER TABLE meal_plan_items DROP COLUMN IF EXISTS day_of_week;
-- ALTER TABLE meal_plan_items DROP COLUMN IF EXISTS meal_type;

-- 2. Tabela zaznaczonych składników w liście zakupów
CREATE TABLE IF NOT EXISTS shopping_selections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id uuid REFERENCES meal_plans(id) ON DELETE CASCADE,
  ingredient_id uuid REFERENCES ingredients(id) ON DELETE CASCADE,
  checked boolean NOT NULL DEFAULT true,
  note text,           -- "mam w domu", "kup więcej" itp.
  created_at timestamptz DEFAULT now(),
  UNIQUE(plan_id, ingredient_id)
);

ALTER TABLE shopping_selections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Własne shopping selections"
  ON shopping_selections FOR ALL
  USING (
    plan_id IN (
      SELECT id FROM meal_plans WHERE profile_id = auth.uid()
    )
  );

-- 3. Polityki INSERT/DELETE dla meal_plan_items (jeśli brakuje)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'meal_plan_items' AND policyname = 'Własne pozycje insert'
  ) THEN
    CREATE POLICY "Własne pozycje insert"
      ON meal_plan_items FOR INSERT
      WITH CHECK (
        plan_id IN (SELECT id FROM meal_plans WHERE profile_id = auth.uid())
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'meal_plan_items' AND policyname = 'Własne pozycje delete'
  ) THEN
    CREATE POLICY "Własne pozycje delete"
      ON meal_plan_items FOR DELETE
      USING (
        plan_id IN (SELECT id FROM meal_plans WHERE profile_id = auth.uid())
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'meal_plan_items' AND policyname = 'Własne pozycje update'
  ) THEN
    CREATE POLICY "Własne pozycje update"
      ON meal_plan_items FOR UPDATE
      USING (
        plan_id IN (SELECT id FROM meal_plans WHERE profile_id = auth.uid())
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'meal_plans' AND policyname = 'Własne plany insert'
  ) THEN
    CREATE POLICY "Własne plany insert"
      ON meal_plans FOR INSERT
      WITH CHECK (profile_id = auth.uid());
  END IF;
END $$;

-- 4. Polityka INSERT dla profiles (potrzebna do auto-tworzenia profilu)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'profiles' AND policyname = 'Tworzenie własnego profilu'
  ) THEN
    CREATE POLICY "Tworzenie własnego profilu"
      ON profiles FOR INSERT
      WITH CHECK (auth.uid() = id);
  END IF;
END $$;
