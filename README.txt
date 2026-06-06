밀웜 상세페이지 HTML 세트 v10

핵심 변경사항
1. 네이버 스마트스토어 상세페이지용으로 max-width 860px 기준 적용
2. 모바일에서는 1열 중심으로 보이도록 UI/UX 수정
3. 배송 이미지에서 아이스팩 제거
4. 이미지와 모든 상세페이지에 아래 문구 추가
   ※ 밀웜 크기·마리수·무게에 따라 실제 포장은 달라질 수 있습니다.
5. 통합페이지는 공통 안내를 반복하지 않고 상품별 차이점만 먼저 보여주도록 변경

파일 구성
- index.html : 전체 파일 바로가기
- html/00_integrated_naver_mobile.html : 통합 상세페이지
- html/01_live_mealworm_1kg.html : 생밀웜 1kg
- html/02_live_superworm_count.html : 슈퍼밀웜 마리수 선택
- html/03_live_superworm_1kg.html : 슈퍼밀웜 1kg
- html/04_dried_mealworm.html : 건조밀웜
- html/05_dried_superworm.html : 건조슈퍼밀웜
- assets/ : 이미지와 CSS

스마트스토어 사용 팁
- 브라우저에서 html 파일을 열어 확인하세요.
- 스마트스토어에 HTML 직접 삽입이 제한될 경우, 섹션별로 캡처 또는 이미지 변환하여 업로드하세요.
- 통합페이지는 상담/전체상품 안내용, 개별 페이지는 상품 상세페이지용으로 사용하면 좋습니다.


v6 추가 반영
- 통합페이지와 슈퍼밀웜 상세페이지 2종에 슈퍼밀웜 계절 배송 안내문을 작게 추가했습니다.
- 폭염기(7월~9월 초), 겨울철(12월~3월) 수령/핫팩/폐사 사진/50% 재배송 안내를 고객용 문구로 다듬어 반영했습니다.


v7 변경사항
- 건조밀웜/건조슈퍼밀웜 이미지를 하얀 봉지 포장 기준으로 교체
- 통합페이지에 건조 상품 포장 안내 섹션 추가
- 개별 건조 상세페이지에 하얀 봉지 포장 안내 및 FAQ 추가
- 안내 문구: 건조 상품은 하얀 봉지에 담아 발송되며, 중량에 따라 봉투 크기와 포장 방식이 달라질 수 있습니다.


v8 추가 반영
- html/00_integrated_naver_mobile.html 통합페이지를 네이버 상세 이미지 업로드용으로 캡처할 수 있게 보강했습니다.
- 일반 브라우저 화면은 기존 HTML 구조를 유지하고, 캡처 모드에서만 본문/안내문 글자 크기를 키웁니다.
- 이미지화 시 작게 보이기 쉬운 상품별 옵션 비교표는 캡처 모드에서 카드형 비교표로 자동 전환됩니다.
- Playwright 캡처 스크립트를 추가해 430px 모바일 화면을 2배 배율로 렌더링하고, 결과 이미지는 860px 폭 PNG로 생성합니다.


v9 변경사항
- 고객에게 필요 없는 제작용 문구, 브랜드 푸터, 페이지 내 이동 목차, 모바일 최적화 안내 문구를 제거했습니다.
- 통합페이지 첫 화면은 상품 안내와 핵심 배송 조건만 남기도록 줄였습니다.
- 개별 생물 상품 페이지에서는 건조 상품 보관 안내를 제거했습니다.
- 개별 건조 상품 페이지에서는 생물 상품 수령 안내를 제거하고 밀봉/습기 관리 안내로 정리했습니다.

v10 변경사항
- 배송 안내에 평일 오후 2시 이전 주문 완료 건 당일 발송 기준을 추가했습니다.
- 제주 및 도서 지역 추가 배송비 별도 발생 안내를 추가했습니다.
- 통합페이지와 생물 상품 상세페이지에 생물 상품 교환/환불 제한 안내를 추가했습니다.

이미지 업로드용 PNG 생성 방법
1. 최초 1회 의존성 설치
   npm install
   npm exec playwright install chromium

2. 통합 상세페이지 이미지 생성
   npm run export:integrated

3. 생성 위치
   exports/00_integrated_naver_mobile/

4. 업로드 방식
   01_01_hero.png부터 16_16_before_purchase.png까지 파일명 순서대로 네이버 스마트스토어 상세설명 이미지에 업로드하세요.
   manifest.json은 생성 결과 확인용 파일이며 업로드하지 않아도 됩니다.

주의
- exports/ 폴더는 생성 산출물이므로 Git에는 포함하지 않습니다.
- 상세 이미지를 외부 URL로 호스팅해서 HTML에 넣는 경우, 네이버 모바일 미리보기 캐시 때문에 수정 때마다 이미지 파일명 또는 URL을 바꾸는 것이 안전합니다.

Cloudflare Pages 배포 설정
- Build command: npm run build
- Build output directory: dist
- Deploy command: 비워두기

Cloudflare Workers Builds 배포 설정
- Build command: npm run build
- Deploy command: npx wrangler deploy
- Output directory 입력란이 없으면 정상입니다. Workers Builds에서는 wrangler.toml의 [assets] directory 설정을 사용합니다.

참고
- Deploy command가 필수라면 Workers Builds 프로젝트입니다.
- wrangler.toml에서 정적 자산 경로를 dist/로 지정했으므로 npx wrangler deploy가 dist 안의 index.html, html/, assets/만 배포합니다.
- Pages로 새 프로젝트를 만들 경우에는 Deploy command를 비우고 Build output directory를 dist로 설정하세요.
