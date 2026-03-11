

# Phase 2 Implementation Plan

## Overview
Migrate names from hardcoded TypeScript to a database table, update frontend to fetch dynamically, fix gender mapping, add delete-account edge function, and add drag-and-drop to liked list.

## Tasks

### 1. Create `names` database table
Create migration with fields: `id` (text, PK — using existing IDs like `nzm-1`), `name`, `culture`, `gender`, `meaning`, `commonality_score` (int, default 2), `source_type`, `source_reference`, `verified_by`, `status` (default 'active'), `created_at`. RLS: public read for active names, no write from client.

### 2. Seed existing ~148 names
Insert all names from `src/data/names.ts` into the new table via migration SQL. All get `commonality_score = 2` initially. This preserves existing `liked_names`/`passed_names` references since IDs match.

### 3. Create `useNames` hook + update frontend
- New `src/hooks/useNames.ts` — React Query hook fetching from `names` table filtered by status='active'
- Update `SwipeDeck.tsx` to use hook instead of static import
- Update `AppContext.tsx` to resolve liked name IDs from the database query
- Keep type exports (`Culture`, `Gender`, `PolynesianName`) in `src/data/names.ts`, remove the hardcoded array

### 4. Implement weighted randomization
In SwipeDeck, sort fetched names using 40/40/20 weighting based on `commonality_score` (3=common, 2=normal, 1=rare). Fisher-Yates shuffle within groups, then interleave.

### 5. Fix gender label mapping
Onboarding currently stores `boy/girl/both` in profile, then AppContext maps to `male/female/all`. **Keep onboarding labels as "Male / Female / All"** (user's request) but store `male/female/all` directly in the profile — eliminating the fragile mapping. Update `Onboarding.tsx` step 3 values from `boy/girl/both` to `male/female/all` and update labels to "Male names / Female names / All names". Update `AppContext.tsx` to read gender_preference directly without mapping.

### 6. Delete-account edge function
Create `supabase/functions/delete-account/index.ts`:
- Verify JWT from request
- Delete from `liked_names`, `passed_names`, `profiles` for user
- Call `supabase.auth.admin.deleteUser(userId)` with service role key
- Update Settings page to invoke this function

### 7. Drag-and-drop reorder on Liked list
Add manual reordering using a simple touch-friendly drag handle approach with framer-motion's `Reorder` component (already installed). No new dependency needed.

## Potential Issues
- **Existing profiles with `boy/girl`**: The gender fix will store `male/female/all` going forward. Old profiles with `boy/girl` need a one-time migration or the AppContext fallback should handle both formats during transition.
- **Names table ID format**: Using text IDs (`nzm-1`) to match existing liked/passed records. Future bulk imports can use UUIDs.

