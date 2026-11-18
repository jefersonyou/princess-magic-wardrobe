export type Wrist={x:number;y:number;dx:number;dy:number;width:number;length:number};
type Row={y:number;x:number;width:number};
const clamp=(x:number,a:number,b:number)=>Math.max(a,Math.min(b,x));
// Follow the exposed forearm, rather than a fixed rectangle for every outfit.
export function findWrist(source:HTMLCanvasElement,side:0|1):Wrist{
 const scale=source.width/280,data=source.getContext('2d')!.getImageData(0,0,source.width,source.height),rows:Row[]=[];
 let previous=side===0?87:193,started=false,missing=0;
 for(let y=195;y<318;y++){
  const runs:{x:number;width:number}[]=[];let start=-1;
  const lo=side===0?15:175,hi=side===0?105:265;
  for(let x=lo;x<=hi;x++){
   const k=(Math.round(y*scale)*source.width+Math.round(x*scale))*4;
   const skin=x<hi&&data.data[k+3]>180&&data.data[k]>145&&data.data[k]>data.data[k+1]*1.08&&data.data[k+1]>data.data[k+2]*1.08&&data.data[k+2]>data.data[k+1]*.55;
   if(skin&&start<0)start=x;
   if(!skin&&start>=0){if(x-start>=3)runs.push({x:(start+x-1)/2,width:x-start});start=-1}
  }
  runs.sort((a,b)=>Math.abs(a.x-previous)-Math.abs(b.x-previous));const run=runs[0];
  if(!run||Math.abs(run.x-previous)>(started?12:30)){if(started&&++missing>2)break;continue}
  started=true;missing=0;previous=run.x;rows.push({y,...run});
 }
 const fallback:Wrist={x:side===0?71:209,y:229,dx:side===0?-.52:.52,dy:.854,width:9,length:31};
 if(rows.length<25)return fallback;
 const end=rows.at(-1)!.y,palm=rows.filter(r=>r.y>=end-27&&r.y<=end-8).sort((a,b)=>b.width-a.width)[0];if(!palm)return fallback;
 const candidates=rows.filter(r=>r.y>=palm.y-18&&r.y<=palm.y-5&&r.width>=5).sort((a,b)=>a.width-b.width||b.y-a.y);const wrist=candidates[0];if(!wrist)return fallback;
 const before=rows.find(r=>r.y===wrist.y-12),after=rows.find(r=>r.y===wrist.y-4);
 let dx=after&&before?after.x-before.x:fallback.dx*8,dy=8;
 if((side===0&&dx>=-1)||(side===1&&dx<=1)){dx=fallback.dx*8;dy=fallback.dy*8}const norm=Math.hypot(dx,dy);dx/=norm;dy/=norm;
 return {x:wrist.x,y:wrist.y,dx,dy,width:clamp(wrist.width*dy,7,13),length:clamp(end-wrist.y,23,35)};
}
export function eraseHand(ctx:CanvasRenderingContext2D,wrist:Wrist){ctx.save();ctx.globalCompositeOperation='destination-out';ctx.translate(wrist.x,wrist.y);ctx.rotate(Math.atan2(-wrist.dx,wrist.dy));ctx.fillRect(-19,-.5,38,62);ctx.restore()}
export function gloveLandmark(image:HTMLImageElement,frame:readonly number[]){
 const [x,y,w,h]=frame,c=document.createElement('canvas');c.width=w;c.height=h;const ctx=c.getContext('2d')!;ctx.drawImage(image,x,y,w,h,0,0,w,h);const d=ctx.getImageData(0,0,w,h).data;
 function row(f:number){const yy=Math.round(h*f);let l=w,r=0;for(let xx=0;xx<w;xx++)if(d[(yy*w+xx)*4+3]>180){l=Math.min(l,xx);r=Math.max(r,xx)}return {x:(l+r)/2,y:yy,width:r-l+1}}
 const cuff=row(.065),palm=row(.52);return {cuff,angle:Math.atan2(cuff.x-palm.x,palm.y-cuff.y),length:h-cuff.y};
}
export function drawFittedGlove(ctx:CanvasRenderingContext2D,image:HTMLImageElement,frame:readonly number[],wrist:Wrist,custom?:ReturnType<typeof gloveLandmark>){
 const [x,y,w,h]=frame,landmark=custom??gloveLandmark(image,frame),angle=Math.atan2(-wrist.dx,wrist.dy);
 ctx.save();ctx.translate(wrist.x,wrist.y);ctx.rotate(angle);ctx.scale(wrist.width*1.08/landmark.cuff.width,wrist.length*1.05/landmark.length);ctx.rotate(-landmark.angle);ctx.drawImage(image,x,y,w,h,-landmark.cuff.x,-landmark.cuff.y,w,h);ctx.restore();
}
// Remove only the exposed resting arm, not a triangle of the dress beside it.
export function removeRestingArm(ctx:CanvasRenderingContext2D){
 const canvas=ctx.canvas,scale=canvas.width/280,w=canvas.width,h=canvas.height,image=ctx.getImageData(0,0,w,h),d=image.data,wrist=findWrist(canvas,1),seen=new Uint8Array(w*h),queue:number[]=[];
 const allowed=(x:number,y:number)=>{const yy=y/scale,xx=x/scale,k=(y*w+x)*4,boundary=yy<190?167+(yy-145)*.15:174+(yy-190)*.3;return y>=145*scale&&y<318*scale&&xx>boundary&&d[k+3]>25&&d[k]>140&&d[k]>d[k+1]*1.08&&d[k+1]>d[k+2]*1.04&&d[k+2]>d[k+1]*.55};
 for(let radius=0;radius<8&&!queue.length;radius++)for(let oy=-radius;oy<=radius;oy++)for(let ox=-radius;ox<=radius;ox++){const x=Math.round(wrist.x*scale)+ox,y=Math.round(wrist.y*scale)+oy;if(x>=0&&x<w&&y>=0&&y<h&&allowed(x,y)){const p=y*w+x;seen[p]=1;queue.push(p)}}
 for(let i=0;i<queue.length;i++){const p=queue[i],x=p%w,y=Math.floor(p/w);for(const [nx,ny]of [[x-1,y],[x+1,y],[x,y-1],[x,y+1]]){const n=ny*w+nx;if(nx>=0&&nx<w&&ny>=0&&ny<h&&!seen[n]&&allowed(nx,ny)){seen[n]=1;queue.push(n)}}}
 // A one-pixel edge removes the antialiased skin fringe without eating the sleeve.
 for(const p of queue){d[p*4+3]=0;const x=p%w,y=Math.floor(p/w);for(const [nx,ny]of [[x-1,y],[x+1,y],[x,y-1],[x,y+1]])if(nx>=0&&nx<w&&ny>=0&&ny<h){const k=(ny*w+nx)*4;if(d[k]>d[k+1]*1.08&&d[k+1]>d[k+2]*1.02)d[k+3]=0}}
 ctx.putImageData(image,0,0);
}
