$ErrorActionPreference = 'Stop'

$rootDir = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$backendDir = Join-Path $rootDir 'backend'

$envCandidates = @(
  (Join-Path $backendDir '.env.local'),
  (Join-Path $backendDir '.env'),
  (Join-Path $rootDir '.env.local'),
  (Join-Path $rootDir '.env')
)

$frontendFiles = @(
  (Join-Path $rootDir 'src\environments\environment.ts'),
  (Join-Path $rootDir 'src\environments\environment.prod.ts')
)

$supabaseFiles = @(
  (Join-Path $rootDir 'backend\supabase_schema.sql'),
  (Join-Path $rootDir 'supabase\migrations\20260315170751_initial_schema.sql')
)

function Parse-EnvFile {
  param([string]$Path)

  $values = @{}

  if (-not (Test-Path $Path)) {
    return $values
  }

  foreach ($line in Get-Content $Path) {
    $trimmed = $line.Trim()
    if (-not $trimmed -or $trimmed.StartsWith('#')) {
      continue
    }

    $separatorIndex = $trimmed.IndexOf('=')
    if ($separatorIndex -lt 1) {
      continue
    }

    $key = $trimmed.Substring(0, $separatorIndex).Trim()
    $value = $trimmed.Substring($separatorIndex + 1).Trim()
    $values[$key] = $value
  }

  return $values
}

function Test-PlaceholderValue {
  param([string]$Value)

  if ([string]::IsNullOrWhiteSpace($Value)) {
    return $true
  }

  return $Value -match 'your_|placeholder|replace'
}

function Inspect-FrontendConfig {
  param([string]$Path)

  $issues = @()

  if (-not (Test-Path $Path)) {
    return @('missing file')
  }

  $content = Get-Content $Path -Raw

  if ($content.Contains('YOUR_SUPABASE_URL')) {
    $issues += 'supabaseUrl is still a placeholder'
  }

  if ($content.Contains('YOUR_SUPABASE_ANON_KEY')) {
    $issues += 'supabaseAnonKey is still a placeholder'
  }

  if ($Path.EndsWith('environment.prod.ts') -and $content.Contains('your-production-backend.com')) {
    $issues += 'production apiBaseUrl is still a placeholder'
  }

  return $issues
}

$backendEnvPath = $envCandidates | Where-Object { Test-Path $_ } | Select-Object -First 1
$backendEnv = if ($backendEnvPath) { Parse-EnvFile -Path $backendEnvPath } else { @{} }

$requiredBackendVars = @(
  'SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY',
  'GEMINI_API_KEY',
  'FRONTEND_URL'
)

$optionalBackendVars = @(
  'COMMODITIES_API_KEY'
)

$backendMissing = @(
  foreach ($key in $requiredBackendVars) {
    if (Test-PlaceholderValue $backendEnv[$key]) {
      $key
    }
  }
)

$backendOptionalMissing = @(
  foreach ($key in $optionalBackendVars) {
    if (Test-PlaceholderValue $backendEnv[$key]) {
      $key
    }
  }
)

$frontendIssues = @(
  foreach ($file in $frontendFiles) {
    foreach ($issue in Inspect-FrontendConfig -Path $file) {
      '{0}: {1}' -f (Resolve-Path $file -ErrorAction SilentlyContinue | ForEach-Object { $_.Path.Replace($rootDir + '\', '') } | Select-Object -First 1), $issue
    }
  }
)

$missingSupabaseFiles = @(
  foreach ($file in $supabaseFiles) {
    if (-not (Test-Path $file)) {
      $file.Replace($rootDir + '\', '')
    }
  }
)

Write-Host 'CropWise setup check'
Write-Host '===================='
Write-Host ('Backend env source: {0}' -f ($(if ($backendEnvPath) { $backendEnvPath.Replace($rootDir + '\', '') } else { 'not found' })))
Write-Host ''

if ($backendMissing.Count -gt 0) {
  Write-Host 'Missing required backend values:'
  $backendMissing | ForEach-Object { Write-Host "- $_" }
} else {
  Write-Host 'Required backend values: OK'
}

Write-Host ''

if ($backendOptionalMissing.Count -gt 0) {
  Write-Host 'Optional backend values still missing:'
  $backendOptionalMissing | ForEach-Object { Write-Host "- $_" }
} else {
  Write-Host 'Optional backend values: OK'
}

Write-Host ''

if ($frontendIssues.Count -gt 0) {
  Write-Host 'Frontend config still needs updates:'
  $frontendIssues | ForEach-Object { Write-Host "- $_" }
} else {
  Write-Host 'Frontend config placeholders: cleared'
}

Write-Host ''

if ($missingSupabaseFiles.Count -gt 0) {
  Write-Host 'Missing Supabase schema files:'
  $missingSupabaseFiles | ForEach-Object { Write-Host "- $_" }
} else {
  Write-Host 'Supabase schema files: present'
}

Write-Host ''
Write-Host 'Reminder:'
Write-Host '- Google OAuth credentials live in Supabase Auth provider settings, not in this repo.'
Write-Host '- The current routed login uses mock auth, but save/history features still need real Supabase auth.'

if (-not $backendEnvPath -or $backendMissing.Count -gt 0 -or $frontendIssues.Count -gt 0 -or $missingSupabaseFiles.Count -gt 0) {
  exit 1
}
