const puppeteer = require('puppeteer');
const $ = require('cheerio');
const CronJob = require('cron').CronJob;
const nodemailer = require('nodemailer');
const axios = require('axios');
require('dotenv').config();

//const url = 'https://www.amazon.com/Mechanical-Keyboard-Bluetooth-Wireless-Multi-Device/dp/B07FZVCH4H/ref=sr_1_1?dchild=1&keywords=60%25+mechanical+keyboard&qid=1587615183&sr=8-1';


/**
 * This function begins the tracking software for a given item
 * It is in the "module.exports" so that another file can access it
 */
module.exports = {
    startTracking: async function () {
        let job = new CronJob('*/15 * * * * *', function () { //runs every 15 sec in this config
            axios.get("http://localhost:5000/info")
                .then(res => {
                    console.log("retrieved information for scraper file");
                    console.log(res.data)
                    for (var i = 0; i < res.data.length; i++) {
                        singularStartTracking(res.data[i])
                    }
                })
                .catch(err => console.log(err));
        }, null, true, null, null, true);
    }
}

/**
 * This sets up the browser using the puppeteer dependency which accesses the link for the website that tracks prices
 */
async function configureBrowser(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    return page;
}

/**
 * this function is needed to start the price checking of each individual product since "await configureBrowser" 
 * cannot be called inside the for loop
 */
async function singularStartTracking(info){
    const page = await configureBrowser(info.url);
    checkPrice(page, info);
}

/**
 *  This function checks the price of the item and sees if it is less than what the user requested
 */
async function checkPrice(page, info) {
    //console.log("in checking price")
    await page.reload(); //makes it so that page doesn't reload every second
    let html = await page.evaluate(() => document.body.innerHTML);

    $('#priceblock_ourprice', html).each(function () {
        let dollarPrice = $(this).text();
        var currentPrice = Number(dollarPrice.replace(/[^0-9.-]+/g, ""));
        console.log(currentPrice);

        if (currentPrice < info.minPrice) { //insert values from db
            console.log("buy this at a price of " + dollarPrice);
            sendNotification(currentPrice, info);
        }
    })
}

/**
 * This function will send an email to the user telling them that the item is less than what they requested in price
 */
async function sendNotification(price, userInfo) {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
        }
    });

    let textToSend = 'Price dropped to ' + price;
    let htmlText = `<a href=\"${userInfo.url}\">Link</a>`;

    let info = await transporter.sendMail({
        from: '"Price Tracker" <' + process.env.EMAIL_USER + '>',
        to: userInfo.user,
        subject: 'Price dropped to ' + price,
        text: textToSend,
        html: htmlText
    });

    console.log("Message sent with id: %s", info.messageId);
    console.log("user id: " + userInfo._id);

    let url = "http://localhost:5000/info/" + userInfo._id
    console.log(url);
    
    axios.delete(url)
        .then(res => {
            console.log(res.data);
        })
        //.catch(err => console.log(err));
    


}
