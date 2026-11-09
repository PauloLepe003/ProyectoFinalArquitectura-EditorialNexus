import type {OrderStatus} from '@prisma/client';
import {db,transaction} from '../config/db.js';
import {calculate} from './pricing.js';
import {ensure} from './errors.js';
import {bookInclude} from './catalog.js';
export async function cart(userId:string){
  return transaction(async tx=>{
    const user=await tx.user.findUniqueOrThrow({where:{id:userId},include:{institution:true}});
    const items=await tx.cartItem.findMany({where:{userId},include:{book:{include:bookInclude}},orderBy:{bookId:'asc'}});
    const tax=(await tx.setting.findUnique({where:{key:'taxRate'}}))?.value??'0.12';
    return {items,breakdown:calculate(items.map(i=>({quantity:i.quantity,unitPrice:i.book.price.toString()})),user.role==='INSTITUTION'&&user.institution?.status==='APPROVED',tax)};
  });
}
export async function setCart(userId:string,bookId:string,quantity:number){
  return transaction(async tx=>{
    const book=await tx.book.findFirst({where:{id:bookId,active:true},include:{inventory:true}});
    ensure(book,404,'Libro no disponible.');ensure((book.inventory?.stock??0)>=quantity,409,'Stock insuficiente.');
    return tx.cartItem.upsert({where:{userId_bookId:{userId,bookId}},create:{userId,bookId,quantity},update:{quantity}});
  });
}
export const removeCart=(userId:string,bookId:string)=>db.cartItem.deleteMany({where:{userId,bookId}});
export async function checkout(userId:string){
  return transaction(async tx=>{
    const user=await tx.user.findUniqueOrThrow({where:{id:userId},include:{institution:true}});
    const items=await tx.cartItem.findMany({where:{userId},include:{book:true},orderBy:{bookId:'asc'}});
    ensure(items.length,400,'El carrito está vacío.');
    for(const item of items){
      ensure(item.book.active,409,'Un libro ya no está disponible.');
      const changed=await tx.inventory.updateMany({where:{bookId:item.bookId,stock:{gte:item.quantity}},data:{stock:{decrement:item.quantity}}});
      ensure(changed.count===1,409,`Stock insuficiente: ${item.book.title}.`);
    }
    const tax=(await tx.setting.findUnique({where:{key:'taxRate'}}))?.value??'0.12';
    const breakdown=calculate(items.map(i=>({unitPrice:i.book.price.toString(),quantity:i.quantity})),user.role==='INSTITUTION'&&user.institution?.status==='APPROVED',tax);
    const order=await tx.order.create({data:{userId,breakdown,items:{create:items.map(i=>({bookId:i.bookId,title:i.book.title,quantity:i.quantity,unitPrice:i.book.price}))},history:{create:{status:'PENDING',actorId:userId}}},include:{items:true,history:true}});
    await tx.cartItem.deleteMany({where:{userId}});return order;
  });
}
export const orders=(userId?:string,status?:OrderStatus)=>db.order.findMany({where:{userId,status},include:{items:true,history:{orderBy:{createdAt:'asc'}},user:{select:{name:true,email:true}}},orderBy:{createdAt:'desc'}});
export async function order(id:string,userId?:string){const result=await db.order.findFirst({where:{id,userId},include:{items:true,history:true,user:{select:{name:true,email:true}}}});ensure(result,404,'Pedido no encontrado.');return result;}
export async function changeOrder(id:string,status:OrderStatus,actorId:string){
  return transaction(async tx=>{
    const row=await tx.order.findUnique({where:{id},include:{items:true}});ensure(row,404,'Pedido no encontrado.');
    const next:Record<OrderStatus,OrderStatus[]>={PENDING:['APPROVED','CANCELLED'],APPROVED:['SHIPPED','CANCELLED'],SHIPPED:[],CANCELLED:[]};
    ensure(next[row.status].includes(status),409,'Transición de estado no permitida.');
    if(status==='CANCELLED')for(const item of row.items)await tx.inventory.update({where:{bookId:item.bookId},data:{stock:{increment:item.quantity}}});
    return tx.order.update({where:{id},data:{status,history:{create:{status,actorId}}}});
  });
}
