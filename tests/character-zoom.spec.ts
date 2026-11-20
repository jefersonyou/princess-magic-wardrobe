import {test,expect} from '@playwright/test';
import {friendPoint} from '../src/character-fit';

test('friend landmarks preserve Joy head scale and eye/chin positions',()=>{
 for(const eye of [268,269,270]){
  expect(friendPoint(eye,326,eye)[0]).toBe(138);
  expect(friendPoint(eye,326,eye)[1]).toBe(69);
  expect(friendPoint(eye,485,eye)[1]).toBeCloseTo(97.62);
  expect(friendPoint(eye,20,eye)[1]).toBeGreaterThan(28);
 }
});

test('character zoom controls enlarge/shrink cleanly, support dressing while zoomed, and unify friend picker portraits with bodies',async({page})=>{
 test.setTimeout(120000);
 const errors:string[]=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/');
 await expect(page.locator('#character')).toHaveAttribute('data-ready','true');

 // 1. Verify 4 character portraits in picker all render unified body-included images with identical natural dimensions
 await page.locator('#character-picker-open').click();
 const imgs=page.locator('#character-picker .character-options img');
 await expect(imgs).toHaveCount(4);
 const dims=await imgs.evaluateAll(list=>list.map(el=>({w:(el as HTMLImageElement).naturalWidth,h:(el as HTMLImageElement).naturalHeight,src:(el as HTMLImageElement).src.slice(0,22)})));
 for(const d of dims){
  expect(d.w).toBe(304);
  expect(d.h).toBe(404);
  expect(d.src).toBe('data:image/png;base64,');
 }
 await page.locator('#close-character-picker').click();

 // 2. Verify zoom controls: 100% -> 125% -> 150% -> 175% -> 200% -> 100% -> 85%
 const baseBox=(await page.locator('#character canvas').boundingBox())!;
 await expect(page.locator('#zoom-reset')).toHaveText('100%');
 await page.locator('#zoom-in').click();
 await expect(page.locator('#zoom-reset')).toHaveText('125%');
 await page.locator('#zoom-in').click();
 await expect(page.locator('#zoom-reset')).toHaveText('150%');
 await page.waitForTimeout(150);
 const zoomedBox=(await page.locator('#character canvas').boundingBox())!;
 expect(zoomedBox.width/baseBox.width).toBeCloseTo(1.5,1);

 // 3. Verify dressing works while zoomed at 150%
 const card=page.locator('[data-item="crown"]');
 await card.scrollIntoViewIfNeeded();
 const r=(await card.locator('.item-art').boundingBox())!;
 const c=(await page.locator('#character canvas').boundingBox())!;
 await page.mouse.move(r.x+r.width/2,r.y+r.height/2);
 await page.mouse.down();
 const target=(await page.locator('#character').getAttribute('data-drop-anchor'))!.split(',').map(Number);
 await page.mouse.move(c.x+target[0]*c.width/280,c.y+target[1]*c.height/440,{steps:4});
 await page.mouse.up();
 await expect(page.locator('#character')).toHaveAttribute('data-worn',/crown/);

 // 4. Verify max zoom disables + and reset restores 100%
 await page.locator('#zoom-in').click();
 await page.locator('#zoom-in').click();
 await expect(page.locator('#zoom-reset')).toHaveText('200%');
 await expect(page.locator('#zoom-in')).toBeDisabled();
 await page.locator('#zoom-reset').click();
 await expect(page.locator('#zoom-reset')).toHaveText('100%');
 await page.locator('#zoom-out').click();
 await expect(page.locator('#zoom-reset')).toHaveText('85%');
 await expect(page.locator('#zoom-out')).toBeDisabled();
 expect(errors).toEqual([]);
});
