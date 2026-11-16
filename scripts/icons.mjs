import {chromium} from '@playwright/test';
import {mkdir,readFile} from 'node:fs/promises';
await mkdir('public/icons',{recursive:true});
const bytes=await readFile('public/icons/joy-face-source.png');
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});
for(const size of [180,192,512]){const page=await browser.newPage({viewport:{width:size,height:size},deviceScaleFactor:1});await page.setContent(`<style>*{margin:0}img{width:100vw;height:100vh;display:block}</style><img src="data:image/png;base64,${bytes.toString('base64')}">`);await page.locator('img').evaluate(i=>i.decode());await page.screenshot({path:`public/icons/${size===180?'apple-touch-icon':`icon-${size}`}.png`});await page.close()}
await browser.close();
