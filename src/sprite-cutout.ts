// Atlas cells can contain a thin edge of a neighbouring item. Keep only the
// actual connected shoe, plus its antialiased border, before fitting it.
export function isolatedSprite(source:CanvasImageSource,x:number,y:number,w:number,h:number){
 const c=document.createElement('canvas');c.width=w;c.height=h;const ctx=c.getContext('2d')!;ctx.drawImage(source,x,y,w,h,0,0,w,h);const image=ctx.getImageData(0,0,w,h),d=image.data,seen=new Uint8Array(w*h);let largest:number[]=[];
 for(let p=0;p<w*h;p++){if(seen[p]||d[p*4+3]<80)continue;const queue=[p];seen[p]=1;for(let i=0;i<queue.length;i++){const n=queue[i],xx=n%w,yy=Math.floor(n/w);for(let oy=-1;oy<=1;oy++)for(let ox=-1;ox<=1;ox++){const nx=xx+ox,ny=yy+oy,k=ny*w+nx;if(nx>=0&&nx<w&&ny>=0&&ny<h&&!seen[k]&&d[k*4+3]>=80){seen[k]=1;queue.push(k)}}}if(queue.length>largest.length)largest=queue}
 const keep=new Uint8Array(w*h);for(const n of largest){const xx=n%w,yy=Math.floor(n/w);for(let oy=-1;oy<=1;oy++)for(let ox=-1;ox<=1;ox++){const nx=xx+ox,ny=yy+oy;if(nx>=0&&nx<w&&ny>=0&&ny<h)keep[ny*w+nx]=1}}
 for(let p=0;p<w*h;p++)if(!keep[p])d[p*4+3]=0;ctx.putImageData(image,0,0);return c;
}
