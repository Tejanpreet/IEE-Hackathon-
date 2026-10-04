import type { Consequence, Level, Product } from './types';

export const productLabel: Record<Product, string> = {
  crude_oil: 'Crude oil',
  sour_gas: 'Sour gas',
  sweet_gas: 'Sweet gas',
};

/** Token used for the product dot colour. */
export const productColor: Record<Product, string> = {
  crude_oil: 'var(--status-warning)',
  sour_gas: 'var(--status-high)',
  sweet_gas: 'var(--action-blue)',
};

export const consequenceLabel: Record<Consequence, string> = {
  high: 'High',
  medium: 'Medium',
  low: 'Low',
};

export const consequenceColor: Record<Consequence, string> = {
  high: 'var(--status-high)',
  medium: 'var(--status-warning)',
  low: 'var(--status-low)',
};

export const levelLabel: Record<Level, string> = {
  5: 'Almost certain',
  4: 'Likely',
  3: 'Possible',
  2: 'Unlikely',
  1: 'Rare',
};

export const levelColor = (l: Level) => `var(--incident-${l})`;
