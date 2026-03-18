import "@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

interface InstructionSection {
  name: string;
  steps: string[];
}

interface ParsedIngredient {
  name: string;
  quantity: number | null;
  unit: string | null;
  category: string | null;
  display: string;
}

interface RecipeResult {
  source: "schema" | "ai";
  name: string;
  ingredients: ParsedIngredient[];
  instructions_data: InstructionSection[];
  prep_minutes: number | null;
  servings: number | null;
  image_url: string | null;
  tags: string[];
}

async function uploadImageToStorage(imageUrl: string): Promise<string | null> {
  try {
    const res = await fetch(imageUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        "Accept": "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
        "Accept-Language": "pl-PL,pl;q=0.9,en;q=0.8",
        "Referer": new URL(imageUrl).origin + "/",
      },
      redirect: "follow",
    });
    if (!res.ok) {
      console.error(`Image fetch failed: ${res.status} ${res.statusText} for ${imageUrl}`);
      return null;
    }

    const contentType = res.headers.get("content-type") ?? "image/jpeg";
    const ext = contentType.includes("png") ? "png" : contentType.includes("webp") ? "webp" : "jpg";
    const fileName = `${crypto.randomUUID()}.${ext}`;
    const buffer = await res.arrayBuffer();

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const { error } = await supabase.storage
      .from("recipe-images")
      .upload(fileName, buffer, { contentType, upsert: false });

    if (error) {
      console.error(`Storage upload failed:`, error);
      return null;
    }

    const { data } = supabase.storage.from("recipe-images").getPublicUrl(fileName);
    return data.publicUrl;
  } catch {
    return null;
  }
}

function extractPageImage(html: string): string | null {
  // 1. og:image / twitter:image meta tag
  const ogMatch = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i)
    ?? html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i)
    ?? html.match(/<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i)
    ?? html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image["']/i);
  if (ogMatch) return ogMatch[1];

  // 2. Pierwsza <img> z width >= 400 (obsługa lazy-load: data-src, data-lazy-src, data-original)
  const imgRegex = /<img[^>]+>/gi;
  let m: RegExpExecArray | null;
  while ((m = imgRegex.exec(html)) !== null) {
    const tag = m[0];
    const widthMatch = tag.match(/\bwidth=["']?(\d+)/i);
    if (widthMatch && parseInt(widthMatch[1]) >= 400) {
      const srcMatch =
        tag.match(/\bdata-src=["']([^"']+)["']/i) ??
        tag.match(/\bdata-lazy-src=["']([^"']+)["']/i) ??
        tag.match(/\bdata-original=["']([^"']+)["']/i) ??
        tag.match(/\bsrc=["']([^"']+)["']/i);
      if (srcMatch && !srcMatch[1].includes('data:')) {
        console.log("Found image:", srcMatch[1]);
        return srcMatch[1];
      }
    }
  }

  console.warn("extractPageImage: no image found");
  return null;
}

function parseInstructions(steps: any[]): InstructionSection[] {
  const sections: InstructionSection[] = [];
  let current: InstructionSection = { name: "", steps: [] };

  for (const item of steps) {
    if (typeof item === "string") {
      current.steps.push(item.trim());
      continue;
    }
    if (item["@type"] === "HowToSection" || Array.isArray(item.itemListElement)) {
      if (current.steps.length > 0) sections.push(current);
      current = { name: item.name ?? "", steps: [] };
      for (const sub of item.itemListElement ?? []) {
        const text = typeof sub === "string" ? sub : (sub.text ?? "");
        if (text.trim()) current.steps.push(text.trim());
      }
      continue;
    }
    const text = (item.text ?? item.name ?? "").trim();
    if (text) current.steps.push(text);
  }

  if (current.steps.length > 0) sections.push(current);
  return sections.length > 0 ? sections : [{ name: "", steps: [] }];
}

async function extractJsonLd(html: string): Promise<RecipeResult | null> {
  const scriptRegex = /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let match;
  let scriptCount = 0;

  while ((match = scriptRegex.exec(html)) !== null) {
    scriptCount++;
    try {
      const json = JSON.parse(match[1]);
      const items = Array.isArray(json) ? json : [json];

      for (const item of items) {
        const recipe = item["@type"] === "Recipe" ? item
          : item["@graph"]?.find((g: { "@type": string }) => g["@type"] === "Recipe");

        if (!recipe) continue;

        const rawIngredients: string[] = (recipe.recipeIngredient ?? []).map(String);
        const ingredients = await parseIngredientStrings(rawIngredients);
        const instructionSteps = recipe.recipeInstructions ?? [];
        const instructions_data = Array.isArray(instructionSteps)
          ? parseInstructions(instructionSteps)
          : [{ name: "", steps: [String(instructionSteps)] }];

        const totalTime = parseDuration(recipe.totalTime);
        const prepPlusCook = (parseDuration(recipe.prepTime) ?? 0) + (parseDuration(recipe.cookTime) ?? 0);
        const prepTime = totalTime ?? (prepPlusCook > 0 ? prepPlusCook : null);
        const image = Array.isArray(recipe.image)
          ? recipe.image[0]?.url ?? recipe.image[0]
          : recipe.image?.url ?? recipe.image ?? null;

        return {
          source: "schema",
          name: recipe.name ?? "Przepis",
          ingredients,
          instructions_data,
          prep_minutes: prepTime,
          servings: recipe.recipeYield ? parseInt(recipe.recipeYield) : null,
          image_url: typeof image === "string" ? image : null,
          tags: [],
        };
      }
    } catch (e) {
      console.error("extractJsonLd parse error:", e);
    }
  }

  console.log(`extractJsonLd: checked ${scriptCount} script tags, no Recipe found`);
  return null;
}

async function parseIngredientStrings(rawList: string[]): Promise<ParsedIngredient[]> {
  if (rawList.length === 0) return [];
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": ANTHROPIC_API_KEY!,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 2048,
      messages: [{
        role: "user",
        content: `Przetworz każdy string składnika przepisu na obiekt JSON. Zwróć TYLKO tablicę JSON bez żadnego opisu ani markdown.

Dla każdego składnika:
- name: sama nazwa produktu, bez ilości/jednostki (np. "wołowina mielona", "cebula", "mąka pszenna")
- quantity: liczba lub null
- unit: jednostka miary lub null (g, kg, ml, l, szt, łyżka, łyżeczka, szklanka, puszka itp.)
- category: DOKŁADNIE jedna z: mięso | warzywa | nabiał | owoce | pieczywo | przyprawy | przetwory | inne
- display: oryginalny string składnika

Kategorie:
- mięso: mięso, drób, ryby, owoce morza, wędliny, jaja
- warzywa: wszystkie warzywa, grzyby, rośliny strączkowe (fasola, soczewica, ciecierzyca)
- nabiał: mleko, śmietana, jogurt, sery, masło, twaróg
- owoce: wszystkie owoce świeże i suszone
- pieczywo: mąka, chleb, bułki, makaron, ryż, kasza, płatki
- przyprawy: sól, pieprz, zioła, przyprawy, cukier, ocet, oliwa, olej, sos sojowy
- przetwory: konserwy, puszki, ketchup, majonez, koncentrat, gotowe sosy

Składniki:
${rawList.map((s, i) => `${i + 1}. ${s}`).join("\n")}`,
      }],
    }),
  });
  if (!response.ok) {
    console.error("parseIngredientStrings failed:", response.status);
    return rawList.map(s => ({ name: s, quantity: null, unit: null, category: null, display: s }));
  }
  const data = await response.json();
  let text = data.content[0].text.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();
  try {
    return JSON.parse(text) as ParsedIngredient[];
  } catch {
    return rawList.map(s => ({ name: s, quantity: null, unit: null, category: null, display: s }));
  }
}

function parseDuration(iso: string | undefined): number | null {
  if (!iso) return null;
  const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
  if (!m) return null;
  return (parseInt(m[1] ?? "0") * 60) + parseInt(m[2] ?? "0");
}

async function parseWithAI(html: string): Promise<RecipeResult> {
  const trimmed = html.replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 15000);

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": ANTHROPIC_API_KEY!,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 4096,
      messages: [
        {
          role: "user",
          content: `Wyciągnij przepis z poniższego tekstu strony i zwróć TYLKO poprawny JSON (bez markdown, bez komentarzy) w tym formacie:
{
  "name": "nazwa przepisu",
  "ingredients": [
    { "name": "wołowina mielona", "quantity": 500, "unit": "g", "category": "mięso", "display": "500g wołowiny mielonej" },
    { "name": "cebula", "quantity": 1, "unit": "szt", "category": "warzywa", "display": "1 cebula" }
  ],
  "instructions_data": [
    { "name": "Nazwa sekcji", "steps": ["Krok pierwszy", "Krok drugi"] }
  ],
  "prep_minutes": 45,
  "servings": 4,
  "image_url": null,
  "tags": ["obiad", "wołowina", "kuchnia meksykańska"]
}

Zasady dla pola ingredients:
- name: sama nazwa produktu bez ilości (np. "wołowina mielona", "cebula", "mąka pszenna")
- quantity: liczba lub null
- unit: jednostka lub null (g, kg, ml, l, szt, łyżka, łyżeczka, szklanka itp.)
- category: DOKŁADNIE jedna z: mięso | warzywa | nabiał | owoce | pieczywo | przyprawy | przetwory | inne
  - mięso: mięso, drób, ryby, owoce morza, wędliny, jaja
  - warzywa: warzywa, grzyby, rośliny strączkowe
  - nabiał: mleko, śmietana, jogurt, sery, masło, twaróg
  - owoce: owoce świeże i suszone
  - pieczywo: mąka, chleb, makaron, ryż, kasza, płatki
  - przyprawy: sól, pieprz, zioła, przyprawy, cukier, ocet, oliwa, olej, sosy
  - przetwory: konserwy, puszki, ketchup, majonez, koncentrat, gotowe sosy
- display: oryginalny tekst składnika ze strony

Zasady dla pola prep_minutes — podaj ŁĄCZNY czas przygotowania i gotowania. Jeśli strona podaje osobno "czas przygotowania" i "czas gotowania", zsumuj je. Jeśli podaje "czas całkowity", użyj tej wartości.

Zasady dla pola instructions_data:
- Podziel instrukcje na logiczne sekcje (np. "Sos boloński", "Sos beszamelowy", "Pieczenie", "Przygotowanie ciasta")
- Jeśli przepis jest prosty i nie ma sekcji, użyj jednej sekcji z name: "" i wszystkimi krokami
- Każdy krok to osobny element tablicy steps — nie łącz kroków w jeden string
- Nie pomijaj żadnych kroków
- Popraw wszystkie literówki i błędy ortograficzne w polskim tekście
- Upewnij się że po każdym znaku interpunkcyjnym jest spacja

Zasady dla pola tags — dodaj 3-6 tagów opisujących danie:
- pora dnia: śniadanie, obiad, kolacja, przekąska, deser
- główny składnik: kurczak, wołowina, wieprzowina, ryba, makaron, ryż, warzywa, jajka, ser itp.
- kuchnia: kuchnia polska, kuchnia włoska, kuchnia meksykańska, kuchnia azjatycka, kuchnia grecka itp.
- dieta: wegetariańskie, wegańskie, bezglutenowe, bezlaktozowe
- czas: szybkie (do 30 min), fit, dla dzieci, na imprezę

Tekst strony:
${trimmed}`,
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`Anthropic API error: ${response.status}`);
  }

  const data = await response.json();
  let text = data.content[0].text.trim();
  text = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();
  const parsed = JSON.parse(text);

  const rawIngredients = parsed.ingredients ?? [];
  const ingredients: ParsedIngredient[] = rawIngredients.map((i: any) =>
    typeof i === "string"
      ? { name: i, quantity: null, unit: null, category: null, display: i }
      : { name: i.name ?? i, quantity: i.quantity ?? null, unit: i.unit ?? null, category: i.category ?? null, display: i.display ?? i.name ?? i }
  );

  return {
    source: "ai",
    name: parsed.name ?? "Przepis",
    ingredients,
    instructions_data: parsed.instructions_data ?? [{ name: "", steps: [] }],
    prep_minutes: parsed.prep_minutes ?? null,
    servings: parsed.servings ?? null,
    image_url: parsed.image_url ?? null,
    tags: parsed.tags ?? [],
  };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "authorization, content-type",
      },
    });
  }

  try {
    const { url } = await req.json();

    if (!url || typeof url !== "string") {
      return new Response(JSON.stringify({ error: "Brak parametru url" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const pageResponse = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; Weekplate/1.0)" },
    });

    if (!pageResponse.ok) {
      return new Response(JSON.stringify({ error: `Nie udało się pobrać strony: ${pageResponse.status}` }), {
        status: 422,
        headers: { "Content-Type": "application/json" },
      });
    }

    const html = await pageResponse.text();

    const ogImage = extractPageImage(html);

    let result = await extractJsonLd(html);
    console.log("extractJsonLd result:", result ? "found" : "null");
    if (!result) {
      console.log("Falling back to AI...");
      result = await parseWithAI(html);
      console.log("AI result:", JSON.stringify(result).slice(0, 200));
    }

    console.log("extractPageImage result:", ogImage);
    // Użyj og:image jeśli parsowanie nie znalazło zdjęcia
    if (!result.image_url && ogImage) {
      result.image_url = ogImage;
    }
    console.log("Final image_url before upload:", result.image_url);

    // Pobierz zdjęcie i wgraj do Supabase Storage
    if (result.image_url) {
      console.log("Uploading image...");
      const storedUrl = await uploadImageToStorage(result.image_url);
      console.log("Upload done, storedUrl:", storedUrl ? "ok" : "null");
      if (storedUrl) result.image_url = storedUrl;
    }

    console.log("Returning result...");
    return new Response(JSON.stringify(result), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  }
});
