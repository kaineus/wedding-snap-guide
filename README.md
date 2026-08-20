# 웨딩 스냅 촬영 시안

카카오톡으로 받은 촬영 시안 PPTX 2건을 모바일에서 보기 좋은 웹 페이지 + 업체 제공용 PDF로 옮긴 것입니다.

**공개 링크 → https://kaineus.github.io/wedding-snap-guide/**

| 파일 | 내용 |
|---|---|
| `index.html` | 두 시안 고르는 랜딩 + PDF 다운로드 |
| `velour.html` | 2026.10.02 벨루어 스튜디오 (노을공원 → 동작대교) |
| `moss.html` | 2026.10.08 모스앤코튼 (스튜디오 → 정동길) |
| `pdf/` | 업체 전달용 A4 PDF (벨루어 13p · 모스앤코튼 11p) |
| `images/velour`, `images/moss` | 원본 PPTX에서 추출한 레퍼런스 사진 |
| `assets/style.css` | 화면 + 인쇄(@media print) 스타일 |
| `assets/app.js` | 사진 확대, 목차 현재 위치 표시 |

## 로컬에서 보기

```bash
node server.js        # http://localhost (80포트)
node server.js 3000   # 포트 지정
```

같은 와이파이의 폰에서 보려면 PC 내부 IP로 접속. (`ipconfig`로 확인)

## PDF 다시 만들기

서버를 띄운 상태에서:

```bash
node build-pdf.js         # 80포트 기준
node build-pdf.js 3000    # 다른 포트로 띄웠다면
```

Chrome 헤드리스로 인쇄해 `pdf/`에 저장합니다. 인쇄 레이아웃은 `style.css`의
`@media print` 블록에서 조정합니다. (사진 열 수, 페이지 나눔 등)

## 수정하고 반영하기

1. 문구는 각 HTML에서 바로 수정. 사진 교체는 `images/` 안 같은 이름으로 덮어쓰기.
   파일명이 내용을 그대로 나타냅니다. (`05-outfit-1-1-w` = 의상 1-1 신부,
   `07-shot-sky-2` = 하늘 배경 샷 2번 …)
2. `node build-pdf.js` 로 PDF 재생성.
3. `git add -A && git commit -m "..." && git push` → 1~2분 뒤 링크에 반영.

### 아직 비어 있는 것

- **신랑 의상** — 원본 PPT에도 `0000`, `ㅇㅇ` 로 비어 있어 점선 박스 처리.
  정해지면 `<div class="placeholder">…</div>` 를 `<img src="…">` 로 교체.
- **신랑 요청사항** — `velour.html` / `moss.html` 상단 `.callout.groom` 블록.

## 공개 범위

GitHub Pages 무료 플랜은 비공개 설정이 없어 **URL을 아는 사람은 볼 수 있는 공개 페이지**입니다.
검색 노출은 `robots.txt` 와 각 페이지의 `noindex` 메타로 차단해 두었습니다.
