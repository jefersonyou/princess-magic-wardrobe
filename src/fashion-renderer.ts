import {mittenGrip} from './mitten-grip';
import type Phaser from 'phaser';
import {fashionFrames as frames} from './fashion';
import {findWrist,drawFittedGlove,eraseHand,type Wrist} from './glove-fit';
import {body} from './phase0/rig';
function make(){const c=document.createElement('canvas');c.width=560;c.height=880;const ctx=c.getContext('2d')!;ctx.scale(2,2);return {c,ctx}}
export function prepareFashion(scene:Phaser.Scene){
 const ears=scene.textures.get('fashionEars').getSourceImage() as HTMLImageElement;
 for(let i=0;i<20;i++){const {c,ctx}=make();for(let side=0;side<2;side++){const f=frames.earrings.halves[i][side];const h=i===3?11:8.5,w=Math.min(6.5,h*f[2]/f[3]);ctx.drawImage(ears,f[0],f[1],f[2],f[3],(side===0?114:166)-w/2,79.5,w,h)}scene.textures.addCanvas('worn-earring'+i,c)}
 const eyes=scene.textures.get('fashionEyes').getSourceImage() as HTMLImageElement;
 for(let i=0;i<10;i++){const {c,ctx}=make(),f=frames.sunglasses.frames[i];const w=[58,57,60,57,59,58,60,56,57,58][i],h=w*f[3]/f[2];ctx.drawImage(eyes,f[0],f[1],f[2],f[3],140-w/2,70-h*.63,w,h);scene.textures.addCanvas('worn-sunglass'+i,c)}
 // The original beach sunglasses use the same detailed round frame and face fit.
 {const {c,ctx}=make();const f=frames.sunglasses.frames[3],w=57,h=w*f[3]/f[2];ctx.drawImage(eyes,f[0],f[1],f[2],f[3],140-w/2,70-h*.63,w,h);scene.textures.addCanvas('worn-sunglasses',c)}
 // Preview and actual wear use the same wrist-based fitting.
 for(const id of ['gloves',...Array.from({length:10},(_,i)=>'fashionGloves'+i)])prepareGloveFit(scene,id,'rose',false);
}
function baseCanvas(scene:Phaser.Scene){const {c,ctx}=make();ctx.drawImage(scene.textures.get(body.atlas).getSourceImage() as HTMLImageElement,...body.frame,...body.position,...body.size);return c}
const wristCache=new WeakMap<Phaser.Scene,Map<string,[Wrist,Wrist]>>();
export function poseWrists(scene:Phaser.Scene,outfit:string|undefined,held:boolean):[Wrist,Wrist]{
 const coat=held&&(outfit==='raincoat'||outfit==='winterCoat'),sourceKey=coat?'holding-'+outfit:outfit?'worn-'+outfit:'base',key=sourceKey+(held?'-raised':'');
 let cache=wristCache.get(scene);if(!cache){cache=new Map();wristCache.set(scene,cache)}const found=cache.get(key);if(found)return found;
 const source=sourceKey==='base'?baseCanvas(scene):scene.textures.get(sourceKey).getSourceImage() as HTMLCanvasElement;
 const wrists:[Wrist,Wrist]=[findWrist(source,0),held?{x:coat?179:218,y:coat?143:183,dx:coat?.45:.65,dy:coat?-.893:-.76,width:9,length:24}:findWrist(source,1)];cache.set(key,wrists);return wrists;
}
function maskGrip(ctx:CanvasRenderingContext2D,coat:boolean){
 const x=coat?182:222,y=coat?132:172;
 ctx.save();ctx.globalCompositeOperation='destination-out';ctx.beginPath();ctx.ellipse(x,y-1,10,14,0,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.ellipse(x-3,y+10,6,7,-.5,0,Math.PI*2);ctx.fill();ctx.restore();
 // Keep the umbrella shaft continuous behind the closed fingers.
 const gold=ctx.createLinearGradient(x-2,0,x+2,0);gold.addColorStop(0,'#a9680c');gold.addColorStop(.45,'#ffe37b');gold.addColorStop(1,'#ad6c12');ctx.fillStyle=gold;ctx.fillRect(x-1.8,y-14,3.6,34);
}

type Fit={key:string;maskedKey:string;heldKey?:string;sourceKey:string;wrists:[Wrist,Wrist]};
const fitCache=new WeakMap<Phaser.Scene,Map<string,Fit>>();
export function prepareGloveFit(scene:Phaser.Scene,id:string,outfit:string|undefined,held:boolean,baseShoes=false):Fit{
 const coat=held&&(outfit==='raincoat'||outfit==='winterCoat');
 const sourceKey=coat?'holding-'+outfit:outfit?(held?'held-outfit-':'worn-')+outfit:held?'posed-body-base'+(baseShoes?'-shoes':''):baseShoes?'worn-body-base-shoes':'base';
 const key='fitted-'+id+'-'+sourceKey+(held?'-held':'');
 let cache=fitCache.get(scene);if(!cache){cache=new Map();fitCache.set(scene,cache)}const cached=cache.get(key);if(cached)return cached;
 const source=sourceKey==='base'?baseCanvas(scene):scene.textures.get(sourceKey).getSourceImage() as HTMLCanvasElement;
 const wrists=poseWrists(scene,outfit,held);
 const maskedKey='glove-skin-'+sourceKey+(held?'-held':'');
 if(!scene.textures.exists(maskedKey)){const {c,ctx}=make();ctx.drawImage(source,0,0,280,440);eraseHand(ctx,wrists[0]);if(!held)eraseHand(ctx,wrists[1]);else if(coat)maskGrip(ctx,true);scene.textures.addCanvas(maskedKey,c)}
 let heldKey:string|undefined;
 if(held&&!coat){heldKey='glove-holding-bare';if(!scene.textures.exists(heldKey)){const {c,ctx}=make();ctx.drawImage(scene.textures.get('holding-bare').getSourceImage() as HTMLCanvasElement,0,0,280,440);maskGrip(ctx,false);scene.textures.addCanvas(heldKey,c)}}
 const {c,ctx}=make(),winter=id==='gloves',i=winter?8:Number(id.replace('fashionGloves','')),hands=scene.textures.get(winter?'adventure':'fashionHands').getSourceImage() as HTMLImageElement;
 const mittenFrames=[[819,507,115,137],[983,507,115,138]] as const;
 for(const side of [0,1] as const){if(side===1&&held)continue;const f=winter?mittenFrames[side]:frames.gloves.halves[i][side];
  const custom=winter?{cuff:{x:side===0?76:36,y:26,width:65},angle:side===0?.36:-.36,length:110}:undefined;
  drawFittedGlove(ctx,hands,f,wrists[side],custom);
 }
 if(held){
  const grip=scene.textures.get(winter?'wornMittenGrip':'fashionGrip').getSourceImage() as HTMLImageElement;
  const r=winter?mittenGrip.frame:frames['gloves-grip'].frames[i],point=winter?mittenGrip.grip:frames['gloves-grip'].grips[i],shaft=coat?182:222,y=coat?132:172,height=27,width=height*r[2]/r[3];
  ctx.drawImage(grip,r[0],r[1],r[2],r[3],shaft-(point[0]-r[0])*width/r[2],y-(point[1]-r[1])*height/r[3],width,height);
 }
 scene.textures.addCanvas(key,c);
 if(outfit==='rose'&&!held)scene.textures.addCanvas('worn-'+id,c);
 const fit={key,maskedKey,heldKey,sourceKey,wrists};cache.set(key,fit);const transient=[...cache.keys()].filter(k=>!k.endsWith('-worn-rose'));while(transient.length>24){const old=transient.shift()!;cache.delete(old);scene.textures.remove(old)}return fit;
}
export function applyGloveFit(scene:Phaser.Scene,id:string,outfit:string|undefined,held:boolean,layers:Map<string,Phaser.GameObjects.Image>,bodyImage:Phaser.GameObjects.Image){
 const fit=prepareGloveFit(scene,id,outfit,held,!outfit&&bodyImage.texture.key.endsWith('base-shoes'));
 layers.get(id)!.setTexture(fit.key).setPosition(0,0).setDisplaySize(280,440).setDepth(65);
 if(fit.sourceKey.startsWith('holding-'))layers.get('umbrella')!.setTexture(fit.maskedKey);
 else if(outfit)layers.get(outfit)!.setTexture(fit.maskedKey);
 else bodyImage.setTexture(fit.maskedKey).setPosition(0,0).setDisplaySize(280,440);
 if(fit.heldKey)layers.get('umbrella')!.setTexture(fit.heldKey);
}

// The friends share a body, but their earlobes are at different head landmarks.
export function earringTexture(scene:Phaser.Scene,id:string,character='joy'){
 const positions:Record<string,readonly[number,number,number]>={joy:[114,166,79.5],luna:[110,174,81],ruby:[111,173,81],aria:[111,173,81]};
 if(character==='joy')return 'worn-'+id;
 const key='ear-fit-'+character+'-'+id;
 if(!scene.textures.exists(key)){
  const [left,right,y]=positions[character]||positions.joy,source=scene.textures.get('worn-'+id).getSourceImage() as HTMLCanvasElement,{c,ctx}=make();
  ctx.drawImage(source,0,0,280,880,left-114,y-79.5,140,440);
  ctx.drawImage(source,280,0,280,880,140+right-166,y-79.5,140,440);
  scene.textures.addCanvas(key,c);
 }
 return key;
}
