import {bodyCenterX} from './anatomy';
// All friends share Joy's eye line (y=69), chin line (y=98), and cheek/jaw width (~54px / 32px).
export const friendWidthScale=.175;
export const friendBands=[[0,326,69-326*.132,.132],[326,550,69,.18],[550,1024,69+(550-326)*.18,.26]] as const;
export function friendPoint(x:number,y:number,eyeX:number){const band=friendBands.find(([,end])=>y<=end)??friendBands[2];return [bodyCenterX+(x-eyeX)*friendWidthScale,band[2]+(y-band[0])*band[3]] as const}
export const earlobes:Record<string,readonly[number,number,number]>={joy:[114,166,79.5],luna:[113.2,161.8,80.5],ruby:[114.2,164.8,80.5],aria:[116.1,166.9,80.5]};
export type HeadFit={crownY:number;hatY:number;flowersY:number;sideClipX:number;sideClipY:number};
export const headFit:Record<string,HeadFit>={
 joy:{crownY:0,hatY:0,flowersY:0,sideClipX:0,sideClipY:0},
 luna:{crownY:-1,hatY:-1,flowersY:-1,sideClipX:-11,sideClipY:-2},
 ruby:{crownY:2.5,hatY:2,flowersY:2,sideClipX:-9,sideClipY:2},
 aria:{crownY:-1,hatY:-2,flowersY:-1,sideClipX:-6,sideClipY:-1}
};
