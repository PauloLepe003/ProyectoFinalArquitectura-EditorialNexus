$ErrorActionPreference='Stop'
$projectRoot=Split-Path $PSScriptRoot -Parent
Set-Location $projectRoot
& "$PSScriptRoot/local-postgres.ps1" start
if($LASTEXITCODE -ne 0){throw 'No se pudo iniciar PostgreSQL'}
if(!(Test-Path '.env')){Copy-Item .env.example .env}
if(!(Test-Path 'node_modules/.prisma/client/index.js')){ & npm.cmd run db:generate; if($LASTEXITCODE -ne 0){throw 'Prisma generate fallo'} }
foreach($step in @('db:migrate','db:seed','build')){
  & npm.cmd run $step
  if($LASTEXITCODE -ne 0){throw "Falló $step"}
}
try { $response=Invoke-RestMethod 'http://localhost:3000/api/health'; if($response.status -eq 'ok'){Write-Host 'Aplicación ya disponible: http://localhost:3000';exit 0} } catch {}
$nodePath=(Get-Command node.exe).Source
$process=Start-Process -FilePath $nodePath -ArgumentList 'node_modules/tsx/dist/cli.mjs','backend/src/server.ts' -WorkingDirectory $projectRoot -WindowStyle Hidden -RedirectStandardOutput "$projectRoot/.local/app.log" -RedirectStandardError "$projectRoot/.local/app-error.log" -PassThru
Set-Content "$projectRoot/.local/app.pid" $process.Id
for($attempt=0;$attempt -lt 30;$attempt++){
  Start-Sleep -Milliseconds 500
  try {$response=Invoke-RestMethod 'http://localhost:3000/api/health';if($response.status -eq 'ok'){Write-Host 'Editorial Nexus: http://localhost:3000';exit 0}}catch{}
}
throw 'El servidor no respondió. Revisar .local/app-error.log.'
