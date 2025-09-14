import { test, expect } from '@playwright/test';

test('Has title', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await expect(page).toHaveTitle(/Car Clinic/);
});

test('Add new vehicle', async ({ page }) => {
  await page.goto('http://localhost:3000');


  await page.getByText('ADD VEHICLE').isVisible();
  await expect(page.getByText('ADD VEHICLE')).toBeVisible();

  // Take a screenshot of the main page
  await page.screenshot({ path: 'screenshots/main-page.png' });

  // Click the "ADD VEHICLE" button
  let addVehicleButton = await page.getByText('ADD VEHICLE');
  await expect(addVehicleButton).toBeVisible();
  await addVehicleButton.click();

  // Fill out the form fields
  let vinInput = await page.locator('//input[@name="vin"]');
  await expect(vinInput).toBeVisible();
  await vinInput.fill('1HGCM82633A123456');

  let makeInput = await page.locator('//input[@name="make"]');
  await expect(makeInput).toBeVisible();
  await makeInput.fill('Honda');

  let modelInput = await page.locator('//input[@name="model"]');
  await expect(modelInput).toBeVisible();
  await modelInput.fill('Accord');

  let colorInput = await page.locator('//input[@name="color"]');
  await expect(colorInput).toBeVisible();
  await colorInput.fill('Black');

  let yearInput = await page.locator('//input[@name="year"]');
  await expect(yearInput).toBeVisible();
  await yearInput.fill('2020');

  let mileageInput = await page.locator('//input[@name="mileage"]');
  await expect(mileageInput).toBeVisible();
  await mileageInput.fill('15000');

  let lastServiceDateInput = await page.locator('//input[@name="lastServiceDate"]');
  await expect(lastServiceDateInput).toBeVisible();
  await lastServiceDateInput.fill('2023-01-15');

  let nextServiceDateInput = await page.locator('//input[@name="nextServiceDate"]');
  await expect(nextServiceDateInput).toBeVisible();
  await nextServiceDateInput.fill('2023-07-15');

  // take a screenshot of the filled form
  await page.screenshot({ path: 'screenshots/filled-form.png' });

  // Submit the form
  let submitButton = await page.getByText('SAVE VEHICLE');
  await expect(submitButton).toBeVisible();
  await submitButton.click();

  // Press Escape to close any modal that might still be open
  await page.keyboard.press('Escape');

  // Wait for add vehicle modal to close
  await expect(page.getByText('SAVE VEHICLE')).toHaveCount(0);

  // Verify that the new vehicle appears in the list
  let newVehicle = await page.getByText('1HGCM82633A123456');
  await expect(newVehicle).toBeVisible();

  // Take a screenshot after adding the vehicle
  await page.screenshot({ path: 'screenshots/after-adding-vehicle.png' });

  const rows = page.locator('.MuiDataGrid-row');
  const rowCount = await rows.count();
  let found = false;
  for (let i = 0; i < rowCount; i++) {
    const row = rows.nth(i);
    if (await row.getByText('1HGCM82633A123456').count() > 0) {
      // Set up dialog handler before clicking delete
      page.once('dialog', async (dialog) => {
        await dialog.accept();
      });
      const deleteButton = row.locator('[data-testid="delete-vehicle-button"]');
      await deleteButton.click({ force: true });
      found = true;
      break;
    }
  }
  expect(found).toBeTruthy();

  // Take a screenshot after deleting the vehicle
  await page.screenshot({ path: 'screenshots/after-deleting-vehicle.png' });


});
