const puppeteer = require('puppeteer');
const $ = require('cheerio');
const CronJob = require('cron').CronJob;
const nodemailer = require('nodemailer');
const axios = require('axios');
require('dotenv').config();

//const url = 'https://www.amazon.com/Mechanical-Keyboard-Bluetooth-Wireless-Multi-Device/dp/B07FZVCH4H/ref=sr_1_1?dchild=1&keywords=60%25+mechanical+keyboard&qid=1587615183&sr=8-1';

module.exports = {
    startTracking: async function (adminLogin, adminPwd, info) {
        console.log(info.url);
        const page = await configureBrowser(info.url);
        let job = new CronJob('*/15 * * * * *', function () { //runs every 15 sec in this config
            checkPrice(page, adminLogin, adminPwd, info);
        }, null, true, null, null, true);
        job.start();

    }
}


async function configureBrowser(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    return page;
}

async function checkPrice(page, adminLogin, adminPwd, info) {
    //console.log("in checking price")
    await page.reload(); //makes it so that page doesn't reload every second
    let html = await page.evaluate(() => document.body.innerHTML);

    $('#priceblock_ourprice', html).each(function () {
        let dollarPrice = $(this).text();
        var currentPrice = Number(dollarPrice.replace(/[^0-9.-]+/g, ""));
        console.log(currentPrice);

        if (currentPrice < 100) { //insert values from db
            console.log("buy this at a price of " + dollarPrice);
            sendNotification(currentPrice, adminLogin, adminPwd, info);
        }
    })
}

async function sendNotification(price, adminLogin, adminPwd, userInfo) {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            //user: String(adminLogin),
            //pass: String(adminPwd)

            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,

            //user: "saimm.ahmadd@gmail.com",
        }
    });

    let textToSend = 'Price dropped to ' + price;
    let htmlText = `<a href=\"${userInfo.url}\">Link</a>`;

    let info = await transporter.sendMail({
        from: '"Price Tracker" <' + adminLogin + '>',
        to: userInfo.user,
        subject: 'Price dropped to ' + price,
        text: textToSend,
        html: htmlText
    });

    console.log("Message sent: %s", info.messageId);
    console.log(userInfo._id);

    let url = "http://localhost:6000/info/" + userInfo._id
    console.log(url);
    axios.delete(url)
        .then(res => {
            console.log(res.data);
        })
        //.catch(err => console.log(err));


}


//startTracking();