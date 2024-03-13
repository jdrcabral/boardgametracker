// @ts-check
const { test, expect } = require('@playwright/test')

test('item box item should keep it quantity', async ({ page }) => {
  await page.goto('http://localhost:5000/pages/boardgame/residentevil.html')
  await page.getByRole('tab', { name: 'Items' }).click()
  await page.locator('#itemSelect').selectOption('green_herb')
  await page.getByRole('button', { name: 'Add Item' }).first().click()
  await page.getByPlaceholder('Quantity').click()
  await page.getByPlaceholder('Quantity').fill('5')
  await page.locator('#itemBox').click()
  await expect(page.getByRole('paragraph')).toContainText('Green Herb')
  await expect(page.getByPlaceholder('Quantity')).toHaveValue('5')
  await page.reload()
  await page.getByRole('tab', { name: 'Items' }).click()
  await expect(page.getByRole('paragraph')).toContainText('Green Herb')
  await expect(page.getByPlaceholder('Quantity')).toHaveValue('5')
})

test('item A item should keep it quantity', async ({ page }) => {
  await page.goto('http://localhost:5000/pages/boardgame/residentevil.html')
  await page.getByRole('tab', { name: 'Items' }).click()
  await page.locator('#itemASelect').selectOption('green_herb')
  await page.getByRole('button', { name: 'Add Item' }).nth(1).click()
  await page.getByPlaceholder('Quantity').click()
  await page.getByPlaceholder('Quantity').fill('5')
  await page.locator('#itemADeck').click()
  await expect(page.getByRole('paragraph')).toContainText('Green Herb')
  await expect(page.getByPlaceholder('Quantity')).toHaveValue('5')
  await page.reload()
  await page.getByRole('tab', { name: 'Items' }).click()
  await expect(page.getByRole('paragraph')).toContainText('Green Herb')
  await expect(page.getByPlaceholder('Quantity')).toHaveValue('5')
})

test('removing item from item box does not remove from deck A', async ({ page }) => {
  await page.goto('http://localhost:5000/pages/boardgame/residentevil.html')
  await page.getByRole('tab', { name: 'Items' }).click()
  await page.locator('#itemSelect').selectOption('blue_herb')
  await page.getByRole('button', { name: 'Add Item' }).first().click()
  await page.locator('#itemASelect').selectOption('blue_herb')
  await page.getByRole('button', { name: 'Add Item' }).nth(1).click()
  await expect(page.locator('#itemBox')).toContainText('Blue Herb')
  await expect(page.locator('#itemADeck')).toContainText('Blue Herb')
  await page.locator('#itemBox').getByRole('button', { name: '' }).click()
  await expect(page.locator('#itemADeck')).toContainText('Blue Herb')
})

test('removing item from deck A does not remove from item box', async ({ page }) => {
  await page.goto('http://localhost:5000/pages/boardgame/residentevil.html')
  await page.getByRole('tab', { name: 'Items' }).click()
  await page.locator('#itemSelect').selectOption('blue_herb')
  await page.getByRole('button', { name: 'Add Item' }).first().click()
  await page.locator('#itemASelect').selectOption('blue_herb')
  await page.getByRole('button', { name: 'Add Item' }).nth(1).click()
  await expect(page.locator('#itemBox')).toContainText('Blue Herb')
  await expect(page.locator('#itemADeck')).toContainText('Blue Herb')
  await page.locator('#itemADeck').getByRole('button', { name: '' }).click()
  await expect(page.locator('#itemBox')).toContainText('Blue Herb')
})
