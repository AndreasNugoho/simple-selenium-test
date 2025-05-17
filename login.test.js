const { Builder, By, until } = require('selenium-webdriver');

// set driver google chrome
async function setupDriver() {
  return await new Builder().forBrowser('chrome').build();
}

// test login sukses dengan user dan password benar 
async function testLoginSuccess(driver) {
  try {
    console.log('============ Test login user -> login sukses ============');
    await driver.get('http://localhost:5555/login.html');

    await driver.wait(until.elementLocated(By.id('username')), 5000);

    await driver.findElement(By.id('username')).sendKeys('alice');
    await driver.findElement(By.id('password')).sendKeys('12345');

    const form = await driver.findElement(By.id('loginForm'));
    await form.submit();

    await driver.wait(until.urlContains('index.html'), 5000);

    console.log('Login sukses');
  } catch (err) {
    console.error('Login sukses test failed:', err);
  }
}

// test login gagal dengan user yang salah
async function testLoginFailInvalidUsername(driver) {
  try {
    console.log('============ Test login user -> username salah ============');
    await driver.get('http://localhost:5555/login.html');

    await driver.wait(until.elementLocated(By.id('username')), 5000);

    await driver.findElement(By.id('username')).sendKeys('alice1');
    await driver.findElement(By.id('password')).sendKeys('12345');

    const form = await driver.findElement(By.id('loginForm'));
    await form.submit();

    await driver.wait(until.alertIsPresent(), 5000);

    let alert = await driver.switchTo().alert();
    const alertText = await alert.getText();
    await alert.accept();

    if (alertText.includes('Login gagal')) {
      console.log('Login gagal (Username Tidak sesuai) test passed');
    } else {
      console.error('Pesan error:', alertText);
    }
  } catch (err) {
    console.error('Login gagal (Username Tidak sesuai) test failed:', err);
  }
}

// test login gagal dengan password yang salah
async function testLoginFailInvalidPassword(driver) {
  try {
    console.log('============ Test login user -> password salah salah ============');
    await driver.get('http://localhost:5555/login.html');

    await driver.wait(until.elementLocated(By.id('username')), 5000);

    await driver.findElement(By.id('username')).sendKeys('alice');
    await driver.findElement(By.id('password')).sendKeys('andre123');

    const form = await driver.findElement(By.id('loginForm'));
    await form.submit();

    await driver.wait(until.alertIsPresent(), 5000);

    let alert = await driver.switchTo().alert();
    const alertText = await alert.getText();
    await alert.accept();

    if (alertText.includes('Login gagal')) {
      console.log('Login gagal (Password Tidak sesuai) test passed');
    } else {
      console.error('Pesan error:', alertText);
    }
  } catch (err) {
    console.error('Login gagal (Password Tidak sesuai) test failed:', err);
  }
}


async function runTests() {
  const driver = await setupDriver();
  try {
    // test login
    await testLoginSuccess(driver);
    await testLoginFailInvalidUsername(driver);
    await testLoginFailInvalidPassword(driver);

  } finally {
    await driver.quit();
    console.log('Semua test case login berhasil di jalankan.');
  }
}

if (require.main === module) {
  runTests();
}
