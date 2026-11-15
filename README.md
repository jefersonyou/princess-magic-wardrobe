# 조이의 마법 옷장
기존 조이 캐릭터와 함께 요정의 영어 안내를 듣고 옷을 입히는 iPad 드레스업 PWA.

[게임 열기](https://jefersonyou.github.io/princess-magic-wardrobe/)

- 상단 「왕궁의 아침」 → 「이야기 시작」: dress / shoes / crown을 드래그해 Stage 1 완료
- 요정 루미, 영어 음성, 반복 듣기·힌트·자막·개별 볼륨
- 이야기 보상, 학습 진행 및 현재 코디 자동 저장
- 자유 꾸미기 60종, 런웨이·무대 2D 워킹, 포토타임 PNG 저장·공유
- 홈 화면 설치와 오프라인 실행·음성

실행: `npm ci` → `npm run dev`. 빌드: `npm run build`.
테스트: `npm test`, `npx playwright test --config playwright.pwa.config.ts` (Chromium 경로 조정 필요).
사전 제작 MP3를 포함하므로 개발·플레이에 유료 음성 API 불필요.

업데이트 후 v0.6.0을 확인하세요. 설치: [INSTALL.md](INSTALL.md).
전체 원문: [SPEC.md](SPEC.md). 구현 대조표: [SPEC-STATUS.md](SPEC-STATUS.md).
이번 단계는 Stage 1까지입니다. Stage 2–6과 실제 iPad/어린이 사용성 검증은 후속 작업입니다.
