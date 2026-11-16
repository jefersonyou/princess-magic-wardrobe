import {fashionAtlases,fashionFrames} from '../fashion';
import frames from './collection-frames';
export type Point=readonly[number,number];
export type Rect=readonly[number,number,number,number];
export type Slot='dress'|'shoes'|'head'|'neck'|'wrist'|'outer'|'hands'|'held'|'face'|'hair'|'ears';
export interface Sprite {atlas:'princess'|'wardrobe'|'clothes'|'accessories'|'adventure'|'hair'|keyof typeof fashionAtlases;frame:Rect;position:Point;size:Point}
export interface Garment extends Sprite {name:string;english:string;designer?:string;slot:Slot;anchor:keyof typeof anchors;rotation:number;layer:number;radius:number}
export const atlases={...fashionAtlases,hair:{url:new URL('../../public/art/hair-extensions.png',import.meta.url).href,width:1254,height:1254},adventure:{url:new URL('../../public/art/adventure-atlas.png',import.meta.url).href,width:1536,height:1024},clothes:{url:new URL('../../public/art/clothes-collection.png',import.meta.url).href,width:1024,height:1536},accessories:{url:new URL('../../public/art/accessories-collection.png',import.meta.url).href,width:1024,height:1536},princess:{url:new URL('../../public/art/princess-atlas.png',import.meta.url).href,width:1216,height:1293},wardrobe:{url:new URL('../../public/art/wardrobe-atlas.png',import.meta.url).href,width:1086,height:1448}};
export const anchors={ears:[140,83],face:[140,69],head:[140,40],neck:[140,111],leftShoulder:[114,119],rightShoulder:[166,119],chest:[140,140],waist:[140,178],hips:[140,220],leftHand:[52,240],rightHand:[228,240],rightWrist:[220,231],leftFoot:[117,408],rightFoot:[164,408]} as const;
export const body:Sprite={atlas:'princess',frame:[110,0,405,762],position:[33.4,21],size:[210.6,396.24]};
function item(name:string,english:string,slot:Slot,atlas:Sprite['atlas'],frame:Rect,position:Point,size:Point,rotation=0):Garment{const anchor=slot==='ears'?'ears':slot==='hair'?'head':slot==='outer'?'waist':slot==='hands'?'leftHand':slot==='held'?'rightHand':slot==='face'?'face':slot==='dress'?'waist':slot==='shoes'?'leftFoot':slot==='head'?'head':slot==='neck'?'neck':'rightWrist';return {name,english,slot,atlas,frame,position,size,rotation,anchor,layer:{dress:30,shoes:40,head:60,neck:55,wrist:56,outer:35,hands:58,held:59,face:62,hair:-10,ears:64}[slot],radius:{dress:60,shoes:42,head:40,neck:29,wrist:28,outer:60,hands:32,held:38,face:30,hair:40,ears:36}[slot]}}
export const garments:Record<string,Garment>={
 dress:item('청록 왕실 드레스','Royal dress','dress','princess',[730,147,350,474],[62.5,97],[155,213.3]),
 rose:item('장미 정원 드레스','Rose dress','dress','wardrobe',[8,30,354,458],[60,99],[160,213]),
 starlight:item('별빛 드레스','Starlight dress','dress','wardrobe',[365,30,353,458],[60,99],[160,213]),
 picnic:item('데이지 피크닉','Daisy dress','dress','wardrobe',[723,30,357,458],[59,99],[162,213]),
 shoes:item('보랏빛 구두','Purple shoes','shoes','princess',[805,1174,195,88],[98.5,385],[83.85,37.84]),
 roseShoes:item('리본 플랫슈즈','Ribbon flats','shoes','wardrobe',[42,563,293,234],[96,386],[88,34]),
 starShoes:item('별 보석 구두','Star shoes','shoes','wardrobe',[392,560,297,237],[96,386],[88,34]),
 boots:item('숲속 앵클부츠','Forest boots','shoes','wardrobe',[757,552,279,245],[96,377],[88,42]),
 crown:item('작은 금빛 왕관','Golden tiara','head','princess',[230,760,171,110],[115,21],[50,32]),
 tiara:item('달빛 티아라','Moon tiara','head','wardrobe',[32,867,309,210],[114,24],[52,35]),
 flowers:item('꽃 요정 머리띠','Flower headband','head','wardrobe',[377,862,324,231],[104,31],[72,51]),
 bow:item('진주 리본','Pearl bow','head','wardrobe',[737,868,321,250],[156,49],[35,27]),
 pendant:item('자수정 목걸이','Amethyst necklace','neck','wardrobe',[42,1192,290,210],[127,110],[26,19]),
 pearls:item('진주 목걸이','Pearl necklace','neck','wardrobe',[388,1192,301,182],[127,110],[26,16]),
 bracelet:item('보석 팔찌','Gem bracelet','wrist','wardrobe',[765,1233,264,112],[211,227],[15,6],-32),
};

const dressNames=['민트 나비','세일러 마린','딸기 소풍','라벤더 발레','에메랄드 왕실','눈꽃 겨울','루비 장미','구름 산책','피치 레이스','바다 조개','가을 단풍','유니콘 꿈','겨울 축제','숲속 친구','자정의 별','블루 플라워'];
const dressEnglish=['Butterfly','Sailor','Strawberry','Ballet','Emerald','Snowflake','Ruby rose','Cloud','Peach lace','Seashell','Autumn','Unicorn','Winter party','Woodland','Midnight','Blue floral'];
for(let i=0;i<16;i++)garments['collectionDress'+i]=item(dressNames[i]+' 드레스',dressEnglish[i]+' dress','dress','clothes',frames.clothes[i] as unknown as Rect,[60,101],[160,214]);
const shoeNames=['나비 구두','마린 운동화','딸기 메리제인','발레 슈즈','눈꽃 부츠','조개 구두'];
for(let i=0;i<6;i++)garments['collectionShoes'+i]=item(shoeNames[i],['Butterfly flats','Sailor sneakers','Strawberry shoes','Ballet shoes','Snow boots','Shell shoes'][i],'shoes','clothes',frames.clothes[16+i] as unknown as Rect,[95,i===4?377:385],[90,i===4?43:35]);
const headNames=['나비 핀','마린 리본','딸기 리본','발레 티아라','에메랄드 티아라','눈꽃 티아라','장미 빗핀','초승달 핀'];
for(let i=0;i<8;i++){const tiara=[3,4,5].includes(i);garments['collectionHead'+i]=item(headNames[i],['Butterfly clip','Sailor bow','Berry bow','Ballet tiara','Emerald tiara','Snow tiara','Rose comb','Moon clip'][i],'head','accessories',frames.accessories[i] as unknown as Rect,tiara?[115,24]:[157,49],tiara?[50,32]:[33,24])}
const jewelNames=['나비','마린','하트','라벤더','에메랄드','눈꽃','장미','달빛'];
for(let i=0;i<8;i++)garments['collectionNeck'+i]=item(jewelNames[i]+' 목걸이',jewelNames[i]+' necklace','neck','accessories',frames.accessories[8+i] as unknown as Rect,[126,109],[28,20]);
for(let i=0;i<7;i++)garments['collectionWrist'+i]=item(jewelNames[i]+' 팔찌',jewelNames[i]+' bracelet','wrist','accessories',frames.accessories[16+i] as unknown as Rect,[211,227],[15,6],-32);
Object.assign(garments,{
 hairWaves:item('조이의 긴 웨이브','Wavy hair','hair','hair',[99,131,451,767],[86,25],[108,184]),
 hairBraids:item('조이의 리본 땋은 머리','Braided hair','hair','hair',[763,131,345,819],[92,26],[96,210]),
 raincoat:item('햇살 비옷','Raincoat','outer','adventure',[65,46,259,315],[51,106],[178,207]),
 winterCoat:item('눈꽃 겨울 외투','Coat','outer','adventure',[443,27,265,329],[50,103],[180,212]),
 explorer:item('탐험 셔츠와 바지','Pants','dress','adventure',[843,26,214,356],[0,0],[280,440]),
 swimsuit:item('산호 수영복','Swimsuit','dress','adventure',[1250,36,181,239],[91,111],[98,183]),
 umbrella:item('마법 우산','Umbrella','held','adventure',[41,418,327,298],[178,116],[99,126]),
 scarf:item('따뜻한 목도리','Scarf','neck','adventure',[465,445,237,243],[120,110],[40,53]),
 gloves:item('눈꽃 장갑','Gloves','hands','adventure',[819,507,279,137],[0,0],[280,440]),
 explorerHat:item('숲속 탐험 모자','Hat','head','adventure',[1212,480,258,156],[105,21],[70,42]),
 sneakers:item('민트 운동화','Sneakers','shoes','adventure',[81,821,228,134],[0,0],[280,440]),
 sandals:item('산호 샌들','Sandals','shoes','adventure',[466,809,218,152],[0,0],[280,440]),
 sunglasses:item('햇살 선글라스','Sunglasses','face','adventure',[837,841,244,90],[117,60],[46,17]),
 finalCrown:item('왕국의 별빛 왕관','Crown','head','adventure',[1227,808,228,120],[116,23],[48,25])
});
for(const g of Object.values(garments)){if(g.slot==='shoes'){g.position=[0,0];g.size=[280,440]}if(g.slot==='neck'&&g.english!=='Scarf'){g.position=[128,113];g.size=[24,g.english.includes('Pearl')?14:17]}}
const earringNames=["핑크 하트","진주 리본","로즈 골드 장미","크리스털 샹들리에","미니 왕관","자수정 물방울","사파이어 별","에메랄드 클로버","루비 하트","오팔 무지개","나비 요정","데이지 꽃","딸기 캔디","눈꽃 결정","인어 조개","초승달 진주","별똥별","유니콘 드림","파스텔 무지개","마법 지팡이"];
const earringEnglish=["Pink heart","Pearl bow","Rose gold rose","Crystal chandelier","Mini crown","Amethyst drop","Sapphire star","Emerald clover","Ruby heart","Opal rainbow","Fairy butterfly","Daisy flower","Strawberry candy","Snowflake","Mermaid shell","Pearl moon","Shooting star","Unicorn dream","Pastel rainbow","Magic wand"];
for(let i=0;i<20;i++)garments['earring'+i]=item(earringNames[i]+' 귀걸이',earringEnglish[i],'ears','fashionEars',fashionFrames.earrings.frames[i],[0,0],[280,440]);
const sunglassNames=["로열 캣아이","핑크 하트","라벤더 버터플라이","골드 라운드","스타 글리터","민트 스퀘어","레인보우 오버사이즈","진주 화이트","체리 레드","문라이트 실버"];
const sunglassEnglish=["Royal cat-eye","Pink heart","Lavender butterfly","Golden round","Glitter star","Mint square","Rainbow oversized","Pearl white","Cherry red","Moonlight silver"];
for(let i=0;i<10;i++)garments['sunglass'+i]=item(sunglassNames[i]+' 선글라스',sunglassEnglish[i],'face','fashionEyes',fashionFrames.sunglasses.frames[i],[0,0],[280,440]);
const gloveNames=["핑크 새틴","진주 레이스","로열 골드","라벤더 리본","눈꽃 벨벳","민트 요정","장미 자수","별빛 글리터","나비 파스텔","레드 하트"];
const gloveEnglish=["Pink satin","Pearl lace","Royal gold","Lavender ribbon","Snowflake velvet","Mint fairy","Rose embroidery","Starlight glitter","Pastel butterfly","Red heart"];
for(let i=0;i<10;i++)garments['fashionGloves'+i]=item(gloveNames[i]+' 장갑',gloveEnglish[i],'hands','fashionHands',fashionFrames.gloves.frames[i],[0,0],[280,440]);
for(const [id,name,english,slot,frame] of [
 ['jianDress','지안의 햇살 꽃 드레스','Jian’s sunshine dress','dress',[100,0,570,520]],
 ['jianFlower','지안의 꽃 리본','Jian’s flower bow','head',[970,160,405,225]],
 ['jianBoots','지안의 꽃 장화','Jian’s flower boots','shoes',[250,580,270,355]],
 ['jianEarrings','지안의 꽃 귀걸이','Jian’s flower earrings','ears',[970,670,380,205]]
] as const)garments[id]={...item(name,english,slot,'jian',frame,[0,0],[280,440]),designer:'지안'};
export type GarmentId=keyof typeof garments;
export const ids=Object.keys(garments) as GarmentId[];
export function thumbnail(id:GarmentId){const g=garments[id],a=atlases[g.atlas],[x,y,w,h]=g.frame;return `<svg viewBox="0 0 ${w} ${h}"><defs><clipPath id="crop-${id}"><rect width="${w}" height="${h}"/></clipPath></defs><image clip-path="url(#crop-${id})" href="${a.url}" x="${-x}" y="${-y}" width="${a.width}" height="${a.height}"/></svg>`}
