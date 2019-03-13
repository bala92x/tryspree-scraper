require('dotenv').config();
const PORT = process.env.port || 4444;

const Service = require('node-windows').Service;
const cron = require('node-cron');
const express = require('express');

const { checkForNewDeal } = require('./src/dealController');


var svc = new Service({
    name: 'Tryspree Scraper',
    description: 'Node.js app to scrape new deals form tryspree.com, and send a notification in email.',
    script: process.env.PATH_TO_START_SCRIPT,
    nodeOptions: [
        '--max_old_space_size=4096'
    ]
});

svc.on('install', function () {
    svc.start();
});

svc.install();

const app = express();

checkForNewDeal().catch(console.error);

cron.schedule('*/5 * * * *', () => {
    checkForNewDeal().catch(console.error);
});

app.listen(PORT, () => {
    console.log(`Listening on ${PORT}`);
})