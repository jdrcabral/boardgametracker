// @ts-check
const { test, expect } = require('@playwright/test');

test('Character Selector', async ({ page }) => {
  await page.goto('http://localhost:8080/pages/boardgame/residentevil.html');
  await page.getByLabel('Character Select 1').selectOption('jill_valentine');
  await expect(page.getByLabel('Character Select 1')).toHaveValue('jill_valentine');
  await expect(page.locator('#characterHealth1')).toHaveValue('5');
  await page.locator('#characterHealth1').click();
  await page.locator('#characterHealth1').fill('3');
  await expect(page.locator('#characterHealth1')).toHaveValue('3');
  await page.locator('#characterKerosene1').click();
  await expect(page.locator('#characterKerosene1')).toHaveValue('0');
  await page.locator('#characterKerosene1').click();
  await page.locator('#characterKerosene1').fill('4');
  await page.locator('#characterKerosene1').press('Tab');
  await expect(page.locator('#characterKerosene1')).toHaveValue('4');
  await page.reload();
  await expect(page.getByLabel('Character Select 1')).toHaveValue('jill_valentine');
  await expect(page.locator('#characterHealth1')).toHaveValue('3');
  await expect(page.locator('#characterKerosene1')).toHaveValue('4');
});

test('Add item to character', async ({ page }) => {
  await page.goto('http://localhost:8080/pages/boardgame/residentevil.html');
  await page.getByLabel('Character 1 Item Select').selectOption('green_herb');
  await page.getByRole('button', { name: 'Add Item' }).first().click();
  await expect(page.getByLabel('Characters').getByRole('listitem')).toBeVisible();
  await expect(page.getByRole('paragraph')).toContainText('Green Herb');
  await expect(page.getByRole('button', { name: '' })).toBeVisible();
  await page.getByPlaceholder('Ammo/Quantity').click();
  await page.getByPlaceholder('Ammo/Quantity').fill('SA');
  await page.getByPlaceholder('Ammo/Quantity').press('Tab');
  await expect(page.getByPlaceholder('Ammo/Quantity')).toHaveValue('SA');
  await page.reload();
  await expect(page.getByRole('paragraph')).toContainText('Green Herb');
  await expect(page.getByPlaceholder('Ammo/Quantity')).toHaveValue('SA');
});

test('Add and remove character item', async ({ page }) => {
  await page.goto('http://localhost:8080/pages/boardgame/residentevil.html');
  await page.getByLabel('Character 1 Item Select').selectOption('003_key');
  await page.getByRole('button', { name: 'Add Item' }).first().click();
  await page.getByLabel('Character 1 Item Select').selectOption('acid_rounds');
  await page.getByRole('button', { name: 'Add Item' }).first().click();
  await expect(page.locator('#character1InventoryList')).toContainText('003 Key');
  await expect(page.locator('#character1InventoryList')).toContainText('Acid Rounds');
  await page.reload();
  await page.locator('li').filter({ hasText: 'Acid Rounds' }).getByRole('button').click();
  await page.reload();
  await expect(page.locator('#character1InventoryList')).toContainText('003 Key');
  await expect(page.locator('#character1InventoryList')).not.toContainText('Acid Rounds');
});

test('Reserve life change cascade to character', async ({ page }) => {
  await page.goto('http://localhost:8080/pages/boardgame/residentevil.html');
  await page.getByLabel('Character Select 2').selectOption('jill_valentine');
  await page.getByRole('row', { name: 'Jill Valentine' }).getByPlaceholder('null').click();
  await page.getByRole('row', { name: 'Jill Valentine' }).getByPlaceholder('null').fill('3');
  await page.getByRole('row', { name: 'Jill Valentine' }).getByPlaceholder('null').press('Enter');
  await expect(page.getByRole('row', { name: 'Jill Valentine' }).getByPlaceholder('null')).toHaveValue('3');
  await page.locator('#characterHealth2').click();
  await expect(page.locator('#characterHealth2')).toHaveValue('3');
  await page.reload();
  await expect(page.locator('#characterHealth2')).toHaveValue('3');
  await expect(page.getByRole('row', { name: 'Jill Valentine' }).getByPlaceholder('null')).toHaveValue('3');
});

test('Character life change cascade to reserve', async ({ page }) => {
  await page.goto('http://localhost:8080/pages/boardgame/residentevil.html');
  await page.getByLabel('Character Select 3').selectOption('jill_valentine');
  await page.locator('#characterHealth3').click();
  await page.locator('#characterHealth3').fill('3');
  await page.locator('#characterHealth3').press('Enter');
  await expect(page.locator('#characterHealth3')).toHaveValue('3');
  await expect(page.getByRole('row', { name: 'Jill Valentine' }).getByPlaceholder('null')).toHaveValue('3');
  await page.reload();
  await expect(page.locator('#characterHealth3')).toHaveValue('3');
  await expect(page.getByRole('row', { name: 'Jill Valentine' }).getByPlaceholder('null')).toHaveValue('3');
});

test('Reserve checkbox', async ({ page }) => {
  await page.goto('http://localhost:8080/pages/boardgame/residentevil.html');
  await page.getByRole('row', { name: 'Jill Valentine' }).getByRole('cell').nth(1).click();
  await page.locator('#character_jill_valentine_unlocked').check();
  await page.locator('#character_rebecca_chambers_advanced').check();
  await page.locator('#character_chris_redfield_dead').check();
  await expect(page.locator('#character_jill_valentine_unlocked')).toBeChecked();
  await expect(page.locator('#character_jill_valentine_advanced')).not.toBeChecked();
  await expect(page.locator('#character_jill_valentine_dead')).not.toBeChecked();
  await expect(page.locator('#character_chris_redfield_unlocked')).not.toBeChecked();
  await expect(page.locator('#character_chris_redfield_dead')).toBeChecked();
  await expect(page.locator('#character_chris_redfield_advanced')).not.toBeChecked();
  await expect(page.locator('#character_rebecca_chambers_unlocked')).not.toBeChecked();
  await expect(page.locator('#character_rebecca_chambers_dead')).not.toBeChecked();
  await expect(page.locator('#character_rebecca_chambers_advanced')).toBeChecked();
  await page.reload();
  await expect(page.locator('#character_jill_valentine_unlocked')).toBeChecked();
  await expect(page.locator('#character_jill_valentine_advanced')).not.toBeChecked();
  await expect(page.locator('#character_jill_valentine_dead')).not.toBeChecked();
  await expect(page.locator('#character_chris_redfield_unlocked')).not.toBeChecked();
  await expect(page.locator('#character_chris_redfield_dead')).toBeChecked();
  await expect(page.locator('#character_chris_redfield_advanced')).not.toBeChecked();
  await expect(page.locator('#character_rebecca_chambers_unlocked')).not.toBeChecked();
  await expect(page.locator('#character_rebecca_chambers_dead')).not.toBeChecked();
  await expect(page.locator('#character_rebecca_chambers_advanced')).toBeChecked();
});