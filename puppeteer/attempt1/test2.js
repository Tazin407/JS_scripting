// Goal: Scrape the top 10 books from Goodreads "Best Books of the Year" page
import puppeteer from "puppeteer";

const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
});
const context = await browser.createBrowserContext();

try{
    const page = await context.newPage();
    await page.goto("https://www.goodreads.com/choiceawards/best-books-2020", {
        waitUntil: 'load'
    });
    await new Promise(resolve => setTimeout(resolve, 2000));
    await page.screenshot({ path: "debug.png", fullPage: true });
    // <a class="gcaButton gcaButton--masthead gcaButton--tall" href="/choiceawards/best-fiction-books-2020">View results</a>
    await page.waitForSelector('.gcaButton--masthead');
    await page.click('.gcaButton--masthead');
    console.log("Hello");
    await new Promise(resolve => setTimeout(resolve, 2000));

    // await page.click('.modal__close .gr-iconButton button');
    await page.evaluate(() => {
        document.querySelector('.modal__close button').click();
    });
    await new Promise(resolve => setTimeout(resolve, 2000));

    const bookInfo = await page.$$eval(".pollAnswer__bookLink img", (imgs,limit)=>{
        const books = imgs.slice(0,limit);
        return books.map(img => {
        const [title, author] = img.alt.split(' by ');
        return {
            title: title,
            author: author
        };
    });
}, 5);


    console.log(bookInfo);
    // await page.screenshot({
    //     path: "ss.png"
    // })


}
finally{
    await context.close();
    await browser.close();

}