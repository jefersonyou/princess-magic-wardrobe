import adventure from './data/adventure.json' with {type:'json'};
import legacy from './data/legacy-adventure.json' with {type:'json'};
import stories from './data/story-cases.json' with {type:'json'};
import {ids} from './phase0/rig';
export type StoryTask={ids:string[];word:string;voice:string;reasonVoice?:string};
export type Episode={id:string;name:string;title:string;friend:string;reason:string;resolved:string;intro:string;result:string;reward:string;tasks:StoryTask[]};
export type Progress={version:3;stage:number;caseId:string;step:number;complete:boolean;cleared:number[];learned:string[];unlocked:string[];partial:string[];completedCases:string[]};
export const episodes=stories.episodes;
export function episode(stage:number,caseId?:string):Episode{
 const original=caseId===`legacy-${stage}`;
 const base=original?legacy.stages[stage]:adventure.stages[stage];
 const selected=episodes.find(c=>c.stage===stage&&c.id===caseId)||episodes.find(c=>c.stage===stage)!;
 return original?{...base,id:`legacy-${stage}`,title:'이전 이야기 이어하기',friend:'왕국 친구들'}:{...base,...selected,name:base.name,reward:base.reward};
}
export const freshProgress=():Progress=>({version:3,stage:0,caseId:episode(0).id,step:0,complete:false,cleared:[],learned:[],unlocked:[],partial:[],completedCases:[]});
const list=(v:unknown):unknown[]=>Array.isArray(v)?v:[];
const textList=(v:unknown):string[]=>[...new Set(list(v).filter((x):x is string=>typeof x==='string'))];
export function restoreProgress(value:unknown,oldValue?:unknown):Progress{
 const p=value as Partial<Progress>|null;
 if(p&&Number.isInteger(p.stage)&&p.stage!>=0&&p.stage!<6){
  const stage=p.stage!,hasCase=typeof p.caseId==='string',validCase=hasCase&&(p.caseId===`legacy-${stage}`||episodes.some(c=>c.stage===stage&&c.id===p.caseId));
  const keepLegacy=!hasCase&&(!!p.complete||(Number.isInteger(p.step)&&p.step!>0)||list(p.partial).length>0);
  const selected=episode(stage,validCase?p.caseId:keepLegacy?`legacy-${stage}`:undefined);
  const count=selected.tasks.length,validStep=Number.isInteger(p.step)&&p.step!>=0&&p.step!<=count;
  const keepEpisode=(!hasCase||validCase)&&validStep;
  const complete=keepEpisode&&p.complete===true,step=complete?count:keepEpisode&&p.step!<count?p.step!:0;
  let partial=complete||!keepEpisode?[]:textList(p.partial).filter(id=>selected.tasks[step].ids.includes(id));if(!complete&&partial.length===selected.tasks[step].ids.length)partial=[];
  return {version:3,stage,caseId:selected.id,step,complete,
   cleared:[...new Set(list(p.cleared).filter((x):x is number=>Number.isInteger(x)&&Number(x)>=0&&Number(x)<6))],
   learned:textList(p.learned),unlocked:textList(p.unlocked).filter(id=>ids.includes(id)),
   partial,
   completedCases:textList(p.completedCases).filter(id=>episodes.some(c=>c.id===id))};
 }
 const old=oldValue as {step?:number;complete?:boolean;learned?:unknown;unlocked?:unknown}|null;
 if(old&&Number.isInteger(old.step)&&old.step!>=0&&old.step!<=3)return {...freshProgress(),caseId:'legacy-0',step:old.complete?3:Math.min(old.step!,2),complete:!!old.complete,cleared:old.complete?[0]:[],learned:textList(old.learned),unlocked:[...new Set([...textList(old.unlocked).filter(id=>ids.includes(id)),...(old.complete?['rose']:[])])]};
 return freshProgress();
}
