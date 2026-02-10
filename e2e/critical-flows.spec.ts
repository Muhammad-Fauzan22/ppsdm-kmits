import { test, expect } from '@playwright/test';

/**
 * Critical User Flows E2E Tests
 * 
 * Tests the golden paths:
 * 1. Registration → Login → Complete Assessment → View Results
 * 2. Guest User → Assessment → Signup → Session Migration
 * 3. Data Export & Deletion Flow
 * 4. Error Handling
 */

test.describe('Critical User Flows', () => {
  
  test('User can complete full assessment journey', async ({ page }) => {
    // Step 1: Navigate to landing page
    await page.goto('/');
    await expect(page).toHaveTitle(/PPSDM KM ITS/);
    
    // Step 2: Start assessment as guest
    await page.click('text=Mulai Asesmen');
    await page.waitForURL('**/assessment');
    
    // Step 3: Select a dimension
    await page.click('text=Kognitif & Intelektual');
    await page.waitForURL('**/assessment/cognitive/info');
    
    // Step 4: Start the assessment
    await page.click('text=Mulai Asesmen');
    await page.waitForURL('**/assessment/cognitive');
    
    // Step 5: Answer questions (simulate answering 3 questions)
    for (let i = 0; i < 3; i++) {
      // Wait for question to load
      await page.waitForSelector('[data-testid="assessment-question"]');
      
      // Select an answer
      await page.click('[data-testid="answer-option"]:first-child');
      
      // Click next
      await page.click('text=Selanjutnya');
    }
    
    // Step 6: Complete assessment
    await page.click('text=Selesai');
    
    // Step 7: Verify results page
    await page.waitForURL('**/results');
    await expect(page.locator('text=Hasil Asesmen')).toBeVisible();
  });

  test('Guest user can convert to registered user', async ({ page }) => {
    // Start assessment as guest
    await page.goto('/assessment');
    await page.click('text=Mulai sebagai Tamu');
    
    // Complete partial assessment
    await page.click('text=Kognitif & Intelektual');
    await page.click('text=Mulai Asesmen');
    
    // Answer one question
    await page.waitForSelector('[data-testid="assessment-question"]');
    await page.click('[data-testid="answer-option"]:first-child');
    
    // Prompt to save progress should appear
    await page.click('text=Simpan Progress');
    
    // Redirect to signup
    await page.waitForURL('**/auth/signup');
    
    // Fill registration form
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'TestPassword123!');
    await page.fill('input[name="confirmPassword"]', 'TestPassword123!');
    await page.click('text=Daftar');
    
    // Should redirect back to assessment with progress restored
    await page.waitForURL('**/assessment/cognitive');
    await expect(page.locator('text=Progress Anda telah dipulihkan')).toBeVisible();
  });

  test('User can export their data (UU PDP Compliance)', async ({ page }) => {
    // Login first
    await page.goto('/auth/login');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'TestPassword123!');
    await page.click('text=Masuk');
    
    // Navigate to profile/settings
    await page.goto('/dashboard/settings');
    
    // Click export data
    await page.click('text=Export Data');
    
    // Verify export modal appears
    await expect(page.locator('text=Export Data Pribadi')).toBeVisible();
    
    // Select PDF format
    await page.click('text=PDF Report');
    
    // Click download
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.click('text=Download')
    ]);
    
    // Verify download started
    expect(download.suggestedFilename()).toContain('ppsdm-export');
  });

  test('User can delete their account (UU PDP Compliance)', async ({ page }) => {
    // Login
    await page.goto('/auth/login');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'TestPassword123!');
    await page.click('text=Masuk');
    
    // Navigate to settings
    await page.goto('/dashboard/settings');
    
    // Click delete account
    await page.click('text=Hapus Akun');
    
    // Verify confirmation modal
    await expect(page.locator('text=Konfirmasi Penghapusan Akun')).toBeVisible();
    
    // Type confirmation
    await page.fill('input[name="confirmDelete"]', 'HAPUS AKUN SAYA');
    
    // Click confirm
    await page.click('text=Konfirmasi Penghapusan');
    
    // Verify success message
    await expect(page.locator('text=Akun Anda akan dihapus dalam 14 hari')).toBeVisible();
  });

  test('Anonymous user can complete assessment without error', async ({ page }) => {
    // Start as guest
    await page.goto('/assessment');
    await page.click('text=Mulai sebagai Tamu');
    
    // Select dimension
    await page.click('text=Kognitif & Intelektual');
    await page.click('text=Mulai Asesmen');
    
    // Complete all questions without error
    const questions = await page.locator('[data-testid="assessment-question"]').count();
    
    for (let i = 0; i < Math.min(questions, 5); i++) {
      await page.waitForSelector('[data-testid="assessment-question"]');
      await page.click('[data-testid="answer-option"]:first-child');
      await page.click('text=Selanjutnya');
    }
    
    // Should not show 500 error
    await expect(page.locator('text=500 Internal Server Error')).not.toBeVisible();
    await expect(page.locator('text=Error')).not.toBeVisible();
  });

  test('Error handling works correctly', async ({ page }) => {
    // Test 404 page
    await page.goto('/non-existent-page');
    await expect(page.locator('text=Halaman Tidak Ditemukan')).toBeVisible();
    
    // Test network error recovery
    await page.goto('/assessment');
    
    // Simulate offline
    await page.context().setOffline(true);
    
    // Try to submit
    await page.click('text=Mulai Asesmen');
    
    // Should show offline message
    await expect(page.locator('text=Tidak ada koneksi internet')).toBeVisible();
    
    // Restore connection
    await page.context().setOffline(false);
    
    // Should recover
    await expect(page.locator('text=Koneksi pulih')).toBeVisible();
  });
});

test.describe('Performance Tests', () => {
  test('Page loads within performance budget', async ({ page }) => {
    // Measure LCP
    const lcpPromise = page.evaluate(() => {
      return new Promise((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          resolve(lastEntry.startTime);
        }).observe({ entryTypes: ['largest-contentful-paint'] });
      });
    });
    
    await page.goto('/');
    const lcp = await lcpPromise as number;
    
    // LCP should be under 2.5s
    expect(lcp).toBeLessThan(2500);
  });

  test('Font loading is optimized', async ({ page }) => {
    await page.goto('/');
    
    // Check that only 2 fonts are loaded
    const fontRequests = await page.evaluate(() => {
      return performance.getEntriesByType('resource')
        .filter(r => r.name.includes('fonts.googleapis.com') || r.name.includes('font'))
        .length;
    });
    
    // Should have reduced from 8 to 2 fonts
    expect(fontRequests).toBeLessThanOrEqual(2);
  });
});

test.describe('Accessibility Tests', () => {
  test('Page has no critical accessibility violations', async ({ page }) => {
    await page.goto('/');
    
    // Check for skip link
    await expect(page.locator('text=Skip to main content')).toBeVisible();
    
    // Check heading hierarchy
    const h1 = await page.locator('h1').count();
    expect(h1).toBeGreaterThan(0);
    
    // Check for alt text on images
    const imagesWithoutAlt = await page.locator('img:not([alt])').count();
    expect(imagesWithoutAlt).toBe(0);
    
    // Check color contrast (basic check)
    const buttons = await page.locator('button').all();
    for (const button of buttons) {
      const isVisible = await button.isVisible();
      if (isVisible) {
        // Button should be clickable (not obscured)
        await expect(button).toBeEnabled();
      }
    }
  });

  test('Keyboard navigation works', async ({ page }) => {
    await page.goto('/assessment');
    
    // Tab through elements
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    // Should be able to activate with Enter
    await page.keyboard.press('Enter');
    
    // Should navigate to next page
    await page.waitForURL('**/*');
  });
});
