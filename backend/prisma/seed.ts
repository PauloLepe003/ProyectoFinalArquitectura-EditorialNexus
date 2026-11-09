import 'dotenv/config';
import {PrismaClient,Role} from '@prisma/client';
import bcrypt from 'bcryptjs';
import {calculate} from '../src/models/pricing.js';
const db=new PrismaClient();
export const demoPassword='NexusDemo2026!';
export async function seed(){
  const passwordHash=await bcrypt.hash(demoPassword,12);
  const accounts:[string,string,Role,string?][]=[['admin','Administración Nexus','ADMIN'],['asesor','María Asesora','ADVISOR'],['minorista','Carlos Lector','RETAIL'],['institucion','Ana Biblioteca','INSTITUTION','APPROVED'],['pendiente','Luis Colegio','INSTITUTION','PENDING']];
  const users:any={};
  for(const [email,name,role,status]of accounts){users[email]=await db.user.upsert({where:{email:email+'@nexus.local'},update:{},create:{email:email+'@nexus.local',name,role,passwordHash,...(status?{institution:{create:{name:status==='APPROVED'?'Biblioteca Horizonte':'Colegio Amanecer',taxId:status==='APPROVED'?'1234567-8':'9876543-2',status:status as 'APPROVED'|'PENDING'}}}:{})}});}
  const categories=[];for(const name of ['Literatura','Narrativa latinoamericana','Poesía','Ciencia y pensamiento','Infantil y juvenil'])categories.push(await db.category.upsert({where:{name},update:{},create:{name,description:'Selección editorial de '+name.toLowerCase()}}));
  const publishers=[];for(const name of ['Nexus Clásicos','Horizonte Editorial','Colección Ceiba'])publishers.push(await db.publisher.upsert({where:{name},update:{},create:{name}}));
  const formats=[];for(const name of ['Tapa blanda','Tapa dura','E-book'])formats.push(await db.format.upsert({where:{name},update:{},create:{name}}));
  // Bibliographic examples for the academic demo; ISBNs identify this fictional catalogue, not commercial editions.
  const titles:[string,string,number,string][]=[
    ['El principito','Antoine de Saint-Exupéry',4,'Un pequeño viajero recorre planetas y descubre la amistad, la responsabilidad y lo esencial de la vida. Una fábula para lectores de todas las edades.'],
    ['El señor Presidente','Miguel Ángel Asturias',1,'Una mirada poderosa a la vida bajo una dictadura latinoamericana. Lenguaje poético y denuncia social convergen en esta obra de la literatura guatemalteca.'],
    ['Una habitación propia','Virginia Woolf',3,'Un ensayo sobre la independencia, la creación literaria y los espacios necesarios para que una voz encuentre su lugar en el mundo.'],
    ['Don Quijote de la Mancha','Miguel de Cervantes',0,'El ingenioso hidalgo y Sancho Panza emprenden aventuras que entrelazan imaginación, humor y una profunda reflexión sobre la condición humana.'],
    ['Orgullo y prejuicio','Jane Austen',0,'Elizabeth Bennet enfrenta las expectativas sociales de su época con inteligencia y espíritu independiente en esta novela sobre afectos y primeras impresiones.'],
    ['La metamorfosis','Franz Kafka',0,'La transformación de Gregor Samsa abre una inquietante reflexión sobre la identidad, el trabajo y los vínculos familiares.'],
    ['Azul','Rubén Darío',2,'Cuentos y poemas que abrieron nuevos caminos para la lengua española. Una invitación a descubrir el ritmo y las imágenes del modernismo.'],
    ['Leyendas de Guatemala','Miguel Ángel Asturias',1,'Relatos que reúnen memoria, mito y paisaje guatemalteco en una prosa de gran riqueza sensorial.'],
    ['El origen de las especies','Charles Darwin',3,'Una obra central para comprender la historia del pensamiento científico y el desarrollo de la teoría de la evolución.'],
    ['Alicia en el país de las maravillas','Lewis Carroll',4,'Alicia sigue a un conejo y llega a un universo de acertijos, encuentros inesperados y posibilidades extraordinarias.'],
    ['Rimas y leyendas','Gustavo Adolfo Bécquer',2,'Una selección de poesía y relatos románticos donde la emoción, el misterio y la imaginación dialogan con el lector.'],
    ['La Odisea','Homero',0,'El largo regreso de Odiseo a Ítaca narra pruebas, encuentros y decisiones que han inspirado generaciones de lectores.'],
    ['Popol Vuh','Tradición k’iche’',1,'Relatos de origen, memoria y sabiduría de la tradición k’iche’. Edición de lectura con notas introductorias para acercarse a su universo narrativo.'],
    ['Mujercitas','Louisa May Alcott',4,'Cuatro hermanas construyen su propio camino entre sueños, responsabilidades y los afectos de una familia que aprende a crecer.'],
    ['Meditaciones','Marco Aurelio',3,'Reflexiones sobre la vida cotidiana, el deber y la serenidad. Una aproximación al pensamiento estoico desde la experiencia personal.']
  ];
  const books:Awaited<ReturnType<typeof db.book.create>>[]=[];
  for(let i=0;i<titles.length;i++){
    const [title,name,category,synopsis]=titles[i];const author=await db.author.upsert({where:{name},update:{},create:{name,biography:'Autor incluido en el catálogo académico de Editorial Nexus.'}});
    books.push(await db.book.upsert({where:{isbn:'978999390'+String(i+1).padStart(4,'0')},update:{},create:{title,isbn:'978999390'+String(i+1).padStart(4,'0'),synopsis,year:2024+i%3,price:i===0?'100.00':String(75+i*9)+'.00',cover:'/covers/book-'+(i+1)+'.svg',featured:i<3,publisherId:publishers[i%3].id,formatId:formats[i%3].id,authors:{connect:{id:author.id}},categories:{connect:{id:categories[category].id}},inventory:{create:{stock:i===14?8:150+i*5}}}}));
  }
  await db.setting.upsert({where:{key:'taxRate'},update:{},create:{key:'taxRate',value:'0.12'}});
  const seedOrderId='00000000-0000-4000-8000-000000000001';
  await db.$transaction(async tx=>{if(!await tx.order.findUnique({where:{id:seedOrderId}})){await tx.inventory.update({where:{bookId:books[0].id},data:{stock:{decrement:2}}});await tx.order.create({data:{id:seedOrderId,userId:users.minorista.id,breakdown:calculate([{unitPrice:'100.00',quantity:2}],false),items:{create:{bookId:books[0].id,title:books[0].title,quantity:2,unitPrice:'100.00'}},history:{create:{actorId:users.minorista.id,status:'PENDING'}}}});}});
  const requestId='00000000-0000-4000-8000-000000000002';
  if(!await db.specialRequest.findUnique({where:{id:requestId}}))await db.specialRequest.create({data:{id:requestId,userId:users.institucion.id,title:'El principito · Edición para biblioteca',quantity:25,coverFinish:'Tapa dura, laminado mate',paper:'Bond 80 g',requiredDate:new Date(Date.now()+60*86400000),notes:'Incluir identificación de la biblioteca.',status:'QUOTED',quote:{create:{description:'Edición institucional de El principito, tapa dura y papel bond.',quantity:25,unitPrice:'100.00',breakdown:calculate([{unitPrice:'100.00',quantity:25}],true),clientSnapshot:{name:users.institucion.name,email:users.institucion.email,institution:'Biblioteca Horizonte',taxId:'1234567-8'},validUntil:new Date(Date.now()+30*86400000)}},history:{create:[{actorId:users.institucion.id,action:'CREATED',details:'Solicitud de demostración.'},{actorId:users.asesor.id,action:'QUOTED',details:'Cotización de demostración emitida.'}]}}});
  await db.specialRequest.upsert({where:{id:'00000000-0000-4000-8000-000000000003'},update:{},create:{id:'00000000-0000-4000-8000-000000000003',userId:users.institucion.id,title:'Antología de literatura guatemalteca',quantity:300,coverFinish:'Tapa blanda ilustrada',paper:'Ahuesado 90 g',requiredDate:new Date(Date.now()+90*86400000),notes:'Impresión bajo demanda para programa de lectura.',history:{create:{actorId:users.institucion.id,action:'CREATED',details:'Solicitud de demostración.'}}}});
  console.log('Semilla idempotente: 15 libros, 5 usuarios, pedido y solicitudes.');
}
seed().finally(()=>db.$disconnect());
