import {canonicalFrame} from './proportions';
import Phaser from 'phaser';
export class WalkRig {
 private original=document.createElement('canvas');private torso=document.createElement('canvas');private frame=document.createElement('canvas');
 private image:Phaser.GameObjects.Image;private texture:Phaser.Textures.CanvasTexture;private elapsed=0;active=false;
 constructor(private scene:Phaser.Scene,private finish:()=>void){for(const c of [this.original,this.torso,this.frame]){c.width=840;c.height=1320}this.texture=scene.textures.addCanvas('walking-frame',this.frame)!;this.image=scene.add.image(0,0,'walking-frame').setOrigin(0).setDisplaySize(280,440).setDepth(200).setVisible(false)}
 start(source:HTMLCanvasElement){const ctx=this.original.getContext('2d')!;ctx.clearRect(0,0,840,1320);ctx.drawImage(canonicalFrame(source),0,0,840,1320);const tc=this.torso.getContext('2d')!;tc.clearRect(0,0,840,1320);tc.drawImage(this.original,0,0);tc.save();tc.scale(3,3);tc.globalCompositeOperation='destination-out';tc.fillRect(98,315,84,125);tc.restore();this.elapsed=0;this.active=true;this.image.setVisible(true);this.draw(0);}
 stop(){if(!this.active)return;this.active=false;this.image.setVisible(false).setPosition(0,0).setDisplaySize(280,440);this.finish()}
 update(delta:number){if(!this.active)return;this.elapsed+=delta;const seconds=this.elapsed/1000;if(seconds>=6.5){this.stop();return}this.draw(seconds)}
 private draw(t:number){const ctx=this.frame.getContext('2d')!;ctx.clearRect(0,0,840,1320);ctx.save();ctx.scale(3,3);const walking=t<5.2,phase=t*8.4,amplitude=walking?Math.min(t*3,1):Math.max(0,1-(t-5.2)/.8);const sway=Math.sin(phase)*amplitude;const bob=Math.abs(Math.sin(phase))*1.5*amplitude;
 ctx.translate(Math.sin(phase/2)*.6*amplitude,-bob);
 // Independent hip and knee transforms; both shoes remain in their lower-leg pieces.
 for(let side=0;side<2;side++){const hip=side?162:116,knee=side?164:115;const stride=Math.sin(phase+(side?Math.PI:0))*amplitude;ctx.save();ctx.translate(hip,315);ctx.rotate(stride*.055);ctx.translate(-hip,-315);ctx.save();ctx.beginPath();ctx.rect(side?141:98,313,42,48);ctx.clip();ctx.drawImage(this.original,0,0,280,440);ctx.restore();ctx.translate(knee,357);ctx.rotate(Math.max(0,-stride)*.11*(side?-1:1));ctx.translate(-knee,-357);ctx.translate(0,-Math.max(0,-stride)*4);ctx.save();ctx.beginPath();ctx.rect(side?140:96,355,45,85);ctx.clip();ctx.drawImage(this.original,0,0,280,440);ctx.restore();ctx.restore()}

 ctx.drawImage(this.torso,0,0,280,440);ctx.restore();this.texture.refresh();const progress=Math.min(t/4.8,1),scale=.76+.24*progress;this.image.setDisplaySize(280*scale,440*scale).setPosition(140*(1-scale),-12*(1-progress)+440*(1-scale)*.5);document.querySelector<HTMLElement>('#character')!.dataset.walkPhase=sway.toFixed(3)}
}
