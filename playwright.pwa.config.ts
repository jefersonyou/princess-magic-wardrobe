import {defineConfig} from '@playwright/test';
export default defineConfig({testDir:'./tests-pwa',use:{baseURL:'http://127.0.0.1:4173',viewport:{width:1194,height:834},deviceScaleFactor:2,hasTouch:true,launchOptions:{executablePath:'/usr/bin/chromium',args:['--no-sandbox']}},webServer:{command:'npm run preview -- --port 4173',url:'http://127.0.0.1:4173',reuseExistingServer:true}});
