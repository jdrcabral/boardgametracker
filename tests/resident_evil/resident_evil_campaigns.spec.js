// @ts-check
const { test, expect } = require('@playwright/test')

test('should clear when start new campaign', async ({ page }) => {
  await page.goto('http://localhost:3000/pages/boardgame/residentevil.html')
  await page.locator('#threatLevel').click();
  await page.locator('#threatLevel').fill('5');
  await page.locator('#threatLevel').press('Tab');
  await page.getByLabel('Character Select 1').selectOption('chris_redfield');
  await page.locator('#characterHealth1').click();
  await page.locator('#characterHealth1').fill('3');
  await page.locator('#characterHealth1').press('Tab');
  await page.locator('#characterKerosene1').fill('3');
  await page.locator('#characterKerosene1').press('Tab');
  await page.getByLabel('Character 1 Item Select').selectOption('acid_rounds');
  await page.getByRole('button', { name: 'Add Item' }).first().click();
  await page.getByPlaceholder('Ammo/Quantity').click();
  await page.getByPlaceholder('Ammo/Quantity').fill('3');
  await page.locator('#character_jill_valentine_unlocked').check();
  await page.locator('#character_chris_redfield_unlocked').check();
  await page.locator('#character_rebecca_chambers_unlocked').check();
  await page.locator('#character_barry_burton_unlocked').check();
  await page.getByLabel('Notes').click();
  await page.getByLabel('Notes').fill('Test');
  await page.getByRole('tab', { name: 'Items' }).click();
  await page.locator('#itemSelect').selectOption('003_key');
  await page.getByRole('button', { name: 'Add Item' }).first().click();
  await page.getByPlaceholder('Quantity', { exact: true }).click();
  await page.getByPlaceholder('Quantity', { exact: true }).fill('1');
  await page.locator('#itemASelect').selectOption('blue_herb');
  await page.getByRole('button', { name: 'Add Item' }).nth(1).click();
  await page.locator('#itemADeck').getByPlaceholder('Quantity').click();
  await page.locator('#itemADeck').getByPlaceholder('Quantity').fill('1');
  await page.getByRole('tab', { name: 'Decks' }).click();
  await page.locator('#tensionCardSelect').selectOption('all_clear');
  await page.getByRole('button', { name: 'Add Tension Card' }).first().click();
  await page.locator('#removedTensionCardSelect').selectOption('all_clear');
  await page.getByRole('button', { name: 'Add Tension Card' }).nth(1).click();
  await page.locator('#narrativeCardSelect').selectOption('architect_s_notebook');
  await page.getByLabel('Decks').locator('div').filter({ hasText: 'Add the played narratives' }).getByRole('button').click();
  await page.locator('#addedNarrativeCardSelect').selectOption('animosity');
  await page.getByRole('button', { name: 'Add Narrative Card' }).nth(1).click();
  await page.locator('#missionCardSelect').selectOption('blue_gem_into_the_tiger_statue');
  await page.getByRole('button', { name: 'Add Mission Card' }).click();
  await page.locator('#encounterCardSelect').selectOption('0');
  await page.getByRole('button', { name: 'Add Encounter Card' }).click();
  await page.getByRole('tab', { name: 'Mansion Map' }).click()
  await expect(page.locator('xpath=//*[@id="1st_Floor_East_A"]')).toBeVisible()
  await expect(page.locator('xpath=/html/body/div/div[4]/div[4]/svg/g/g[3]/g[16]/path')).not.toBeVisible()
  await page.locator('xpath=//*[@id="1st_Floor_East_A"]').click()
  await expect(page.locator('#modalTitle')).toContainText('1st Floor East A')
  await page.getByRole('button', { name: 'Reveal ' }).click()
  await expect(page.locator('#rect36')).toBeVisible()
  await page.goto('http://localhost:3000/pages/boardgame/residentevil.html');
  await page.reload();
  await expect(page.locator('#threatLevel')).toHaveValue('5');
  await page.locator('#characterHealth1').click();
  await expect(page.locator('#characterHealth1')).toHaveValue('3');
  await expect(page.locator('#characterKerosene1')).toHaveValue('3');
  await expect(page.getByPlaceholder('Ammo/Quantity')).toHaveValue('3');
  await expect(page.getByRole('paragraph')).toContainText('Acid Rounds');
  await expect(page.locator('#character_jill_valentine_unlocked')).toBeChecked();
  await expect(page.locator('#character_chris_redfield_unlocked')).toBeChecked();
  await expect(page.locator('#character_rebecca_chambers_unlocked')).toBeChecked();
  await expect(page.locator('#character_barry_burton_unlocked')).toBeChecked();
  await expect(page.getByLabel('Notes')).toHaveValue('Test');
  await page.getByRole('tab', { name: 'Items' }).click();
  await expect(page.locator('#itemBox')).toContainText('003 Key');
  await expect(page.locator('#itemBox').getByPlaceholder('Quantity')).toHaveValue('1');
  await expect(page.locator('#itemADeck')).toContainText('Blue Herb');
  await expect(page.locator('#itemADeck').getByPlaceholder('Quantity')).toHaveValue('1');
  await page.getByRole('tab', { name: 'Decks' }).click();
  await expect(page.locator('#tensionDeck')).toContainText('All Clear');
  await expect(page.locator('#tensionDeck').getByPlaceholder('Quantity')).toHaveValue('1');
  await expect(page.locator('#removedTensionDeck')).toContainText('All Clear');
  await expect(page.locator('#removedTensionDeck').getByPlaceholder('Quantity')).toHaveValue('1');
  await expect(page.locator('#narrativeDeck')).toContainText('Architect\'s Notebook');
  await expect(page.locator('#addedNarrativeDeck')).toContainText('Animosity');
  await expect(page.locator('#missionDeck')).toContainText('Blue Gem Into The Tiger Statue');
  await expect(page.locator('#encounterDeck')).toContainText('Spawn a Corpse...');
  await expect(page.locator('#encounterDeck').getByPlaceholder('Quantity')).toHaveValue('1');

  await page.getByRole('tab', { name: 'Mansion Map' }).click()
  await expect(page.locator('xpath=//*[@id="1st_Floor_East_A"]')).toBeVisible()
  await expect(page.locator('xpath=/html/body/div/div[4]/div[4]/svg/g/g[3]/g[16]/path')).not.toBeVisible()
  await page.locator('xpath=//*[@id="1st_Floor_East_A"]').click()
  await expect(page.locator('#modalTitle')).toContainText('1st Floor East A')
  await page.getByRole('button', { name: 'Reveal ' }).click()

  // Create new campaign
  await page.getByRole('button', { name: 'New Campaign' }).click();
  await expect(page.getByPlaceholder('Campaign Title')).toHaveValue('New Campaign');
  await page.getByRole('tab', { name: 'Characters' }).click();
  await expect(page.locator('#threatLevel')).toHaveValue('0');
  await expect(page.locator('#characterHealth1')).toHaveValue('0');
  await expect(page.locator('#characterKerosene1')).toHaveValue('0');
  await expect(page.getByLabel('Character Select 1')).toHaveValue('Select Character');
  await expect(page.getByLabel('Notes')).toBeEmpty();
  await page.getByRole('tab', { name: 'Items' }).click();
  await expect(page.locator('#itemBox')).not.toContainText('003 Key');
  await expect(page.locator('#itemADeck')).not.toContainText('Blue Herb');
  await page.getByRole('tab', { name: 'Decks' }).click();
  await expect(page.locator('#tensionDeck')).not.toContainText('All Clear');
  await expect(page.locator('#removedTensionDeck')).not.toContainText('All Clear');
  await expect(page.locator('#narrativeDeck')).not.toContainText('Architect\'s Notebook');
  await expect(page.locator('#addedNarrativeDeck')).not.toContainText('Animosity');
  await expect(page.locator('#missionDeck')).not.toContainText('Blue Gem Into The Tiger Statue');
  await expect(page.locator('#encounterDeck')).not.toContainText('Spawn a Corpse...');
  await page.getByRole('tab', { name: 'Mansion Map' }).click()
  await expect(page.locator('xpath=//*[@id="1st_Floor_East_A"]')).toBeVisible()
  await expect(page.locator('xpath=/html/body/div/div[4]/div[4]/svg/g/g[3]/g[16]/path')).not.toBeVisible()
});

test('should update campaign list when update campaign', async ({ page }) => {
  await page.goto('http://localhost:3000/pages/boardgame/residentevil.html');
  await expect(page.getByLabel('Campaign Select')).toContainText('Select Campaign Game Campaign');
  await expect(page.getByPlaceholder('Campaign Title')).toHaveValue('Game Campaign');
  await page.getByPlaceholder('Campaign Title').click();
  await page.getByPlaceholder('Campaign Title').fill('Newest campaign');
  await page.getByPlaceholder('Campaign Title').press('Tab');
  await expect(page.getByLabel('Campaign Select')).toContainText('Select Campaign Newest campaign');
  await expect(page.getByPlaceholder('Campaign Title')).toHaveValue('Newest campaign');
});

test('should create a new campaign when only remove the only existing campaign', async ({ page }) => {
  await page.goto('http://localhost:3000/pages/boardgame/residentevil.html');
  await expect(page.getByPlaceholder('Campaign Title')).toHaveValue('Game Campaign');
  await expect(page.getByLabel('Campaign Select')).toContainText('Select Campaign Game Campaign');
  await page.getByPlaceholder('Campaign Title').click();
  await page.getByPlaceholder('Campaign Title').fill('Newest campaign');
  await page.getByPlaceholder('Campaign Title').press('Tab');
  await expect(page.getByLabel('Campaign Select')).toContainText('Select Campaign Newest campaign');
  await expect(page.getByPlaceholder('Campaign Title')).toHaveValue('Newest campaign');
  page.once('dialog', dialog => {
    console.log(`Dialog message: ${dialog.message()}`);
    dialog.accept().catch(() => {});
  });
  await page.getByRole('button', { name: 'Delete Campaign' }).click();
  await expect(page.getByLabel('Campaign Select')).toContainText('Select Campaign Game Campaign');
  await expect(page.getByPlaceholder('Campaign Title')).toHaveValue('Game Campaign');
});

test('should change to the new campaign when create a new one', async ({ page }) => {
  await page.goto('http://localhost:3000/pages/boardgame/residentevil.html');
  await expect(page.getByLabel('Campaign Select')).toContainText('Select Campaign Game Campaign');
  await page.getByRole('button', { name: 'New Campaign' }).click();
  await expect(page.getByLabel('Campaign Select')).toContainText('Select Campaign Game CampaignNew Campaign');
  await expect(page.getByPlaceholder('Campaign Title')).toHaveValue('New Campaign');
});

test('should load an existing campaign when remove the current one', async ({ page }) => {
  await page.goto('http://localhost:3000/pages/boardgame/residentevil.html');
  await expect(page.getByLabel('Campaign Select')).toContainText('Select Campaign Game Campaign');
  await page.getByRole('button', { name: 'New Campaign' }).click();
  await expect(page.getByLabel('Campaign Select')).toContainText('Select Campaign Game CampaignNew Campaign');
  await expect(page.getByPlaceholder('Campaign Title')).toHaveValue('New Campaign');
  page.once('dialog', dialog => {
    console.log(`Dialog message: ${dialog.message()}`);
    dialog.accept().catch(() => {});
  });
  await page.getByRole('button', { name: 'Delete Campaign' }).click();
  await expect(page.getByLabel('Campaign Select')).toContainText('Select Campaign Game Campaign');
  await expect(page.getByPlaceholder('Campaign Title')).toHaveValue('Game Campaign');
});

test('should load a new campaign', async ({ page }) => {
  await page.goto('http://localhost:3000/pages/boardgame/residentevil.html');
  await expect(page.locator('#threatLevel')).toHaveValue('0');
  await page.getByRole('button', { name: 'New Campaign' }).click();
  await page.locator('#threatLevel').click();
  await page.locator('#threatLevel').fill('5');
  await page.locator('#threatLevel').press('Tab');
  await page.getByLabel('Campaign Select').click();
  await page.getByLabel('Campaign Select').selectOption('Game Campaign');
  await expect(page.locator('#threatLevel')).toHaveValue('0');
  await page.getByLabel('Campaign Select').selectOption('New Campaign');
  await expect(page.locator('#threatLevel')).toHaveValue('5');
});