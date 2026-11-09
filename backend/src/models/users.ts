import bcrypt from 'bcryptjs';
import {randomBytes,createHash} from 'node:crypto';
import {db,transaction} from '../config/db.js';
import {ensure} from './errors.js';
import type {Role,Validation} from '@prisma/client';
export const publicUser={id:true,email:true,name:true,role:true,active:true,createdAt:true,institution:true} as const;
export const hashToken=(token:string)=>createHash('sha256').update(token).digest('hex');
export async function register(data:{email:string;name:string;password:string;role:'RETAIL'|'INSTITUTION';institutionName?:string;taxId?:string}) {
  return db.user.create({data:{email:data.email,name:data.name,passwordHash:await bcrypt.hash(data.password,12),role:data.role,...(data.role==='INSTITUTION'?{institution:{create:{name:data.institutionName!,taxId:data.taxId!}}}:{})},select:publicUser});
}
export async function login(email:string,password:string,oldToken?:string) {
  const user=await db.user.findUnique({where:{email}});
  // Constant-cost hash check for unknown users reduces account enumeration timing differences.
  const hash=user?.passwordHash??'$2b$12$9Q43wZ0L5c8EsmJvTq6Fh.u0cpLGTzSvwKNxp0IKwjTEoNFxRqqES';
  const valid=await bcrypt.compare(password,hash);
  ensure(user?.active&&valid,401,'Correo o contraseña incorrectos.');
  const token=randomBytes(32).toString('hex'),csrf=randomBytes(32).toString('hex');
  await transaction(async tx=>{if(oldToken)await tx.session.deleteMany({where:{id:hashToken(oldToken)}});await tx.session.create({data:{id:hashToken(token),csrf,userId:user.id,expiresAt:new Date(Date.now()+8*3600000)}});});
  return {token,csrf,user:await db.user.findUnique({where:{id:user.id},select:publicUser})};
}
export async function session(token?:string){ if(!token)return null;const row=await db.session.findUnique({where:{id:hashToken(token)},include:{user:{select:publicUser}}});return row&&row.expiresAt>new Date()&&row.user.active?row:null; }
export async function logout(token?:string){if(token)await db.session.deleteMany({where:{id:hashToken(token)}});}
export const profile=(id:string,name:string)=>db.user.update({where:{id},data:{name},select:publicUser});
export const listUsers=(q:string)=>db.user.findMany({where:{OR:[{name:{contains:q,mode:'insensitive'}},{email:{contains:q,mode:'insensitive'}}]},select:publicUser,orderBy:{createdAt:'desc'}});
export async function updateUser(actorId:string,id:string,data:{role?:Role;active?:boolean;institutionStatus?:Validation}){
  return transaction(async tx=>{
    const user=await tx.user.findUnique({where:{id},include:{institution:true}});ensure(user,404,'Usuario no encontrado.');
    ensure(actorId!==id||(!data.role&&!('active' in data)),409,'No puedes cambiar tu propio rol o estado.');
    ensure(data.role!=='INSTITUTION'||user.institution,400,'Este usuario no tiene una institución registrada.');
    if(data.institutionStatus){ensure(user.institution,400,'No hay institución registrada.');await tx.institution.update({where:{userId:id},data:{status:data.institutionStatus}});}
    const updated=await tx.user.update({where:{id},data:{role:data.role,active:data.active},select:publicUser});
    await tx.session.deleteMany({where:{userId:id}});return updated;
  });
}
