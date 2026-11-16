# Orbis Securities 카드뉴스 렌더러

초안 JSON을 받아 실제 크롬으로 카드뉴스 이미지(2160×2700)와 포스트 대표 이미지를 만듭니다.

- `templates/` 카드 디자인
- `render.mjs` 렌더러 (`node render.mjs samples/d1.json`)
- `.github/workflows/render.yml` 자동 렌더링 (repository_dispatch `render`)
- `.github/workflows/thumb.yml` 대표 이미지 (repository_dispatch `thumb`)
- `cards/{초안 id}/` 렌더링 결과 (인스타 발행용 공개 주소)
