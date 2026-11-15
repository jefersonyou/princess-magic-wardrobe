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
LINES = {
    'intro': 'Good morning, Joy! The weather is mixed up! Let’s get ready to help our friends.',
    'dress': 'Dress! Find your dress.',
    'shoes': 'Shoes! Put on your shoes.',
    'crown': 'Crown! Put on your crown.',
    'praise': 'Yay! Perfect!',
    'hint': 'Let’s try again. Look at the picture!',
    'complete': 'You did it! We are ready to help our friends. Here is your new dress!',
}
async def main():
    target = Path(__file__).resolve().parent.parent / 'public' / 'audio'
    target.mkdir(parents=True, exist_ok=True)
    for name, line in LINES.items():
        await edge_tts.Communicate(line, 'en-US-AriaNeural',
            rate='-5%' if name in ('dress', 'shoes', 'crown') else '+5%', pitch='+5Hz',
            proxy=os.environ.get('HTTPS_PROXY') or os.environ.get('https_proxy')
        ).save(str(target / (name + '.mp3')))
        print(name)
if __name__ == '__main__':
    asyncio.run(main())
