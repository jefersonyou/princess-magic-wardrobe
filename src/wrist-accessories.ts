import type Phaser from 'phaser';
import {poseWrists} from './fashion-renderer';
// Bracelets in the art sheet already lean at an angle. Measure that angle
// before fitting the band across the actual wrist, preserving the artwork's aspect.
export function braceletLandmark(source:HTMLCanvasElement){
 const {width:w,height:h}=source,d=source.getContext('2d')!.getImageData(0,0,w,h).data,points:number[][]=[];let cx=0,cy=0;
 for(let y=0;y<h;y++)for(let x=0;x<w;x++)if(d[(y*w+x)*4+3]>180){points.push([x,y]);cx+=x;cy+=y}
 cx/=points.length;cy/=points.length;let xx=0,yy=0,xy=0;for(const [x,y]of points){xx+=(x-cx)**2;yy+=(y-cy)**2;xy+=(x-cx)*(y-cy)}
 const angle=.5*Math.atan2(2*xy,xx-yy),cos=Math.cos(angle),sin=Math.sin(angle);
 const u=points.map(([x,y])=>(x-cx)*cos+(y-cy)*sin).sort((a,b)=>a-b),v=points.map(([x,y])=>-(x-cx)*sin+(y-cy)*cos).sort((a,b)=>a-b),lo=Math.floor(points.length*.01),hi=Math.floor(points.length*.99);
 const midU=(u[lo]+u[hi])/2,midV=(v[lo]+v[hi])/2;
 return {x:cx+midU*cos-midV*sin,y:cy+midU*sin+midV*cos,angle,width:u[hi]-u[lo]};
}
const cache=new WeakMap<Phaser.Scene,string[]>();
export function prepareBraceletFit(scene:Phaser.Scene,id:string,outfit:string|undefined,held:boolean){
 const key='fitted-'+id+'-'+(outfit||'base')+(held?'-raised':'');
 if(!scene.textures.exists(key)){
  const wrist=poseWrists(scene,outfit,held)[1],source=scene.textures.get('bracelet-art-'+id).getSourceImage() as HTMLCanvasElement,landmark=braceletLandmark(source),width=Math.max(10,Math.min(16,wrist.width+3)),scale=width/landmark.width;
  const canvas=document.createElement('canvas');canvas.width=560;canvas.height=880;const ctx=canvas.getContext('2d')!;ctx.scale(2,2);ctx.translate(wrist.x-wrist.dx*3,wrist.y-wrist.dy*3);ctx.rotate(Math.atan2(-wrist.dx,wrist.dy)-landmark.angle);ctx.scale(scale,scale);ctx.drawImage(source,-landmark.x,-landmark.y);scene.textures.addCanvas(key,canvas);
  let keys=cache.get(scene);if(!keys){keys=[];cache.set(scene,keys)}keys.push(key);if(keys.length>24)scene.textures.remove(keys.shift()!);
 }
 return key;
}

export function applyBraceletFit(scene:Phaser.Scene,id:string,outfit:string|undefined,held:boolean,layers:Map<string,Phaser.GameObjects.Image>){layers.get(id)!.setTexture(prepareBraceletFit(scene,id,outfit,held)).setPosition(0,0).setDisplaySize(280,440).setAngle(0).setDepth(66)}
