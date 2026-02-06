# Script untuk memproses 10 buku via Stepper Webhook
# Workflow ID: 2185

$WebhookUrl = "https://hooks.stepper.io/workflow/2185"
$Email = "punyofauzan3@gmail.com"

Write-Host "🚀 Memulai pemrosesan 10 buku via Stepper Webhook..." -ForegroundColor Green
Write-Host ""

# Book 1: CHEATSHEET MANAJEMEN.pdf
Write-Host "📚 Book 1: CHEATSHEET MANAJEMEN.pdf" -ForegroundColor Cyan
try {
    $body1 = '{"file":{"name":"CHEATSHEET MANAJEMEN.pdf","download_url":"https://drive.google.com/uc?export=download&id=10lasKKin4yFKj1jN2LnxXj09a1oq20an"},"job_id":"57f8abf9-e461-4398-84f5-8d9e8cc45994","timestamp":"2026-01-31T18:16:00.000Z","notification":{"email":"' + $Email + '"}}'
    $response = Invoke-RestMethod -Uri $WebhookUrl -Method POST -ContentType "application/json" -Body $body1
    Write-Host "✅ Book 1 triggered - Status: $($response.status)" -ForegroundColor Green
} catch {
    Write-Host "❌ Book 1 failed: $($_.Exception.Message)" -ForegroundColor Red
}
Start-Sleep -Seconds 2

# Book 2: DRAF NEO PPSDM
Write-Host "📚 Book 2: DRAF NEO PPSDM Keluarga Mahasiswa Mesin ITS.docx" -ForegroundColor Cyan
try {
    $body2 = '{"file":{"name":"DRAF NEO PPSDM Keluarga Mahasiswa Mesin ITS.docx","download_url":"https://drive.google.com/uc?export=download&id=1YayXjry7un1LETFOH4c_uSmBdjuUqfAY"},"job_id":"37b0ce05-b3d7-4973-a833-00680f5d07b0","timestamp":"2026-01-31T18:17:00.000Z","notification":{"email":"' + $Email + '"}}'
    $response = Invoke-RestMethod -Uri $WebhookUrl -Method POST -ContentType "application/json" -Body $body2
    Write-Host "✅ Book 2 triggered - Status: $($response.status)" -ForegroundColor Green
} catch {
    Write-Host "❌ Book 2 failed: $($_.Exception.Message)" -ForegroundColor Red
}
Start-Sleep -Seconds 2

# Book 3: NEOPPSDM.html
Write-Host "📚 Book 3: NEOPPSDM.html" -ForegroundColor Cyan
try {
    $body3 = '{"file":{"name":"NEOPPSDM.html","download_url":"https://drive.google.com/uc?export=download&id=1Fd9y476TkfkXAO-ku0QbyxTzoS8Nm312"},"job_id":"aa975eee-aca3-4008-a3bb-d45e6cf79c59","timestamp":"2026-01-31T18:18:00.000Z","notification":{"email":"' + $Email + '"}}'
    $response = Invoke-RestMethod -Uri $WebhookUrl -Method POST -ContentType "application/json" -Body $body3
    Write-Host "✅ Book 3 triggered - Status: $($response.status)" -ForegroundColor Green
} catch {
    Write-Host "❌ Book 3 failed: $($_.Exception.Message)" -ForegroundColor Red
}
Start-Sleep -Seconds 2

# Book 4: ORGANISASI.html
Write-Host "📚 Book 4: ORGANISASI.html" -ForegroundColor Cyan
try {
    $body4 = '{"file":{"name":"ORGANISASI.html","download_url":"https://drive.google.com/uc?export=download&id=1gyUjWnZp9tsZp6jcEsWjwBP_hIbXOrk9"},"job_id":"00b6f004-1b71-41f7-b8f6-83f380390b6d","timestamp":"2026-01-31T18:19:00.000Z","notification":{"email":"' + $Email + '"}}'
    $response = Invoke-RestMethod -Uri $WebhookUrl -Method POST -ContentType "application/json" -Body $body4
    Write-Host "✅ Book 4 triggered - Status: $($response.status)" -ForegroundColor Green
} catch {
    Write-Host "❌ Book 4 failed: $($_.Exception.Message)" -ForegroundColor Red
}
Start-Sleep -Seconds 2

# Book 5: Naskah Akademik
Write-Host "📚 Book 5: Naskah Akademik dan Penyusunan PPSDM KMM ITS.pdf" -ForegroundColor Cyan
try {
    $body5 = '{"file":{"name":"Naskah Akademik dan Penyusunan PPSDM KMM ITS.pdf","download_url":"https://drive.google.com/uc?export=download&id=1dG88UW61wugYxeZ5_hjAagdXgfjQ5eo7"},"job_id":"dc93e83a-9869-4462-a47a-3e229a19fc4e","timestamp":"2026-01-31T18:20:00.000Z","notification":{"email":"' + $Email + '"}}'
    $response = Invoke-RestMethod -Uri $WebhookUrl -Method POST -ContentType "application/json" -Body $body5
    Write-Host "✅ Book 5 triggered - Status: $($response.status)" -ForegroundColor Green
} catch {
    Write-Host "❌ Book 5 failed: $($_.Exception.Message)" -ForegroundColor Red
}
Start-Sleep -Seconds 2

# Book 6: SHORT CUT.xlsx
Write-Host "📚 Book 6: SHORT CUT.xlsx" -ForegroundColor Cyan
try {
    $body6 = '{"file":{"name":"SHORT CUT.xlsx","download_url":"https://drive.google.com/uc?export=download&id=1bwmN410LoBW8qeg9r7okQv-mMyHc0UjB"},"job_id":"f5e2b12b-45b6-41e1-98aa-affe346981c5","timestamp":"2026-01-31T18:21:00.000Z","notification":{"email":"' + $Email + '"}}'
    $response = Invoke-RestMethod -Uri $WebhookUrl -Method POST -ContentType "application/json" -Body $body6
    Write-Host "✅ Book 6 triggered - Status: $($response.status)" -ForegroundColor Green
} catch {
    Write-Host "❌ Book 6 failed: $($_.Exception.Message)" -ForegroundColor Red
}
Start-Sleep -Seconds 2

# Book 7: UU MESIN.html
Write-Host "📚 Book 7: UU MESIN.html" -ForegroundColor Cyan
try {
    $body7 = '{"file":{"name":"UU MESIN.html","download_url":"https://drive.google.com/uc?export=download&id=1Lps-OpcNtVsriAEwoYk7NtNG63ZIgJjX"},"job_id":"853f4f14-c1c7-4989-813c-e1c3a8a17289","timestamp":"2026-01-31T18:22:00.000Z","notification":{"email":"' + $Email + '"}}'
    $response = Invoke-RestMethod -Uri $WebhookUrl -Method POST -ContentType "application/json" -Body $body7
    Write-Host "✅ Book 7 triggered - Status: $($response.status)" -ForegroundColor Green
} catch {
    Write-Host "❌ Book 7 failed: $($_.Exception.Message)" -ForegroundColor Red
}
Start-Sleep -Seconds 2

# Book 8: AD ART ORMAWA.html
Write-Host "📚 Book 8: AD ART ORMAWA.html" -ForegroundColor Cyan
try {
    $body8 = '{"file":{"name":"AD ART ORMAWA.html","download_url":"https://drive.google.com/uc?export=download&id=1hC3xnryLJ9SFPs9taRPE8cqUSKMaRi_b"},"job_id":"04da3412-d669-47b6-b261-c24b60f2fee4","timestamp":"2026-01-31T18:23:00.000Z","notification":{"email":"' + $Email + '"}}'
    $response = Invoke-RestMethod -Uri $WebhookUrl -Method POST -ContentType "application/json" -Body $body8
    Write-Host "✅ Book 8 triggered - Status: $($response.status)" -ForegroundColor Green
} catch {
    Write-Host "❌ Book 8 failed: $($_.Exception.Message)" -ForegroundColor Red
}
Start-Sleep -Seconds 2

# Book 9: FORUM.html
Write-Host "📚 Book 9: FORUM.html" -ForegroundColor Cyan
try {
    $body9 = '{"file":{"name":"FORUM.html","download_url":"https://drive.google.com/uc?export=download&id=1zTHmK4zvHBRZAiU0qcUOwtH_nZ6V7DU3"},"job_id":"0a004dcc-accf-4033-9d23-5a2778019b7b","timestamp":"2026-01-31T18:24:00.000Z","notification":{"email":"' + $Email + '"}}'
    $response = Invoke-RestMethod -Uri $WebhookUrl -Method POST -ContentType "application/json" -Body $body9
    Write-Host "✅ Book 9 triggered - Status: $($response.status)" -ForegroundColor Green
} catch {
    Write-Host "❌ Book 9 failed: $($_.Exception.Message)" -ForegroundColor Red
}
Start-Sleep -Seconds 2

# Book 10: Buku 1 KDKM
Write-Host "📚 Book 10: Buku 1 KDKM dan HDPSDM MUBES V ITS.pdf" -ForegroundColor Cyan
try {
    $body10 = '{"file":{"name":"Buku 1 KDKM dan HDPSDM MUBES V ITS.pdf","download_url":"https://drive.google.com/uc?export=download&id=1RtJBQ_Hd-ULaOH5l_7PDU4ruiTpWUta3"},"job_id":"44c9edc5-a7cd-43b2-9951-b48eb622ca64","timestamp":"2026-01-31T18:25:00.000Z","notification":{"email":"' + $Email + '"}}'
    $response = Invoke-RestMethod -Uri $WebhookUrl -Method POST -ContentType "application/json" -Body $body10
    Write-Host "✅ Book 10 triggered - Status: $($response.status)" -ForegroundColor Green
} catch {
    Write-Host "❌ Book 10 failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "🎉 SEMUA 10 BUKU TELAH DIKIRIM KE STEPPER WEBHOOK!" -ForegroundColor Green
Write-Host "📊 Monitor dashboard: https://docs.google.com/spreadsheets/d/1prb07HX5pG_4HpENs-buWm_Tw-V80t5en1_nFc808GM" -ForegroundColor Yellow
Write-Host "📧 Check email: $Email" -ForegroundColor Yellow
Write-Host ""
Write-Host "Status pemrosesan dapat dimonitor di Google Spreadsheet dashboard."
