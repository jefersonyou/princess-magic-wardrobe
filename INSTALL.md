# 공주의 마법 옷장 v0.2.0 설치
새 생성 캐릭터가 기본 시작 화면에 적용된 PWA입니다. 현재 범위는 드레스/신발/왕관 착용입니다.

## iPad
1. 배포된 HTTPS 주소를 iPad Safari로 엽니다.
2. ‘오프라인 준비 완료’를 확인합니다.
3. Safari 공유 버튼 → 홈 화면에 추가 → 추가.
4. 홈 화면의 ‘마법 옷장’ 아이콘으로 실행합니다.
기존 설치가 오래된 화면을 표시하면 인터넷에 연결한 상태로 앱을 다시 열어 업데이트를 받아주세요.
ZIP 파일을 iPad 파일 앱에서 열어서는 PWA를 설치할 수 없습니다. 웹 배포 주소가 필요합니다.

## GitHub Pages 배포
저장소에 프로젝트 파일을 올리고 Settings → Pages → Source를 GitHub Actions로 설정합니다.
main 브랜치 push 또는 Actions의 Publish Magic Wardrobe 실행으로 자동 빌드/배포합니다.
주소는 보통 https://사용자이름.github.io/저장소이름/ 입니다.
상대 경로 manifest, service worker, 이미지 URL로 저장소 하위 경로를 지원합니다.

## 로컬 확인
npm ci
npm run build
npm run preview
localhost에서는 설치/오프라인 검사 가능. iPad에서 일반 HTTP LAN 주소로 접속하면 서비스 워커 설치가 제한됩니다.

## 배포 파일
princess-magic-wardrobe-v0.2.0.zip: 빌드 결과물. HTTPS 정적 호스팅에 내용물을 업로드하세요.
최종 실제 iPad Safari/Chrome 및 홈 화면 설치 검증은 기기에서 진행해야 합니다.
