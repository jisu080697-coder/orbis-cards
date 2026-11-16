// 포스트 본문 이미지 렌더러: 요청 JSON → 실제 크롬으로 1200×800(×1.5) JPEG
// 사용: node thumbs/bodyimg.mjs req.json 출력.jpg
// 종류 (2026-11-03 · ALL THAT FX 먼저)
//   summary = 핵심 요약 카드 (포인트 3줄 · 글 내용에서 AI가 뽑은 사실만)
//   steps   = 단계 카드 (글에 순서가 있을 때만 · 3~5단계)
//   compare = 비교 카드 (글에 비교가 있을 때만 · 머리글 + 3~5줄)
// 요청: { site, kind, cat, date, title, points[], steps[{t,d}], head[], rows[[]] }
import { chromium } from 'playwright-core';
import { readFileSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const FONTS = 'https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@500;700;900&display=block';
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const COMPASS = readFileSync(join(here, 'thumb.mjs'), 'utf8').match(/const COMPASS = '([^']+)'/)[1];   // 대표 이미지와 같은 로고

// 사이트별 색 (대표 이미지와 같게) · 지금은 ALL THAT FX 만
const THEME = { allthatfx: { navy: '#000342', blue: '#3D63FF', soft: '#8ea6ff', name: 'ALL THAT FX' } };

const KIND = {
  summary: (r, T) => `<div class="lab">KEY POINTS</div><h1 class="fit1">${esc(r.title || '핵심 정리')}</h1>
    <ol class="pts">${(r.points || []).slice(0, 3).map((p, i) => `<li><em>${String(i + 1).padStart(2, '0')}</em><span>${esc(p)}</span></li>`).join('')}</ol>`,
  steps: (r, T) => { const S = (r.steps || []).slice(0, 5);
    return `<div class="lab">STEP BY STEP</div><h1 class="fit1">${esc(r.title || '순서대로 보기')}</h1>
    <div class="stp n${S.length}">${S.map((s, i) => `<div><em>STEP ${i + 1}</em><b>${esc(s.t || s)}</b>${s.d ? `<span>${esc(s.d)}</span>` : ''}</div>`).join('')}</div>`; },
  compare: (r, T) => { const H = (r.head || []).slice(0, 3), R = (r.rows || []).slice(0, 5);
    return `<div class="lab">COMPARE</div><h1 class="fit1">${esc(r.title || '한눈에 비교')}</h1>
    <table class="cmp c${H.length}"><tr>${H.map((h, i) => `<th class="${i ? 'v' : ''}">${esc(h)}</th>`).join('')}</tr>${R.map(row => `<tr>${row.slice(0, H.length).map((c, i) => `<td class="${i ? 'v' : 'k'}">${esc(c)}</td>`).join('')}</tr>`).join('')}</table>`; },
};

function html(r) {
  const T = THEME[r.site] || THEME.allthatfx, [y, m, d] = String(r.date || '').split('-');
  return `<!doctype html><html lang="ko"><head><meta charset="utf-8"><link rel="stylesheet" href="${FONTS}"><style>
  *{margin:0;padding:0;box-sizing:border-box}body{width:1200px;height:800px;-webkit-font-smoothing:antialiased;font-family:'Noto Sans KR'}
  .f{position:relative;width:1200px;height:800px;overflow:hidden;color:${T.navy};background-color:#fff;background-image:linear-gradient(rgba(0,3,66,.045) 1px,transparent 1px),linear-gradient(90deg,rgba(0,3,66,.045) 1px,transparent 1px);background-size:40px 40px}
  .bar{position:absolute;left:0;right:0;top:0;height:84px;background:${T.navy};color:#fff;display:flex;align-items:center;padding:0 64px}
  .bar svg{width:24px;height:22px;margin-right:10px}.bar b{font:700 19px 'Noto Sans KR';letter-spacing:.02em}.bar em{margin-left:auto;font:500 15px 'Noto Sans KR';font-style:normal;opacity:.7}
  .bar i{font-style:normal;font:700 15px 'Noto Sans KR';color:${T.soft};margin-left:22px;padding-left:22px;border-left:1px solid rgba(255,255,255,.25)}
  .in{position:absolute;left:64px;right:64px;top:132px;bottom:56px;display:flex;flex-direction:column}
  .lab{font:700 15px 'Noto Sans KR';letter-spacing:.26em;color:${T.blue};margin-bottom:12px}
  h1{font:900 48px/1.25 'Noto Sans KR';letter-spacing:-.03em;word-break:keep-all;text-wrap:balance;margin-bottom:34px}
  .pts{list-style:none;display:flex;flex-direction:column;gap:18px;flex:1;justify-content:center}
  .pts li{flex:1;max-height:150px;display:flex;align-items:center;gap:26px;background:#fff;border:1px solid rgba(0,3,66,.12);border-left:6px solid ${T.blue};padding:26px 32px}
  .pts em{font:900 34px/1 'Noto Sans KR';color:${T.blue};font-style:normal;min-width:52px}
  .pts span{font:700 32px/1.4 'Noto Sans KR';letter-spacing:-.02em;word-break:keep-all;text-wrap:balance}
  .stp{display:grid;gap:14px;flex:0 0 360px;margin:auto 0}.stp.n3{grid-template-columns:repeat(3,1fr)}.stp.n4{grid-template-columns:repeat(4,1fr)}.stp.n5{grid-template-columns:repeat(5,1fr)}
  .stp div{background:#fff;border:1px solid rgba(0,3,66,.12);border-top:6px solid ${T.navy};padding:44px 26px 32px;display:flex;flex-direction:column;justify-content:flex-start;gap:16px}
  .stp div:last-child{border-top-color:${T.blue}}
  .stp em{font:700 17px 'Noto Sans KR';letter-spacing:.18em;color:${T.blue};font-style:normal}
  .stp b{font:900 36px/1.3 'Noto Sans KR';letter-spacing:-.02em;word-break:keep-all}
  .stp span{font:500 26px/1.5 'Noto Sans KR';color:#3a3a4a;word-break:keep-all}
  .cmp{width:100%;height:100%;border-collapse:collapse;background:#fff}
  .cmp th{background:${T.navy};color:#fff;font:700 28px 'Noto Sans KR';padding:22px 28px;text-align:left}.cmp th.v{text-align:center}
  .cmp td{font:500 30px/1.35 'Noto Sans KR';padding:20px 28px;border-bottom:1px solid rgba(0,3,66,.1);word-break:keep-all}
  .cmp td.k{font-weight:700;color:${T.navy};width:28%}.cmp td.v{text-align:center;color:#2b2b3a}
  .cmp tr:nth-child(odd) td{background:rgba(61,99,255,.04)}
  </style></head><body><div class="f">
  <div class="bar"><svg viewBox="0 0 35 32"><path fill="#fff" d="${COMPASS}"/></svg><b>${esc(T.name)}</b>${r.cat ? `<i>${esc(r.cat)}</i>` : ''}<em>${y ? `${y}. ${m}. ${d}` : ''}</em></div>
  <div class="in">${(KIND[r.kind] || KIND.summary)(r, T)}</div></div></body></html>`;
}

export async function renderBody(req, out, browser) {
  if (!KIND[req.kind]) throw new Error('본문 이미지 종류 없음: ' + req.kind);
  if (req.kind === 'steps' && !(req.steps || []).length || req.kind === 'compare' && !(req.rows || []).length) return { skip: '재료 없음' };   // 순서·비교가 없는 글은 만들지 않음
  const tmp = join(here, `_body_${process.pid}.html`); writeFileSync(tmp, html(req));
  const page = await browser.newPage({ viewport: { width: 1200, height: 800 }, deviceScaleFactor: 1.5 });
  await page.goto(pathToFileURL(tmp).href, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  // 넘치면 글씨를 조금씩 줄임 (최소 75%) · 제목 2줄 · 본문 영역 안
  const fit = await page.evaluate(() => {
    const box = document.querySelector('.in'), h1 = document.querySelector('h1'); let k = 1;
    const over = () => box.scrollHeight > box.clientHeight + 1 || [...box.querySelectorAll('*')].some(e => e.scrollWidth > e.clientWidth + 1 && getComputedStyle(e).overflow !== 'visible');
    const shrink = f => box.querySelectorAll('h1,.pts span,.stp b,.stp span,.cmp td,.cmp th').forEach(e => { e.style.fontSize = parseFloat(getComputedStyle(e).fontSize) * f + 'px'; });
    if (h1 && h1.getBoundingClientRect().height > parseFloat(getComputedStyle(h1).lineHeight) * 2.2) { h1.style.fontSize = '40px'; }
    while (box.scrollHeight > box.clientHeight + 1 && k > 0.75) { shrink(0.95); k *= 0.95; }
    return k;
  });
  mkdirSync(dirname(out), { recursive: true });
  await page.screenshot({ path: out, type: 'jpeg', quality: 90 });
  await page.close(); rmSync(tmp, { force: true });
  return { fit };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [, , input, outArg] = process.argv;
  const req = JSON.parse(readFileSync(input, 'utf8'));
  const browser = await chromium.launch(process.env.PW_EXEC ? { executablePath: process.env.PW_EXEC } : process.env.PW_CHANNEL ? { channel: process.env.PW_CHANNEL } : process.env.CI ? {} : { channel: 'msedge', headless: false, args: ['--headless=new'] });
  try { console.log('ok', JSON.stringify(await renderBody(req, resolve(outArg || join(here, 'out', (req.id || 'body') + '.jpg')), browser))); }
  finally { await browser.close(); }
}
