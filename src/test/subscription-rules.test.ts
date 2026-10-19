import { it, expect, vi } from 'vitest';
import { subscriptionStatus } from '@/lib/subscriptionStatus';
import { saveThenNavigate } from '@/lib/profileActions';
import { swipeDate, DAILY_SWIPE_LIMIT } from '@/hooks/useDailySwipes';
it('accepts ingoa_pro entitlement as monthly access',()=>expect(subscriptionStatus({ingoa_pro:{productIdentifier:'com.ingoa.app.monthly'}}).tier).toBe('monthly'));
it('accepts INGOA Pro entitlement as lifetime access',()=>expect(subscriptionStatus({'INGOA Pro':{productIdentifier:'com.ingoa.app.lifetime'}}).tier).toBe('lifetime'));
it('navigates a saved onboarding plan to the existing subscription page',async()=>{
 const navigate=vi.fn();await saveThenNavigate(async()=>({error:null}),navigate,'/subscribe');expect(navigate).toHaveBeenCalledWith('/subscribe');
});
it('does not navigate after a profile save fails',async()=>{
 const navigate=vi.fn();await expect(saveThenNavigate(async()=>({error:new Error('Offline')}),navigate,'/subscribe')).rejects.toThrow('Offline');expect(navigate).not.toHaveBeenCalled();
});
it('preserves the 20-swipe free daily allowance',()=>expect(DAILY_SWIPE_LIMIT).toBe(20));
it('changes the swipe date at UTC midnight',()=>{expect(swipeDate(new Date('2026-10-19T23:59:59Z'))).toBe('2026-10-19');expect(swipeDate(new Date('2026-10-20T00:00:00Z'))).toBe('2026-10-20');});
