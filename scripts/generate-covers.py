from pathlib import Path
from html import escape
titles=[('EL PRINCIPITO','Antoine de Saint-Exupéry','#c69661','#173e3c'),('EL SEÑOR PRESIDENTE','Miguel Ángel Asturias','#d9d8ba','#234c43'),('UNA HABITACIÓN PROPIA','Virginia Woolf','#ece5d5','#8f5749'),('DON QUIJOTE','Miguel de Cervantes','#813f38','#e2c59c'),('ORGULLO Y PREJUICIO','Jane Austen','#425f63','#eee0be'),('LA METAMORFOSIS','Franz Kafka','#c3b994','#303e39'),('AZUL','Rubén Darío','#365a76','#e8d6a3'),('LEYENDAS DE GUATEMALA','Miguel Ángel Asturias','#355341','#d1b876'),('EL ORIGEN DE LAS ESPECIES','Charles Darwin','#b4bd99','#354d34'),('ALICIA EN EL PAÍS DE LAS MARAVILLAS','Lewis Carroll','#a06c64','#f4e9c9'),('RIMAS Y LEYENDAS','Gustavo Adolfo Bécquer','#e3d4bd','#705246'),('LA ODISEA','Homero','#314d59','#d3bd88'),('POPOL VUH','Tradición k’iche’','#b47d44','#173e35'),('MUJERCITAS','Louisa May Alcott','#69826d','#f4e6c9'),('MEDITACIONES','Marco Aurelio','#cecbb4','#3d514b')]
out=Path('frontend/public/covers');out.mkdir(parents=True,exist_ok=True)
for i,(title,author,bg,fg) in enumerate(titles):
    words=title.split();lines=[];line=''
    for w in words:
        if len(line+' '+w)>19: lines.append(line);line=w
        else: line=(line+' '+w).strip()
    lines.append(line)
    text=''.join(f'<tspan x="150" dy="{0 if j==0 else 29}">{escape(s)}</tspan>' for j,s in enumerate(lines))
    svg=f'''<svg xmlns="http://www.w3.org/2000/svg" width="300" height="440" viewBox="0 0 300 440"><rect width="300" height="440" fill="{bg}"/><rect x="12" y="12" width="276" height="416" fill="none" stroke="{fg}" opacity=".5"/><path d="M7 0V440" stroke="#000" opacity=".18" stroke-width="5"/><text x="150" y="40" font-family="Georgia,serif" font-size="10" letter-spacing="4" text-anchor="middle" fill="{fg}">NEXUS CLÁSICOS</text><text x="150" y="91" fill="{fg}" text-anchor="middle" font-family="Georgia,serif" font-size="23">{text}</text><g transform="translate(150 264)" fill="none" stroke="{fg}" stroke-width="1.5"><circle r="67"/><circle r="48"/><path d="M-85 15Q0 -110 85 15Q0 120 -85 15M0 -85V85M-67 0H67"/><path d="M-40 50L0 -52L40 50Z" fill="{fg}" opacity=".18"/><circle r="14" fill="{fg}"/></g><text x="150" y="376" font-family="Georgia,serif" font-size="14" fill="{fg}" text-anchor="middle">{escape(author)}</text><text x="150" y="408" font-family="Arial,sans-serif" font-size="7" letter-spacing="2" fill="{fg}" text-anchor="middle">BIBLIOTECA EDITORIAL · EDICIÓN DEMO</text></svg>'''
    (out/f'book-{i+1}.svg').write_text(svg,encoding='utf-8')
print('15 portadas SVG originales generadas.')
