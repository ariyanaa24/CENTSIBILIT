import { ValueTransformer } from 'typeorm';

// MySQL returns DECIMAL as a string. This makes it a number in JSON.
export const decimalTransformer: ValueTransformer = {
  to: (value?: number) => value,
  from: (value?: string) => (value === null || value === undefined ? value : parseFloat(value)),
};
