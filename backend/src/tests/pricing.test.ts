import { describe, it, expect } from 'vitest';
import { calculate } from '../models/pricing.js';
describe('Motor de descuentos del Modelo', () => {
  for (const [quantity, rate] of [
    [1, '0'],
    [5, '0'],
    [6, '0.05'],
    [20, '0.05'],
    [21, '0.10'],
    [50, '0.10'],
    [51, '0.15'],
  ] as const)
    it(`límite ${quantity}: ${rate}`, () =>
      expect(calculate([{ unitPrice: '100.00', quantity }], false).volumeRate).toBe(rate));
  it('institución: 25 × Q100 = Q2318.40 con descuento secuencial e IVA', () => {
    expect(calculate([{ unitPrice: '100.00', quantity: 25 }], true)).toEqual({
      units: 25,
      volumeRate: '0.10',
      institutionRate: '0.08',
      taxRate: '0.12',
      base: '2500.00',
      volumeDiscount: '250.00',
      afterVolume: '2250.00',
      institutionDiscount: '180.00',
      discounted: '2070.00',
      tax: '248.40',
      total: '2318.40',
    });
  });
  it('suma unidades de diferentes títulos', () =>
    expect(
      calculate(
        [
          { unitPrice: '25.00', quantity: 3 },
          { unitPrice: '75.00', quantity: 3 },
        ],
        false,
      ).volumeDiscount,
    ).toBe('15.00'));
  it('sin deriva de coma flotante', () =>
    expect(calculate([{ unitPrice: '0.10', quantity: 3 }], false, '0').total).toBe('0.30'));
  it('impuesto configurable y redondeo half up', () =>
    expect(calculate([{ unitPrice: '0.05', quantity: 1 }], false, '0.10').tax).toBe('0.01'));
  it('no descuenta institución no validada', () =>
    expect(calculate([{ unitPrice: '100.00', quantity: 25 }], false).institutionDiscount).toBe(
      '0.00',
    ));
});
