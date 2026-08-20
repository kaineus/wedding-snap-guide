// 업체 제공용 PDF 생성 —  node build-pdf.js
// 서버(node server.js)가 떠 있는 상태에서 실행하세요.
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const CHROME = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  process.env.LOCALAPPDATA + '/Google/Chrome/Application/chrome.exe',
].find((p) => fs.existsSync(p));

if (!CHROME) {
  console.error('Chrome을 찾지 못했습니다.');
  process.exit(1);
}

const PORT = Number(process.argv[2]) || 80;
const OUT = path.join(__dirname, 'pdf');
fs.mkdirSync(OUT, { recursive: true });

// lazy 로딩을 끈 인쇄 전용 사본 (헤드리스에서 화면 밖 이미지가 빠지는 것을 방지)
const TARGETS = [
  { src: 'velour.html', out: '26.10.02_벨루어스튜디오_촬영시안.pdf' },
  { src: 'moss.html', out: '26.10.08_모스앤코튼_촬영시안.pdf' },
];

const temps = [];
for (const t of TARGETS) {
  const html = fs.readFileSync(path.join(__dirname, t.src), 'utf8').replace(/\s*loading="lazy"/g, '');
  t.tmp = '_print-' + t.src;
  fs.writeFileSync(path.join(__dirname, t.tmp), html, 'utf8');
  temps.push(path.join(__dirname, t.tmp));
}

try {
  for (const t of TARGETS) {
    const dest = path.join(OUT, t.out);
    console.log('→', t.out);
    execFileSync(
      CHROME,
      [
        '--headless=new',
        '--disable-gpu',
        '--no-pdf-header-footer',
        '--virtual-time-budget=30000',
        '--run-all-compositor-stages-before-draw',
        `--print-to-pdf=${dest}`,
        `http://localhost:${PORT}/${t.tmp}`,
      ],
      { stdio: 'ignore' }
    );
    const kb = Math.round(fs.statSync(dest).size / 1024);
    console.log(`   ${dest}  (${kb} KB)`);
  }
} finally {
  temps.forEach((f) => fs.existsSync(f) && fs.unlinkSync(f));
}
