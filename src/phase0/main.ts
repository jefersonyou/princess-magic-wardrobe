import {fitFootline} from '../footline';
import {CharacterRig} from '../characters';
import {prepareGloveFit,poseWrists,earringTexture} from '../fashion-renderer';
import {prepareBraceletFit} from '../wrist-accessories';
import {fitCharacterCanvas} from '../fit-canvas';
import {setupProportions,visualY,bodyY} from '../proportions';
import {wornImages,prepareWorn,applyWorn,hasWorn} from '../worn-renderer';
import {setupStory,storyAttempt,storyMiss,magicSound,canUse,storyReject} from '../story';
import {WalkRig} from '../walk-rig';
import {setupExperience} from '../experience';
import Phaser from 'phaser';
import {anchors,garments,body,atlases,ids,thumbnail,type GarmentId} from './rig';
import {canvasPoint} from './geometry';
const status=document.querySelector<HTMLElement>('#status')!;
const host=document.querySelector<HTMLElement>('#character')!;

const density=Math.min(devicePixelRatio,3);
const itemList=document.querySelector<HTMLElement>('#items')!;
const catalogLabel=document.querySelector<HTMLElement>('.wardrobe-heading span')!;
catalogLabel.textContent='그림을 끌어 입히기 · 이름에서 목록 넘기기';
status.textContent='옷 그림을 조이에게 끌어다 입혀주세요.';
let twoFingerScroll=false;
let scrollTouchY=0;
itemList.addEventListener('touchstart',e=>{
 if(e.touches.length>=2){
  twoFingerScroll=true;
  scrollTouchY=(e.touches[0].clientY+e.touches[1].clientY)/2;
  cancel();
 }
},{passive:true,capture:true});
itemList.addEventListener('touchmove',e=>{
 if(e.touches.length>=2){
  twoFingerScroll=true;
  const y=(e.touches[0].clientY+e.touches[1].clientY)/2;
  itemList.scrollTop+=scrollTouchY-y;
  scrollTouchY=y;
  e.preventDefault();
 }
},{passive:false,capture:true});
itemList.addEventListener('touchend',e=>{if(e.touches.length===0)twoFingerScroll=false},{passive:true});
itemList.addEventListener('touchcancel',()=>{twoFingerScroll=false},{passive:true});
let scene:WardrobeScene, guides=false;
let drag:{id:GarmentId;pointer:number;ghost:HTMLElement;button:HTMLButtonElement;near:boolean}|null=null;
class WardrobeScene extends Phaser.Scene {
  characterRig!:CharacterRig; worn=new Set<GarmentId>(); layers=new Map<GarmentId,Phaser.GameObjects.Image>();
  bodyImage!:Phaser.GameObjects.Image;hatBack!:Phaser.GameObjects.Image;
  walker!:WalkRig;
  marks!:Phaser.GameObjects.Container; target!:Phaser.GameObjects.Graphics; preview!:Phaser.GameObjects.Image;
  preload(){for(const [key,url]of Object.entries(wornImages))this.load.image(key,url);for(const [key,a] of Object.entries(atlases))this.load.image(key,a.url)}
  create(){this.cameras.main.setZoom(density).setScroll((280-280*density)/2,(440-440*density)/2);scene=this;for(const [id,sprite]of [['body',body],...ids.map(id=>[id,garments[id]] as const)] as const){this.textures.get(sprite.atlas).add(id,0,...sprite.frame)}this.bodyImage=this.add.image(...body.position,body.atlas,'body').setOrigin(0).setDisplaySize(...body.size);this.prepareBodyLayers();this.prepareFootwear();this.prepareExplorer();prepareWorn(this);this.hatBack=this.add.image(0,0,'worn-back-explorerHat').setOrigin(0).setDisplaySize(280,440).setDepth(-20).setVisible(false);for(const id of ids){const g=garments[id];this.layers.set(id,this.add.image(...g.position,id==='explorer'?'outfit-explorer':['shoes','hands'].includes(g.slot)?'shoe-'+id:g.atlas,id==='explorer'||['shoes','hands'].includes(g.slot)?undefined:id).setOrigin(0).setDisplaySize(...g.size).setAngle(g.rotation).setDepth(g.layer).setVisible(false))}this.preview=this.add.image(0,0,'princess','dress').setOrigin(0).setDepth(80).setAlpha(.5).setVisible(false);this.target=this.add.graphics().setDepth(90);this.marks=this.add.container().setDepth(100);for(const [label,[x,y]]of Object.entries(anchors)){this.marks.add(this.add.circle(x,y,2,0xe85282));this.marks.add(this.add.text(x+4,y-3,label,{fontFamily:'Nanum Gothic',fontSize:'6px',color:'#584268',backgroundColor:'#fffaf5'}))}this.marks.setVisible(guides);this.walker=new WalkRig(this,()=>{this.bodyImage.setVisible(true);this.layers.forEach((image,id)=>image.setVisible(this.worn.has(id)));this.fitBody();host.dataset.walking='false'});this.characterRig=new CharacterRig(this,()=>{this.stopWalk();for(const id of [...this.worn])if(garments[id].slot==='hair'){this.worn.delete(id);this.layers.get(id)!.setVisible(false)}host.dataset.worn=[...this.worn].sort().join(',');updateWorn()});this.fitBody();host.dataset.ready='true';host.dataset.artVersion='0.11.3';document.querySelectorAll<HTMLButtonElement>('.item').forEach(b=>b.disabled=false);try{const current=JSON.parse(localStorage.getItem('joy-current-look')||'[]');if(Array.isArray(current))for(const id of current)if(ids.includes(id))this.wear(id)}catch{}window.dispatchEvent(new Event('wardrobe-ready'));}
  update(_time:number,delta:number){this.walker?.update(delta)}
  startWalk(){this.stopWalk();this.clearPreview();this.marks.setVisible(false);requestAnimationFrame(()=>{if(document.body.dataset.location==='room')return;this.walker.start(game.canvas);this.characterRig.hide();this.hatBack.setVisible(false);this.bodyImage.setVisible(false);this.layers.forEach(l=>l.setVisible(false));host.dataset.walking='true'})}
  stopWalk(){this.walker?.stop()}
  prepareBodyLayers(){const source=this.textures.get(body.atlas).getSourceImage() as HTMLImageElement;for(const mode of [0,1,4,5,9,13]){const c=document.createElement('canvas');c.width=body.frame[2];c.height=body.frame[3];const ctx=c.getContext('2d')!;ctx.drawImage(source,...body.frame,0,0,c.width,c.height);if(mode&1){ctx.save();ctx.globalCompositeOperation='destination-out';ctx.beginPath();for(const [i,p]of [[264,210],[357,210],[350,300],[381,511],[240,511],[268,300]].entries()){if(i===0)ctx.moveTo(p[0]-110,p[1]);else ctx.lineTo(p[0]-110,p[1])}ctx.closePath();ctx.fill();ctx.restore()}if(mode&4){ctx.save();ctx.globalCompositeOperation='destination-out';for(const side of [0,1]){ctx.beginPath();for(const [i,p]of [[66,222],[73,231],[51,261],[31,260],[39,239]].entries()){const x=((side?280-p[0]:p[0])-body.position[0])/.52,y=(p[1]-body.position[1])/.52;i?ctx.lineTo(x,y):ctx.moveTo(x,y)}ctx.closePath();ctx.fill()}ctx.restore()}if(mode&8){ctx.save();ctx.globalCompositeOperation='destination-out';ctx.fillRect((90-body.position[0])/.52,(280-body.position[1])/.52,100/.52,115/.52);ctx.restore()}this.textures.addCanvas('body-mode-'+mode,c)}}
  prepareFootwear(){for(const id of ids){const g=garments[id];if(!['shoes','hands'].includes(g.slot))continue;const source=this.textures.get(g.atlas).getSourceImage() as HTMLImageElement;const pair=document.createElement('canvas');pair.width=g.frame[2];pair.height=g.frame[3];const pc=pair.getContext('2d')!;pc.drawImage(source,...g.frame,0,0,pair.width,pair.height);const result=document.createElement('canvas');result.width=840;result.height=1320;const ctx=result.getContext('2d')!;ctx.scale(3,3);const boots=['boots','collectionShoes4'].includes(id);for(let side=0;side<2;side++){const start=Math.floor(side*pair.width/2),end=Math.floor((side+1)*pair.width/2);const data=pc.getImageData(start,0,end-start,pair.height);let minX=end-start,minY=pair.height,maxX=0,maxY=0;for(let y=0;y<data.height;y++)for(let x=0;x<data.width;x++)if(data.data[(y*data.width+x)*4+3]>160){minX=Math.min(minX,x);maxX=Math.max(maxX,x);minY=Math.min(minY,y);maxY=Math.max(maxY,y)}const shoe=document.createElement('canvas');shoe.width=maxX-minX+1;shoe.height=maxY-minY+1;const sc=shoe.getContext('2d')!;sc.drawImage(pair,start+minX,minY,shoe.width,shoe.height,0,0,shoe.width,shoe.height);if(!boots&&!['shoes','gloves','sneakers'].includes(id)){sc.globalCompositeOperation='destination-out';sc.beginPath();sc.ellipse(shoe.width*.5,shoe.height*.30,shoe.width*.29,shoe.height*.25,0,0,Math.PI*2);sc.fill()}if(id==='sandals'){sc.globalCompositeOperation='destination-out';sc.beginPath();sc.ellipse(shoe.width*.5,shoe.height*.83,shoe.width*.32,shoe.height*.085,0,0,Math.PI*2);sc.fill()}const gloves=id==='gloves',width=gloves?26:boots?25:23,height=gloves?37:boots?38:27,cx=gloves?(side===0?56:224):(side===0?114.5:164);ctx.drawImage(shoe,cx-width/2,(gloves?255:417)-height,width,height)}this.textures.addCanvas('shoe-'+id,result)}}
  prepareExplorer(){const c=document.createElement('canvas');c.width=840;c.height=1320;const ctx=c.getContext('2d')!;ctx.scale(3,3);const source=this.textures.get('adventure').getSourceImage() as HTMLImageElement;for(let y=0;y<237;y++){const w=55+45*Math.min(y/52,1);ctx.drawImage(source,898,145+y,118,1,140-w/2,183+y*218/237,w,218/237+.3)}ctx.drawImage(source,843,26,214,125,86,109,108,78);this.textures.addCanvas('outfit-explorer',c)}
  fitBody(){fitFootline(this,this.worn);this.hatBack?.setVisible(this.worn.has('explorerHat'));const hasOuter=[...this.worn].some(id=>garments[id].slot==='outer');for(const id of this.worn)if(garments[id].slot==='dress')this.layers.get(id)!.setVisible(!hasOuter);const worn=[...this.worn];const mode=(worn.some(id=>['dress','outer'].includes(garments[id].slot))?1:0)+(this.worn.has('gloves')?4:0)+(this.worn.has('explorer')?8:0);this.bodyImage.setTexture('body-mode-'+mode).setDisplaySize(...body.size);applyWorn(this,this.worn,this.layers,this.bodyImage);this.characterRig?.apply(this.bodyImage,this.worn);for(const id of this.worn)if(garments[id].slot==='ears')this.layers.get(id)!.setTexture(earringTexture(this,id,this.characterRig?.id))}
  outfit(){return [...this.worn].find(id=>garments[id].slot==='outer')||[...this.worn].find(id=>garments[id].slot==='dress')}
  anchorFor(id:GarmentId):readonly[number,number]{const g=garments[id];if(g.slot==='wrist'||g.slot==='hands'){const wrist=poseWrists(this,this.outfit(),this.worn.has('umbrella'))[g.slot==='wrist'?1:0];return [wrist.x,wrist.y]}return anchors[g.anchor]}
  highlight(id:GarmentId,near:boolean){const g=garments[id],[x,y]=this.anchorFor(id);let full=hasWorn(id),texture=full?'worn-'+id:id==='explorer'?'outfit-explorer':['shoes','hands'].includes(g.slot)?'shoe-'+id:g.atlas;
   if(g.slot==='ears'){full=true;texture=earringTexture(this,id,this.characterRig?.id)}
   if(id==='umbrella'){full=true;const outfit=this.outfit();texture=outfit==='raincoat'||outfit==='winterCoat'?'holding-'+outfit:'holding-bare'}
   if(full&&['dress','outer'].includes(g.slot)&&this.worn.has('umbrella'))texture=id==='raincoat'||id==='winterCoat'?'holding-'+id:'held-outfit-'+id;
   if(g.slot==='wrist'){full=true;texture=prepareBraceletFit(this,id,this.outfit(),this.worn.has('umbrella'))}
   if(g.slot==='hands'){full=true;texture=prepareGloveFit(this,id,this.outfit(),this.worn.has('umbrella'),[...this.worn].some(id=>garments[id].slot==='shoes')).key}
   const radius=dropRadius(id);host.dataset.dropAnchor=x+','+visualY(y);host.dataset.dropRadius=String(radius);this.target.clear().fillStyle(near?0xb5e6bd:0xe8c7f4,.18).fillCircle(x,y,radius).lineStyle(3,near?0x54845c:0xad72c2,1).strokeCircle(x,y,radius).lineStyle(1,0xffffff,.9).strokeCircle(x,y,radius-5);this.preview.setTexture(texture,full||['shoes','hands'].includes(g.slot)?undefined:id).setPosition(...(full?[0,0] as const:g.position)).setDisplaySize(...(full?[280,440] as const:g.size)).setAngle(full?0:g.rotation).setVisible(near);
  }
  clearPreview(){this.target.clear();delete host.dataset.dropAnchor;delete host.dataset.dropRadius;this.preview.setVisible(false)}
  wear(id:GarmentId){for(const old of [...this.worn])if(garments[old].slot===garments[id].slot||(garments[old].slot==='outer'&&garments[id].slot==='dress')){this.worn.delete(old);this.layers.get(old)!.setVisible(false)}this.worn.add(id);const image=this.layers.get(id)!;this.tweens.killTweensOf(image);image.setVisible(true).setAlpha(.4);this.tweens.add({targets:image,alpha:1,duration:220});host.dataset.worn=[...this.worn].sort().join(',');updateWorn();const [x,y]=this.anchorFor(id);for(let i=0;i<8;i++){const angle=i*Math.PI/4,star=this.add.star(x,y,4,1,4,0xe7c879).setDepth(110);this.tweens.add({targets:star,x:x+Math.cos(angle)*35,y:y+Math.sin(angle)*35,alpha:0,duration:450,onComplete:()=>star.destroy()})}}
}
const game=new Phaser.Game({type:Phaser.CANVAS,parent:host,width:280*density,height:440*density,transparent:true,scale:{mode:Phaser.Scale.NONE,autoCenter:Phaser.Scale.NO_CENTER},scene:WardrobeScene,audio:{noAudio:true},render:{antialias:true}});
function dropRadius(id:GarmentId){return Math.max(42,garments[id].radius*1.35)}
function near(e:PointerEvent,id:GarmentId){const p=canvasPoint(game.canvas.getBoundingClientRect(),e.clientX,e.clientY),[x,y]=scene.anchorFor(id);return Math.hypot(p.x-x,bodyY(p.y)-y)<=dropRadius(id)}
function move(e:PointerEvent){if(!drag||drag.pointer!==e.pointerId)return;const d=drag;d.near=canUse(d.id)&&near(e,d.id);const r=game.canvas.getBoundingClientRect();if(d.near){const [x,y]=scene.anchorFor(d.id);d.ghost.style.left=r.left+x*r.width/280+'px';d.ghost.style.top=r.top+visualY(y)*r.height/440+'px';d.ghost.style.opacity='0';}else{d.ghost.style.left=e.clientX+'px';d.ghost.style.top=e.clientY-24+'px';d.ghost.style.opacity='1'}scene.highlight(d.id,d.near);status.textContent=d.near?'반짝이는 자리에 놓아주세요!':'옷을 알맞은 신체 부위로 옮겨주세요.'}
function cancel(){if(!drag)return;drag.ghost.remove();drag=null;scene.clearPreview();status.textContent='옷장으로 돌아왔어요. 다시 시도해요.'}
for(const id of ids){const g=garments[id],b=document.createElement('button');b.className='item';b.dataset.item=id;b.dataset.category=g.slot;b.disabled=true;b.innerHTML=`<div class="item-art">${thumbnail(id)}</div><span>${g.name}<br><small>${g.english}</small>${g.designer?'<small class="designer-credit">지안이가 디자인했어요</small>':''}</span>`;document.querySelector('#items')!.append(b);b.onpointerdown=e=>{if(e.pointerType==='touch'&&(e.target as HTMLElement).closest('span'))return;if(twoFingerScroll||drag||!e.isPrimary||e.button!==0)return;e.preventDefault();b.setPointerCapture(e.pointerId);const ghost=document.createElement('div');ghost.className='ghost';ghost.innerHTML=b.querySelector('svg')!.outerHTML;document.body.append(ghost);drag={id,pointer:e.pointerId,ghost,button:b,near:false};move(e)};b.onpointermove=move;b.onpointerup=e=>{if(!drag||drag.pointer!==e.pointerId)return;const d=drag;drag=null;scene.clearPreview();if(twoFingerScroll){d.ghost.remove();return}if(!canUse(id)){d.ghost.remove();storyReject(id);}else if(near(e,id)){scene.wear(id);magicSound();storyAttempt(id);d.ghost.remove();status.textContent=`${garments[id].name} 착용 완료`;}else{storyMiss();const r=b.getBoundingClientRect();const animation=d.ghost.animate([{left:d.ghost.style.left,top:d.ghost.style.top,opacity:1},{left:r.left+r.width/2+'px',top:r.top+r.height/2+'px',opacity:0}],{duration:220});animation.onfinish=()=>d.ghost.remove();status.textContent='옷장으로 돌아왔어요. 다시 시도해요.'}b.releasePointerCapture(e.pointerId)};b.onpointercancel=cancel;b.onlostpointercapture=cancel;}
document.querySelector<HTMLButtonElement>('#guides')!.onclick=()=>{guides=!guides;scene?.marks.setVisible(guides)};
document.querySelector<HTMLButtonElement>('#reset')!.onclick=()=>{cancel();if(!scene)return;scene.worn.clear();scene.layers.forEach(l=>l.setVisible(false));host.dataset.worn='';updateWorn();status.textContent='새로운 스타일을 만들어보세요.'};
window.addEventListener('blur',cancel);const refit=fitCharacterCanvas(game,host);const resize=new ResizeObserver(()=>{cancel();refit()});resize.observe(host);

function updateWorn(){scene.fitBody();host.dataset.designer=[...scene.worn].some(id=>garments[id].designer==='지안')?'지안':'';try{localStorage.setItem('joy-current-look',JSON.stringify([...scene.worn]))}catch{}const container=document.querySelector('#worn-items');if(!container)return;container.innerHTML='';for(const id of scene.worn){const b=document.createElement('button');b.textContent=garments[id].name+' ×';b.setAttribute('aria-label',garments[id].name+' 벗기기');b.onclick=()=>{scene.worn.delete(id);scene.layers.get(id)!.setVisible(false);host.dataset.worn=[...scene.worn].sort().join(',');updateWorn()};container.append(b)}document.querySelectorAll<HTMLButtonElement>('[data-item]').forEach(b=>b.classList.toggle('equipped',scene.worn.has(b.dataset.item as GarmentId)))}
document.querySelectorAll<HTMLButtonElement>('[data-category-filter]').forEach(b=>b.onclick=()=>{cancel();document.querySelectorAll('[data-category-filter]').forEach(t=>t.classList.toggle('active',t===b));document.querySelectorAll<HTMLButtonElement>('[data-item]').forEach(card=>card.hidden=b.dataset.categoryFilter!=='all'&&card.dataset.category!==b.dataset.categoryFilter);window.dispatchEvent(new Event('wardrobe-filter'))});
document.querySelector('#save-look')?.addEventListener('click',()=>{try{localStorage.setItem('princess-look-v3',JSON.stringify([...scene.worn]));status.textContent='이 코디를 저장했어요.'}catch{status.textContent='저장 공간을 사용할 수 없어요.'}});
document.querySelector('#load-look')?.addEventListener('click',()=>{try{const data=JSON.parse(localStorage.getItem('princess-look-v3')||'null');if(!Array.isArray(data)){status.textContent='먼저 코디를 저장해주세요.';return}scene.worn.clear();scene.layers.forEach(l=>l.setVisible(false));for(const id of data)if(ids.includes(id)&&canUse(id))scene.wear(id);host.dataset.worn=[...scene.worn].sort().join(',');updateWorn();status.textContent='저장한 코디를 불러왔어요.'}catch{status.textContent='저장된 코디를 읽을 수 없어요.'}});

setupProportions(game);
setupExperience(game,{start:()=>scene?.startWalk(),stop:()=>scene?.stopWalk()});

setupStory();

window.addEventListener('joy-clear-outfit',event=>{cancel();if(!scene)return;scene.stopWalk();for(const id of [...scene.worn])if((event as CustomEvent<{allowedIds?:string[]}>).detail?.allowedIds?!((event as CustomEvent<{allowedIds:string[]}>).detail.allowedIds.includes(id)):garments[id].slot!=='shoes'){scene.worn.delete(id);scene.layers.get(id)!.setVisible(false)}host.dataset.worn=[...scene.worn].sort().join(',');updateWorn()});
