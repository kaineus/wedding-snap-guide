# 웨딩 스냅 촬영 시안 (웹)

카카오톡으로 받은 촬영 시안 PPTX 2건을 모바일에서 보기 좋은 웹 페이지로 옮긴 것입니다.

| 파일 | 내용 |
|---|---|
| `index.html` | 두 시안 고르는 랜딩 |
| `velour.html` | 2026.10.02 벨루어 스튜디오 (노을공원 → 동작대교) |
| `moss.html` | 2026.10.08 모스앤코튼 (스튜디오 → 정동길) |
| `images/velour`, `images/moss` | 원본 PPTX에서 추출한 레퍼런스 사진 |
| `assets/style.css`, `assets/app.js` | 스타일 / 사진 확대·목차 스크립트 |

## 실행

```bash
node server.js        # http://localhost (80포트)
node server.js 3000   # 포트 지정
```

같은 와이파이에 있는 폰에서 보려면 PC의 내부 IP로 접속하면 됩니다. (`ipconfig`로 확인)

## 수정할 때

- 문구는 각 HTML 파일에서 바로 고치면 됩니다.
- 사진 교체는 `images/` 안의 같은 이름으로 덮어쓰면 됩니다. 파일명이 내용을 그대로 나타냅니다.
  (`05-outfit-1-1-w` = 의상 1-1 신부, `07-shot-sky-2` = 하늘 배경 샷 2번 …)
- **신랑 의상**은 원본 PPT에도 비어 있어서 (`0000`, `ㅇㅇ`) 점선 박스로 두었습니다.
  정해지면 `<div class="placeholder">…</div>` 를 `<img src="…">` 로 바꾸면 됩니다.
