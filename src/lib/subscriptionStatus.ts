export interface ActiveEntitlement { productIdentifier?: string; expirationDate?: string | null }
export function subscriptionStatus(active: Record<string, ActiveEntitlement>) {
 const entitlement=Object.entries(active).find(([key])=>key.toLowerCase().replace(/[\s_]/g,'')==='ingoapro')?.[1];
 if(!entitlement)return {isSubscribed:false,tier:'free' as const,expiresDate:null};
 return {isSubscribed:true,tier:entitlement.productIdentifier?.toLowerCase().includes('lifetime')?'lifetime' as const:'monthly' as const,expiresDate:entitlement.expirationDate??null};
}
