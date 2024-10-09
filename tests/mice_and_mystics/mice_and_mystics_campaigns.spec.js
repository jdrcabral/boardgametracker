// @ts-check
const { test, expect } = require('@playwright/test')

test('should clear when start new campaign', async ({ page }) => {

  await page.goto('http://localhost:3000/pages/boardgame/mice_and_mystics.html');
  await expect(page.locator('#miz_maggie_party_achievement')).not.toBeChecked();
  await page.locator('#miz_maggie_party_achievement').check();
  await expect(page.locator('#miz_maggie_party_achievement')).toBeChecked();
  await expect(page.locator('#disguises_party_item')).not.toBeChecked();
  await page.locator('#disguises_party_item').check();
  await expect(page.locator('#disguises_party_item')).toBeChecked();
  await expect(page.locator('#select_inventory_colin')).toHaveValue('Select Item');
  await page.locator('#select_inventory_colin').selectOption('heal_all');
  await page.locator('.col > .btn').first().click();
  await expect(page.locator('#ColinInventoryList')).toContainText('Heal All');
  await expect(page.locator('#select_inventory_colin')).toHaveValue('heal_all');
  await page.locator('#select_abilities_colin').selectOption('major_heal');
  await expect(page.locator('#select_abilities_colin')).toHaveValue('major_heal');
  await page.locator('div:nth-child(7) > div:nth-child(2) > .btn').first().click();
  await expect(page.locator('#ColinAbilitiesList')).toContainText('Major Heal');
  await page.locator('#filch_player').click();
  await page.locator('#filch_player').fill('Test');
  await expect(page.locator('#filch_player')).toHaveValue('Test');
  await page.locator('#select_abilities_lily').selectOption('keen_eye');
  await page.locator('div:nth-child(3) > .card > .card-body > div:nth-child(7) > div:nth-child(2) > .btn').click();
  await expect(page.locator('#LilyAbilitiesList')).toContainText('Keen Eye');
  await expect(page.locator('#flight_to_barksburg_completed')).not.toBeChecked();
  await page.locator('#flight_to_barksburg_completed').check();
  await expect(page.locator('#flight_to_barksburg_completed')).toBeChecked();

  await page.reload();
  await expect(page.locator('#miz_maggie_party_achievement')).toBeChecked();
  await expect(page.locator('#disguises_party_item')).toBeChecked();
  await expect(page.locator('#ColinInventoryList')).toContainText('Heal All');
  await expect(page.locator('#ColinAbilitiesList')).toContainText('Major Heal');
  await expect(page.locator('#filch_player')).toHaveValue('Test');
  await expect(page.locator('#LilyAbilitiesList')).toContainText('Keen Eye');
  await expect(page.locator('#flight_to_barksburg_completed')).toBeChecked();
  
})

test('should update campaign list when update campaign', async ({ page }) => {
  await page.goto('http://localhost:3000/pages/boardgame/mice_and_mystics.html')
  await expect(page.getByLabel('Campaign Select')).toContainText('Select Campaign Game Campaign')
  await expect(page.getByPlaceholder('Campaign Title')).toHaveValue('Game Campaign')
  await page.getByPlaceholder('Campaign Title').click()
  await page.getByPlaceholder('Campaign Title').fill('Newest campaign')
  await page.getByPlaceholder('Campaign Title').press('Tab')
  await expect(page.getByLabel('Campaign Select')).toContainText('Select Campaign Newest campaign')
  await expect(page.getByPlaceholder('Campaign Title')).toHaveValue('Newest campaign')
})

test('should create a new campaign when only remove the only existing campaign', async ({ page }) => {
  await page.goto('http://localhost:3000/pages/boardgame/mice_and_mystics.html')
  await expect(page.getByPlaceholder('Campaign Title')).toHaveValue('Game Campaign')
  await expect(page.getByLabel('Campaign Select')).toContainText('Select Campaign Game Campaign')
  await page.getByPlaceholder('Campaign Title').click()
  await page.getByPlaceholder('Campaign Title').fill('Newest campaign')
  await page.getByPlaceholder('Campaign Title').press('Tab')
  await expect(page.getByLabel('Campaign Select')).toContainText('Select Campaign Newest campaign')
  await expect(page.getByPlaceholder('Campaign Title')).toHaveValue('Newest campaign')
  page.once('dialog', dialog => {
    console.log(`Dialog message: ${dialog.message()}`)
    dialog.accept().catch(() => {})
  })
  await page.getByRole('button', { name: 'Delete Campaign' }).click()
  await expect(page.getByLabel('Campaign Select')).toContainText('Select Campaign Game Campaign')
  await expect(page.getByPlaceholder('Campaign Title')).toHaveValue('Game Campaign')
})

test('should change to the new campaign when create a new one', async ({ page }) => {
  await page.goto('http://localhost:3000/pages/boardgame/mice_and_mystics.html')
  await expect(page.getByLabel('Campaign Select')).toContainText('Select Campaign Game Campaign')
  await page.getByRole('button', { name: 'New Campaign' }).click()
  await expect(page.getByLabel('Campaign Select')).toContainText('Select Campaign Game CampaignNew Campaign')
  await expect(page.getByPlaceholder('Campaign Title')).toHaveValue('New Campaign')
})

test('should load an existing campaign when remove the current one', async ({ page }) => {
  await page.goto('http://localhost:3000/pages/boardgame/mice_and_mystics.html')
  await expect(page.getByLabel('Campaign Select')).toContainText('Select Campaign Game Campaign')
  await page.getByRole('button', { name: 'New Campaign' }).click()
  await expect(page.getByLabel('Campaign Select')).toContainText('Select Campaign Game CampaignNew Campaign')
  await expect(page.getByPlaceholder('Campaign Title')).toHaveValue('New Campaign')
  page.once('dialog', dialog => {
    console.log(`Dialog message: ${dialog.message()}`)
    dialog.accept().catch(() => {})
  })
  await page.getByRole('button', { name: 'Delete Campaign' }).click()
  await expect(page.getByLabel('Campaign Select')).toContainText('Select Campaign Game Campaign')
  await expect(page.getByPlaceholder('Campaign Title')).toHaveValue('Game Campaign')
})

test('should load a new campaign', async ({ page }) => {
  await page.goto('http://localhost:3000/pages/boardgame/mice_and_mystics.html')
  await expect(page.locator('#flight_to_barksburg_completed')).not.toBeChecked();
  await page.getByRole('button', { name: 'New Campaign' }).click()
  await page.locator('#flight_to_barksburg_completed').check();
  await expect(page.locator('#flight_to_barksburg_completed')).toBeChecked();
  await page.getByLabel('Campaign Select').click()
  await page.getByLabel('Campaign Select').selectOption('Game Campaign');
  await expect(page.locator('#flight_to_barksburg_completed')).not.toBeChecked();
  await page.getByLabel('Campaign Select').selectOption('New Campaign');
  await expect(page.locator('#flight_to_barksburg_completed')).toBeChecked();
})
