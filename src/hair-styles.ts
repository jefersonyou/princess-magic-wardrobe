import type Phaser from 'phaser';
import type {CharacterId} from './characters';

export interface HairStyleSpec {
 id:string;
 styleName:string;
 english:string;
 atlas:'hair'|'hairStyles';
 frame:readonly [number,number,number,number];
 position:readonly [number,number];
 size:readonly [number,number];
 trimJoyBuns?:boolean;
}

export const hairStylesAtlas={
 url:new URL('../public/art/hair-styles.png',import.meta.url).href,
 width:1264,
 height:848
} as const;

export const hairStyles:readonly HairStyleSpec[]=[
 {id:'hairWaves',styleName:'긴 웨이브',english:'Wavy hair',atlas:'hair',frame:[99,131,451,767],position:[86,25],size:[108,184],trimJoyBuns:true},
 {id:'hairBraids',styleName:'리본 양갈래 땋기',english:'Braided hair',atlas:'hair',frame:[763,131,345,819],position:[92,26],size:[96,210],trimJoyBuns:true},
 {id:'hairLongStraight',styleName:'긴 생머리',english:'Long straight',atlas:'hairStyles',frame:[47,35,244,387],position:[85,27],size:[106,168]},
 {id:'hairPonytail',styleName:'하이 포니테일',english:'High ponytail',atlas:'hairStyles',frame:[368,32,264,384],position:[69,12],size:[112,163]},
 {id:'hairTwinTails',styleName:'트윈테일 웨이브',english:'Twin tails',atlas:'hairStyles',frame:[632,46,316,364],position:[64,24],size:[148,170]},
 {id:'hairHalfUp',styleName:'반묶음 공주 머리',english:'Half-up waves',atlas:'hairStyles',frame:[978,38,250,377],position:[82,26],size:[112,169]},
 {id:'hairSideBraid',styleName:'한쪽 땋은 머리',english:'Side braid',atlas:'hairStyles',frame:[61,445,210,387],position:[89,25],size:[96,177]},
 {id:'hairBob',styleName:'단발 C컬 보브',english:'Classic bob',atlas:'hairStyles',frame:[355,451,247,259],position:[83,28],size:[110,112]},
 {id:'hairUpdo',styleName:'로열 올림머리',english:'Royal updo',atlas:'hairStyles',frame:[691,424,197,287],position:[97,14],size:[82,119]},
 {id:'hairTwinBuns',styleName:'만두 양갈래',english:'Twin buns',atlas:'hairStyles',frame:[973,460,259,239],position:[84,17],size:[108,100]}
];

export const hairStyleById:Record<string,HairStyleSpec>=Object.fromEntries(hairStyles.map(s=>[s.id,s]));
export const hairIds=hairStyles.map(s=>s.id);

export type HairColorProfile={
 hue:number;
 satScale:number;
 satBias:number;
 lightLift:number;
 lightGamma:number;
};

// Calibrated from measured RGB/HSL hair samples of Joy (#45325a), Luna (#733a76),
// Ruby (#c34a57), and Aria (#303562).
export const hairColorProfiles:Record<CharacterId,HairColorProfile>={
 joy:{hue:269,satScale:1.0,satBias:0,lightLift:0.02,lightGamma:0.97},
 luna:{hue:297,satScale:1.18,satBias:0.05,lightLift:0.08,lightGamma:0.84},
 ruby:{hue:349,satScale:1.45,satBias:0.12,lightLift:0.24,lightGamma:0.62},
 aria:{hue:234,satScale:1.15,satBias:0.05,lightLift:0.03,lightGamma:0.95}
};

export function hairLabel(hairId:string,characterName:string){
 const spec=hairStyleById[hairId];
 return spec?`${characterName}의 ${spec.styleName}`:hairId;
}

function rgbToHsl(r:number,g:number,b:number):[number,number,number]{
 r/=255;g/=255;b/=255;
 const max=Math.max(r,g,b),min=Math.min(r,g,b),l=(max+min)/2;
 if(max===min)return [0,0,l];
 const d=max-min,s=l>.5?d/(2-max-min):d/(max+min);
 let h=0;
 if(max===r)h=(g-b)/d+(g<b?6:0);
 else if(max===g)h=(b-r)/d+2;
 else h=(r-g)/d+4;
 return [h*60,s,l];
}

function hslToRgb(h:number,s:number,l:number):[number,number,number]{
 h=((h%360)+360)%360;
 const c=(1-Math.abs(2*l-1))*s,x=c*(1-Math.abs((h/60)%2-1)),m=l-c/2;
 let r=0,g=0,b=0;
 if(h<60){r=c;g=x}
 else if(h<120){r=x;g=c}
 else if(h<180){g=c;b=x}
 else if(h<240){g=x;b=c}
 else if(h<300){r=x;b=c}
 else{r=c;b=x}
 return [Math.round((r+m)*255),Math.round((g+m)*255),Math.round((b+m)*255)];
}

export function recolorHairImageData(image:ImageData,characterId:CharacterId){
 if(characterId==='joy')return image;
 const profile=hairColorProfiles[characterId],d=image.data;
 const srcCenterHue=274;
 for(let i=0;i<d.length;i+=4){
  if(d[i+3]===0)continue;
  const [h,s,l]=rgbToHsl(d[i],d[i+1],d[i+2]);
  // Preserve warm pearl/gold hair ties (e.g. ponytail pearl clasp)
  if(h>=15&&h<=68&&l>0.42&&s<0.55)continue;
  // Blend hue offset gently around source violet center so ribbon accents stay harmonious
  let dh=h-srcCenterHue;
  if(dh>180)dh-=360;
  if(dh<-180)dh+=360;
  const targetH=profile.hue+dh*0.35;
  const targetS=Math.max(0,Math.min(1,s*profile.satScale+(l<0.82?profile.satBias*(1-Math.abs(l-0.45)):0)));
  const targetL=Math.max(0.05,Math.min(0.95,Math.pow(l,profile.lightGamma)+profile.lightLift*(1-l)*0.85));
  const [nr,ng,nb]=hslToRgb(targetH,targetS,targetL);
  d[i]=nr;d[i+1]=ng;d[i+2]=nb;
 }
 return image;
}

function trimJoySideBuns(ctx:CanvasRenderingContext2D){
 // Trim Joy's outer twin-bun ears from legacy hair-extensions.png when worn on friends
 ctx.save();
 ctx.globalCompositeOperation='destination-out';
 ctx.beginPath();
 ctx.ellipse(98,58,15,24,-0.15,0,Math.PI*2);
 ctx.ellipse(182,58,15,24,0.15,0,Math.PI*2);
 ctx.fill();
 ctx.restore();
}

export function hairTextureKey(scene:Phaser.Scene,hairId:string,characterId:CharacterId):string{
 const key=`worn-hair-${characterId}-${hairId}`;
 if(scene.textures.exists(key))return key;
 const spec=hairStyleById[hairId];
 if(!spec)return 'worn-'+hairId;
 const src=scene.textures.get(spec.atlas).getSourceImage() as HTMLImageElement;
 const [sx,sy,sw,sh]=spec.frame;
 const c=document.createElement('canvas');c.width=560;c.height=880;
 const ctx=c.getContext('2d')!;ctx.scale(2,2);
 ctx.drawImage(src,sx,sy,sw,sh,spec.position[0],spec.position[1],spec.size[0],spec.size[1]);
 if(characterId!=='joy'&&spec.trimJoyBuns)trimJoySideBuns(ctx);
 if(characterId!=='joy'){
  const img=ctx.getImageData(0,0,560,880);
  recolorHairImageData(img,characterId);
  ctx.putImageData(img,0,0);
 }
 scene.textures.addCanvas(key,c);
 return key;
}

const thumbCache=new Map<string,string>();

export function hairThumbnailUrl(scene:Phaser.Scene,hairId:string,characterId:CharacterId):string|null{
 const cacheKey=`${characterId}:${hairId}`;
 const hit=thumbCache.get(cacheKey);
 if(hit)return hit;
 const spec=hairStyleById[hairId];
 if(!spec||!scene.textures.exists(spec.atlas))return null;
 const src=scene.textures.get(spec.atlas).getSourceImage() as HTMLImageElement;
 const [sx,sy,sw,sh]=spec.frame;
 const maxSide=220,scale=Math.min(1,maxSide/Math.max(sw,sh));
 const tw=Math.max(1,Math.round(sw*scale)),th=Math.max(1,Math.round(sh*scale));
 const c=document.createElement('canvas');c.width=tw;c.height=th;
 const ctx=c.getContext('2d')!;
 ctx.drawImage(src,sx,sy,sw,sh,0,0,tw,th);
 if(characterId!=='joy'){
  const img=ctx.getImageData(0,0,tw,th);
  recolorHairImageData(img,characterId);
  ctx.putImageData(img,0,0);
 }
 const url=c.toDataURL('image/png');
 thumbCache.set(cacheKey,url);
 return url;
}

export function refreshHairCatalog(scene:Phaser.Scene,characterId:CharacterId,characterName:string){
 for(const spec of hairStyles){
  const card=document.querySelector<HTMLButtonElement>(`[data-item="${spec.id}"]`);
  if(!card)continue;
  const label=hairLabel(spec.id,characterName);
  card.dataset.displayName=label;
  card.setAttribute('aria-label',label);
  const span=card.querySelector('span');
  if(span)span.innerHTML=`${label}<br><small>${spec.english}</small>`;
  const url=hairThumbnailUrl(scene,spec.id,characterId);
  if(url){
   const art=card.querySelector('.item-art');
   if(art){
    const [,,w,h]=spec.frame;
    art.innerHTML=`<svg viewBox="0 0 ${w} ${h}"><image href="${url}" width="${w}" height="${h}"/></svg>`;
   }
  }
 }
}
