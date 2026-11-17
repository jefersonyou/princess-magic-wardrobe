import {readdir,readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
async function walk(dir){const entries=await readdir(dir,{withFileTypes:true});return (await Promise.all(entries.map(async e=>e.isDirectory()?walk(`${dir}/${e.name}`):`${dir}/${e.name}`))).flat()}
const paths=(await walk('dist')).filter(p=>!p.includes('phase0-legacy')&&!p.endsWith('/sw.js')&&!p.includes('/phase0/'));
const hash=createHash('sha256');for(const path of paths.sort())hash.update(await readFile(path));
const version=hash.digest('hex').slice(0,12);
await writeFile('dist/sw.js',`const CACHE='princess-install-${version}';const FILES=${JSON.stringify(['./',...paths.map(p=>'./'+p.slice(5))])};
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES.map(url=>new Request(url,{cache:'reload'})))).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil((async()=>{for(const key of await caches.keys()){if(key!==CACHE&&(key.startsWith('princess-install-')||key==='wardrobe-v1'))await caches.delete(key)}await self.clients.claim()})()));
self.addEventListener('message',e=>{if(e.data==='CHECK_READY')e.ports[0]?.postMessage('OFFLINE_READY')});
self.addEventListener('fetch',e=>{if(e.request.method!=='GET'||new URL(e.request.url).origin!==self.location.origin)return;e.respondWith((async()=>{if(e.request.mode==='navigate'){try{const response=await fetch(e.request);if(response.ok)return response}catch{}}const cached=await caches.match(e.request,{ignoreSearch:true,ignoreVary:true});if(cached)return cached;try{return await fetch(e.request)}catch(error){if(e.request.mode==='navigate')return await caches.match(new URL('./',self.registration.scope));throw error}})())});`);
console.log(`PWA precached ${paths.length} files: ${version}`);
