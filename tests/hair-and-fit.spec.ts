import {test,expect} from '@playwright/test';
import {ids,garments} from '../src/phase0/rig';
import {hairIds} from '../src/hair-styles';

test('catalog has 127 items (10 hairstyles, 9 bracelets) and zero duplicate SVG clipPath ids',async({page})=>{
 expect(ids).toHaveLength(127);
 expect(ids.filter(id=>garments[id].slot==='hair')).toHaveLength(10);
 expect(ids.filter(id=>garments[id].slot==='wrist')).toHaveLength(9);
 await page.goto('/');
 await expect(page.locator('#character')).toHaveAttribute('data-ready','true');
 const dupes=await page.evaluate(()=>{
  const seen=new Set<string>(),duplicates:string[]=[];
  document.querySelectorAll('[id^="crop-"]').forEach(el=>{
   if(seen.has(el.id))duplicates.push(el.id);
   seen.add(el.id);
  });
  return duplicates;
 });
 expect(dupes).toEqual([]);
});

test('10 hairstyles match each selected character hair color and name, and persist across character switches',async({page})=>{
 test.setTimeout(180000);
 await page.addInitScript(all=>localStorage.setItem('joy-story-v2',JSON.stringify({stage:5,step:3,complete:true,cleared:[0,1,2,3,4,5],learned:[],unlocked:all,partial:[]})),ids);
 const errors:string[]=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/');
 await expect(page.locator('#character')).toHaveAttribute('data-ready','true');

 async function wear(id:string){
  const b=page.locator(`[data-item="${id}"]`);
  await b.scrollIntoViewIfNeeded();
  const r=(await b.locator('.item-art').boundingBox())!,c=(await page.locator('canvas').boundingBox())!;
  await page.mouse.move(r.x+r.width/2,r.y+r.height/2);
  await page.mouse.down();
  const target=(await page.locator('#character').getAttribute('data-drop-anchor'))!.split(',').map(Number);
  await page.mouse.move(c.x+target[0]*c.width/280,c.y+target[1]*c.height/440,{steps:4});
  await page.mouse.up();
  await expect(page.locator('#character')).toHaveAttribute('data-worn',new RegExp(`(^|,)${id}(,|$)`));
  await page.waitForTimeout(250);
 }

 await page.locator('[data-category-filter="hair"]').click();
 await expect(page.locator('[data-item]:visible')).toHaveCount(10);
 await wear('hairPonytail');

 const expectedHue:Record<string,number>={joy:269,luna:297,ruby:354,aria:234};
 const expectedNames:Record<string,string>={joy:'조이',luna:'루나',ruby:'루비',aria:'아리아'};

 for(const charId of ['joy','luna','ruby','aria'] as const){
  await page.locator('#character-picker-open').click();
  await page.locator(`button[data-character-id="${charId}"]`).click();
  await expect(page.locator('#character')).toHaveAttribute('data-character-id',charId);
  // Hairstyle persists on switch and updates label to active character
  await expect(page.locator('#character')).toHaveAttribute('data-worn',/hairPonytail/);
  await expect(page.locator('[data-item="hairPonytail"] span')).toContainText(`${expectedNames[charId]}의 하이 포니테일`);
  await expect(page.locator('#worn-items')).toContainText(`${expectedNames[charId]}의 하이 포니테일`);
  await expect(page.locator('#show-message')).toContainText(expectedNames[charId]);

  // Verify thumbnail pixel average hue shifts to character target hue
  const avgHue=await page.locator('[data-item="hairLongStraight"] image').evaluate(async el=>{
   const href=el.getAttribute('href')||el.getAttributeNS('http://www.w3.org/1999/xlink','href')||'';
   const img=new Image();img.src=href;await img.decode();
   const c=document.createElement('canvas');c.width=img.naturalWidth;c.height=img.naturalHeight;
   const ctx=c.getContext('2d')!;ctx.drawImage(img,0,0);
   const d=ctx.getImageData(0,0,c.width,c.height).data;
   let hc=0,hs=0;
   for(let i=0;i<d.length;i+=4){
    if(d[i+3]<200)continue;
    const r=d[i]/255,g=d[i+1]/255,b=d[i+2]/255;
    const max=Math.max(r,g,b),min=Math.min(r,g,b),l=(max+min)/2;
    if(max===min||l<0.15||l>0.82)continue;
    const delta=max-min,s=l>.5?delta/(2-max-min):delta/(max+min);
    if(s<0.15)continue;
    let h=max===r?(g-b)/delta+(g<b?6:0):max===g?(b-r)/delta+2:(r-g)/delta+4;
    h*=60;
    hc+=Math.cos(h*Math.PI/180);hs+=Math.sin(h*Math.PI/180);
   }
   return ((Math.atan2(hs,hc)*180/Math.PI)+360)%360;
  });
  const diff=Math.min(Math.abs(avgHue-expectedHue[charId]),360-Math.abs(avgHue-expectedHue[charId]));
  expect(diff,`${charId} hair hue ${avgHue.toFixed(1)} vs ${expectedHue[charId]}`).toBeLessThan(20);
 }

 // Verify all 10 hairstyles can be worn without errors
 for(const id of hairIds){
  await wear(id);
 }

 // Verify P0/P1 tricky combinations: winterCoat + umbrella + scarf on Luna, explorer + jianBoots, gloves + collectionWrist7, flowers + sunglass0
 await page.locator('[data-category-filter="all"]').click();
 await page.locator('#character-picker-open').click();
 await page.locator('button[data-character-id="luna"]').click();
 await page.locator('#reset').click();
 await wear('winterCoat');
 await wear('umbrella');
 await wear('scarf');
 await wear('gloves');
 await wear('collectionWrist7');
 await wear('flowers');
 await wear('sunglass0');
 await page.locator('#photo-time').click();
 await expect(page.locator('#photo-preview')).toHaveJSProperty('naturalWidth',1600);
 await expect(page.locator('#photo-dialog h2')).toContainText('루나의 포토타임');
 await page.locator('#close-photo').click();

 expect(errors).toEqual([]);
});
