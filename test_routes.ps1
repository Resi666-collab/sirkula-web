$urls = @(
  'http://localhost:8080/',
  'http://localhost:8080/index.html',
  'http://localhost:8080/login.html',
  'http://localhost:8080/register.html',
  'http://localhost:8080/marketplace.html',
  'http://localhost:8080/css/style.css',
  'http://localhost:8080/css/responsive.css',
  'http://localhost:8080/js/main.js',
  'http://localhost:8080/assets/images/logo.svg',
  'http://localhost:8080/assets/images/favicon.svg',
  'http://localhost:8080/assets/images/hero-illustration.svg',
  'http://localhost:8080/assets/images/composting-illustration.svg',
  'http://localhost:8080/assets/images/bsf-cultivation-illustration.svg',
  'http://localhost:8080/assets/images/animal-feed-illustration.svg'
)

$allPassed = $true
foreach ($u in $urls) {
  try {
    $res = Invoke-WebRequest -Uri $u -UseBasicParsing -TimeoutSec 3
    if ($res.StatusCode -eq 200) {
      Write-Host "[PASS 200] $u ($($res.RawContentLength) bytes, $($res.Headers['Content-Type']))"
    } else {
      Write-Host "[FAIL $($res.StatusCode)] $u"
      $allPassed = $false
    }
  } catch {
    Write-Host "[ERROR] $u : $_"
    $allPassed = $false
  }
}

if ($allPassed) {
  Write-Host ">>> ALL ROUTES AND ASSETS VERIFIED SUCCESSFULLY <<<"
} else {
  Write-Host ">>> SOME ROUTES FAILED <<<"
  exit 1
}
