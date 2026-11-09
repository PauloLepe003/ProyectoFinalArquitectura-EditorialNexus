let csrf = '';
export function setCsrf(value: string) {
  csrf = value;
}
export async function api<T = any>(path: string, method = 'GET', body?: unknown): Promise<T> {
  const response = await fetch('/api' + path, {
    method,
    credentials: 'same-origin',
    headers: {
      ...(method !== 'GET' ? { 'Content-Type': 'application/json', 'x-csrf-token': csrf } : {}),
    },
    ...(method !== 'GET' ? { body: JSON.stringify(body ?? {}) } : {}),
  });
  const data = await response.json();
  if (!response.ok)
    throw new Error(
      data.issues?.map((i: any) => `${i.field}: ${i.message}`).join(' · ') ||
        data.error ||
        'Error de conexión.',
    );
  return data;
}
export const money = (value: string | number) =>
  new Intl.NumberFormat('es-GT', { style: 'currency', currency: 'GTQ' }).format(Number(value));
export const labels: Record<string, string> = {
  RETAIL: 'Minorista',
  INSTITUTION: 'Institucional',
  ADVISOR: 'Asesor',
  ADMIN: 'Administrador',
  PENDING: 'Pendiente',
  APPROVED: 'Aprobado',
  SHIPPED: 'Enviado',
  CANCELLED: 'Cancelado',
  QUOTED: 'Cotizado',
  ACCEPTED: 'Aceptado',
  REJECTED: 'Rechazado',
};
