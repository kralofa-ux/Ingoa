

# Name Database Expansion — 8 Cultures, ~200 Each

## Current State
120 active names across 8 cultures. No new cultures to add (Tokelau, Tuvalu, Kiribati removed from scope).

## What to Build

### 1. Edge Function: `generate-names`
Create a backend function that uses Lovable AI (Gemini 2.5 Flash) to generate culturally authentic Pacific names in batches per culture, then inserts them into the `names` table.

**Per-culture targets (names to generate):**

| Culture | Current | Target | To Add |
|---------|---------|--------|--------|
| Aotearoa | 15 | 200 | ~185 |
| Cook Islands | 15 | 200 | ~185 |
| Samoa | 18 | 200 | ~182 |
| Tonga | 15 | 200 | ~185 |
| Fiji | 15 | 200 | ~185 |
| Hawaii | 15 | 200 | ~185 |
| Tahiti | 15 | 200 | ~185 |
| Niue | 12 | 200 | ~188 |

**Total: ~1,480 new names → ~1,600 total**

### 2. Edge Function Design
- Accept a `culture` parameter and a `count` parameter
- Call Lovable AI to generate structured JSON arrays of names with: `name`, `gender` (male/female/unisex), `meaning`, `commonality_score` (1-3)
- De-duplicate against existing names in the DB before inserting
- Generate IDs like `{culture_abbrev}_{index}` to avoid collisions
- Include quality prompt: real attested names only, no sacred titles, leave meaning empty if unknown

### 3. Invocation
- Call the function 8 times (once per culture) after deployment
- Or add a batch mode that iterates all cultures

### Files to Create/Modify
- `supabase/functions/generate-names/index.ts` — new edge function

No app code changes needed — the existing app already reads from the `names` table dynamically.

