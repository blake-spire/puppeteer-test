const puppeteer = require("puppeteer");
const puppeteerOptions = {
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
  TZ: "Australia/Melbourne",
};

puppeteer.launch(puppeteerOptions).then(async browser => {
  const page = await browser.newPage();

  // setup logging
  function logError(err) {
    return console.log("\n-------- page error --------\n", err.message);
  }

  page.on("console", async msg => {
    for (let i = 0; i < msg.args().length; i++) {
      const message = await msg.args()[i].jsonValue();
      console.log(`puppeteer message ${i}: `, message);
    }
  });
  page.on("error", err => logError(err));
  page.on("pageerror", err => logError(err));

  // set the content, wait for DOM loaded

  await page.goto("http://localhost:3001");
  await page.screenshot({ path: "screenshot.png" });
  await browser.close();
});
