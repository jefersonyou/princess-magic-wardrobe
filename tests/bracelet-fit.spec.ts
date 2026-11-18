import {test,expect} from '@playwright/test';
import {ids,garments,anchors} from '../src/phase0/rig';
import {visualY} from '../src/proportions';
test('all eight bracelets follow the wrist in relaxed, raised and coat poses',async({page})=>{
 test.setTimeout(240000);await page.addInitScript(all=>localStorage.setItem('joy-story-v2',JSON.stringify({stage:5,step:3,complete:true,cleared:[0,1,2,3,4,5],learned:[],unlocked:all,partial:[]})),ids);const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));await page.goto('/');await expect(page.locator('#character')).toHaveAttribute('data-ready','true');
 async function wear(id:string){const b=page.locator(`[data-item="${id}"]`);await b.scrollIntoViewIfNeeded();const r=(await b.boundingBox())!,c=(await page.locator('canvas').boundingBox())!,[x,y]=anchors[garments[id].anchor];await page.mouse.move(r.x+r.width/2,r.y+r.height/2);await page.mouse.down();const target=(await page.locator('#character').getAttribute('data-drop-anchor'))!.split(',').map(Number);await page.mouse.move(c.x+target[0]*c.width/280,c.y+target[1]*c.height/440,{steps:3});await page.mouse.up();await expect(page.locator('#character')).toHaveAttribute('data-worn',new RegExp(`(^|,)${id}(,|$)`));await page.waitForTimeout(1100)}
 const bracelets=ids.filter(id=>garments[id].slot==='wrist');expect(bracelets).toHaveLength(8);
 for(const pose of ['relaxed','raised','coat']){
  await page.locator('#reset').click();await wear(pose==='coat'?'raincoat':'rose');if(pose!=='relaxed'){await wear('umbrella');await wear('fashionGloves4')}
  for(const id of bracelets){
   const existing=page.locator('#worn-items button').filter({hasText:/팔찌/});if(await existing.count())await existing.click();await page.waitForTimeout(100);
   const target=await page.locator('canvas').evaluate(async(c,pose)=>{const p='/src/proportions.ts',g='/src/glove-fit.ts';const {canonicalFrame}=await import(p),{findWrist}=await import(g);const image=canonicalFrame(c as HTMLCanvasElement),ctx=image.getContext('2d')!;(window as any).__braceletBefore=ctx.getImageData(0,0,image.width,image.height);const w=pose==='relaxed'?findWrist(image,1):pose==='coat'?{x:179,y:143,dx:.45,dy:-.893}:{x:218,y:183,dx:.65,dy:-.76};return {x:w.x-w.dx*3,y:w.y-w.dy*3}},pose);
   await wear(id);
   const center=await page.locator('canvas').evaluate(async c=>{const p='/src/proportions.ts';const {canonicalFrame}=await import(p);const image=canonicalFrame(c as HTMLCanvasElement),after=image.getContext('2d')!.getImageData(0,0,image.width,image.height),before=(window as any).__braceletBefore;let x=0,y=0,n=0;for(let yy=0;yy<image.height;yy++)for(let xx=0;xx<image.width;xx++){const k=(yy*image.width+xx)*4;if(Math.max(...[0,1,2,3].map(i=>Math.abs(after.data[k+i]-before.data[k+i])))>35){x+=xx;y+=yy;n++}}return {x:x/n*280/image.width,y:y/n*440/image.height,n}});expect(center.n,id+' bracelet visible').toBeGreaterThan(10);expect(Math.hypot(center.x-target.x,center.y-target.y),id+' '+pose+' wrist distance').toBeLessThan(8);
  }
 }
 await page.locator('#photo-time').click();await expect(page.locator('#photo-preview')).toHaveJSProperty('naturalWidth',1600);expect(errors).toEqual([]);
});
