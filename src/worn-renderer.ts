import {removeRestingArm} from './glove-fit';
import {applyBraceletFit} from './wrist-accessories';
import {prepareFashion,applyGloveFit} from './fashion-renderer';
import {fashionIds} from './fashion';
import Phaser from 'phaser';
import {body,garments,ids} from './phase0/rig';
const outfitIds=['dress','rose','starlight','picnic',...Array.from({length:16},(_,i)=>'collectionDress'+i),'raincoat','winterCoat','explorer','swimsuit'];
const shoeIds=['shoes','roseShoes','starShoes','boots',...Array.from({length:6},(_,i)=>'collectionShoes'+i),'sneakers','sandals'];
export const wornImages={wornFriends:new URL('../public/art/friends-heads.png',import.meta.url).href,wornMittenGrip:new URL('../public/art/fashion/mitten-grip.png',import.meta.url).href,wornArm:new URL('../public/art/worn/holding-arm.png',import.meta.url).href,wornJewels:new URL('../public/art/worn/jewelry.png',import.meta.url).href,worn1:new URL('../public/art/worn/outfits-1.png',import.meta.url).href,worn2:new URL('../public/art/worn/outfits-2.png',import.meta.url).href,worn3:new URL('../public/art/worn/outfits-3.png',import.meta.url).href,wornFeet:new URL('../public/art/worn/footwear.png',import.meta.url).href,wornHolding:new URL('../public/art/worn/holding.png',import.meta.url).href};
function canvas(){const c=document.createElement('canvas');c.width=560;c.height=880;return c}
function context(c:HTMLCanvasElement){const ctx=c.getContext('2d')!;ctx.scale(2,2);return ctx}
function bounds(source:HTMLImageElement,x:number,y:number,w:number,h:number){const c=document.createElement('canvas');c.width=w;c.height=h;const ctx=c.getContext('2d')!;ctx.drawImage(source,x,y,w,h,0,0,w,h);const d=ctx.getImageData(0,0,w,h);let l=w,t=h,r=0,b=0;for(let yy=0;yy<h;yy++)for(let xx=0;xx<w;xx++)if(d.data[(yy*w+xx)*4+3]>180){l=Math.min(l,xx);r=Math.max(r,xx);t=Math.min(t,yy);b=Math.max(b,yy)}return [x+l,y+t,r-l+1,b-t+1] as const}
export function prepareWorn(scene:Phaser.Scene){
 const skinCanvas=canvas(),skinCtx=context(skinCanvas);skinCtx.drawImage(scene.textures.get(body.atlas).getSourceImage() as HTMLImageElement,...body.frame,...body.position,...body.size);const skin=skinCtx.getImageData(0,0,560,880);
 const cleanShoeCalf=(ctx:CanvasRenderingContext2D,top:number)=>{const p=ctx.getImageData(0,0,560,880);for(let y=top*2;y<(top+9)*2;y++)for(let x=85*2;x<190*2;x++){const k=(y*560+x)*4,r=p.data[k],g=p.data[k+1],b=p.data[k+2];if(p.data[k+3]>0&&r>200&&g>145&&g<213&&b>115&&r>g+15&&g>b+8){if(skin.data[k+3]>150){for(let c=0;c<3;c++)p.data[k+c]=skin.data[k+c]}else p.data[k+3]=0}}ctx.putImageData(p,0,0)};
 const connectNeck=(ctx:CanvasRenderingContext2D)=>{
  const p=ctx.getImageData(0,0,560,880);
  for(let y=94*2;y<125*2;y++)for(let x=124*2;x<156*2;x++){
   const k=(y*560+x)*4,sr=skin.data[k],sg=skin.data[k+1],sb=skin.data[k+2];
   const baseSkin=skin.data[k+3]>100&&sr>sg*1.08&&sg>sb*1.06&&sb>sg*.65;
   const artworkSkin=p.data[k]>p.data[k+1]*1.08&&p.data[k+1]>p.data[k+2]*1.06&&p.data[k+2]>p.data[k+1]*.65;
   if(baseSkin&&(p.data[k+3]<100||artworkSkin)){
    for(let channel=0;channel<3;channel++)p.data[k+channel]=skin.data[k+channel];
    p.data[k+3]=Math.max(p.data[k+3],skin.data[k+3]);
   }
  }
  ctx.putImageData(p,0,0);
 };

 for(const [i,id]of outfitIds.entries()){const key='worn'+(Math.floor(i/8)+1),atlas=scene.textures.get(key).getSourceImage() as HTMLImageElement;const col=i%4,row=Math.floor(i%8/4);const centers=[[199,199,197],[197,199,197],[196,195.5,196],[195,197.5,196],[198,198.5,196.5],[197.5,197.5,195.5],[196.5,196.5,196.5],[195.5,196,198],[197.5,198.5,198],[196.5,197,197],[196,196.5,195.5],[195.5,196.5,197],[197,198,197.5],[196.5,197.5,198],[196.5,197,196.5],[196,197,197],[197,196,194.5],[195.5,195.5,193.5],[195.5,195,194],[195.5,195.5,194],[196.5,195,194],[196.5,196,196.5],[196,196,196],[196.5,196.5,196.5]][i];const source=document.createElement('canvas');source.width=384;source.height=512;const align=source.getContext('2d')!;for(let line=0;line<512;line++){const t=line<170?Math.max(0,Math.min(1,(line-36)/134)):Math.min(1,(line-170)/220);const center=line<170?centers[0]+(centers[1]-centers[0])*t:centers[1]+(centers[2]-centers[1])*t;align.drawImage(atlas,col*384,row*512+line,384,1,192-center,line,384,1)}const x=0,y=0;const c=canvas(),ctx=context(c);const hem=i<16?480:i<20?430:i===22?499:i===23?340:470;
 // One worn torso includes its own neck, sleeves, arms and hands. Align neck and waist independently of the hem.
 ctx.drawImage(source,x,y+26,384,150-26,43,97,194,79);
 ctx.drawImage(source,x,y+150,384,(hem<380?hem:330)-150,43,176,194,hem<380?139:91);
 if(hem>=380)ctx.drawImage(source,x,y+330,384,hem-330,43,267,194,(id==='explorer'?411:315)-267);
 ctx.save();ctx.globalCompositeOperation='destination-out';ctx.fillRect(0,0,280,98);ctx.restore();connectNeck(ctx);scene.textures.addCanvas('worn-'+id,c);const posed=canvas(),pc=context(posed);pc.drawImage(c,0,0,280,440);// The resting arm occupies a narrow strip outside the torso and skirt.
 removeRestingArm(pc);scene.textures.addCanvas('held-outfit-'+id,posed);
 }
 const jian=scene.textures.get('jian').getSourceImage() as HTMLImageElement;
 {const c=canvas(),ctx=context(c);
 ctx.drawImage(jian,0,7,768,213,0,98,280,78);
 ctx.drawImage(jian,0,220,768,140,0,176,280,84);
 ctx.drawImage(jian,0,360,768,160,0,260,280,55);
 connectNeck(ctx);scene.textures.addCanvas('worn-jianDress',c);
 const posed=canvas(),pc=context(posed);pc.drawImage(c,0,0,280,440);removeRestingArm(pc);scene.textures.addCanvas('held-outfit-jianDress',posed);}
 {const c=canvas(),ctx=context(c);ctx.drawImage(jian,970,160,373,225,157,46,31*373/405,19);scene.textures.addCanvas('worn-jianFlower',c);}
 {const c=canvas(),ctx=context(c);for(let i=0;i<2;i++)ctx.drawImage(jian,250+i*140,694,132,240,(i?164:114.5)-15,374,30,45);cleanShoeCalf(ctx,374);scene.textures.addCanvas('worn-jianBoots',c);}
 {const c=canvas(),ctx=context(c);for(let i=0;i<2;i++)ctx.drawImage(jian,970+i*192,670,188,205,(i?166:114)-3.5,79.5,7,9);scene.textures.addCanvas('worn-jianEarrings',c);}
 const source=scene.textures.get('wornFeet').getSourceImage() as HTMLImageElement;
 for(const [i,id]of shoeIds.entries()){const c=canvas(),ctx=context(c),col=i%4,row=Math.floor(i/4),y=Math.round(row*1024/3),h=Math.round((row+1)*1024/3)-y;for(let side=0;side<2;side++){const b=bounds(source,col*384+side*192,y,192,h);const boot=['boots','collectionShoes4'].includes(id);
const cut=boot?.28:.55,top=boot?374:385;ctx.drawImage(source,b[0],b[1]+b[3]*cut,b[2],b[3]*(1-cut),(side===0?114.5:164)-15,top,30,419-top)}cleanShoeCalf(ctx,['boots','collectionShoes4'].includes(id)?374:385);scene.textures.addCanvas('worn-'+id,c)}
 // Headwear from the atlas is fitted to the actual head rather than stretched
 // over the character's full body. This applies to free play and story mode.
 const headIds=['crown','tiara','flowers','bow',...Array.from({length:8},(_,i)=>'collectionHead'+i),'explorerHat','finalCrown'];
 for(const id of headIds){
  const g=garments[id],c=canvas(),ctx=context(c);
  const src=scene.textures.get(g.atlas).getSourceImage() as HTMLImageElement;
  const [sx,sy,sw,sh]=g.frame;
  const fit=id==='explorerHat'?{x:99,y:21,w:82,h:44}:
   id==='finalCrown'?{x:116,y:21,w:49,h:27}:
   id==='crown'?{x:115,y:20,w:51,h:33}:
   id==='tiara'?{x:114,y:22,w:53,h:36}:
   id==='flowers'?{x:104,y:29,w:73,h:52}:
   id==='bow'?{x:155,y:47,w:37,h:29}:
   id.startsWith('collectionHead')&&[3,4,5].includes(Number(id.slice(-1)))?
   {x:114,y:22,w:53,h:35}:{x:157,y:47,w:32,h:24};
  // Only the decorative front is visible when a clip or comb is in the hair.
  const cropX=id==='collectionHead0'?.83:id==='collectionHead7'?.76:1;
  const cropY=id==='collectionHead6'?.66:1;
  ctx.drawImage(src,sx,sy,sw*cropX,sh*cropY,fit.x,fit.y,fit.w*cropX,fit.h*cropY);
  if(id==='explorerHat'){
   const rear=canvas();rear.getContext('2d')!.drawImage(c,0,0);scene.textures.addCanvas('worn-back-explorerHat',rear);
   // The open underside goes behind the hair. Only the crown and near brim
   // pass in front, so the hat surrounds the head instead of covering it.
   ctx.save();ctx.globalCompositeOperation='destination-out';ctx.beginPath();ctx.ellipse(fit.x+fit.w*.5,fit.y+fit.h*.745,fit.w*.435,fit.h*.135,0,0,Math.PI*2);ctx.fill();ctx.restore();
  }
  scene.textures.addCanvas('worn-'+id,c);
 }
 prepareFashion(scene);
 const jewelry=scene.textures.get('wornJewels').getSourceImage() as HTMLImageElement;const jewelIds=['pendant','pearls',...Array.from({length:8},(_,i)=>'collectionNeck'+i),'bracelet',...Array.from({length:7},(_,i)=>'collectionWrist'+i),'scarf'];
 for(const [i,id]of jewelIds.entries()){const c=canvas(),ctx=context(c),x=Math.round(i%5*1254/5),y=Math.round(Math.floor(i/5)*1254/4);const b=bounds(jewelry,x,y,250,313);if(i<10)ctx.drawImage(jewelry,...b,126,110,28,23);else if(i<18)ctx.drawImage(jewelry,...b,209,225,17,9);else ctx.drawImage(jewelry,...b,122,108,36,51);scene.textures.addCanvas('worn-'+id,c);if(i>=10&&i<18){const patch=document.createElement('canvas');patch.width=b[2];patch.height=b[3];patch.getContext('2d')!.drawImage(jewelry,...b,0,0,b[2],b[3]);scene.textures.addCanvas('bracelet-art-'+id,patch)}}
 const original=scene.textures.get(body.atlas).getSourceImage() as HTMLImageElement;
 for(const mode of ['outfit','outfit-shoes','base-shoes']){const c=canvas(),ctx=context(c);ctx.drawImage(original,...body.frame,...body.position,...body.size);ctx.globalCompositeOperation='destination-out';if(mode.startsWith('outfit'))ctx.fillRect(0,100,280,187);if(mode.endsWith('shoes'))ctx.fillRect(89,389,102,51);scene.textures.addCanvas('worn-body-'+mode,c)}
 const holding=scene.textures.get('wornHolding').getSourceImage() as HTMLImageElement;
 for(const [i,id]of ['raincoat','winterCoat'].entries()){const c=canvas(),ctx=context(c);ctx.drawImage(holding,i*512,290,480,640,64+(i?6:0),99,172.5,216);connectNeck(ctx);ctx.drawImage(holding,i?620:120,0,i?410:420,290,133,3,100,61);ctx.drawImage(holding,i?824:324,270,14,110,181+(i?1:0),50,4.3,85);scene.textures.addCanvas('holding-'+id,c)}
 const arm=scene.textures.get('wornArm').getSourceImage() as HTMLImageElement;const c=canvas(),ctx=context(c);ctx.drawImage(arm,0,750,540,570,166,145,70,74);ctx.drawImage(arm,0,110,887,500,165,3,108,61);ctx.drawImage(arm,435,550,28,360,220,54,3.6,124);scene.textures.addCanvas('holding-bare',c);
}
export const hasWorn=(id:string)=>garments[id].slot==='neck'||id.startsWith('jian')||outfitIds.includes(id)||shoeIds.includes(id)||['crown','tiara','flowers','bow','explorerHat','finalCrown','sunglasses','gloves'].includes(id)||id.startsWith('collectionHead')||fashionIds.includes(id);
export function applyWorn(scene:Phaser.Scene,worn:Set<string>,layers:Map<string,Phaser.GameObjects.Image>,bodyImage:Phaser.GameObjects.Image){
 const outfit=[...worn].find(id=>garments[id].slot==='outer')||[...worn].find(id=>garments[id].slot==='dress');const shoes=[...worn].some(id=>garments[id].slot==='shoes');if(outfit)layers.get(outfit)!.setVisible(true);
 if(outfit||shoes)bodyImage.setTexture('worn-body-'+(outfit?'outfit'+(shoes?'-shoes':''):'base-shoes')).setPosition(0,0).setDisplaySize(280,440);else bodyImage.setPosition(...body.position).setDisplaySize(...body.size);
 if(worn.has('umbrella')&&!outfit){const key='posed-body-base'+(shoes?'-shoes':'');if(!scene.textures.exists(key)){const c=canvas(),ctx=context(c),f=bodyImage.frame;ctx.drawImage(bodyImage.texture.getSourceImage() as CanvasImageSource,f.cutX,f.cutY,f.cutWidth,f.cutHeight,bodyImage.x,bodyImage.y,bodyImage.displayWidth,bodyImage.displayHeight);removeRestingArm(ctx);scene.textures.addCanvas(key,c)}bodyImage.setTexture(key).setPosition(0,0).setDisplaySize(280,440)}
 for(const id of ids){if(!hasWorn(id)&&!['neck','wrist'].includes(garments[id].slot))continue;const image=layers.get(id)!;image.setTexture('worn-'+id).setPosition(0,0).setDisplaySize(280,440).setAngle(0);}


 if(worn.has('umbrella')){if(outfit&&outfit!=='raincoat'&&outfit!=='winterCoat')layers.get(outfit)!.setTexture('held-outfit-'+outfit);const held=layers.get('umbrella')!;held.setDepth(outfit==='raincoat'||outfit==='winterCoat'?59:29);held.setTexture(outfit==='raincoat'||outfit==='winterCoat'?'holding-'+outfit:'holding-bare').setPosition(0,0).setDisplaySize(280,440);if(outfit==='raincoat'||outfit==='winterCoat')layers.get(outfit)!.setVisible(false)}else{const g=garments.umbrella;layers.get('umbrella')!.setDepth(g.layer).setTexture(g.atlas,'umbrella').setPosition(...g.position).setDisplaySize(...g.size)}
 for(const id of worn)if(id==='gloves'||id.startsWith('fashionGloves'))applyGloveFit(scene,id,outfit,worn.has('umbrella'),layers,bodyImage);
 for(const id of worn)if(garments[id].slot==='wrist')applyBraceletFit(scene,id,outfit,worn.has('umbrella'),layers);
}
