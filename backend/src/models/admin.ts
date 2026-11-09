import Decimal from 'decimal.js';
import { db } from '../config/db.js';
export async function metrics() {
  const [users, books, orders, pendingRequests, quotes, lowStock, sales] = await Promise.all([
    db.user.count(),
    db.book.count({ where: { active: true } }),
    db.order.count(),
    db.specialRequest.count({ where: { status: 'PENDING' } }),
    db.quote.count(),
    db.book.findMany({
      where: { active: true, inventory: { stock: { lte: 10 } } },
      include: { inventory: true },
    }),
    db.order.findMany({ where: { status: { not: 'CANCELLED' } }, select: { breakdown: true } }),
  ]);
  return {
    users,
    books,
    orders,
    pendingRequests,
    quotes,
    lowStock,
    sales: sales
      .reduce((total, o) => total.plus((o.breakdown as { total: string }).total), new Decimal(0))
      .toFixed(2),
  };
}
export const settings = async () => ({
  taxRate: (await db.setting.findUnique({ where: { key: 'taxRate' } }))?.value ?? '0.12',
});
export const setTax = (taxRate: string) =>
  db.setting.upsert({
    where: { key: 'taxRate' },
    create: { key: 'taxRate', value: taxRate },
    update: { value: taxRate },
  });
