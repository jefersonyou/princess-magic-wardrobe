const label=document.querySelector<HTMLElement>('#offline-status')!;
const dialog=document.querySelector<HTMLDialogElement>('#install-dialog')!;
document.querySelector('#install-help')!.addEventListener('click',()=>dialog.showModal());
document.querySelector('#close-install')!.addEventListener('click',()=>dialog.close());
if(import.meta.env.PROD && 'serviceWorker' in navigator){
 const manifest=document.querySelector<HTMLLinkElement>('link[rel=manifest]')!;
 const appBase=new URL('./',manifest.href);
 const hadController=!!navigator.serviceWorker.controller;
 navigator.serviceWorker.register(new URL('sw.js',appBase),{scope:appBase.pathname,updateViaCache:'none'}).then(async(registration)=>{
  void registration.update();
  await navigator.serviceWorker.ready;
  const check=()=>{const worker=navigator.serviceWorker.controller;if(worker){const channel=new MessageChannel();channel.port1.onmessage=e=>{if(e.data==='OFFLINE_READY')label.textContent='오프라인 준비 완료'};worker.postMessage('CHECK_READY',[channel.port2])}};
  navigator.serviceWorker.addEventListener('controllerchange',()=>{check();if(hadController){label.textContent='새 버전 준비 완료 · 여기를 눌러 새로고침';label.style.cursor='pointer';label.onclick=()=>location.reload()}});check();
 }).catch(()=>{label.textContent='설치 준비 실패 · 인터넷 연결 후 다시 열어주세요.'});
}else label.textContent=import.meta.env.DEV?'개발 미리보기 · 설치는 배포 주소에서 가능':'Safari의 HTTPS 주소에서 열어주세요.';
