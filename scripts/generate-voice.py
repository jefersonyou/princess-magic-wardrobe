"""Optional development tool: pip install edge-tts==7.3.1. Never runs in game."""
import asyncio
import os
from pathlib import Path
import ssl
import edge_tts
import edge_tts.communicate

# Use the machine's trusted CA bundle where a managed network requires one.
if os.environ.get('SSL_CERT_FILE'):
    edge_tts.communicate._SSL_CTX = ssl.create_default_context(cafile=os.environ['SSL_CERT_FILE'])
import json
LINES = {k:v[0] for k,v in json.loads((Path(__file__).resolve().parent.parent / 'src/data/adventure.json').read_text())['lines'].items()}
async def main():
    target = Path(__file__).resolve().parent.parent / 'public' / 'audio'
    target.mkdir(parents=True, exist_ok=True)
    for name, line in LINES.items():
        if (target / (name + ".mp3")).exists() and (target / (name + ".mp3")).stat().st_size > 0:
            continue
        await edge_tts.Communicate(line, 'en-US-AriaNeural',
            rate='-5%' if not name.endswith(('intro','end','ending')) else '+5%', pitch='+5Hz',
            proxy=os.environ.get('HTTPS_PROXY') or os.environ.get('https_proxy')
        ).save(str(target / (name + '.mp3')))
        print(name)
if __name__ == '__main__':
    asyncio.run(main())
