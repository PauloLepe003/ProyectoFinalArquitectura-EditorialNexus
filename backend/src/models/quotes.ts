import {db,transaction} from '../config/db.js';
import {ensure} from './errors.js';
import {calculate} from './pricing.js';
export type RequestInput={title:string;quantity:number;coverFinish:string;paper:string;requiredDate:string;notes:string};
const include={quote:true,history:{orderBy:{createdAt:'asc' as const}},user:{select:{name:true,email:true,institution:true}}};
export async function createRequest(userId:string,data:RequestInput){
  const user=await db.user.findUniqueOrThrow({where:{id:userId},include:{institution:true}});
  ensure(user.role==='INSTITUTION'&&user.institution?.status==='APPROVED',403,'La institución debe estar validada.');
  ensure(new Date(data.requiredDate)>new Date(),400,'La fecha de entrega debe ser futura.');
  return db.specialRequest.create({data:{...data,requiredDate:new Date(data.requiredDate),userId,history:{create:{actorId:userId,action:'CREATED',details:'Solicitud creada por el cliente.'}}},include});
}
export const requests=(userId?:string)=>db.specialRequest.findMany({where:{userId},include,orderBy:{createdAt:'desc'}});
export async function request(id:string,userId?:string){const result=await db.specialRequest.findFirst({where:{id,userId},include});ensure(result,404,'Solicitud no encontrada.');return result;}
export async function issueQuote(id:string,actorId:string,data:{description:string;quantity:number;unitPrice:string;validUntil:string}){
  return transaction(async tx=>{
    const row=await tx.specialRequest.findUnique({where:{id},include:{user:{include:{institution:true}},quote:true}});ensure(row,404,'Solicitud no encontrada.');
    ensure(['PENDING','QUOTED'].includes(row.status),409,'La solicitud ya fue cerrada.');
    ensure(new Date(data.validUntil)>new Date(),400,'La validez debe ser futura.');
    const tax=(await tx.setting.findUnique({where:{key:'taxRate'}}))?.value??'0.12';
    const breakdown=calculate([{unitPrice:data.unitPrice,quantity:data.quantity}],row.user.role==='INSTITUTION'&&row.user.institution?.status==='APPROVED',tax);
    const values={...data,validUntil:new Date(data.validUntil),breakdown,clientSnapshot:{name:row.user.name,email:row.user.email,institution:row.user.institution?.name??'',taxId:row.user.institution?.taxId??''}};
    await tx.quote.upsert({where:{requestId:id},create:{requestId:id,...values},update:values});
    return tx.specialRequest.update({where:{id},data:{status:'QUOTED',history:{create:{actorId,action:row.quote?'QUOTE_REVISED':'QUOTED',details:JSON.stringify({previous:row.quote,issued:values})}}},include});
  });
}
export async function rejectRequest(id:string,actorId:string,reason:string){return transaction(async tx=>{const row=await tx.specialRequest.findUnique({where:{id}});ensure(row,404,'Solicitud no encontrada.');ensure(['PENDING','QUOTED'].includes(row.status),409,'La solicitud ya fue cerrada.');return tx.specialRequest.update({where:{id},data:{status:'REJECTED',history:{create:{actorId,action:'ADVISOR_REJECTED',details:reason}}},include});});}
export async function decideQuote(id:string,userId:string,accept:boolean){
  return transaction(async tx=>{
    const row=await tx.specialRequest.findFirst({where:{id,userId},include:{quote:true}});ensure(row,404,'Solicitud no encontrada.');
    ensure(row.status==='QUOTED'&&row.quote,409,'No existe una cotización pendiente de respuesta.');
    ensure(!accept||row.quote.validUntil>new Date(),409,'La cotización ha expirado; solicita una revisión al asesor.');
    return tx.specialRequest.update({where:{id},data:{status:accept?'ACCEPTED':'REJECTED',history:{create:{actorId:userId,action:accept?'CLIENT_ACCEPTED':'CLIENT_REJECTED',details:'Decisión del cliente sobre la propuesta.'}}},include});
  });
}
