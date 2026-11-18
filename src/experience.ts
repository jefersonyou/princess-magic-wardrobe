const kingdom=new Image();kingdom.src=new URL('../public/art/kingdom-scenes.png',import.meta.url).href;
let sceneIndex=-1;
const sceneBackdrops=new Map<number,string>();
function applyBackground(url:string){
 const background=document.querySelector<HTMLElement>('#scene-backdrop')!;
 background.style.backgroundImage=`url("${url}")`;
 const stage=document.querySelector<HTMLElement>('.stage')!;
 for(const property of ['background-image','background-size','background-position'])stage.style.removeProperty(property);
}
export function setKingdomScene(index:number){
 sceneIndex=index;if(document.body.dataset.location!=='room')return;
 document.body.dataset.scene=String(index);
 if(index<0){applyBackground(room.src);return}
 const cached=sceneBackdrops.get(index);if(cached){applyBackground(cached);return}
 void kingdom.decode().then(()=>{
  const c=document.createElement('canvas');c.width=512;c.height=512;
  c.getContext('2d')!.drawImage(kingdom,(index%3)*512,Math.floor(index/3)*512,512,512,0,0,512,512);
  const url=c.toDataURL();sceneBackdrops.set(index,url);
  if(sceneIndex===index&&document.body.dataset.location==='room')applyBackground(url);
 }).catch(()=>{if(sceneIndex===index&&document.body.dataset.location==='room')applyBackground(room.src)});
}
export type Location='room'|'runway'|'stage';
const room=new Image();room.src=new URL('../public/art/royal-dressing-room.png',import.meta.url).href;
let showTimer:ReturnType<typeof setTimeout>|undefined;
let controls:{start:()=>void;stop:()=>void};
let location:Location='room',photoBlob:Blob|null=null,photoUrl='';
export function backdrop(ctx:CanvasRenderingContext2D,w:number,h:number,place:Location){
 if(place==='room'&&sceneIndex>=0&&kingdom.complete&&kingdom.naturalWidth){const side=512,scale=Math.max(w/side,h/side),dw=w/scale,dh=h/scale;ctx.drawImage(kingdom,(sceneIndex%3)*side+(side-dw)/2,Math.floor(sceneIndex/3)*side+(side-dh)/2,dw,dh,0,0,w,h);return}
 if(place==='room'&&room.complete&&room.naturalWidth){const scale=Math.max(w/room.width,h/room.height);ctx.drawImage(room,(w-room.width*scale)/2,(h-room.height*scale)/2,room.width*scale,room.height*scale);return}
 const gradient=ctx.createLinearGradient(0,0,0,h);gradient.addColorStop(0,place==='runway'?'#291c43':'#351331');gradient.addColorStop(1,'#bc789c');ctx.fillStyle=gradient;ctx.fillRect(0,0,w,h);
 for(let i=0;i<7;i++){ctx.fillStyle='rgba(255,236,194,.12)';ctx.beginPath();ctx.moveTo(w*i/6,0);ctx.lineTo(w*(i-.7)/6,h);ctx.lineTo(w*(i+1)/6,h);ctx.fill()}
 if(place==='runway'){ctx.fillStyle='#efc9d7';ctx.beginPath();ctx.moveTo(w*.42,h*.45);ctx.lineTo(w*.58,h*.45);ctx.lineTo(w*.86,h);ctx.lineTo(w*.14,h);ctx.fill();ctx.strokeStyle='#ffe9bc';ctx.lineWidth=5;ctx.stroke()}else{ctx.fillStyle='#ab365e';ctx.fillRect(0,0,w*.13,h*.86);ctx.fillRect(w*.87,0,w*.13,h*.86);ctx.fillStyle='#e0b3c6';ctx.beginPath();ctx.ellipse(w/2,h*.91,w*.37,h*.09,0,0,Math.PI*2);ctx.fill()}
 for(let i=0;i<42;i++){const x=(i*137%1000)/1000*w,y=(i*79%680)/1000*h;ctx.fillStyle='rgba(255,240,195,.65)';ctx.fillRect(x,y,2,2)}
}
function setLocation(value:Location){clearTimeout(showTimer);controls?.stop();document.querySelector('.stage')!.classList.remove('walking');location=value;document.body.dataset.location=value;document.body.classList.toggle('show-mode',value!=='room');document.querySelectorAll('button[data-location]').forEach(b=>b.classList.toggle('active',(b as HTMLElement).dataset.location===value));if(value!=='room'){document.querySelector<HTMLElement>('.stage')!.style.backgroundSize='cover';document.querySelector<HTMLElement>('.stage')!.style.backgroundPosition='center';const c=document.createElement('canvas');c.width=1600;c.height=1000;backdrop(c.getContext('2d')!,1600,1000,value);applyBackground(c.toDataURL());document.body.dataset.scene=value}else setKingdomScene(sceneIndex);document.querySelector('#runway-title')!.textContent=value==='runway'?'JOY’S ROYAL RUNWAY':'JOY’S STARLIGHT STAGE';document.querySelector('#show-title')!.textContent=value==='runway'?'조이의 로열 런웨이':value==='stage'?'조이의 별빛 무대':'조이의 마법 옷장';}
export function setupExperience(game:import('phaser').Game,walk:{start:()=>void;stop:()=>void}){controls=walk;document.querySelectorAll<HTMLButtonElement>('button[data-location]').forEach(b=>b.onclick=()=>setLocation(b.dataset.location as Location));document.querySelector('#start-show')!.addEventListener('click',()=>{clearTimeout(showTimer);controls.start();const stage=document.querySelector('.stage')!;stage.classList.remove('walking');void (stage as HTMLElement).offsetWidth;stage.classList.add('walking');document.querySelector('#show-message')!.textContent='조이의 패션쇼가 시작됐어요! ✨';showTimer=setTimeout(()=>{stage.classList.remove('walking');document.querySelector('#show-message')!.textContent='멋진 피날레! 포토타임으로 남겨보세요.'},6500)});
 document.querySelector('#photo-time')!.addEventListener('click',async()=>{try{controls.stop();await document.fonts.load('400 24px "Nanum Gothic"');await document.fonts.load('700 32px "Nanum Gothic"');await room.decode();if(sceneIndex>=0)await kingdom.decode();await new Promise(resolve=>setTimeout(resolve,250));const c=document.createElement('canvas');c.width=1600;c.height=1000;const ctx=c.getContext('2d')!;backdrop(ctx,1600,1000,location);const source=game.canvas;const height=870,width=height*280/440;ctx.drawImage(source,800-width/2,65,width,height);ctx.fillStyle='#fffaf1';ctx.textAlign='center';if(location!=='room'){ctx.font='700 32px "Nanum Gothic"';ctx.fillText(location==='runway'?'JOY’S ROYAL RUNWAY':'JOY’S STARLIGHT STAGE',800,48)}ctx.font='400 24px "Nanum Gothic"';const profile=document.querySelector<HTMLElement>('#character')!;ctx.fillText(profile.dataset.designer==='지안'?`지안이가 디자인했어요 · ${profile.dataset.characterName||'조이'}의 포토타임`:`${profile.dataset.characterName||'조이'}의 포토타임 · 조이의 마법 옷장`,800,970);photoBlob=await new Promise<Blob|null>(resolve=>c.toBlob(resolve,'image/png'));if(!photoBlob)throw Error('PNG');if(photoUrl)URL.revokeObjectURL(photoUrl);photoUrl=URL.createObjectURL(photoBlob);document.querySelector<HTMLImageElement>('#photo-preview')!.src=photoUrl;document.querySelector<HTMLAnchorElement>('#download-photo')!.href=photoUrl;document.querySelector<HTMLDialogElement>('#photo-dialog')!.showModal()}catch{document.querySelector('#show-message')!.textContent='사진을 만들지 못했어요. 다시 눌러주세요.'}});
 document.querySelector('#close-photo')!.addEventListener('click',()=>document.querySelector<HTMLDialogElement>('#photo-dialog')!.close());
 document.querySelector('#share-photo')!.addEventListener('click',async()=>{if(!photoBlob)return;const file=new File([photoBlob],'joy-magic-wardrobe.png',{type:'image/png'});if(navigator.canShare?.({files:[file]})){try{await navigator.share({files:[file],title:'조이의 포토타임'})}catch(e){if((e as Error).name!=='AbortError')document.querySelector('#photo-help')!.textContent='아래 사진을 길게 눌러 저장할 수도 있어요.'}}else document.querySelector('#photo-help')!.textContent='PNG 저장을 누르거나 사진을 길게 눌러 이미지 저장을 선택하세요.'});}
