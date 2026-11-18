import {visualY} from './proportions';
import type Phaser from 'phaser';
// Keep the renderer's Retina resolution stable; fit only its CSS box inside the available space.
export function fitCharacterCanvas(game:Phaser.Game,host:HTMLElement){
 let frame=0;
 const fit=()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>{const width=host.clientWidth,height=host.clientHeight;if(width<=0||height<=0)return;const scale=Math.min(Math.max(1,width-16)/280,Math.max(1,height-16)/440);const canvas=game.canvas;Object.assign(canvas.style,{position:'absolute',width:280*scale+'px',height:440*scale+'px',left:(width-280*scale)/2+'px',top:height-440*scale-2+'px',margin:'0',transform:'none'});host.style.setProperty('--ground-x',(width/2)+'px');host.style.setProperty('--ground-y',(height-440*scale-2+Number(host.dataset.footY||visualY(418))*scale)+'px');host.style.setProperty('--ground-width',(66*scale)+'px');host.style.setProperty('--ground-height',(9*scale)+'px');game.scale.updateBounds();host.dataset.fit='ready';window.dispatchEvent(new Event('joy-ground-change'))})};
 const observer=new ResizeObserver(fit);observer.observe(host);window.addEventListener('joy-foot-change',fit);window.addEventListener('resize',fit);window.addEventListener('orientationchange',fit);window.visualViewport?.addEventListener('resize',fit);game.events.once('ready',fit);fit();return fit;
}
