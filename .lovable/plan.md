

# Stripe Integration Plan — Both Payment Options

## Summary
Wire up functional Stripe checkout for both the monthly subscription ($9.99/mo) and one-time purchase ($20) on the Subscription page. Add subscription status checking to AuthContext so premium features are gated app-wide.

## Stripe Products
- **Monthly**: `price_1THeOlS2YuVDTyoq2oCosiMb` (NZD $9.99/mo, recurring)
- **Lifetime**: `price_1THePVS2YuVDTyoqFgQQ1N8d` (NZD $20, one-time)

---

## Step 1: Create `check-subscription` Edge Function
**File:** `supabase/functions/check-subscription/index.ts`

- Authenticates user via JWT
- Looks up Stripe customer by email
- Checks for active subscription OR completed one-time payment (via checkout sessions with `payment_status: 'paid'`)
- Returns `{ subscribed, product_id, subscription_end }`
- Called on login, page load, and periodically

## Step 2: Create `create-checkout` Edge Function
**File:** `supabase/functions/create-checkout/index.ts`

- Accepts `{ priceId }` in request body
- Authenticates user via JWT
- Finds or references existing Stripe customer
- Creates checkout session with `mode: "subscription"` or `mode: "payment"` based on whether the price is recurring
- Returns `{ url }` for redirect
- Success URL: `/subscribe?success=true`, Cancel URL: `/subscribe`

## Step 3: Create `customer-portal` Edge Function
**File:** `supabase/functions/customer-portal/index.ts`

- Authenticates user, finds Stripe customer
- Creates a Stripe Customer Portal session
- Returns `{ url }` — lets users manage/cancel subscriptions

## Step 4: Add Subscription State to AuthContext
**File:** `src/context/AuthContext.tsx`

- Add `isSubscribed`, `subscriptionTier`, `subscriptionEnd` to context
- Call `check-subscription` after login and on initial load
- Auto-refresh every 60 seconds
- Expose `checkSubscription()` for manual refresh

## Step 5: Update Subscription Page UI
**File:** `src/pages/Subscription.tsx`

- Show both plan options: Monthly ($9.99/mo) and Lifetime ($20)
- "Upgrade" buttons call `create-checkout` with the appropriate `priceId`
- Redirect to Stripe Checkout URL
- Handle `?success=true` query param to show confirmation + refresh subscription status
- If already subscribed, show "Your Plan" badge and "Manage Subscription" button (customer portal)

## Step 6: Gate Premium Features
**File:** `src/components/SwipeDeck.tsx`

- Check `isSubscribed` from AuthContext
- If subscribed, skip the daily swipe limit
- If not subscribed, keep the 20/day limit and show upgrade CTA when hit

## Step 7: Update Settings Page
**File:** `src/pages/Settings.tsx`

- Show current plan status (Free / Premium)
- If subscribed: "Manage Subscription" button → customer portal
- If not subscribed: "Upgrade to Premium" → `/subscribe`

---

## Technical Details

**Edge function constants (hardcoded in source):**
```typescript
const PRICES = {
  monthly: "price_1THeOlS2YuVDTyoq2oCosiMb",
  lifetime: "price_1THePVS2YuVDTyoqFgQQ1N8d",
};
```

**Files created (3):**
- `supabase/functions/check-subscription/index.ts`
- `supabase/functions/create-checkout/index.ts`
- `supabase/functions/customer-portal/index.ts`

**Files modified (3):**
- `src/context/AuthContext.tsx`
- `src/pages/Subscription.tsx`
- `src/components/SwipeDeck.tsx`
- `src/pages/Settings.tsx`

