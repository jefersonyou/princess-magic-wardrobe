// All friends use Joy's eye line and chin line; the old 0.25 horizontal stretch
// made their faces much wider than Joy on the same body.
export const friendWidthScale=.18;
export const friendBands=[[0,326,69-326*.13,.13],[326,550,69,.18],[550,1024,69+(550-326)*.18,.28]] as const;
export function friendPoint(x:number,y:number,eyeX:number){const band=friendBands.find(([,end])=>y<=end)??friendBands[2];return [140+(x-eyeX)*friendWidthScale,band[2]+(y-band[0])*band[3]] as const}
export const earlobes:Record<string,readonly[number,number,number]>={joy:[114,166,79.5],luna:[115,165,80.5],ruby:[114,166,80.5],aria:[114,166,80.5]};
