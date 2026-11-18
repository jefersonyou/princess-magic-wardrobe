import {visualY} from './proportions';
export function groundCamera(sourceWidth:number,sourceHeight:number,stageWidth:number,footX:number,footY:number){
 const sceneHeight=Math.max(120,footY/.9),scale=Math.max(stageWidth/sourceWidth,sceneHeight/sourceHeight);
 return {x:footX-sourceWidth*scale/2,y:sceneHeight-sourceHeight*scale,width:sourceWidth*scale,height:sourceHeight*scale,bottom:sceneHeight,sourceFloorY:sourceHeight-(sceneHeight-footY)/scale};
}
let source:HTMLImageElement|undefined,pending=0;
export function useGroundedBackground(url:string){if(source?.src===url){refreshGround();return}const image=new Image();source=image;image.onload=()=>{if(source===image)refreshGround()};image.src=url;}
export function refreshGround(){cancelAnimationFrame(pending);pending=requestAnimationFrame(()=>{
 if(!source?.complete||!source.naturalWidth)return;
 const model=document.querySelector<HTMLCanvasElement>('#character canvas'),stage=document.querySelector<HTMLElement>('.stage'),background=document.querySelector<HTMLElement>('#scene-backdrop');if(!model||!stage||!background)return;
 const r=model.getBoundingClientRect(),s=stage.getBoundingClientRect();if(!r.width||!r.height)return;
 const footX=r.left+r.width/2,footY=r.top+Number(model.parentElement?.dataset.footY||visualY(418))*r.height/440;
 const camera=groundCamera(source.naturalWidth,source.naturalHeight,s.width,footX,footY),density=Math.min(devicePixelRatio,2),w=innerWidth,h=innerHeight;
 const c=document.createElement('canvas');c.width=Math.round(w*density);c.height=Math.round(h*density);const ctx=c.getContext('2d')!;ctx.scale(density,density);ctx.fillStyle='#efd7d5';ctx.fillRect(0,0,w,h);
 // Continue the floor texture and outer edges behind the controls and wardrobe.
 // The visible character stands at the centre of the actual floor in the artwork.
 if(camera.x>0)ctx.drawImage(source,0,0,1,source.naturalHeight,0,camera.y,camera.x,camera.height);
 const right=camera.x+camera.width;if(right<w)ctx.drawImage(source,source.naturalWidth-1,0,1,source.naturalHeight,right,camera.y,w-right,camera.height);
 ctx.drawImage(source,camera.x,camera.y,camera.width,camera.height);
 if(camera.bottom<h){
  const tileHeight=Math.min(160,camera.height*.25),tile=document.createElement('canvas');tile.width=c.width;tile.height=Math.max(1,Math.round(tileHeight*density));
  tile.getContext('2d')!.drawImage(c,0,Math.max(0,(camera.bottom-tileHeight)*density),c.width,tile.height,0,0,tile.width,tile.height);
  for(let y=camera.bottom,i=0;y<h;y+=tileHeight,i++){ctx.save();if(i%2===0){ctx.translate(0,2*y+tileHeight);ctx.scale(1,-1)}ctx.drawImage(tile,0,y,w,tileHeight);ctx.restore()}
 }
 background.style.backgroundImage=`url("${c.toDataURL()}")`;background.style.backgroundSize='100% 100%';background.dataset.groundY=String(footY);background.dataset.floorRatio=String(camera.sourceFloorY/source.naturalHeight);background.dataset.ready='true';background.dataset.scene=document.body.dataset.scene||'-1';
 });}
if(typeof window!=='undefined'){window.addEventListener('joy-ground-change',refreshGround);window.addEventListener('resize',refreshGround);window.visualViewport?.addEventListener('resize',refreshGround);}
export function photoShadow(ctx:CanvasRenderingContext2D,x:number,y:number,width:number){ctx.save();ctx.translate(x,y);ctx.scale(width/2,Math.max(3,width*.065));const g=ctx.createRadialGradient(0,0,0,0,0,1);g.addColorStop(0,'rgba(63,39,40,.29)');g.addColorStop(.4,'rgba(63,39,40,.12)');g.addColorStop(1,'rgba(63,39,40,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,1,0,Math.PI*2);ctx.fill();ctx.restore()}
