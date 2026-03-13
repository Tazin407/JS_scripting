import puppeteer from "puppeteer";

const browser = await puppeteer.launch({headless: false});

try{
    console.log("Hello");
    const page = await browser.newPage();
    await page.goto("https://www.facebook.com/", {
        waitUntil: 'load',
    });
    // await page.waitForSelector('body', {visible : true});
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    await page.screenshot({
      path: 'hn.png',
    });
}
finally{

    await browser.close();
}