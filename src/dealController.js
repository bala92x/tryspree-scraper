const fs = require('fs');
const puppeteer = require('puppeteer');

const sendMail = require('./sendMail');

const url = 'https://www.tryspree.com/';

const getLastDeal = async (url) => {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(url);
    
        const lastDeal = await page.$$eval('div.deal-entry div.title', deals => {
            return deals[0].innerHTML;
        })

        await browser.close();
    
        return lastDeal;
    } catch (err) {
        console.log('Cannot get last deal:', err);
    }
}

const getPreviousDeal = () => {
    try {
        const previousDealJSON = fs.readFileSync('previous-deal.json');
        let previousDeal = {}

        if (previousDealJSON.length > 0) {
            previousDeal = JSON.parse(previousDealJSON).lastDeal;
        }

       return previousDeal;
    } catch (err) {
        console.log('Cannot read previous-deal.json:', err);
    }
};

const appendHostToUrl = (deal) => {
    const host = 'https://www.tryspree.com';
    const splitDeal = deal.split('/products');
    splitDeal[0] += host;
    const appendedDeal = splitDeal.join('/products');

    return appendedDeal;
};

const checkForNewDeal = async () => {
    try {
        const lastDeal = await getLastDeal(url);
        const previousDeal = await getPreviousDeal();
        const isNewDeal = lastDeal !== previousDeal;

        if (isNewDeal) {
            console.log('New deal on board!');
            
            const newDeal = JSON.stringify({lastDeal});

            fs.writeFile('previous-deal.json', newDeal, (err) => {
                if (err) {
                    console.log('Cannot write file previous-deal.json', err);
                } else {
                    console.log('Deal saved to file!');
                    sendMail(appendHostToUrl(lastDeal));                }
            });
        } else {
            console.log('Nothing new', new Date());
        }
    } catch (err) {
        console.log('Cannot check for new deal:', err);
    }
};

module.exports = { checkForNewDeal };