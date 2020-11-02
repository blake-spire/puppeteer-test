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

  // set the content, wait for DOM loaded

  try {
    // set auth token
    await Promise.all([
      await page.evaluateOnNewDocument(token => {
        localStorage.clear();
        localStorage.setItem("token: ", token);
      }, process.env.TOKEN),
      await page.setExtraHTTPHeaders({ authorization: process.env.TOKEN }),
    ]);
    await page.goto("http://localhost:3000/map", { waitUntil: "load" });

    await page.screenshot({ path: "screenshot.png" });
    await browser.close();
  } catch (error) {
    console.log("error", error);
    await browser.close();
  }
});
