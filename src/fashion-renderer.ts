import type Phaser from 'phaser';
import {fashionAtlases,fashionFrames as frames} from './fashion';
function make(){const c=document.createElement('canvas');c.width=560;c.height=880;const ctx=c.getContext('2d')!;ctx.scale(2,2);return {c,ctx}}
export function prepareFashion(scene:Phaser.Scene){
 const ears=scene.textures.get('fashionEars').getSourceImage() as HTMLImageElement;
 for(let i=0;i<20;i++){const {c,ctx}=make();for(let side=0;side<2;side++){const f=frames.earrings.halves[i][side];const h=i===3?14:11,w=Math.min(9,h*f[2]/f[3]);ctx.drawImage(ears,f[0],f[1],f[2],f[3],(side===0?106:174)-w/2,81,w,h)}scene.textures.addCanvas('worn-earring'+i,c)}
 const eyes=scene.textures.get('fashionEyes').getSourceImage() as HTMLImageElement;
 for(let i=0;i<10;i++){const {c,ctx}=make(),f=frames.sunglasses.frames[i];const w=[58,57,60,57,59,58,60,56,57,58][i],h=w*f[3]/f[2];ctx.drawImage(eyes,f[0],f[1],f[2],f[3],140-w/2,70-h*.63,w,h);scene.textures.addCanvas('worn-sunglass'+i,c)}
 // The original beach sunglasses use the same detailed round frame and face fit.
 {const {c,ctx}=make();const f=frames.sunglasses.frames[3],w=57,h=w*f[3]/f[2];ctx.drawImage(eyes,f[0],f[1],f[2],f[3],140-w/2,70-h*.63,w,h);scene.textures.addCanvas('worn-sunglasses',c)}
 const hands=scene.textures.get('fashionHands').getSourceImage() as HTMLImageElement;
 const gripping=scene.textures.get('fashionGrip').getSourceImage() as HTMLImageElement;
 for(let i=0;i<10;i++){
  for(const pose of ['normal','umbrella','coat'] as const){const {c,ctx}=make();const f=frames.gloves.halves[i][0];const target=pose==='coat'?[69,217,22,37]:[41,222,30,42];ctx.drawImage(hands,f[0],f[1],f[2],f[3],target[0],target[1],target[2],target[3]);
   if(pose==='normal'){const r=frames.gloves.halves[i][1];ctx.drawImage(hands,r[0],r[1],r[2],r[3],209,222,30,42)}else{const r=frames['gloves-grip'].frames[i];const x=pose==='coat'?182:222,y=pose==='coat'?132:172;const left=x-18*(frames['gloves-grip'].shafts[i]-r[0])/r[2];ctx.drawImage(gripping,r[0],r[1],r[2],r[3],left,y-10,18,30)}
   scene.textures.addCanvas('worn-fashionGloves'+i+(pose==='normal'?'':'-'+pose),c)
  }
 }
}
