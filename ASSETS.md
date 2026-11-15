# 에셋 기록
외부 조사 시도: https://opengameart.org/art-search-advanced?keys=dressup
결과: 실행 환경의 프록시 연결 실패. 에셋 내용, 라이선스 및 사용 가능 여부 미확인. 외부 다운로드 없음.
후속 조사 후보: itch.io, OpenGameArt, CraftPix. 무료 여부와 재배포 권한을 각각 확인할 것.
현재 public/phase0/rig.js의 캐릭터/의상은 프로젝트 내 작성한 임시 SVG. 최종 동화풍 아트로 승인된 에셋이 아님.
공통 viewBox 0 0 280 440. anchors에 머리/목/양어깨/가슴/허리/골반/양손/양발 정의.
모든 의상은 공통 캔버스에 직접 작성. 착용 transform: position [0,0], scale 1, rotation 0.
드레스: layer 30, waist [140,220], radius 65.
신발: layer 40, leftFoot [122,408], radius 46. 좌우 신발 한 쌍으로 구성.
왕관: layer 60, head [140,42], radius 43.
기본 캐릭터는 기본 슬립을 착용하며 왕관과 신발은 별도 레이어.
정렬 품질은 실제 렌더링에서 추가 검증해야 함.

## 2026-11-15 후속 조사
네트워크 재시도 성공. 아래 공개 페이지 본문 확인:
https://opengameart.org/content/dress-up-illustration-set-lin-tongze
작가 THE13RUIN, 표시 라이선스 CC-BY-SA 4.0.
PSD 레이어 세트, 드레스 2벌 및 여러 신발/헤어/표정 포함. 페이지 목록에 왕관 없음.
애니메이션/비주얼노벨 방향의 세트로 요청한 공주 아트와 차이가 있어 채택 보류.
파일은 게임에 포함하지 않았으며, 미리보기 이미지 검토 및 실제 PSD 정렬 검증 전.
현재 검증용 원본 데이터는 src/phase0/rig.ts. public/phase0-legacy는 이전 스냅샷.
840×1320 SVG 래스터 텍스처를 공통 280×440 좌표로 렌더링. 최종 아트가 아닌 기술 검증용.

## 사용자 참고 이미지 기반 캐릭터 시안
사용자 제공 참고 2장: 남보라 머리, 짧은 앞머리, 둥근 묶음머리, 큰 눈, 장난스러운 표정, 청록/보라/금색 방향.
ChatGPT 이미지 생성으로 오리지널 공주 컨셉 시트 제작.
파일: generated_images/exec-af5a5d20-3c2c-4c50-84ed-617ecba863b4.png
정면 전신 고정 포즈 + 표정 상세. 현 단계는 시안이며 게임에 통합하지 않음.
한 장에 의상이 합성된 이미지이므로 교체 가능한 레이어로 사용할 수 없음.
후속 제작 시 이 이미지를 기준으로 동일 포즈의 기본 캐릭터와 드레스/신발/왕관 투명 레이어를 제작하고 정렬 검증할 것.

## 확정 시안의 게임 적용 — 2026-11-15
기준: exec-af5a5d20-3c2c-4c50-84ed-617ecba863b4.png (사용자 승인).
이미지 생성 편집으로 투명 캐릭터/드레스/왕관/신발 아틀라스 제작:
generated_images/exec-b20534a8-1291-45cb-8a02-d5ad4477c6f3.png
게임 원본 사본: public/art/princess-atlas.png (1216×1294 RGBA).
파일 자체를 잘라 재인코딩하지 않고 Phaser 프레임과 SVG clipPath로 원본 영역 사용.
생성 결과가 요청한 동일 셀 등록 위치를 따르지 않아, src/phase0/rig.ts에 실제 프레임과 착용 위치/크기를 기록함.
기본 캐릭터는 아이보리 원피스 착용. 왕관/신발/드레스는 독립 레이어.
렌더링 검사 후 드레스 어깨 폭 및 신발 높이 보정. 스냅 반경으로 아트 정렬을 보정하지 않음.
현재는 첫 통합 아트 버전. 최종 품질 승인 및 실제 iPad의 선명도/경계 검증은 남아 있음.

## 조이의 마법 옷장 v0.4.0
이미지 생성으로 만든 원본(기존 사용자의 승인 캐릭터를 참조):
- exec-55850e77-23e7-4d3b-97de-2f767ee20363.png: 기본 드레스 목깃 제거/어깨 폭 축소. public/art/princess-atlas.png
- exec-a48dd020-f8e8-4cfc-942d-bff90329f59d.png: 드레스 3, 신발 3, 머리장식 3, 목걸이 2, 팔찌 1. wardrobe-atlas.png
- exec-ae194931-1176-4967-a42d-0c19fc6b741d.png: 16 드레스 및 8 신발 세트 중 6 사용. clothes-collection.png
- exec-b93f56d2-bde1-4315-abbe-629d5c624c85.png: 머리장식8, 목걸이8, 팔찌8 중7 사용. accessories-collection.png
- exec-41ba877c-11d3-4fc8-bf40-cce9b15dac56.png: 왕실 옷방 배경. royal-dressing-room.png
아틀라스 프레임은 alpha 채널 경계 판독으로 데이터화. 파일을 잘라 다시 인코딩하지 않음.
좌표: src/phase0/rig.ts 및 collection-frames.ts.
원본 이미지 수정은 이미지 생성 도구 사용. 런타임 레이어 가림: 기본 의상 몸통/치마를 교체할 때 가려짐 처리, 플랫슈즈 안쪽과 일부 목선의 스프라이트 마스크.
금색 왕관 폭 88.92 → 50, 위치 [115,21]로 축소.
대표 착장 4종을 브라우저 캡처로 검사. 모든 조합의 실제 iPad 정렬 검증은 미완료.
