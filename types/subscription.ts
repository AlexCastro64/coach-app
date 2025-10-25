export type SubscriptionTier = 'free' | 'basic' | 'premium' | 'enterprise';

export type SubscriptionStatus = 'active' | 'cancelled' | 'expired' | 'trial';

export interface Subscription {
  id: number;
  user_id: number;
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  created_at: string;
  updated_at: string;
}

export interface SubscriptionPlan {
  tier: SubscriptionTier;
  name: string;
  price: number;
  billing_period: 'monthly' | 'yearly';
  features: string[];
  isPopular?: boolean;
}
