import frames from './collection-frames';
export type Point=readonly[number,number];
export type Rect=readonly[number,number,number,number];
export type Slot='dress'|'shoes'|'head'|'neck'|'wrist';
export interface Sprite {atlas:'princess'|'wardrobe'|'clothes'|'accessories';frame:Rect;position:Point;size:Point}
export interface Garment extends Sprite {name:string;english:string;slot:Slot;anchor:keyof typeof anchors;rotation:number;layer:number;radius:number}
export const atlases={clothes:{url:new URL('../../public/art/clothes-collection.png',import.meta.url).href,width:1024,height:1536},accessories:{url:new URL('../../public/art/accessories-collection.png',import.meta.url).href,width:1024,height:1536},princess:{url:new URL('../../public/art/princess-atlas.png',import.meta.url).href,width:1216,height:1293},wardrobe:{url:new URL('../../public/art/wardrobe-atlas.png',import.meta.url).href,width:1086,height:1448}};
export const anchors={head:[140,40],neck:[140,111],leftShoulder:[114,119],rightShoulder:[166,119],chest:[140,140],waist:[140,178],hips:[140,220],leftHand:[52,240],rightHand:[228,240],rightWrist:[220,231],leftFoot:[117,408],rightFoot:[164,408]} as const;
export const body:Sprite={atlas:'princess',frame:[110,0,405,762],position:[33.4,21],size:[210.6,396.24]};
function item(name:string,english:string,slot:Slot,atlas:Sprite['atlas'],frame:Rect,position:Point,size:Point,rotation=0):Garment{const anchor=slot==='dress'?'waist':slot==='shoes'?'leftFoot':slot==='head'?'head':slot==='neck'?'neck':'rightWrist';return {name,english,slot,atlas,frame,position,size,rotation,anchor,layer:{dress:30,shoes:40,head:60,neck:55,wrist:56}[slot],radius:{dress:60,shoes:42,head:40,neck:29,wrist:28}[slot]}}
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
for(const g of Object.values(garments)){if(g.slot==='shoes'){g.position=[0,0];g.size=[280,440]}if(g.slot==='neck'){g.position=[128,113];g.size=[24,g.english.includes('Pearl')?14:17]}}
export type GarmentId=keyof typeof garments;
export const ids=Object.keys(garments) as GarmentId[];
export function thumbnail(id:GarmentId){const g=garments[id],a=atlases[g.atlas],[x,y,w,h]=g.frame;return `<svg viewBox="0 0 ${w} ${h}"><defs><clipPath id="crop-${id}"><rect width="${w}" height="${h}"/></clipPath></defs><image clip-path="url(#crop-${id})" href="${a.url}" x="${-x}" y="${-y}" width="${a.width}" height="${a.height}"/></svg>`}
