import { z } from 'zod';
const text = (max = 200) => z.string().trim().min(1).max(max);
export const id = z.string().uuid();
export const price = z
  .string()
  .regex(/^\d{1,7}(\.\d{1,2})?$/, 'Precio decimal inválido.')
  .refine((v) => Number(v) > 0, 'El precio debe ser positivo.');
const password = z
  .string()
  .max(72)
  .refine(
    (v) => Buffer.byteLength(v, 'utf8') <= 72,
    'La contraseña supera el límite de 72 bytes UTF-8.',
  );
export const login = z
  .object({ email: z.email().toLowerCase(), password: password.refine((v) => v.length >= 1) })
  .strict();
export const register = z
  .object({
    name: text(100),
    email: z.email().max(200).toLowerCase(),
    password: password.refine((v) => v.length >= 10, 'Mínimo 10 caracteres.'),
    role: z.enum(['RETAIL', 'INSTITUTION']).default('RETAIL'),
    institutionName: text(200).optional(),
    taxId: text(30).optional(),
  })
  .strict()
  .refine((v) => v.role !== 'INSTITUTION' || (v.institutionName && v.taxId), {
    message: 'Indica institución y NIT.',
  });
export const profile = z.object({ name: text(100) }).strict();
export const catalog = z
  .object({
    q: z.string().max(200).optional(),
    author: z.string().max(100).optional(),
    category: id.optional(),
    format: id.optional(),
    min: z.coerce.number().min(0).optional(),
    max: z.coerce.number().min(0).optional(),
    page: z.coerce.number().int().min(1).max(10000).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(12),
    featured: z
      .enum(['true'])
      .optional()
      .transform((v) => v === 'true'),
    new: z
      .enum(['true'])
      .optional()
      .transform((v) => v === 'true'),
  })
  .refine((v) => v.min === undefined || v.max === undefined || v.min <= v.max, {
    message: 'Rango de precio inválido.',
  });
const cover = z
  .string()
  .max(1000)
  .refine(
    (v) => v === '' || /^\/covers\/[\w.-]+\.svg$/.test(v) || /^https:\/\/[^\s]+$/.test(v),
    'Usa una URL HTTPS o una portada local.',
  );
export const book = z
  .object({
    title: text(200),
    isbn: z.string().regex(/^\d{13}$/, 'ISBN de 13 dígitos.'),
    synopsis: text(5000),
    year: z.coerce.number().int().min(1400).max(2100),
    price,
    cover: cover.default(''),
    active: z.boolean().default(true),
    featured: z.boolean().default(false),
    publisherId: id,
    formatId: id,
    authorIds: z
      .array(id)
      .min(1)
      .max(10)
      .refine((a) => new Set(a).size === a.length),
    categoryIds: z
      .array(id)
      .min(1)
      .max(10)
      .refine((a) => new Set(a).size === a.length),
    stock: z.coerce.number().int().min(0).max(1000000),
  })
  .strict();
export const taxonomy = z
  .object({
    name: text(100),
    active: z.boolean().default(true),
    biography: z.string().max(5000).optional(),
    description: z.string().max(5000).optional(),
  })
  .strict();
export const cart = z.object({ quantity: z.number().int().min(1).max(100000) }).strict();
export const status = z
  .object({ status: z.enum(['PENDING', 'APPROVED', 'SHIPPED', 'CANCELLED']) })
  .strict();
const date = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .refine(
    (v) => !Number.isNaN(Date.parse(v)) && new Date(v).toISOString().slice(0, 10) === v,
    'Fecha inválida.',
  );
export const request = z
  .object({
    title: text(300),
    quantity: z.number().int().min(1).max(100000),
    coverFinish: text(200),
    paper: text(200),
    requiredDate: date,
    notes: z.string().max(5000).default(''),
  })
  .strict();
export const quote = z
  .object({
    description: text(3000),
    quantity: z.number().int().min(1).max(100000),
    unitPrice: price,
    validUntil: date,
  })
  .strict();
export const reason = z.object({ reason: text(2000) }).strict();
export const decision = z.object({ accept: z.boolean() }).strict();
export const user = z
  .object({
    role: z.enum(['RETAIL', 'INSTITUTION', 'ADVISOR', 'ADMIN']).optional(),
    active: z.boolean().optional(),
    institutionStatus: z.enum(['PENDING', 'APPROVED', 'REJECTED']).optional(),
  })
  .strict();
export const settings = z
  .object({ taxRate: z.string().regex(/^(0(\.\d{1,4})?|1(\.0{1,4})?)$/) })
  .strict();
