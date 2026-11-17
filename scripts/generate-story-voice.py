"""Generate the approved story expansion with the same fairy voice as the game.
Run with edge-tts==7.3.1. Four concurrent requests, resumable and content checked.
"""
import asyncio,hashlib,json,os,ssl
from pathlib import Path
import edge_tts
import edge_tts.communicate
if os.environ.get('SSL_CERT_FILE'):
    edge_tts.communicate._SSL_CTX=ssl.create_default_context(cafile=os.environ['SSL_CERT_FILE'])
ROOT=Path(__file__).resolve().parent.parent
LINES={k:v[0]for k,v in json.loads((ROOT/'src/data/adventure.json').read_text())['lines'].items()if k.startswith('story-')}
TARGET=ROOT/'public/audio'
MANIFEST=TARGET/'story-voice-manifest.json'
async def main():
    old=json.loads(MANIFEST.read_text())if MANIFEST.exists()else{}
    records=dict(old);gate=asyncio.Semaphore(4)
    async def generate(key,line):
        digest=hashlib.sha256(line.encode()).hexdigest();path=TARGET/(key+'.mp3')
        if path.exists()and path.stat().st_size>1000 and old.get(key,{}).get('textSha256')==digest:return
        async with gate:
            for attempt in range(4):
                try:
                    temp=path.with_suffix('.tmp.mp3')
                    await asyncio.wait_for(edge_tts.Communicate(line,'en-US-AriaNeural',rate='-8%',pitch='+5Hz',proxy=os.environ.get('HTTPS_PROXY')or os.environ.get('https_proxy')).save(str(temp)),90)
                    if temp.stat().st_size<1000:raise RuntimeError('Empty voice clip')
                    temp.replace(path);records[key]={'text':line,'textSha256':digest,'voice':'en-US-AriaNeural','bytes':path.stat().st_size};MANIFEST.write_text(json.dumps(records,ensure_ascii=False,indent=2));print('OK',key,flush=True);return
                except Exception as exc:
                    if attempt==3:raise
                    print('RETRY',key,type(exc).__name__,flush=True);await asyncio.sleep(1+attempt)
    await asyncio.gather(*(generate(k,v)for k,v in LINES.items()))
    print('DONE',len(LINES),flush=True)
if __name__=='__main__':asyncio.run(main())
