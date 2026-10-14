import { Plan } from './types';

export const FEATURES = {
  advanced_analytics: ['PRO', 'BUSINESS'],
  csv_import: ['PRO', 'BUSINESS'],
  low_stock_alerts: ['PRO', 'BUSINESS'],
  ai_tools: ['PRO', 'BUSINESS'],
  unlimited_products: ['PRO', 'BUSINESS'],
  unlimited_orders: ['PRO', 'BUSINESS'],
  team_management: ['BUSINESS'],
  priority_support: ['BUSINESS'],
} as const;

export type FeatureKey = keyof typeof FEATURES;

export function canAccess(plan: Plan, feature: FeatureKey): boolean {
  return (FEATURES[feature] as readonly string[]).includes(plan);
}

export const PLAN_LIMITS = {
  FREE: {
    maxProducts: 50,
    maxOrdersPerMonth: 100,
    teamSeats: 1,
  },
  PRO: {
    maxProducts: Infinity,
    maxOrdersPerMonth: Infinity,
    teamSeats: 2,
  },
  BUSINESS: {
    maxProducts: Infinity,
    maxOrdersPerMonth: Infinity,
    teamSeats: 10,
  },
};
