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
원본 이미지 수정은 이미지 생성 도구 사용. 런타임 레이어 가림: 기본 의상 몸통/치마를 교체할 때 가려짐 처리, 플랫슈즈 안쪽 스프라이트 마스크.
금색 왕관 폭 88.92 → 50, 위치 [115,21]로 축소.
대표 착장 4종을 브라우저 캡처로 검사. 모든 조합의 실제 iPad 정렬 검증은 미완료.

v0.5.0 이미지 편집 원본:
- exec-42a89db6-e125-41de-8697-5564da1e846f.png → clothes-collection.png (목 뒤 링 제거, 신발 폭 수정)
- exec-e2cdfea4-ce2d-4eea-923d-7426b0c9c8bc.png → wardrobe-atlas.png (3종 목선 수정)
목선 타원 구멍 마스크는 완전히 삭제.

## v0.6.0
- princess-atlas.png 및 기존 의상 4개 atlas는 변경하지 않음 (기존 조이 유지).
- fairy.png: 이미지 생성 도구로 제작한 오리지널 동료 요정 루미. 원본 exec-d6af11d3-7191-44f6-81b8-4f2c82416087.png.
- public/audio/*.mp3: 확정된 영어 대사 7개, 무료 edge-tts 7.3.1 / en-US-AriaNeural. 학습 단어 -5% 속도, 일반 대사 +5%, pitch +5Hz. 런타임 API 호출 없음.
- TTS는 ChatGPT 음성 내보내기로 생성한 것이 아님. 무료 임시 음성으로 제공하며 실제 iPad 발음/억양 청취 검증 필요.

## v0.7.0 전체 여행
기존 조이 princess-atlas.png 변경 없음. SHA256 36de2af50c6f5da6d205ba79edaa3bc54fe6dd14ae9a0636b52c37d43719ef32.
- adventure-atlas.png: 기준 조이 참조 생성 exec-b6e2fce2-9938-4e8f-a561-a5de9ecf34d3.png → 목선/수영복 수정 exec-b4a15ff7-a019-4fad-a874-c4fd8f8252f9.png → 외투 앞 여밈 수정 exec-817f4f51-d13b-466c-bf4b-abb0fa1b7394.png → 배경 alpha 보정 exec-e4a7ab47-10ef-48e3-aef0-0aff784f5626.png. 원본 보관.
- kingdom-scenes.png: 3×2 장소 배경 atlas. exec-f2e20afb-2541-4560-9029-b1bf3c631e35.png.
- hair-extensions.png: 기존 얼굴/머리를 덮지 않는 뒤 레이어 2개. exec-a811e4a0-fada-4785-ab03-68681d01cdc2.png.
- 새 atlas 좌표/스냅/레이어는 rig.ts. 신발/장갑은 좌우 각각 정렬. 탐험복은 셔츠와 바지를 분리 합성하여 허리와 발 위치를 맞춤. 장갑/바지 착용 시 원래 손/다리의 중복 노출을 렌더 마스크로 가림.
- 영어 음성32개: src/data/adventure.json 대사, scripts/generate-voice.py 재현. 무료 Edge TTS AriaNeural, 런타임 호출 없음.

## v0.8.0 착용 렌더링
- 기존 조이 얼굴/머리/원본 atlas 유지.
- worn/outfits-1..3.png: 기준 캐릭터 참조, 24종 의상에 피부 목·팔·손을 포함한 착용 이미지 생성. 기존 얼굴/다리와 연결하며 기존 몸통/팔 중복 제거.
- worn/footwear.png: 12종 신발을 발·발목이 안으로 들어간 착용 모습으로 제작. 기존 발 영역 교체.
- worn/holding.png 및 holding-arm.png: 우비/겨울 외투의 접힌 소매와 우산을 쥔 손, 다른 의상용 굽힌 팔.
- worn/jewelry.png: 목·손목 위 착용 기준으로 생성한 10목걸이/8팔찌/목도리의 곡선 장신구 추출. 머리장식/헤어/선글라스는 기존 기준 위치 레이어 유지.
- 착용 원본 생성ID: 4a00e96e-d36f-4f1b-a602-c0faf75a305a, f4c6243e-69d9-480f-90ff-46c9616d75ef, 29c55034-8a6d-448d-acc9-c73d0268f1ea, 0ec43b4b-0c31-4eba-a096-3d7409c9cd55, 81b011f5-7624-4e87-89ea-b5aa3dc98f75, fd74f272-9287-4265-9ca1-cf336635ea02, 4121cce1-9331-413a-87d5-24ae7943fd7b. generated_images에 원본 보관.
- src/worn-renderer.ts에서 착용 좌표/몸 가림/교체 관리. 기존 썸네일과 실제 착용 스프라이트 분리.

## v0.8.3 정렬 보정
기존 착용 atlas에서 의상별 목/허리/치마 중심 좌표를 확인. 24종을 동일 중심 x=140에 맞추도록 원본 스트립을 이동해 정렬(회전/좌우 반전 없음). 조이 얼굴 원본 변경 없음.


## v0.9.0 지안 디자인 컬렉션
- 원안: 사용자가 제공한 지안의 손그림. 노란 3단 꽃무늬 치마, 분홍 상의, 파란 소매와 꽃 리본을 동화풍으로 제작.
- `public/art/jian-design.png`: 착용형 드레스, 꽃 리본, 꽃 귀걸이, 꽃 장화. 기존 조이 얼굴/기본 캐릭터 유지.
- 옷장 카드와 해당 착장의 포토타임 PNG에 “지안이가 디자인했어요” 표시.
- `public/art/fashion/`: 귀걸이 20, 선글라스 10, 장갑 10의 실제 이미지와 우산용 쥔 손 이미지.


## v0.10.0 추가·정리
- `art/friends-heads.png`: 사용자 팀 구성 참고를 바탕으로 제작한 루나·루비·아리아의 전면 얼굴/헤어. 기존 조이의 몸/목 등록을 공유하며 조이 원본은 변경하지 않음.
- `art/fashion/gloves-grip.png`: 금속 막대가 포함되지 않고 손목이 자연스럽게 기울어진 쥔 손 10종으로 교체. 우산 막대와 손은 분리 렌더링.
- `art/fashion/mitten-grip.png`: 기존 보랏빛 벙어리장갑과 같은 퍼 커프·금색 식물 문양의 우산 쥔 포즈.
- 귀걸이 원화는 유지하고 추출 사각형만 실제 좌우 장식 경계로 재측정.
- 원본 조이 atlas SHA-256: `36de2af50c6f5da6d205ba79edaa3bc54fe6dd14ae9a0636b52c37d43719ef32`.


## v0.11.0 영어 음성
- `audio/story-*.mp3`: 승인된18개이야기의도입·착용지시·이유·결과142개. `scripts/generate-story-voice.py`와edge-tts7.3.1로기존과동일en-US-AriaNeural(rate-8%,pitch+5Hz) 생성.
- `audio/story-voice-manifest.json`: 실제대사·SHA-256·바이트수·목소리기록. 모든MP3의재생형식과길이검증.
- 기존32개영어음성은보존해진행중인이전이야기와저장데이터에대응. 모든음성은PWA설치시캐시하며외부TTS를게임실행중호출하지않음.

## v0.11.2 나눔고딕
Google Fonts의 Nanum Gothic Regular/Bold 원본 TTF를 글리프 변경 없이 WOFF로 변환해 `src/fonts/`에 포함했습니다. 전체 한글·영문 글리프를 유지하며 외부 폰트 서버에 의존하지 않습니다.
원본: https://github.com/google/fonts/tree/main/ofl/nanumgothic
라이선스: SIL Open Font License 1.1, `public/fonts/OFL-NanumGothic.txt`.

## v0.11.4 탐험 모자
`public/art/worn/explorer-hat-worn.png`: 기존 초록 탐험 모자의 금색 잎 장식과 가죽 밴드를 유지한 새 착용용 원화. 열린 밑면이 없는 정면 모습으로 이미지 생성 도구에서 제작했습니다. 생성 원본은 `/workspace/generated_images/exec-f0c4d5af-ec8d-4565-aa2c-1ae2446e61b3.png`에 보존했습니다. 옷장 썸네일과 실제 착용에 같은 원화를 사용합니다.
