import {Prisma} from '@prisma/client';
import {db,transaction} from '../config/db.js';
import {ensure} from './errors.js';
export const bookInclude={authors:true,categories:true,publisher:true,format:true,inventory:true} as const;
export type CatalogQuery={q?:string;author?:string;category?:string;format?:string;min?:number;max?:number;page:number;limit:number;featured?:boolean;new?:boolean};
export async function catalog(query:CatalogQuery,admin=false){
  const where:Prisma.BookWhereInput={...(admin?{}:{active:true}),...(query.featured?{featured:true}:{}),...(query.new?{createdAt:{gte:new Date(new Date().getFullYear(),new Date().getMonth(),1)}}:{}),...(query.category?{categories:{some:{id:query.category,active:true}}}:{}),...(query.author?{authors:{some:{name:{contains:query.author,mode:'insensitive'}}}}:{}),...(query.format?{formatId:query.format}:{}),price:{gte:query.min,lte:query.max},...(query.q?{OR:[{title:{contains:query.q,mode:'insensitive'}},{isbn:{contains:query.q}},{authors:{some:{name:{contains:query.q,mode:'insensitive'}}}},{publisher:{name:{contains:query.q,mode:'insensitive'}}}]}:{})};
  const [items,total]=await db.$transaction([db.book.findMany({where,include:bookInclude,skip:(query.page-1)*query.limit,take:query.limit,orderBy:[{createdAt:'desc'},{title:'asc'}]}),db.book.count({where})]);return {items,total,page:query.page,pages:Math.ceil(total/query.limit)};
}
export async function book(id:string){const row=await db.book.findFirst({where:{id,active:true},include:bookInclude});ensure(row,404,'Libro no encontrado.');return row;}
export async function metadata(admin=false){const [authors,categories,publishers,formats]=await Promise.all([db.author.findMany({where:admin?{}:{active:true},orderBy:{name:'asc'}}),db.category.findMany({where:admin?{}:{active:true},orderBy:{name:'asc'}}),db.publisher.findMany(),db.format.findMany()]);return {authors,categories,publishers,formats};}
export type BookInput={title:string;isbn:string;synopsis:string;year:number;price:string;cover:string;active:boolean;featured:boolean;publisherId:string;formatId:string;authorIds:string[];categoryIds:string[];stock:number};
export async function saveBook(id:string|undefined,data:BookInput){
  const {authorIds,categoryIds,stock,...fields}=data;
  return transaction(async tx=>{
    ensure(await tx.author.count({where:{id:{in:authorIds},active:true}})===authorIds.length,400,'Selecciona autores activos.');
    ensure(await tx.category.count({where:{id:{in:categoryIds},active:true}})===categoryIds.length,400,'Selecciona categorías activas.');
    if(id)return tx.book.update({where:{id},data:{...fields,authors:{set:authorIds.map(id=>({id}))},categories:{set:categoryIds.map(id=>({id}))},inventory:{upsert:{create:{stock},update:{stock}}}},include:bookInclude});
    return tx.book.create({data:{...fields,authors:{connect:authorIds.map(id=>({id}))},categories:{connect:categoryIds.map(id=>({id}))},inventory:{create:{stock}}},include:bookInclude});
  });
}
export const deleteBook=(id:string)=>db.book.update({where:{id},data:{active:false}});
export async function saveTaxonomy(kind:'authors'|'categories',id:string|undefined,data:{name:string;active:boolean;description?:string;biography?:string}){
  if(kind==='authors'){const value={name:data.name,active:data.active,biography:data.biography??''};return id?db.author.update({where:{id},data:value}):db.author.create({data:value});}
  const value={name:data.name,active:data.active,description:data.description??''};return id?db.category.update({where:{id},data:value}):db.category.create({data:value});
}
export const deleteTaxonomy=(kind:'authors'|'categories',id:string)=>kind==='authors'?db.author.update({where:{id},data:{active:false}}):db.category.update({where:{id},data:{active:false}});
