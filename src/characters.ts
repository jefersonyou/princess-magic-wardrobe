import Phaser from 'phaser';
import {friendBands,friendWidthScale,friendPoint} from './character-fit';
import {hairStyleById,refreshHairCatalog} from './hair-styles';
import {body} from './phase0/rig';
export const friendArt=new URL('../public/art/friends-heads.png',import.meta.url).href;
export const characters=[{id:'joy',name:'조이',hair:'보랏빛 양쪽 번',column:-1,eyeX:0},{id:'luna',name:'루나',hair:'보라색 긴 땋은 머리',column:0,eyeX:271.5},{id:'ruby',name:'루비',hair:'긴 분홍빛 머리',column:1,eyeX:261},{id:'aria',name:'아리아',hair:'남색 하이 포니테일',column:2,eyeX:249}] as const;
export type CharacterId=typeof characters[number]['id'];
function canvas(){const c=document.createElement('canvas');c.width=560;c.height=880;const ctx=c.getContext('2d')!;ctx.scale(2,2);return {c,ctx}}

function featherBottom(ctx:CanvasRenderingContext2D,x:number,y0:number,y1:number,w:number){
 ctx.save();ctx.globalCompositeOperation='destination-out';
 const g=ctx.createLinearGradient(0,y0,0,y1);
 g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(0,0,0,1)');
 ctx.fillStyle=g;ctx.fillRect(x,y0,w,y1-y0);
 ctx.fillStyle='rgba(0,0,0,1)';ctx.fillRect(x,y1,w,440-y1);
 ctx.restore();
}

function drawFriendBody(ctx:CanvasRenderingContext2D,source:CanvasImageSource,sx:number,sy:number,sw:number,sh:number,dx:number,dy:number,dw:number,dh:number){
 ctx.drawImage(source,sx,sy,sw,sh,dx,dy,dw,dh);
 ctx.clearRect(0,0,280,97);ctx.clearRect(0,97,126,13);ctx.clearRect(153,97,127,13);
 // Subtle soft chin shadow on the neck join so friend faces blend smoothly onto the shared body.
 ctx.save();
 ctx.globalCompositeOperation='source-atop';
 const shade=ctx.createRadialGradient(138,99,2,138,101,11);
 shade.addColorStop(0,'rgba(148,86,78,.24)');shade.addColorStop(1,'rgba(148,86,78,0)');
 ctx.fillStyle=shade;ctx.fillRect(125,96,26,12);
 ctx.restore();
}

function makePortrait(composite:HTMLCanvasElement){
 // Unified upper-body crop (head + hair + neck + shoulders + cream slip bodice) for all 4 characters.
 const p=document.createElement('canvas');p.width=304;p.height=404;
 p.getContext('2d')!.drawImage(composite,64*2,14*2,152*2,202*2,0,0,304,404);
 return p.toDataURL('image/png');
}

export class CharacterRig{
 id:CharacterId='joy';private back:Phaser.GameObjects.Image;private front:Phaser.GameObjects.Image;private braid:Phaser.GameObjects.Image;
 private lastUiChar:CharacterId|null=null;
 constructor(private scene:Phaser.Scene,onChoose:()=>void){
  try{const saved=localStorage.getItem('joy-character');if(characters.some(c=>c.id===saved))this.id=saved as CharacterId}catch{}
  const source=scene.textures.get('wornFriends').getSourceImage() as HTMLImageElement;
  const joySource=scene.textures.get(body.atlas).getSourceImage() as HTMLImageElement;
  const joyFull=canvas();joyFull.ctx.drawImage(joySource,...body.frame,...body.position,...body.size);
  const friendBaseBody=canvas();drawFriendBody(friendBaseBody.ctx,joySource,...body.frame,...body.position,...body.size);
  const portraits:Record<CharacterId,string>={joy:makePortrait(joyFull.c),luna:'',ruby:'',aria:''};
  for(const character of characters){if(character.column<0)continue;const x=character.column*512,dx=friendPoint(0,0,character.eyeX)[0];
   const full=canvas();for(const [start,end,top,scale]of friendBands)full.ctx.drawImage(source,x,start,512,end-start,dx,top,512*friendWidthScale,(end-start)*scale);
   const head=canvas(),back=canvas(),braid=canvas();
   head.ctx.drawImage(full.c,0,0,280,440);
   back.ctx.drawImage(full.c,0,0,280,440);
   // Overlap back slightly under head (from y=95) so soft feathered head edges never leave a seam.
   back.ctx.clearRect(0,0,280,95);
   if(character.id==='luna'){
    featherBottom(head.ctx,0,99,106,126);
    featherBottom(head.ctx,126,100,104,24);
    featherBottom(head.ctx,150,103,114,130);
    braid.ctx.drawImage(full.c,0,0,280,440);
    braid.ctx.clearRect(0,0,280,98);
    braid.ctx.clearRect(126,0,154,440);
    back.ctx.clearRect(0,95,126,345);
   }else if(character.id==='ruby'){
    // Softly feather side hair below collarbone instead of a harsh y=103 horizontal razor cut.
    featherBottom(head.ctx,0,101,113,124);
    featherBottom(head.ctx,124,99,103,32);
    featherBottom(head.ctx,156,101,113,124);
   }else{
    // Preserve Aria's delicate left cheek curl while softly fading the right ponytail behind shoulders.
    featherBottom(head.ctx,0,115,126,128);
    featherBottom(head.ctx,128,99,103,24);
    featherBottom(head.ctx,152,98,108,128);
   }
   scene.textures.addCanvas('friend-head-'+character.id,head.c);scene.textures.addCanvas('friend-back-'+character.id,back.c);scene.textures.addCanvas('friend-braid-'+character.id,braid.c);
   const comp=canvas();
   comp.ctx.drawImage(back.c,0,0,280,440);
   comp.ctx.drawImage(friendBaseBody.c,0,0,280,440);
   if(character.id==='luna')comp.ctx.drawImage(braid.c,0,0,280,440);
   comp.ctx.drawImage(head.c,0,0,280,440);
   portraits[character.id]=makePortrait(comp.c);
  }
  this.back=scene.add.image(0,0,'friend-back-luna').setOrigin(0).setDisplaySize(280,440).setDepth(-15).setVisible(false);
  this.front=scene.add.image(0,0,'friend-head-luna').setOrigin(0).setDisplaySize(280,440).setDepth(50).setVisible(false);
  this.braid=scene.add.image(0,0,'friend-braid-luna').setOrigin(0).setDisplaySize(280,440).setDepth(45).setVisible(false);
  const button=document.createElement('button');button.id='character-picker-open';button.textContent='👸 친구 선택';document.querySelector('.locations')!.append(button);
  const dialog=document.createElement('dialog');dialog.id='character-picker';dialog.innerHTML='<h2>오늘 함께할 친구는?</h2><p>옷과 장신구는 그대로, 친구를 바꿔 꾸며보세요.</p><div class="character-options">'+characters.map(c=>`<button data-character-id="${c.id}" aria-pressed="${c.id===this.id}"><img src="${portraits[c.id]}" alt="${c.name}"><strong>${c.name}</strong><small>${c.hair}</small></button>`).join('')+'</div><button id="close-character-picker">닫기</button>';document.body.append(dialog);button.onclick=()=>dialog.showModal();dialog.querySelector('#close-character-picker')!.addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',e=>{const b=(e.target as HTMLElement).closest<HTMLButtonElement>('[data-character-id]');if(!b)return;this.id=b.dataset.characterId as CharacterId;try{localStorage.setItem('joy-character',this.id)}catch{}dialog.querySelectorAll<HTMLButtonElement>('[data-character-id]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.characterId===this.id)));onChoose();dialog.close()});
 }
 hide(){this.back.setVisible(false);this.front.setVisible(false);this.braid.setVisible(false)}
 apply(bodyImage:Phaser.GameObjects.Image,worn:Set<string>){
  const character=characters.find(c=>c.id===this.id)!;const host=document.querySelector<HTMLElement>('#character')!;host.dataset.characterId=this.id;host.dataset.characterName=character.name;host.setAttribute('aria-label',`${character.name}에게 의상을 입혀주세요`);
  const badge=document.querySelector('.stage-badge')!;badge.innerHTML=`♡ ${character.name}<span>오늘의 주인공</span>`;
  if(this.lastUiChar!==this.id){
   this.lastUiChar=this.id;
   refreshHairCatalog(this.scene,this.id,character.name);
   const msg=document.querySelector<HTMLElement>('#show-message');
   if(msg&&/오늘의 멋진 .*사진으로 남겨보세요/.test(msg.textContent||''))msg.textContent=`오늘의 멋진 ${character.name}를 사진으로 남겨보세요.`;
   const st=document.querySelector<HTMLElement>('#status');
   if(st&&/옷.*끌어다 입혀주세요/.test(st.textContent||''))st.textContent=`옷 그림을 ${character.name}에게 끌어다 입혀주세요.`;
   window.dispatchEvent(new Event('joy-character-change'));
  }
  if(this.id==='joy'){this.hide();return}
  this.front.setTexture('friend-head-'+this.id).setVisible(true);const customHair=[...worn].some(id=>Boolean(hairStyleById[id]));this.back.setTexture('friend-back-'+this.id).setVisible(!customHair);this.braid.setTexture('friend-braid-'+this.id).setVisible(this.id==='luna'&&!customHair);
  const key='friend-body-'+bodyImage.texture.key;
  if(!this.scene.textures.exists(key)){
   const {c,ctx}=canvas(),frame=bodyImage.frame;
   drawFriendBody(ctx,bodyImage.texture.getSourceImage() as CanvasImageSource,frame.cutX,frame.cutY,frame.cutWidth,frame.cutHeight,bodyImage.x,bodyImage.y,bodyImage.displayWidth,bodyImage.displayHeight);
   this.scene.textures.addCanvas(key,c);
  }
  bodyImage.setTexture(key).setPosition(0,0).setDisplaySize(280,440);
 }
}
