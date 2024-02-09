// @ts-check
const { test, expect } = require('@playwright/test');

test('should reveal map', async ({ page }) => {
  await page.goto('http://localhost:3000/pages/boardgame/residentevil.html');
  await page.getByRole('tab', { name: 'Mansion Map' }).click();
  await expect(page.locator('#rect36')).toBeVisible();
  await expect(page.locator('xpath=/html/body/div/div[4]/div[4]/svg/g/g[3]/g[16]/path')).not.toBeVisible();
  await page.locator('#tspan175').click();
  await expect(page.locator('#modalTitle')).toContainText('1st Floor East A');
  await page.getByRole('button', { name: 'Reveal ' }).click();
  await expect(page.locator('#rect36')).toBeVisible();
  await page.reload();
  await page.getByRole('tab', { name: 'Mansion Map' }).click();
  await page.locator('#tspan175').click();
  await expect(page.locator('#rect36')).toBeVisible();
  await expect(page.locator('#path98')).toBeVisible();
});

test('should hide a revealed map', async ({ page }) => {
  await page.goto('http://localhost:3000/pages/boardgame/residentevil.html');
  await page.getByRole('tab', { name: 'Mansion Map' }).click();
  await expect(page.locator('#rect36')).toBeVisible();
  await expect(page.locator('xpath=/html/body/div/div[4]/div[4]/svg/g/g[3]/g[16]/path')).not.toBeVisible();
  await page.locator('#tspan175').click();
  await expect(page.locator('#modalTitle')).toContainText('1st Floor East A');
  await page.getByRole('button', { name: 'Reveal ' }).click();
  await expect(page.locator('#rect36')).toBeVisible();
  await page.reload();
  await page.getByRole('tab', { name: 'Mansion Map' }).click();
  await expect(page.locator('#rect36')).toBeVisible();
  await expect(page.locator('#path98')).toBeVisible();
  await page.locator('#tspan175').click();
  await expect(page.locator('#modalTitle')).toContainText('1st Floor East A');
  await page.getByRole('button', { name: 'Reveal ' }).click();
  await expect(page.locator('#rect36')).toBeVisible();
  await expect(page.locator('xpath=/html/body/div/div[4]/div[4]/svg/g/g[3]/g[16]/path')).not.toBeVisible();
  await page.reload();
  await page.getByRole('tab', { name: 'Mansion Map' }).click();
  await expect(page.locator('#rect36')).toBeVisible();
  await expect(page.locator('xpath=/html/body/div/div[4]/div[4]/svg/g/g[3]/g[16]/path')).not.toBeVisible();
});

test('should complete a scenario', async ({ page }) => {
  await page.goto('http://localhost:3000/pages/boardgame/residentevil.html');
  await page.getByRole('tab', { name: 'Mansion Map' }).click();
  await page.locator('#tspan175').click();
  await page.getByRole('button', { name: 'Complete ' }).click();
  await expect(page.locator('#rect5')).toHaveAttribute('fill', '#2dcf43');
  await page.reload();
  await page.getByRole('tab', { name: 'Mansion Map' }).click();
  await expect(page.locator('#rect5')).toHaveAttribute('fill', '#2dcf43');
});

test('should reverse a complete scenario', async ({ page }) => {
  await page.goto('http://localhost:3000/pages/boardgame/residentevil.html');
  await page.getByRole('tab', { name: 'Mansion Map' }).click();
  await page.locator('#tspan175').click();
  await page.getByRole('button', { name: 'Complete ' }).click();
  await expect(page.locator('#rect5')).toHaveAttribute('fill', '#2dcf43');
  await page.reload();
  await page.getByRole('tab', { name: 'Mansion Map' }).click();
  await expect(page.locator('#rect5')).toHaveAttribute('fill', '#2dcf43');
  await page.locator('#tspan175').click();
  await page.getByRole('button', { name: 'Complete ' }).click();
  await expect(page.locator('#rect5')).toHaveAttribute('fill', '#ffffff');
  await page.reload();
  await page.getByRole('tab', { name: 'Mansion Map' }).click();
  await expect(page.locator('#rect5')).toHaveAttribute('fill', '#ffffff');
});
