import puppeteer from "puppeteer";

const CONFIG = {
  url: "https://www.goodreads.com/choiceawards/best-books-2020",
  bookLimit: 5,
  timeout: 2000,
  headless: false
};

const SELECTORS = {
  viewResultsButton: ".gcaButton--masthead",
  modalCloseButton: ".modal__close button",
  bookImages: ".pollAnswer__bookLink img"
};

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const closeModal = async (page) => {
  await page.evaluate((selector) => {
    document.querySelector(selector)?.click();
  }, SELECTORS.modalCloseButton);
};

const extractBookInfo = async (page, limit) => {
  return await page.$$eval(
    SELECTORS.bookImages,
    (imgs, limit) => {
      const books = imgs.slice(0, limit);
      return books.map(img => {
        const [title, author] = img.alt.split(" by ");
        return { title, author };
      });
    },
    limit
  );
};

const scrapeGoodreadsBooks = async () => {
  const browser = await puppeteer.launch({ headless: CONFIG.headless });
  const context = await browser.createBrowserContext();

  try {
    const page = await context.newPage();
    await page.goto(CONFIG.url, { waitUntil: "load" });

    await page.waitForSelector(SELECTORS.viewResultsButton);
    await page.click(SELECTORS.viewResultsButton);
    await delay(CONFIG.timeout);

    await closeModal(page);
    await delay(CONFIG.timeout);

    const bookInfo = await extractBookInfo(page, CONFIG.bookLimit);
    console.log(bookInfo);

    return bookInfo;
  } finally {
    await context.close();
    await browser.close();
  }
};

scrapeGoodreadsBooks().catch(console.error);