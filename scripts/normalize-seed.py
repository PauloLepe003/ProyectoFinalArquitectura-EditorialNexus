"""Make the exported demo DML repeatable without changing existing application data."""
from pathlib import Path
import re
path=Path('database/seed.sql')
sql=path.read_text(encoding='utf-8')
lines=[]
for line in sql.splitlines():
    if line.startswith('\\restrict') or line.startswith('\\unrestrict'):
        continue
    if line.startswith('INSERT INTO ') and line.endswith(';') and ' ON CONFLICT DO NOTHING;' not in line:
        line=line[:-1]+' ON CONFLICT DO NOTHING;'
    if line.startswith('SELECT pg_catalog.setval('):
        if 'Order_number_seq' in line:
            line='SELECT pg_catalog.setval(\'public."Order_number_seq"\', GREATEST((SELECT COALESCE(MAX(number),1) FROM public."Order"),1), true);'
        elif 'Quote_number_seq' in line:
            line='SELECT pg_catalog.setval(\'public."Quote_number_seq"\', GREATEST((SELECT COALESCE(MAX(number),1) FROM public."Quote"),1), true);'
    lines.append(line)
path.write_text('-- Datos de demostracion locales. Reejecutable: preserva registros existentes.\n'+'\n'.join(lines)+'\n',encoding='utf-8')
