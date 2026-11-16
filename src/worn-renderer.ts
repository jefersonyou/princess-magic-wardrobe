import Phaser from 'phaser';
import {body,garments,ids} from './phase0/rig';
const outfitIds=['dress','rose','starlight','picnic',...Array.from({length:16},(_,i)=>'collectionDress'+i),'raincoat','winterCoat','explorer','swimsuit'];
const shoeIds=['shoes','roseShoes','starShoes','boots',...Array.from({length:6},(_,i)=>'collectionShoes'+i),'sneakers','sandals'];
export const wornImages={wornArm:new URL('../public/art/worn/holding-arm.png',import.meta.url).href,wornJewels:new URL('../public/art/worn/jewelry.png',import.meta.url).href,worn1:new URL('../public/art/worn/outfits-1.png',import.meta.url).href,worn2:new URL('../public/art/worn/outfits-2.png',import.meta.url).href,worn3:new URL('../public/art/worn/outfits-3.png',import.meta.url).href,wornFeet:new URL('../public/art/worn/footwear.png',import.meta.url).href,wornHolding:new URL('../public/art/worn/holding.png',import.meta.url).href};
function canvas(){const c=document.createElement('canvas');c.width=560;c.height=880;return c}
function context(c:HTMLCanvasElement){const ctx=c.getContext('2d')!;ctx.scale(2,2);return ctx}
function bounds(source:HTMLImageElement,x:number,y:number,w:number,h:number){const c=document.createElement('canvas');c.width=w;c.height=h;const ctx=c.getContext('2d')!;ctx.drawImage(source,x,y,w,h,0,0,w,h);const d=ctx.getImageData(0,0,w,h);let l=w,t=h,r=0,b=0;for(let yy=0;yy<h;yy++)for(let xx=0;xx<w;xx++)if(d.data[(yy*w+xx)*4+3]>180){l=Math.min(l,xx);r=Math.max(r,xx);t=Math.min(t,yy);b=Math.max(b,yy)}return [x+l,y+t,r-l+1,b-t+1] as const}
export function prepareWorn(scene:Phaser.Scene){
 for(const [i,id]of outfitIds.entries()){const key='worn'+(Math.floor(i/8)+1),source=scene.textures.get(key).getSourceImage() as HTMLImageElement;const col=i%4,row=Math.floor(i%8/4),x=col*384,y=row*512;const c=canvas(),ctx=context(c);const hem=i<16?480:i<20?430:i===22?499:i===23?340:470;
 // One worn torso includes its own neck, sleeves, arms and hands. Align neck and waist independently of the hem.
 ctx.drawImage(source,x,y+26,384,150-26,43,99,194,77);
 ctx.drawImage(source,x,y+150,384,(hem<380?hem:330)-150,43,176,194,hem<380?139:91);
 if(hem>=380)ctx.drawImage(source,x,y+330,384,hem-330,43,267,194,(id==='explorer'?411:315)-267);
 ctx.save();ctx.globalCompositeOperation='destination-out';ctx.fillRect(0,0,280,99);const fade=ctx.createLinearGradient(0,99,0,121);fade.addColorStop(0,'rgba(0,0,0,1)');fade.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=fade;ctx.fillRect(0,99,280,22);ctx.restore();scene.textures.addCanvas('worn-'+id,c);const posed=canvas(),pc=context(posed);pc.drawImage(c,0,0,280,440);pc.globalCompositeOperation='destination-out';pc.beginPath();pc.moveTo(174,145);pc.lineTo(280,145);pc.lineTo(280,265);pc.lineTo(187,265);pc.lineTo(164,190);pc.closePath();pc.fill();scene.textures.addCanvas('held-outfit-'+id,posed);
 }
 const source=scene.textures.get('wornFeet').getSourceImage() as HTMLImageElement;
 for(const [i,id]of shoeIds.entries()){const c=canvas(),ctx=context(c),col=i%4,row=Math.floor(i/4),y=Math.round(row*1024/3),h=Math.round((row+1)*1024/3)-y;for(let side=0;side<2;side++){const b=bounds(source,col*384+side*192,y,192,h);const boot=['boots','collectionShoes4'].includes(id),cut=boot?.28:.55,top=boot?374:385;ctx.drawImage(source,b[0],b[1]+b[3]*cut,b[2],b[3]*(1-cut),(side===0?114.5:164)-15,top,30,419-top)}scene.textures.addCanvas('worn-'+id,c)}
 const jewelry=scene.textures.get('wornJewels').getSourceImage() as HTMLImageElement;const jewelIds=['pendant','pearls',...Array.from({length:8},(_,i)=>'collectionNeck'+i),'bracelet',...Array.from({length:7},(_,i)=>'collectionWrist'+i),'scarf'];
 for(const [i,id]of jewelIds.entries()){const c=canvas(),ctx=context(c),x=Math.round(i%5*1254/5),y=Math.round(Math.floor(i/5)*1254/4);const b=bounds(jewelry,x,y,250,313);if(i<10)ctx.drawImage(jewelry,...b,126,110,28,23);else if(i<18)ctx.drawImage(jewelry,...b,209,225,17,9);else ctx.drawImage(jewelry,...b,122,108,36,51);scene.textures.addCanvas('worn-'+id,c)}
 const original=scene.textures.get(body.atlas).getSourceImage() as HTMLImageElement;
 for(const mode of ['outfit','outfit-shoes','base-shoes']){const c=canvas(),ctx=context(c);ctx.drawImage(original,...body.frame,...body.position,...body.size);ctx.globalCompositeOperation='destination-out';if(mode.startsWith('outfit'))ctx.fillRect(0,121,280,166);if(mode.endsWith('shoes'))ctx.fillRect(89,389,102,51);scene.textures.addCanvas('worn-body-'+mode,c)}
 const holding=scene.textures.get('wornHolding').getSourceImage() as HTMLImageElement;
 for(const [i,id]of ['raincoat','winterCoat'].entries()){const c=canvas(),ctx=context(c);ctx.drawImage(holding,i*512,290,512,640,64,99,184,216);ctx.drawImage(holding,i*512,0,512,290,116,-2,100,44);ctx.drawImage(holding,i*512+326,210,12,180,181,32,4.3,103);scene.textures.addCanvas('holding-'+id,c)}
 const arm=scene.textures.get('wornArm').getSourceImage() as HTMLImageElement;const c=canvas(),ctx=context(c);ctx.drawImage(arm,0,750,540,570,155,125,82,87);ctx.drawImage(arm,0,110,887,500,155,-55,135,76);ctx.drawImage(arm,435,550,28,360,221,20,4,110);scene.textures.addCanvas('holding-bare',c);
}
export const hasWorn=(id:string)=>outfitIds.includes(id)||shoeIds.includes(id);
export function applyWorn(scene:Phaser.Scene,worn:Set<string>,layers:Map<string,Phaser.GameObjects.Image>,bodyImage:Phaser.GameObjects.Image){
 const outfit=[...worn].find(id=>garments[id].slot==='outer')||[...worn].find(id=>garments[id].slot==='dress');const shoes=[...worn].some(id=>garments[id].slot==='shoes');
 if(outfit||shoes)bodyImage.setTexture('worn-body-'+(outfit?'outfit'+(shoes?'-shoes':''):'base-shoes')).setPosition(0,0).setDisplaySize(280,440);else bodyImage.setPosition(...body.position).setDisplaySize(...body.size);
 for(const id of ids){if(!hasWorn(id)&&!['neck','wrist'].includes(garments[id].slot))continue;const image=layers.get(id)!;image.setTexture('worn-'+id).setPosition(0,0).setDisplaySize(280,440).setAngle(0);}
 for(const id of worn)if(garments[id].slot==='wrist')layers.get(id)!.setPosition(0,worn.has('umbrella')?-72:0);
 if(worn.has('umbrella')){if(outfit&&outfit!=='raincoat'&&outfit!=='winterCoat')layers.get(outfit)!.setTexture('held-outfit-'+outfit);const held=layers.get('umbrella')!;held.setTexture(outfit==='raincoat'||outfit==='winterCoat'?'holding-'+outfit:'holding-bare').setPosition(0,0).setDisplaySize(280,440);if(outfit==='raincoat'||outfit==='winterCoat')layers.get(outfit)!.setVisible(false)}else{const g=garments.umbrella;layers.get('umbrella')!.setTexture(g.atlas,'umbrella').setPosition(...g.position).setDisplaySize(...g.size)}
}
