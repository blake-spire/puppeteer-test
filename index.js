const puppeteer = require("puppeteer");
const puppeteerOptions = {
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
};

puppeteer.launch(puppeteerOptions).then(async browser => {
  const page = await browser.newPage();

  // setup logging
  function logError(err) {
    return console.log("Puppeteer error: ", err.message);
  }

  page.on("console", async msg => {
    for (let i = 0; i < msg.args().length; i++) {
      const message = await msg.args()[i].jsonValue();
      console.log(`Puppeteer message ${i}: `, message);
    }
  });
  page.on("error", err => logError(err));
  page.on("pageerror", err => logError(err));

  try {
    // set auth token
    await Promise.all([
      await page.evaluateOnNewDocument(token => {
        localStorage.clear();
        localStorage.setItem("token", token);
      }, process.env.TOKEN),
      await page.setExtraHTTPHeaders({ authorization: process.env.TOKEN }),
    ]);
    await page.goto(
      `http://localhost:3000/map?screenshotRiver={"id":"110","center":"[-105.25707723059739,40.417561591450266]"}`,
      { waitUntil: "networkidle2" }
    );

    await page.waitForSelector("#screenshot-ready");

    // await page.waitForTimeout(30000);
    await page.screenshot({
      path: `screenshot-${new Date().toISOString()}.png`,
    });
    await browser.close();
  } catch (error) {
    console.log("error", error);
    await browser.close();
  }
});
