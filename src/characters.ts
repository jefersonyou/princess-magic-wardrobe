import Phaser from 'phaser';
export const friendArt=new URL('../public/art/friends-heads.png',import.meta.url).href;
const joyArt=new URL('../public/art/princess-atlas.png',import.meta.url).href;
export const characters=[{id:'joy',name:'조이',hair:'보랏빛 양쪽 번',column:-1,eyeX:0},{id:'luna',name:'루나',hair:'보라색 긴 땋은 머리',column:0,eyeX:268},{id:'ruby',name:'루비',hair:'긴 분홍빛 머리',column:1,eyeX:270},{id:'aria',name:'아리아',hair:'남색 하이 포니테일',column:2,eyeX:269}] as const;
export type CharacterId=typeof characters[number]['id'];
function canvas(){const c=document.createElement('canvas');c.width=560;c.height=880;const ctx=c.getContext('2d')!;ctx.scale(2,2);return {c,ctx}}
export class CharacterRig{
 id:CharacterId='joy';private back:Phaser.GameObjects.Image;private front:Phaser.GameObjects.Image;private braid:Phaser.GameObjects.Image;
 constructor(private scene:Phaser.Scene,onChoose:()=>void){
  try{const saved=localStorage.getItem('joy-character');if(characters.some(c=>c.id===saved))this.id=saved as CharacterId}catch{}
  const source=scene.textures.get('wornFriends').getSourceImage() as HTMLImageElement;
  for(const character of characters){if(character.column<0)continue;const x=character.column*512,dx=140-character.eyeX*.25,dy=69-326*.18;
   const full=canvas();full.ctx.drawImage(source,x,0,512,550,dx,dy,128,550*.18);full.ctx.drawImage(source,x,550,512,474,dx,dy+550*.18,128,474*.32);
   const head=canvas(),back=canvas(),braid=canvas();head.ctx.drawImage(full.c,0,0,280,440);head.ctx.clearRect(0,103,280,337);back.ctx.drawImage(full.c,0,0,280,440);back.ctx.clearRect(0,0,280,103);
   if(character.id==='luna'){braid.ctx.drawImage(back.c,0,0,280,440);braid.ctx.clearRect(126,0,154,440);back.ctx.clearRect(0,103,126,337)}
   scene.textures.addCanvas('friend-head-'+character.id,head.c);scene.textures.addCanvas('friend-back-'+character.id,back.c);scene.textures.addCanvas('friend-braid-'+character.id,braid.c);
  }
  this.back=scene.add.image(0,0,'friend-back-luna').setOrigin(0).setDisplaySize(280,440).setDepth(-15).setVisible(false);
  this.front=scene.add.image(0,0,'friend-head-luna').setOrigin(0).setDisplaySize(280,440).setDepth(50).setVisible(false);
  this.braid=scene.add.image(0,0,'friend-braid-luna').setOrigin(0).setDisplaySize(280,440).setDepth(45).setVisible(false);
  const button=document.createElement('button');button.id='character-picker-open';button.textContent='👸 친구 선택';document.querySelector('.locations')!.append(button);
  const dialog=document.createElement('dialog');dialog.id='character-picker';dialog.innerHTML='<h2>오늘 함께할 친구는?</h2><p>옷과 장신구는 그대로, 친구를 바꿔 꾸며보세요.</p><div class="character-options">'+characters.map(c=>`<button data-character-id="${c.id}" aria-pressed="${c.id===this.id}">${c.id==='joy'?`<svg viewBox="220 0 205 195"><image href="${joyArt}" width="1216" height="1293"/></svg>`:`<svg viewBox="${c.column*512+55} 90 410 500"><image href="${friendArt}" width="1536" height="1024"/></svg>`}<strong>${c.name}</strong><small>${c.hair}</small></button>`).join('')+'</div><button id="close-character-picker">닫기</button>';document.body.append(dialog);button.onclick=()=>dialog.showModal();dialog.querySelector('#close-character-picker')!.addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',e=>{const b=(e.target as HTMLElement).closest<HTMLButtonElement>('[data-character-id]');if(!b)return;this.id=b.dataset.characterId as CharacterId;try{localStorage.setItem('joy-character',this.id)}catch{}dialog.querySelectorAll<HTMLButtonElement>('[data-character-id]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.characterId===this.id)));onChoose();dialog.close()});
 }
 hide(){this.back.setVisible(false);this.front.setVisible(false);this.braid.setVisible(false)}
 apply(bodyImage:Phaser.GameObjects.Image,worn:Set<string>){
  const character=characters.find(c=>c.id===this.id)!;const host=document.querySelector<HTMLElement>('#character')!;host.dataset.characterId=this.id;host.dataset.characterName=character.name;host.setAttribute('aria-label',`${character.name}에게 의상을 입혀주세요`);
  const badge=document.querySelector('.stage-badge')!;badge.innerHTML=`♡ ${character.name}<span>오늘의 주인공</span>`;
  if(this.id==='joy'){this.hide();return}
  this.front.setTexture('friend-head-'+this.id).setVisible(true);const customHair=[...worn].some(id=>id==='hairWaves'||id==='hairBraids');this.back.setTexture('friend-back-'+this.id).setVisible(!customHair);this.braid.setTexture('friend-braid-'+this.id).setVisible(this.id==='luna'&&!customHair);
  const key='friend-body-'+bodyImage.texture.key;
  if(!this.scene.textures.exists(key)){const {c,ctx}=canvas(),frame=bodyImage.frame;ctx.drawImage(bodyImage.texture.getSourceImage() as CanvasImageSource,frame.cutX,frame.cutY,frame.cutWidth,frame.cutHeight,bodyImage.x,bodyImage.y,bodyImage.displayWidth,bodyImage.displayHeight);ctx.clearRect(0,0,280,97);ctx.clearRect(0,97,126,13);ctx.clearRect(153,97,127,13);this.scene.textures.addCanvas(key,c)}
  bodyImage.setTexture(key).setPosition(0,0).setDisplaySize(280,440);
 }
}
