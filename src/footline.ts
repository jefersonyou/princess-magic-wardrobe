import type Phaser from 'phaser';
import {body,garments} from './phase0/rig';
import {visualY} from './proportions';
const cache=new WeakMap<Phaser.Scene,Map<string,number>>();
export function fitFootline(scene:Phaser.Scene,worn:Set<string>){
 const shoe=[...worn].find(id=>garments[id].slot==='shoes'),outfit=[...worn].find(id=>garments[id].slot==='outer')||[...worn].find(id=>garments[id].slot==='dress'),key=shoe||'base-'+(outfit||'');let values=cache.get(scene);if(!values){values=new Map();cache.set(scene,values)}let foot=values.get(key);
 if(foot===undefined){const c=document.createElement('canvas');c.width=560;c.height=880;const ctx=c.getContext('2d')!;if(shoe)ctx.drawImage(scene.textures.get('worn-'+shoe).getSourceImage() as CanvasImageSource,0,0,560,880);else ctx.drawImage(scene.textures.get(body.atlas).getSourceImage() as CanvasImageSource,...body.frame,body.position[0]*2,body.position[1]*2,body.size[0]*2,body.size[1]*2);if(!shoe&&outfit)ctx.drawImage(scene.textures.get('worn-'+outfit).getSourceImage() as CanvasImageSource,0,0,560,880);const d=ctx.getImageData(0,0,560,880).data;foot=418;outer:for(let y=879;y>=700;y--)for(let x=180;x<380;x++)if(d[(y*560+x)*4+3]>150){foot=y/2+.25;break outer}values.set(key,foot)}
 const host=document.querySelector<HTMLElement>('#character')!;if(host.dataset.canonicalFoot!==String(foot)){host.dataset.canonicalFoot=String(foot);host.dataset.footY=String(visualY(foot));window.dispatchEvent(new Event('joy-foot-change'))}
}
