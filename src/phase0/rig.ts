export type Point = readonly [number,number];
export type GarmentId = 'dress'|'shoes'|'crown';
export type Rect = readonly [number,number,number,number];
export interface Sprite {frame:Rect;position:Point;size:Point}
export interface Garment extends Sprite {anchor:keyof typeof anchors;rotation:number;layer:number;radius:number}
// Coordinates in the 1216×1294 source atlas, mapped to the shared 280×440 stage.
export const atlasUrl= new URL('../../public/art/princess-atlas.png',import.meta.url).href;
export const anchors={head:[140,40],neck:[140,108],leftShoulder:[114,119],rightShoulder:[166,119],chest:[140,140],waist:[140,178],hips:[140,220],leftHand:[52,240],rightHand:[228,240],leftFoot:[117,408],rightFoot:[164,408]} as const;
export const body:Sprite={frame:[110,0,405,762],position:[33.4,21],size:[210.6,396.24]};
export const garments:Record<GarmentId,Garment>={
 dress:{frame:[730,147,350,474],position:[62.5,100],size:[155,213.3],anchor:'waist',rotation:0,layer:30,radius:60},
 shoes:{frame:[805,1202,195,88],position:[98.5,385],size:[83.85,37.84],anchor:'leftFoot',rotation:0,layer:40,radius:42},
 crown:{frame:[230,760,171,110],position:[95.5,6],size:[88.92,57.2],anchor:'head',rotation:0,layer:60,radius:40}
};
export function thumbnail(id:GarmentId){const [x,y,w,h]=garments[id].frame;return `<svg viewBox="0 0 ${w} ${h}"><defs><clipPath id="crop-${id}"><rect width="${w}" height="${h}"/></clipPath></defs><image clip-path="url(#crop-${id})" href="${atlasUrl}" x="${-x}" y="${-y}" width="1216" height="1294"/></svg>`}
