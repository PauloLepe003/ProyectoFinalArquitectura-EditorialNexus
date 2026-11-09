import PDFDocument from 'pdfkit';
import type {Response} from 'express';
import type {request} from '../models/quotes.js';
export function renderQuote(row:Awaited<ReturnType<typeof request>>,res:Response){
  const q=row.quote!;const b=q.breakdown as Record<string,string>;const client=q.clientSnapshot as Record<string,string>;
  const doc=new PDFDocument({size:'A4',margin:50,info:{Title:`Cotización NX-${q.number}`,Author:'Editorial Nexus'}});doc.pipe(res);
  doc.fillColor('#123e35').fontSize(28).text('Editorial Nexus').fontSize(10).text('LIBROS QUE ABREN MUNDOS').moveDown(2);
  doc.fontSize(20).text(`Cotización NX-${String(q.number).padStart(5,'0')}`).moveDown();
  doc.fillColor('#333333').fontSize(11).text(`Emisión: ${q.createdAt.toISOString().slice(0,10)} | Válida hasta: ${q.validUntil.toISOString().slice(0,10)}`);
  doc.text(`Cliente: ${client.name}`).text(`Correo: ${client.email}`).text(`Institución: ${client.institution} | NIT: ${client.taxId}`).text(`Estado: ${row.status}`).moveDown();
  doc.fontSize(13).text(q.description).fontSize(11).moveDown().text(`Cantidad: ${q.quantity} | Precio unitario: Q${q.unitPrice.toFixed(2)}`).moveDown();
  const rows=[['Subtotal base',b.base],['Descuento por volumen ('+Number(b.volumeRate)*100+'%)','-'+b.volumeDiscount],['Descuento institucional ('+Number(b.institutionRate)*100+'%)','-'+b.institutionDiscount],['Subtotal descontado',b.discounted],['IVA ('+Number(b.taxRate)*100+'%)',b.tax],['TOTAL',b.total]];
  for(const [label,value]of rows){doc.text(`${label}: Q${value}`).moveDown(.5);}
  doc.moveDown().fontSize(10).text('Propuesta comercial. La aceptación registra el acuerdo; no constituye un pago ni una factura fiscal.').text('Los descuentos se aplican secuencialmente. Precios expresados en quetzales.');doc.end();
}
