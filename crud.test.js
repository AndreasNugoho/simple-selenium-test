const { Builder, By, until } = require('selenium-webdriver');

// set driver google chrome
async function setupDriver() {
  return await new Builder().forBrowser('chrome').build();
}

// test tambah user berhasil
async function testAddUserSuccess(driver) {
    try {
      console.log('============ Test tambah user -> berhasil ============');
      await driver.get('http://localhost:5555/users.html');
    
    const nameInput = await driver.findElement(By.id('name'));
    const usernameInput = await driver.findElement(By.id('username'));
    const passwordInput = await driver.findElement(By.id('password'));
    const form = await driver.findElement(By.id('userForm'));
    const userList = await driver.findElement(By.id('userList'));
    
    const testName = 'User Test';
    const testUsername = 'usertest123';
    const testPassword = 'pass123';
    
    await nameInput.clear();
    await nameInput.sendKeys(testName);
    await usernameInput.clear();
    await usernameInput.sendKeys(testUsername);
    await passwordInput.clear();
    await passwordInput.sendKeys(testPassword);
    
    await form.submit();
    
    await driver.wait(async () => {
      const items = await userList.findElements(By.css('li'));
      for (let item of items) {
        const text = await item.getText();
        if (text.includes(testName)) return true;
      }
      return false;
    }, 5000);
    
    console.log('Test: Tambah User - Passed');
    } catch (err) {
    console.error('Test: Tambah User - Failed:', err);
    }
}
  
// test tambah user gagal
async function testAddUserFailed(driver) {
    try {
    console.log('============ Test tambah user -> gagal ============');
    await driver.get('http://localhost:5555/users.html');
    
    await driver.wait(until.elementLocated(By.id('userForm')), 5000);
    await driver.wait(until.elementLocated(By.id('userList')), 5000);
    
    const nameInput = await driver.findElement(By.id('name'));
    const usernameInput = await driver.findElement(By.id('username'));
    const passwordInput = await driver.findElement(By.id('password'));
    const form = await driver.findElement(By.id('userForm'));
    const userList = await driver.findElement(By.id('userList'));
    
    const initialItems = await userList.findElements(By.css('li'));
    const initialCount = initialItems.length;
    
    await nameInput.sendKeys('User Test');
    
    await form.submit();
    
    await driver.sleep(2000);
    
    const finalItems = await userList.findElements(By.css('li'));
    const finalCount = finalItems.length;
    
    if (finalCount === initialCount) {
      console.log('Test: Tambah User Gagal - Passed');
    } else {
      console.error('Test: Tambah User Gagal - Failed: User bertambah padahal input tidak lengkap');
    }
    } catch (err) {
    console.error('Test: Tambah User Gagal - Failed:', err);
    }
}

// test update user
async function testUpdateUser(driver, userId, newName) {
    try {
    console.log('============ Test update user ============');
    await driver.get('http://localhost:5555/users.html');
    
    const userList = await driver.wait(until.elementLocated(By.id('userList')), 5000);
    
    const editButtonSelector = `[onclick*='edit(${userId})']`;
    let editButton;
    try {
      editButton = await driver.wait(until.elementLocated(By.css(editButtonSelector)), 3000);
    } catch (e) {
      console.error(`Test update user failed: User ID ${userId} tidak ditemukan`);
      return;
    }
    
    await editButton.click();
    
    const alert = await driver.switchTo().alert();
    await alert.sendKeys(newName);
    await alert.accept();
    
    await driver.wait(async () => {
      const items = await userList.findElements(By.css('li'));
      for (let item of items) {
        const text = await item.getText();
        if (text.includes(newName)) return true;
      }
      return false;
    }, 5000);
    
    const items = await userList.findElements(By.css('li'));
    let found = false;
    for (let item of items) {
      const text = await item.getText();
      if (text.includes(newName)) {
        found = true;
        break;
      }
    }
    if (found) {
      console.log(`Test update user passed: User ID ${userId} updated to "${newName}"`);
    } else {
      console.error(`Test update user failed: User ID ${userId} tidak ditemukan atau tidak terupdate`);
    }
    } catch (err) {
    console.error('Test update user failed:', err);
    }
}

// test delete user
async function testDeleteUser(driver, userId) {
    try {
    console.log('============ Test delete user ============');
    await driver.get('http://localhost:5555/users.html');
    
    const userList = await driver.wait(until.elementLocated(By.id('userList')), 5000);
    
    const deleteButtonSelector = `[onclick*='delete(${userId})']`;
    let deleteButton;
    try {
      deleteButton = await driver.wait(until.elementLocated(By.css(deleteButtonSelector)), 3000);
    } catch (e) {
      console.error(`Test delete user failed: User ID ${userId} tidak ditemukan`);
      return;
    }
    
    await deleteButton.click();
    
    const alert = await driver.switchTo().alert();
    await alert.accept();
    
    await driver.sleep(2000);
    
    const items = await userList.findElements(By.css('li'));
    let found = false;
    for (let item of items) {
      const text = await item.getText();
      if (text.includes(userId)) {
        found = true;
        break;
      }
    }
    if (!found) {
      console.log(`Test delete user passed: User ID ${userId} deleted`);
    } else {
      console.error(`Test delete user failed: User ID ${userId} masih ada`);
    }
    } catch (err) {
    console.error('Test delete user failed:', err);
    }
}

// run test
async function runTests() {
    const driver = await setupDriver();
    try {
        // test tambah user berhasil
        await testAddUserSuccess(driver);
        // test tambah user gagal
        await testAddUserFailed(driver);
        // test update user berhasil
        await testUpdateUser(driver, 1, 'User Test Updated');
        //test update user gagal 
        await testUpdateUser(driver, 999, 'User Test Updated Gagal');
        // test delete user berhasil
        await testDeleteUser(driver, 1);
        // test delete user gagal
        await testDeleteUser(driver, 999);

    } finally {
      await driver.quit();
      console.log('Semua test case CRUD berhasil di jalankan.');
    }
  }
  
  if (require.main === module) {
    runTests();
  }
  