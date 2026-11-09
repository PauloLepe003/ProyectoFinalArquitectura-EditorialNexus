import type { RequestHandler } from 'express';
import type { Role } from '@prisma/client';
import { session } from '../models/users.js';
import { DomainError } from '../models/errors.js';
export const authenticate: RequestHandler = async (req, res, next) => {
  res.locals.session = await session(req.cookies?.nexus);
  next();
};
export const requireRoles =
  (...roles: Role[]): RequestHandler =>
  (req, res, next) => {
    const current = res.locals.session;
    if (!current) return next(new DomainError(401, 'Inicia sesión para continuar.'));
    if (roles.length && !roles.includes(current.user.role))
      return next(new DomainError(403, 'No tienes permiso para esta operación.'));
    next();
  };
export const csrf: RequestHandler = (req, res, next) => {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return next();
  const allowed = new Set((process.env.APP_ORIGIN ?? 'http://localhost:5173').split(','));
  const origin = req.get('origin');
  if (origin && !allowed.has(origin)) return next(new DomainError(403, 'Origen no permitido.'));
  if (!req.is('application/json')) return next(new DomainError(415, 'Se requiere JSON.'));
  const current = res.locals.session;
  if (current && req.get('x-csrf-token') !== current.csrf)
    return next(new DomainError(403, 'Token CSRF inválido.'));
  next();
};
