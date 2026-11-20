import {bodyCenterX} from './anatomy';
import {visualY} from './proportions';
import type Phaser from 'phaser';

export const zoomLevels=[0.85,1,1.25,1.5,1.75,2] as const;
const ZOOM_STORAGE_KEY='joy-character-zoom';

export interface CharacterFitController {
 refit:()=>void;
 setZoom:(value:number)=>void;
 stepZoom:(delta:1|-1)=>void;
 resetZoom:()=>void;
 setWalkOverride:(active:boolean)=>void;
 getZoom:()=>number;
}

// Keep the renderer's Retina resolution stable; fit and optionally zoom its CSS box inside #character.
export function fitCharacterCanvas(game:Phaser.Game,host:HTMLElement):CharacterFitController{
 let frame=0;
 let zoom=1;
 let panRatio=1; // 1 = top/head-focused when zoomed in, 0 = bottom/feet-focused
 let walkOverride=false;
 try{
  const saved=Number(localStorage.getItem(ZOOM_STORAGE_KEY));
  if(zoomLevels.some(z=>Math.abs(z-saved)<0.001))zoom=saved;
 }catch{}

 const zoomOutBtn=document.querySelector<HTMLButtonElement>('#zoom-out');
 const zoomResetBtn=document.querySelector<HTMLButtonElement>('#zoom-reset');
 const zoomInBtn=document.querySelector<HTMLButtonElement>('#zoom-in');

 const syncButtons=()=>{
  const effective=walkOverride?1:zoom;
  host.dataset.zoom=String(effective);
  host.classList.toggle('zoomed',effective>1.001);
  if(zoomResetBtn)zoomResetBtn.textContent=`${Math.round(effective*100)}%`;
  if(zoomOutBtn)zoomOutBtn.disabled=walkOverride||zoom<=zoomLevels[0];
  if(zoomInBtn)zoomInBtn.disabled=walkOverride||zoom>=zoomLevels[zoomLevels.length-1];
 };

 const fit=()=>{
  cancelAnimationFrame(frame);
  frame=requestAnimationFrame(()=>{
   const width=host.clientWidth,height=host.clientHeight;
   if(width<=0||height<=0)return;
   const effectiveZoom=walkOverride?1:zoom;
   const baseScale=Math.min(Math.max(1,width-16)/280,Math.max(1,height-16)/440);
   const scale=baseScale*effectiveZoom;
   const canvasW=280*scale,canvasH=440*scale;
   const left=(width-canvasW)/2;
   const minTop=height-canvasH-2;
   const maxTop=6;
   let top=minTop;
   if(effectiveZoom>1&&maxTop>minTop){
    panRatio=Math.max(0,Math.min(1,panRatio));
    top=minTop+(maxTop-minTop)*panRatio;
   }else{
    panRatio=1;
   }
   const canvas=game.canvas;
   Object.assign(canvas.style,{position:'absolute',width:canvasW+'px',height:canvasH+'px',left:left+'px',top:top+'px',margin:'0',transform:'none'});
   const footYModel=Number(host.dataset.footY||visualY(418));
   host.style.setProperty('--ground-x',(left+bodyCenterX*scale)+'px');
   host.style.setProperty('--ground-y',(top+footYModel*scale)+'px');
   host.style.setProperty('--ground-width',(66*scale)+'px');
   host.style.setProperty('--ground-height',(9*scale)+'px');
   // Store unzoomed (1x) floor anchor so the room backdrop stays serene and grounded during zoom.
   const baseLeft=(width-280*baseScale)/2,baseTop=height-440*baseScale-2;
   host.dataset.baseFootX=String(baseLeft+bodyCenterX*baseScale);
   host.dataset.baseFootY=String(baseTop+footYModel*baseScale);
   syncButtons();
   game.scale.updateBounds();
   host.dataset.fit='ready';
   window.dispatchEvent(new Event('joy-ground-change'));
  });
 };

 const setZoom=(next:number)=>{
  const clamped=zoomLevels.reduce((best,z)=>Math.abs(z-next)<Math.abs(best-next)?z:best,zoomLevels[1]);
  if(clamped===zoom&&!walkOverride){syncButtons();return}
  const wasZoomed=zoom>1;
  zoom=clamped;
  if(zoom>1&&!wasZoomed)panRatio=1;
  if(zoom<=1)panRatio=1;
  try{localStorage.setItem(ZOOM_STORAGE_KEY,String(zoom))}catch{}
  fit();
 };

 const stepZoom=(delta:1|-1)=>{
  const idx=zoomLevels.findIndex(z=>Math.abs(z-zoom)<0.001);
  const currentIdx=idx>=0?idx:1;
  const target=zoomLevels[Math.max(0,Math.min(zoomLevels.length-1,currentIdx+delta))];
  setZoom(target);
 };

 const resetZoom=()=>setZoom(1);
 const setWalkOverride=(active:boolean)=>{if(walkOverride===active)return;walkOverride=active;fit()};

 zoomOutBtn?.addEventListener('click',()=>stepZoom(-1));
 zoomInBtn?.addEventListener('click',()=>stepZoom(1));
 zoomResetBtn?.addEventListener('click',resetZoom);

 // Vertical drag-to-pan directly on the stage when zoomed in (does not conflict with wardrobe item drags).
 let panDrag:{pointer:number;startY:number;startRatio:number;span:number}|null=null;
 host.addEventListener('pointerdown',e=>{
  if(walkOverride||zoom<=1||!e.isPrimary||e.button!==0)return;
  const width=host.clientWidth,height=host.clientHeight;
  const baseScale=Math.min(Math.max(1,width-16)/280,Math.max(1,height-16)/440);
  const span=6-(height-440*baseScale*zoom-2);
  if(span<=4)return;
  host.setPointerCapture(e.pointerId);
  host.classList.add('panning');
  panDrag={pointer:e.pointerId,startY:e.clientY,startRatio:panRatio,span};
 });
 host.addEventListener('pointermove',e=>{
  if(!panDrag||panDrag.pointer!==e.pointerId)return;
  const dy=e.clientY-panDrag.startY;
  panRatio=Math.max(0,Math.min(1,panDrag.startRatio+dy/panDrag.span));
  fit();
 });
 const endPan=(e:PointerEvent)=>{
  if(!panDrag||panDrag.pointer!==e.pointerId)return;
  panDrag=null;host.classList.remove('panning');
  try{host.releasePointerCapture(e.pointerId)}catch{}
 };
 host.addEventListener('pointerup',endPan);
 host.addEventListener('pointercancel',endPan);

 // Wheel zoom (Ctrl/Meta + wheel) or vertical pan when zoomed in.
 host.addEventListener('wheel',e=>{
  if(walkOverride)return;
  if(e.ctrlKey||e.metaKey){
   e.preventDefault();
   stepZoom(e.deltaY<0?1:-1);
  }else if(zoom>1){
   const width=host.clientWidth,height=host.clientHeight;
   const baseScale=Math.min(Math.max(1,width-16)/280,Math.max(1,height-16)/440);
   const span=6-(height-440*baseScale*zoom-2);
   if(span>4){
    e.preventDefault();
    panRatio=Math.max(0,Math.min(1,panRatio-e.deltaY/span));
    fit();
   }
  }
 },{passive:false});

 window.addEventListener('keydown',e=>{
  if(walkOverride||document.querySelector('dialog[open]'))return;
  const tag=(e.target as HTMLElement|null)?.tagName;
  if(tag==='INPUT'||tag==='TEXTAREA'||tag==='SELECT')return;
  if(e.key==='+'||e.key==='='){e.preventDefault();stepZoom(1)}
  else if(e.key==='-'||e.key==='_'){e.preventDefault();stepZoom(-1)}
  else if(e.key==='0'){e.preventDefault();resetZoom()}
 });

 const observer=new ResizeObserver(fit);observer.observe(host);
 window.addEventListener('joy-foot-change',fit);
 window.addEventListener('resize',fit);
 window.addEventListener('orientationchange',fit);
 window.visualViewport?.addEventListener('resize',fit);
 game.events.once('ready',fit);
 fit();
 return {refit:fit,setZoom,stepZoom,resetZoom,setWalkOverride,getZoom:()=>zoom};
}
