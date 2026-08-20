# CLAUDE.md

나동규 ♥ 이엄지 웨딩 스냅 촬영 시안. 카카오톡으로 받은 PPTX 2건을 업체(헤어·메이크업 실장님,
스냅 작가님)에게 전달할 **모바일 웹페이지 + A4 PDF** 로 옮긴 프로젝트입니다.

- 공개 링크: https://kaineus.github.io/wedding-snap-guide/
- 촬영 2건: `velour.html` (2026.10.02 노을공원→동작대교) / `moss.html` (2026.10.08 스튜디오→정동길)

## 구조

```
index.html          랜딩 (두 시안 선택 + PDF 다운로드)
velour.html         벨루어 스튜디오 시안
moss.html           모스앤코튼 시안
assets/style.css    화면 스타일 + @media print (인쇄 조판)
assets/app.js       사진 라이트박스, 목차 현재 위치 표시
images/{velour,moss}/  PPTX에서 추출한 레퍼런스 사진
pdf/                업체 전달용 A4 PDF (생성물, 커밋됨)
server.js           정적 서버
build-pdf.js        Chrome 헤드리스로 PDF 생성
```

두 HTML은 **의도적으로 중복**된 정적 파일입니다. 템플릿 엔진 없이 각각 직접 수정합니다.
공통 문구(요청사항 콜아웃 등)를 고칠 때는 두 파일 모두 손봐야 합니다.

## 실행

```bash
node server.js          # http://localhost (80포트), 포트 인자로 변경 가능
node build-pdf.js       # 서버가 떠 있어야 함. pdf/ 에 저장
```

## 문서 구조 (양쪽 공통)

1. hero → 신부/신랑 요청사항 콜아웃 (`.callout.bride` / `.callout.groom`)
2. `#course` 촬영 순서 (타임라인 + 장소별 무드)
3. `#beauty` 헤어·메이크업 (메이크업 선호/비선호 → 헤어 선호/비선호 → 원하는 헤어 시안)
4. `#outfit` 의상 (look 3벌, 각 look 아래 `.pairing` = 의상↔부케 조합 배너)
5. `#prop` 소품 (장소별)
6. `#shot` 찍고 싶은 샷 (장소별 → 샷 종류별 `.shotblock`)

## 사진 파일명 규칙

파일명이 곧 내용입니다. 사진 교체는 같은 이름으로 덮어쓰면 끝.

| 접두어 | 뜻 |
|---|---|
| `01-course-*` | 장소별 무드 |
| `02-makeup-{yes,no}-N` | 메이크업 선호 / 비선호 |
| `03-hair-{yes,no}-N` | 헤어 선호 / 비선호 |
| `04-hair-{start,mid,end}-N` | 스타트 웨이브 / 중간 진행머리 / 마무리 |
| `05-outfit-{1-1,1-2,2}-w` | 의상별 신부 (`-w` = 여자) |
| `06-prop-*` | 소품 (부케, 인형, 풍선, 컨페티 …) |
| `07~09-shot-*` | 찍고 싶은 샷 (장소·종류별) |

## 원본과 매핑

원본: `C:\Users\1\Documents\카카오톡 받은 파일\26.10.0{2,8}_*.pptx`
같은 폴더의 PDF는 **PPTX를 내보낸 동일 내용**이라 참고용일 뿐, 작업 소스는 PPTX입니다.

사진이 어느 항목(좋아요/싫어요, 소품명, 샷 종류)에 붙어 있었는지는
**원본 슬라이드의 도형 좌표를 파싱해서** 매핑했습니다. 사진을 추가·재정렬할 일이 있으면
같은 방식으로 확인하세요.

> ⚠️ 이 PPTX의 사진은 `<p:pic>` 이 아니라 **도형의 `blipFill`** 로 들어 있습니다.
> python-pptx 의 `shape_type == PICTURE` 로는 한 장도 안 잡힙니다.
> 슬라이드 XML에서 `a:blip/@r:embed` 를 직접 훑고, 그룹(`p:grpSp`)의
> `chOff`/`chExt` 로 자식 좌표를 변환해야 실제 위치가 나옵니다.

## 인쇄(PDF) 조판 — 밟았던 지뢰

`@media print` 블록에 이유와 함께 주석이 달려 있습니다. 요약:

- **CSS grid 는 크롬 인쇄에서 페이지를 못 넘깁니다.** 격자가 한 면에 안 들어가면 통째로
  다음 장으로 밀려서 "사진 한 장만 있는 빈 페이지"가 생깁니다. 그래서 인쇄용은
  `.strip` / `.grid.g3` 를 `display: block` + `inline-block` 흐름으로 바꿉니다.
- 큰 블록(`.look`, `.shotblock`)에 `break-inside: avoid` 를 걸면 같은 이유로 빈 면이 생깁니다.
  헤더에 `break-after: avoid`, 개별 사진에 `break-inside: avoid` 만 겁니다.
- `.pairing` 에는 `break-before: avoid` — 부케 배너가 의상 사진과 떨어져 혼자 넘어가지 않게.
- `.sub.page-break` = "원하는 헤어 시안" 앞에서 강제 개행. 그 뒤 세 블록은 형제 선택자로
  사진을 19%(5열)로 줄여 한 면에 들어가게 합니다.

레이아웃을 만졌으면 **반드시 PDF를 다시 뽑아 전체 페이지를 눈으로 확인**하세요.
빈 페이지가 생기기 쉽습니다.

## 이 환경에서의 주의사항

- **한글을 셸로 쓰지 마세요.** Bash/PowerShell 에서 `sed`, `echo`, `\uXXXX` 이스케이프로
  한글을 파일에 넣으면 조용히 깨집니다(실제로 뽀송→뻐송, 꼭→꾭 으로 깨진 적 있음).
  한글이 들어가는 편집은 **Edit/Write 도구**나 `python io.open(..., encoding='utf-8')` 으로.
- Bash 도구는 Git Bash 입니다. PowerShell here-string(`@'...'@`)은 리터럴로 들어갑니다.
  여러 줄 문자열은 heredoc 을 쓰세요.
- 시스템 `python` 은 Windows Store 스텁이라 동작하지 않습니다. **`uv run --python 3.12`** 사용:
  ```bash
  uv run --python 3.12 --with python-pptx --with pymupdf python script.py
  ```

## 배포

```bash
git add -A && git commit -m "..." && git push    # 1~2분 뒤 Pages 반영
```

리모트가 `https://kaineus@github.com/kaineus/wedding-snap-guide.git` 입니다.
푸시는 **개인 계정 `kaineus`** 로 나가야 하는데, URL에 계정을 박아둬서
`gh auth switch` 없이 그대로 됩니다. (활성 gh 계정은 보통 회사 계정 `Nadk-Pluxity`)

무료 Pages 라 비공개가 안 됩니다. 개인 사진이 들어 있으므로 `robots.txt` 와 각 페이지
`noindex` 메타로 검색 노출만 막아둔 상태입니다. 이 방어를 지우지 마세요.

## 남은 일

- **신랑 의상** — 원본 PPT에도 `0000`, `ㅇㅇ` 로 비어 있음.
  `.placeholder` div 를 `<img>` 로 교체. (벨루어 1-1, 2 / 모스 1-2, 2)
- **신랑 요청사항** — `.callout.groom` 블록이 안내 문구만 있는 상태.

## 사실 관계 (임의로 바꾸지 말 것)

원본 PPT에서 그대로 옮긴 내용입니다. 문장을 다듬는 건 괜찮지만 사실은 유지하세요.

- 요청사항은 전부 **신부(이엄지) 기준**입니다. 신랑 요청사항은 원본에 없습니다.
- 안경 착장 / 광 없이 뽀송한 메이크업 / 눈썹 보이는 풀뱅 앞머리 철벽 고정 /
  신부 왼쪽 어깨가 올라가는 경향 — 양쪽 촬영 공통 핵심 요청.
- 벨루어: 헤메 12:30 홍대입구역 &lt;스타일업&gt; → 15:00 노을공원 → 동작대교(야경).
- 모스앤코튼: 헤메 11:00 스튜디오 출장(아이엠메이크업) → 13:00 스튜디오 → 정동길(시립미술관).
