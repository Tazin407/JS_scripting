import puppeteer from "puppeteer";

const browser = await puppeteer.launch({
    headless: true
});  // Puppeteer started a controlled Chrome instance

const page = await browser.newPage(); // This creates a tab object

await page.goto("https://news.ycombinator.com/"); // Same as typing a URL

// const firstPost = await page.$(".titleLine a");

// const title = await firstPost.evaluate(el => el.textContent);
// const link = await firstPost.evaluate(el => el.href);

const firstPost = await page.$$eval(
    ".titleLine a", 
    (links, limit) => {
        return links.slice(0,limit).map(link => ({
            title: link.textContent,
            link: link.href
        }))
    }, 5)

console.log("Title:", firstPost.map(text=> text.title) ) ;
console.log("Link:", firstPost.link);

await browser.close();