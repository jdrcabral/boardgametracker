// @ts-check
const { test, expect } = require('@playwright/test')

test('should clear when start new campaign', async ({ page }) => {
  await page.goto('http://localhost:3000/pages/boardgame/residentevil3.html')
  await page.locator('#cityDanger').click()
  await page.locator('#cityDanger').fill('5')
  await page.locator('#cityDanger').press('Tab')
  await page.getByLabel('Character Select 1').selectOption('carlos_oliveira')
  await page.locator('#characterHealth1').click()
  await page.locator('#characterHealth1').fill('3')
  await page.locator('#characterHealth1').press('Tab')
  await page.getByLabel('Character 1 Item Select').selectOption('acid_rounds')
  await page.getByRole('button', { name: 'Add Item' }).first().click()
  await page.getByPlaceholder('Ammo/Quantity').click()
  await page.getByPlaceholder('Ammo/Quantity').fill('3')
  await page.locator('#character_jill_valentine_unlocked').check()
  await page.locator('#character_carlos_oliveira_unlocked').check()
  await page.locator('#character_nicholai_ginovaef_unlocked').check()
  await page.locator('#character_barry_burton_unlocked').check()
  await page.getByLabel('Notes').click()
  await page.getByLabel('Notes').fill('Test')
  await page.getByRole('tab', { name: 'Items' }).click()
  await page.locator('#itemSelect').selectOption('acid_rounds')
  await page.getByRole('button', { name: 'Add Item' }).first().click()
  await page.getByPlaceholder('Quantity', { exact: true }).click()
  await page.getByPlaceholder('Quantity', { exact: true }).fill('1')
  await page.locator('#itemASelect').selectOption('blue_herb')
  await page.getByRole('button', { name: 'Add Item' }).nth(1).click()
  await page.locator('#itemADeck').getByPlaceholder('Quantity').click()
  await page.locator('#itemADeck').getByPlaceholder('Quantity').fill('1')
  await page.getByRole('tab', { name: 'Decks' }).click()
  await page.locator('#tensionCardSelect').selectOption('all_clear')
  await page.getByRole('button', { name: 'Add' }).first().click()
  await expect(page.locator('#tensionDeck')).toContainText('All Clear')
  await page.getByLabel('Narrative Select').selectOption('explosion')
  await page.getByRole('button', { name: 'Add' }).nth(1).click()
  await expect(page.locator('#narrativeDeck')).toContainText('Explosion')
  await page.getByRole('tab', { name: 'Scenarios' }).click()
  await expect(page.locator('#scenario_downtown_1_completed')).not.toBeChecked()
  await expect(page.locator('#scenario_downtown_1_itemC')).not.toBeChecked()
  await expect(page.locator('#scenario_downtown_2_discovered')).not.toBeChecked()
  await page.reload()
  await expect(page.locator('#cityDanger')).toHaveValue('5')
  await page.locator('#characterHealth1').click()
  await expect(page.locator('#characterHealth1')).toHaveValue('3')
  await expect(page.getByPlaceholder('Ammo/Quantity')).toHaveValue('3')
  await expect(page.getByRole('paragraph')).toContainText('Acid Rounds')
  await expect(page.locator('#character_jill_valentine_unlocked')).toBeChecked()
  await expect(page.locator('#character_carlos_oliveira_unlocked')).toBeChecked()
  await expect(page.locator('#character_nicholai_ginovaef_unlocked')).toBeChecked()
  await expect(page.locator('#character_barry_burton_unlocked')).toBeChecked()
  await expect(page.getByLabel('Notes')).toHaveValue('Test')
  await page.getByRole('tab', { name: 'Items' }).click()
  await expect(page.locator('#itemBox')).toContainText('Acid Rounds')
  await expect(page.locator('#itemBox').getByPlaceholder('Quantity')).toHaveValue('1')
  await expect(page.locator('#itemADeck')).toContainText('Blue Herb')
  await expect(page.locator('#itemADeck').getByPlaceholder('Quantity')).toHaveValue('1')
  await page.getByRole('tab', { name: 'Decks' }).click()
  await expect(page.locator('#tensionDeck')).toContainText('All Clear')
  await expect(page.locator('#tensionDeck').getByPlaceholder('Quantity')).toHaveValue('1')
  await expect(page.locator('#narrativeDeck')).toContainText('Explosion')

  await page.getByRole('tab', { name: 'Scenarios' }).click()
  await expect(page.locator('#scenario_downtown_1_completed')).not.toBeChecked()
  await expect(page.locator('#scenario_downtown_1_itemC')).not.toBeChecked()
  await expect(page.locator('#scenario_downtown_2_discovered')).not.toBeChecked()
  await page.locator('#scenario_downtown_1_completed').check()
  await page.locator('#scenario_downtown_1_itemC').check()
  await page.locator('#scenario_downtown_2_discovered').check()
  await expect(page.locator('#scenario_downtown_1_completed')).toBeChecked()
  await expect(page.locator('#scenario_downtown_1_itemC')).toBeChecked()
  await expect(page.locator('#scenario_downtown_2_discovered')).toBeChecked()

  // Create new campaign
  await page.getByRole('button', { name: 'New Campaign' }).click()
  await expect(page.getByPlaceholder('Campaign Title')).toHaveValue('New Campaign')
  await page.getByRole('tab', { name: 'Characters' }).click()
  await expect(page.locator('#cityDanger')).toHaveValue('0')
  await expect(page.locator('#characterHealth1')).toHaveValue('0')
  await expect(page.getByLabel('Character Select 1')).toHaveValue('Select Character')
  await expect(page.getByLabel('Notes')).toBeEmpty()
  await page.getByRole('tab', { name: 'Items' }).click()
  await expect(page.locator('#itemBox')).not.toContainText('Acid Rounds')
  await expect(page.locator('#itemADeck')).not.toContainText('Blue Herb')
  await page.getByRole('tab', { name: 'Decks' }).click()
  await expect(page.locator('#tensionDeck')).not.toContainText('All Clear')
  await expect(page.locator('#narrativeDeck')).not.toContainText('Explosion')
  await page.getByRole('tab', { name: 'Scenarios' }).click()
  await expect(page.locator('#scenario_downtown_1_completed')).not.toBeChecked()
  await expect(page.locator('#scenario_downtown_1_itemC')).not.toBeChecked()
  await expect(page.locator('#scenario_downtown_2_discovered')).not.toBeChecked()
})

test('should update campaign list when update campaign', async ({ page }) => {
  await page.goto('http://localhost:3000/pages/boardgame/residentevil3.html')
  await expect(page.getByLabel('Campaign Select')).toContainText('Select Campaign Game Campaign')
  await expect(page.getByPlaceholder('Campaign Title')).toHaveValue('Game Campaign')
  await page.getByPlaceholder('Campaign Title').click()
  await page.getByPlaceholder('Campaign Title').fill('Newest campaign')
  await page.getByPlaceholder('Campaign Title').press('Tab')
  await expect(page.getByLabel('Campaign Select')).toContainText('Select Campaign Newest campaign')
  await expect(page.getByPlaceholder('Campaign Title')).toHaveValue('Newest campaign')
})

test('should create a new campaign when only remove the only existing campaign', async ({ page }) => {
  await page.goto('http://localhost:3000/pages/boardgame/residentevil3.html')
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
  await page.goto('http://localhost:3000/pages/boardgame/residentevil3.html')
  await expect(page.getByLabel('Campaign Select')).toContainText('Select Campaign Game Campaign')
  await page.getByRole('button', { name: 'New Campaign' }).click()
  await expect(page.getByLabel('Campaign Select')).toContainText('Select Campaign Game CampaignNew Campaign')
  await expect(page.getByPlaceholder('Campaign Title')).toHaveValue('New Campaign')
})

test('should load an existing campaign when remove the current one', async ({ page }) => {
  await page.goto('http://localhost:3000/pages/boardgame/residentevil3.html')
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
  await page.goto('http://localhost:3000/pages/boardgame/residentevil3.html')
  await expect(page.locator('#cityDanger')).toHaveValue('0')
  await page.getByRole('button', { name: 'New Campaign' }).click()
  await page.locator('#cityDanger').click()
  await page.locator('#cityDanger').fill('5')
  await page.locator('#cityDanger').press('Tab')
  await page.getByLabel('Campaign Select').click()
  await page.getByLabel('Campaign Select').selectOption('Game Campaign')
  await expect(page.locator('#cityDanger')).toHaveValue('0')
  await page.getByLabel('Campaign Select').selectOption('New Campaign')
  await expect(page.locator('#cityDanger')).toHaveValue('5')
})

test('should load scenarios correctly when changing campaign', async ({ page }) => {
  await page.goto('http://localhost:3000/pages/boardgame/residentevil3.html')
  await page.getByRole('tab', { name: 'Scenarios' }).click()
  await expect(page.locator('#scenario_downtown_1_completed')).not.toBeChecked()
  await expect(page.locator('#scenario_downtown_1_itemC')).not.toBeChecked()
  await expect(page.locator('#scenario_downtown_2_discovered')).not.toBeChecked()
  await page.locator('#scenario_downtown_1_completed').check()
  await page.locator('#scenario_downtown_1_itemC').check()
  await page.locator('#scenario_downtown_2_discovered').check()
  await expect(page.locator('#scenario_downtown_1_completed')).toBeChecked()
  await expect(page.locator('#scenario_downtown_1_itemC')).toBeChecked()
  await expect(page.locator('#scenario_downtown_2_discovered')).toBeChecked()
  await page.reload()

  await page.getByRole('button', { name: 'New Campaign' }).click()
  await page.getByRole('tab', { name: 'Scenarios' }).click()
  await expect(page.locator('#scenario_downtown_1_completed')).not.toBeChecked()
  await expect(page.locator('#scenario_downtown_1_itemC')).not.toBeChecked()
  await expect(page.locator('#scenario_downtown_2_discovered')).not.toBeChecked()

  await page.getByLabel('Campaign Select').click()
  await page.getByLabel('Campaign Select').selectOption('Game Campaign')
  await page.getByRole('tab', { name: 'Scenarios' }).click()
  await expect(page.locator('#scenario_downtown_1_completed')).toBeChecked()
  await expect(page.locator('#scenario_downtown_1_itemC')).toBeChecked()
  await expect(page.locator('#scenario_downtown_2_discovered')).toBeChecked()

  await page.getByLabel('Campaign Select').click()
  await page.getByLabel('Campaign Select').selectOption('New Campaign')
  await page.getByRole('tab', { name: 'Scenarios' }).click()
  await expect(page.locator('#scenario_downtown_1_completed')).not.toBeChecked()
  await expect(page.locator('#scenario_downtown_1_itemC')).not.toBeChecked()
  await expect(page.locator('#scenario_downtown_2_discovered')).not.toBeChecked()
})
