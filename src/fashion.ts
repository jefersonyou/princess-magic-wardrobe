import frames from './fashion-frames';
export const fashionAtlases={
 jian:{url:new URL('../public/art/jian-design.png',import.meta.url).href,width:1536,height:1024},
 fashionEars:{url:new URL('../public/art/fashion/earrings.png',import.meta.url).href,width:frames.earrings.width,height:frames.earrings.height},
 fashionEyes:{url:new URL('../public/art/fashion/sunglasses.png',import.meta.url).href,width:frames.sunglasses.width,height:frames.sunglasses.height},
 fashionHands:{url:new URL('../public/art/fashion/gloves.png',import.meta.url).href,width:frames.gloves.width,height:frames.gloves.height},
 fashionGrip:{url:new URL('../public/art/fashion/gloves-grip.png',import.meta.url).href,width:frames['gloves-grip'].width,height:frames['gloves-grip'].height}
};
export const fashionIds=[...Array.from({length:20},(_,i)=>'earring'+i),...Array.from({length:10},(_,i)=>'sunglass'+i),...Array.from({length:10},(_,i)=>'fashionGloves'+i)];
export {frames as fashionFrames};
