# 테스트 — 2026-11-15
실행: npm install 후 npm run dev → /phase0/index.html
자동화: npm test (환경의 /usr/bin/chromium 사용). 빌드: npm run build.

통과한 검사:
- TypeScript strict 타입 검사 및 Vite 프로덕션 빌드.
- 부위별 스냅 거리 경계, 잘못된 부위 거절, 좌표 스케일 변환.
- 실제 Chromium에서 세 의상 동시 착용, 탭 착용 방지, 잘못된 부위 드롭, 초기화.
- 1194×834 DPR 2 → 1024×768 리사이즈 후 다시 착용.
- 브라우저 pageerror 없음.

시각 검사: artifacts/phase0-dressed.png를 열어 어깨·허리·왕관·신발 위치 확인.
최초 테스트에서 Phaser SVG data URL 디코딩 오류 발견 → base64 URL로 수정 → 재실행 통과.
Phaser 포함 번들 약 1.2 MB (gzip 322 KB), Vite 크기 경고 있음. 성능은 아직 측정하지 않음.
아직 검증 전: 실제 iPad Safari/Chrome, 어린이 사용성, 최종 아트, 새 빌드 PWA 오프라인.
- 추가 Chromium CDP 터치 테스트: touchStart → touchMove → touchEnd 착용 및 touchCancel 원복 통과.
- 최종 자동화 결과: 3 passed. 터치 테스트 타입 오류 수정 후 프로덕션 빌드 재검사.

## 생성 캐릭터 통합 회귀 검사
3개 테스트 모두 통과: 부위 판정 / 세 레이어 동시 착용 및 리사이즈 / CDP 터치 착용 및 취소.
artifacts/phase0-dressed.png 갱신하고 실제 이미지 열어 확인.
첫 이미지에서 어깨 폭, 신발 높이, 왕관 썸네일 주변 노출 문제 발견 후 수정, 다시 시각 확인.
실제 iPad 검증을 대체하지 않음. PWA 및 최종 아트 품질 승인 미완료.

## 설치 버전
npx playwright test --config playwright.pwa.config.ts: 1 passed.
루트 프로덕션 페이지가 생성 아틀라스 로드, 3종 착용, manifest/PNG icons HTTP 200 확인.
서비스워커 활성화 후 네트워크 차단 및 reload, 캐릭터 재등장과 의상 드래그 재검증 통과.
오프라인 캐시 Vary 매칭 실패를 ignoreVary로 수정 후 재실행.
artifacts/install-version.png는 실제 프로덕션 화면 캡처.
실제 iPad 설치 검증 및 GitHub 배포는 미완료.

## 배포 주소 실제 검증
node scripts/check-live.mjs: PASS.
https://jefersonyou.github.io/princess-magic-wardrobe/ HTTP 200.
생성 캐릭터 및 드레스/신발/왕관 동시 착용 성공.
서비스워커 준비 후 오프라인 reload 성공, 브라우저 오류 0.
스크린샷: artifacts/live-install-version.png.

## v0.4.0 최종 검사
npm run build: PASS (strict TypeScript + Vite + PWA precache).
npm test: 5 passed (57.9s).
- 몸 부위별 스냅, 오탭 방지, 드래그 취소, 화면 크기 변경
- 60개 아이템 및 의상30/액세서리30 분류 수 검증
- 대표 4코디 조합과 같은 슬롯 교체, 개별 제거, 저장 후 새로고침/불러오기
- 런웨이/무대 전환 시 착장 유지, 패션쇼 상태, 실제 PNG 다운로드(1600×1000)
npx playwright test --config playwright.pwa.config.ts: 1 passed (9.6s).
- 프로덕션 아틀라스 로딩, manifest/아이콘, 오프라인 새로고침 및 착용
대표 시각 확인: outfit-dress.png, outfit-rose.png, outfit-collectionDress0.png, outfit-collectionDress13.png, joy-photo.png, joy-runway.png.
테스트 도중 소스 수정으로 HMR이 발생한 회차는 제외하고, 소스를 고정한 최종 회차 전부 통과.
실제 iPad Photos 앱 저장/터치 체감 성능은 미검증.

v0.4.0 실제 배포 검증: node scripts/check-live.mjs PASS.
공개 HTTPS 주소에서 새 이름, 60종, 3종 동시 착용, 런웨이, 1600px PNG, 오프라인 reload 확인. 브라우저 오류 0.

## v0.5.0
빌드 통과. 전체 브라우저 검사 6 passed. 프로덕션 PWA 검사 1 passed. 목선/목걸이/신발 대표 3종과 워킹 프레임 직접 시각 확인. 워킹은 다리와 무릎을 움직이는 2D 구현이며 팔 포즈 유지. 실제 iPad 하드웨어 검증은 미완료.

## v0.6.0 명세 재반영
- TypeScript/Vite/PWA 빌드 통과.
- Stage 1: 순서가 다른 의상에 무벌점 힌트, 올바른 드래그로 진행, 새로고침 이어하기, 단어 기록, 보상, 완료 저장 검사.
- 프로덕션 PWA 2개 검사 통과: 설치/오프라인 착용 및 오프라인 MP3 실제 재생 시간 증가/반복 듣기/설정 복원.
- 음성 중단 원인: data-location 속성을 가진 body까지 버튼 이벤트에 포함. button[data-location]으로 한정하여 해결.
- 1194×834, 1024×768 화면 캡처에서 기존 조이/요정 안내/의상 카드 표시 확인.
- 기존 조이 atlas SHA256가 v0.5.0과 동일함 확인.
- 실제 iPad Safari/Chrome 하드웨어와 어린이 사용성 검증은 미완료.

최종 전체 회귀검사: npm test 7 passed (1.4m). 프로덕션 PWA 2 passed (21.4s).

## v0.7.0 전체 여행 최종 검증
- npm run build: PASS.
- npm test: 9 passed (2.9m). 6개 스테이지 실제 드래그 완료, 복합 지시, 지도 잠금/해금, 보상, v0.6 저장 이전, 재방문, 헤어/배경, 사진과 기존 회귀 검사.
- 프로덕션 PWA: 3 passed (51.2s). 전체 여행 에셋 캐시, 오프라인 재실행, 음성 재생/반복/엔딩, 설정 복원.
- 착장 시각 검사: 외투 목선/장갑/탐험복 허리와 발/수영복/왕관 투명도 보정 후 캡처 확인.
- 기존 조이 원본 SHA256 동일. 실제 iPad 기기와 60FPS/어린이 사용성 검증은 미완료.

## v0.8.0 착용 이미지 검증
- TypeScript/Vite/PWA 빌드 통과.
- 6스테이지 드래그 완료·저장 이전 2개 검사 통과.
- 전74종을 실제 드래그로 착용하고 각각 artifacts/worn-all/에 캡처, 착용 상태·PNG 출력·브라우저 오류 검사.
- 목·신발 연결 및 우산 위치 보정 후 대표 착장/패션쇼 회귀검사 통과.
- 프로덕션 PWA 3 passed: 오프라인 이미지/착용/음성/엔딩/설정 복원.
- 새 이미지를 준비하는 최초 로딩이 기존보다 길어짐. 메모리 감소를 위해 착용 텍스처를 2배 해상도로 구성.
- 실제 iPad 및 모든 교차 조합의 시각적 완전성은 미검증. 원본 조이 얼굴 변경 없음.
- 최종 전74종 착용 및 대표 핏/워킹: 2 passed (3.1m). 마지막 밑단/팔찌 보정 후 전체 여행: 2 passed (53.0s).
