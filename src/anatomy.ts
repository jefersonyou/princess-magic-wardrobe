// Measured from Joy's original neck/waist and bare feet, in 280×440 rig space.
export const bodyCenterX=138;
export const feet=[114.5,161.5] as const;
export const shoeFloor=414;
export function fitExplorerPants(canvas:HTMLCanvasElement){
 const w=canvas.width,h=canvas.height,s=w/280,ctx=canvas.getContext('2d')!,pants=document.createElement('canvas');pants.width=w;pants.height=h;const pc=pants.getContext('2d')!,mask=pc.createImageData(w,h);ctx.save();ctx.setTransform(1,0,0,1,0,0);
 // Align the whole explorer torso with Joy, then widen only the trouser legs.
 const original=document.createElement('canvas');original.width=w;original.height=h;original.getContext('2d')!.drawImage(canvas,0,0);ctx.clearRect(0,0,w,h);ctx.drawImage(original,-2*s,0);const aligned=ctx.getImageData(0,0,w,h);
 for(let y=Math.floor(215*s);y<Math.min(h,397*s);y++)for(let x=Math.floor(88*s);x<193*s;x++){const k=(y*w+x)*4,r=aligned.data[k],g=aligned.data[k+1],b=aligned.data[k+2],skin=r>g*1.08&&g>b*1.04&&b>g*.55;if(!skin&&aligned.data[k+3]){for(let i=0;i<4;i++)mask.data[k+i]=aligned.data[k+i];aligned.data[k+3]=0}}
 ctx.putImageData(aligned,0,0);pc.putImageData(mask,0,0);
 const centers:number[]=[];const row=Math.floor(388*s);for(const [lo,hi]of [[90,138],[138,190]]){let left=hi*s,right=lo*s;for(let x=Math.floor(lo*s);x<hi*s;x++)if(mask.data[(row*w+x)*4+3]>150){left=Math.min(left,x);right=Math.max(right,x)}centers.push((left+right)/2/s)}
 const factors=[(bodyCenterX-feet[0])/(bodyCenterX-centers[0]),(feet[1]-bodyCenterX)/(centers[1]-bodyCenterX)];
 for(let y=215;y<397;y++){const t=Math.min(1,Math.max(0,(y-215)/(388-215)));for(const side of [0,1]){const factor=1+(factors[side]-1)*t,lo=side?bodyCenterX:88,width=side?193-bodyCenterX:bodyCenterX-88;ctx.drawImage(pants,lo*s,y*s,width*s,s,side?bodyCenterX*s:(bodyCenterX-width*factor)*s,y*s,width*factor*s,s)}}
 ctx.restore();
}
