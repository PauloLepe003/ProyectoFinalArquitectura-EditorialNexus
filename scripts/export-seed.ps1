$ErrorActionPreference='Stop'
$projectRoot=Split-Path $PSScriptRoot -Parent
$env:PGPASSWORD='nexus_local_only'
try {
  & "$projectRoot/.local/pgsql/bin/pg_dump.exe" -h 127.0.0.1 -p 5438 -U nexus -d nexus --data-only --column-inserts --no-owner --no-privileges --exclude-table=_prisma_migrations --exclude-table=Session --file="$projectRoot/database/seed.sql"
  if($LASTEXITCODE -ne 0){throw 'Falló exportación DML'}
  python "$projectRoot/scripts/normalize-seed.py"
  if($LASTEXITCODE -ne 0){throw 'Falló normalización DML'}
} finally { Remove-Item Env:PGPASSWORD }
