import {anchors,garments,type GarmentId} from './rig';
export function canSnap(id:GarmentId,x:number,y:number){const g=garments[id],a=anchors[g.anchor];return Math.hypot(x-a[0],y-a[1])<=g.radius}
export function canvasPoint(rect:Pick<DOMRect,'left'|'top'|'width'|'height'>,x:number,y:number){return {x:(x-rect.left)*280/rect.width,y:(y-rect.top)*440/rect.height}}
