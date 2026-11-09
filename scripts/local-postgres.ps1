param([ValidateSet('start','stop','status')][string]$Action='start')
$ErrorActionPreference='Stop'
$projectRoot=Split-Path $PSScriptRoot -Parent
$pgBin=Join-Path $projectRoot '.local/pgsql/bin'
$pgData=Join-Path $projectRoot '.local/pgdata'
if (!(Test-Path (Join-Path $pgBin 'pg_ctl.exe'))) { throw 'Faltan binarios de PostgreSQL. Usa Docker Compose o consulta README, ejecución local sin Docker.' }
if($Action -eq 'stop'){ & "$pgBin/pg_ctl.exe" -D $pgData -m fast stop; exit $LASTEXITCODE }
if($Action -eq 'status'){ & "$pgBin/pg_ctl.exe" -D $pgData status; exit $LASTEXITCODE }
if(!(Test-Path (Join-Path $pgData 'PG_VERSION'))){
  $passwordFile=Join-Path $projectRoot '.local/init-password.txt'
  [System.IO.File]::WriteAllText($passwordFile,'nexus_local_only')
  try { & "$pgBin/initdb.exe" -D $pgData -U nexus -A scram-sha-256 --pwfile=$passwordFile -E UTF8 --locale=C; if($LASTEXITCODE -ne 0){throw 'initdb falló'} } finally { Remove-Item -LiteralPath $passwordFile -ErrorAction SilentlyContinue }
}
& "$pgBin/pg_ctl.exe" -D $pgData status | Out-Null
if($LASTEXITCODE -ne 0){& "$pgBin/pg_ctl.exe" -D $pgData -l (Join-Path $projectRoot '.local/postgres.log') -o '-p 5438 -h 127.0.0.1' -w start; if($LASTEXITCODE -ne 0){throw 'No se pudo iniciar PostgreSQL'} }
$env:PGPASSWORD='nexus_local_only'
foreach($databaseName in @('nexus','nexus_test','nexus_sql_verify')){
  $found=& "$pgBin/psql.exe" -h 127.0.0.1 -p 5438 -U nexus -d postgres -tAc "SELECT 1 FROM pg_database WHERE datname='$databaseName'"
  if($found -ne '1'){ & "$pgBin/createdb.exe" -h 127.0.0.1 -p 5438 -U nexus $databaseName; if($LASTEXITCODE -ne 0){throw "No se pudo crear $databaseName"} }
}
Remove-Item Env:PGPASSWORD
Write-Host 'PostgreSQL local disponible en 127.0.0.1:5438.'
