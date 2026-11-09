import Decimal from 'decimal.js';
// All amounts remain decimal strings on the HTTP boundary. Round half-up at each monetary step.
const money=(value:Decimal)=>value.toDecimalPlaces(2,Decimal.ROUND_HALF_UP);
export function calculate(lines:{unitPrice:string;quantity:number}[],institutional:boolean,taxRate='0.12') {
  const units=lines.reduce((sum,l)=>sum+l.quantity,0);
  const volumeRate=units>50?'0.15':units>20?'0.10':units>5?'0.05':'0';
  const base=money(lines.reduce((sum,l)=>sum.plus(new Decimal(l.unitPrice).times(l.quantity)),new Decimal(0)));
  const volumeDiscount=money(base.times(volumeRate));
  const afterVolume=base.minus(volumeDiscount);
  const institutionDiscount=money(afterVolume.times(institutional?'0.08':'0'));
  const discounted=afterVolume.minus(institutionDiscount);
  const tax=money(discounted.times(taxRate));
  return {units,volumeRate,institutionRate:institutional?'0.08':'0',taxRate,base:base.toFixed(2),volumeDiscount:volumeDiscount.toFixed(2),afterVolume:afterVolume.toFixed(2),institutionDiscount:institutionDiscount.toFixed(2),discounted:discounted.toFixed(2),tax:tax.toFixed(2),total:discounted.plus(tax).toFixed(2)};
}
