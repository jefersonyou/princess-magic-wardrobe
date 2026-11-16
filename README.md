# 조이의 마법 옷장
기존 조이와 요정 루미가 함께하는 6장 영어 드레스업 여행.

[게임 열기](https://jefersonyou.github.io/princess-magic-wardrobe/)

- **왕국 여행 → 이야기 시작**: 옷을 끌어다 입히며 친구를 돕고 다음 장소로 이동
- 왕궁·정원·눈의 성·숲·바닷가·무도회와 엔딩
- 영어 음성32개, 반복 듣기/힌트/자막/개별 볼륨, 무벌점·시간 제한 없음
- 기존60종 + 여행12종 + 선택형 헤어2종, 여행 보상과 배경 해금
- 현재 코디·진행 자동 저장, 기존 Stage 1 저장 이어받기
- 런웨이/별빛 무대, 포토타임 PNG 저장·공유, 홈 화면 설치와 오프라인 음성

실행: `npm ci` → `npm run dev`. 빌드: `npm run build`.
검사: `npm test`, `npx playwright test --config playwright.pwa.config.ts` (Chromium 경로 조정 필요).
MP3 파일이 포함되어 플레이에 TTS API가 필요하지 않습니다.

v0.7.0. [설치 안내](INSTALL.md) · [명세 대조표](SPEC-STATUS.md) · [테스트](TEST.md)
실제 iPad Safari/Chrome·어린이 사용성·60FPS 검증은 별도로 남아 있습니다.
