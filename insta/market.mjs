// 인스타 시장 이슈 카드뉴스 5장 (표지 + 종목/지수 상세 + 막대 + 3줄 요약 + 내일 볼 것) · 1080×1350
// 피그마 플러그인 '카드 올리기'의 [시험] 엔비디아 틀과 같은 좌표·색 (2026-11-19 사용자 확정)
// 사용: node insta/market.mjs req.json outDir   →  outDir/p1.jpg … p5.jpg
// req = { id, date, series, tag, title, hl, sub, cover, stock:{name,price,chg,up,points[],axis[],why[]}, bars:{t,hl,sub,rows:[[이름,값]],src}, sum:[[굵게,작게]], watch:[[배지,시각,일정]], hlColor? }
import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const FONT = 'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css';
const LOGO = readFileSync(join(here, '..', 'templates', 'orbis-logo-white.svg'), 'utf8').replace(/<\?xml[^>]*>/, '');
const LOGO_C = readFileSync(join(here, '..', 'templates', 'orbis-logo.svg'), 'utf8').replace(/<\?xml[^>]*>/, '').replace(/<!--[\s\S]*?-->/g, '');   // 원본 컬러 로고 그대로 (2026-11-19 사용자: 흰색 말고는 원본 그대로)
const DK = '#0f1a33', EB = '#2f6bff', RED = '#e5484d', HL = '#5b8fff', BG = '#f5f7fb', NAVY = '#0a1838';
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
// 제목 안 강조 단어만 색칠 (줄바꿈 \n 유지)
const hi = (t, w, col) => { const s = esc(t); const e = esc(w || ''); const i = e ? s.indexOf(e) : -1; const out = i < 0 ? s : s.slice(0, i) + `<span style="color:${col}">${e}</span>` + s.slice(i + e.length); return out.replace(/\n/g, '<br>'); };
const src = p => !p ? '' : /^(https?|file|data):/.test(p) ? p : pathToFileURL(resolve(here, '..', p)).href;

const BASE = `<link rel="stylesheet" href="${FONT}"><style>
*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1350px;overflow:hidden;font-family:'Pretendard Variable',Pretendard,'Noto Sans KR',sans-serif;-webkit-font-smoothing:antialiased;word-break:keep-all}
.a{position:absolute}.num{font-family:Inter,'Pretendard Variable',sans-serif;font-feature-settings:'tnum'}
.lg svg{width:100%;height:auto;display:block}.lg.w svg *{fill:#fff!important}
.chip{display:inline-block;border-radius:999px;padding:12px 26px;font-weight:700;font-size:30px;color:#fff;background:${EB};white-space:nowrap}
.card{background:#fff;border:2px solid #dde3ee;border-radius:32px}
.dots{position:absolute;left:84px;top:1272px;display:flex;gap:10px}.dots i{display:block;height:12px;width:12px;border-radius:6px;background:${DK};opacity:.2}.dots i.on{width:40px;background:${EB};opacity:1}
</style>
<script>
// 넘침 방지: data-max 높이에 들어갈 때까지 글자 크기를 줄임 (data-min 까지)
window.addEventListener('load', () => { document.querySelectorAll('[data-max]').forEach(el => { const mx = +el.dataset.max, mn = +el.dataset.min || 24; let fs = parseFloat(getComputedStyle(el).fontSize); while (el.scrollHeight > mx && fs > mn) { fs -= 2; el.style.fontSize = fs + 'px'; } }); document.body.dataset.ready = '1'; });
</script>`;

const head = (r, page) => `<div class="a lg" style="left:84px;top:72px;width:150px">${LOGO_C}</div>
  <div class="a num" style="left:260px;top:90px;font-weight:600;font-size:24px;letter-spacing:.04em;color:${DK};opacity:.45">${esc(r.series)}</div>
  <div class="a num" style="right:84px;top:88px;font-weight:600;font-size:26px;color:${DK};opacity:.55">${page}</div>
  <div class="a" style="left:84px;top:150px;width:912px;height:2px;background:${DK};opacity:.1"></div>`;
const dots = (n, cur) => `<div class="dots">${Array.from({ length: n }, (_, i) => `<i class="${i === cur ? 'on' : ''}"></i>`).join('')}</div>`;
const foot = t => `<div class="a" style="right:84px;top:1264px;font-size:22px;font-weight:500;color:${DK};opacity:.4">${esc(t)}</div>`;
const sub = t => `<div class="a num" style="left:84px;top:226px;font-weight:700;font-size:24px;letter-spacing:.08em;color:${EB}">${esc(t)}</div>`;
const title = (t, w) => `<div class="a" data-max="250" data-min="56" style="left:84px;top:276px;width:912px;font-weight:800;font-size:80px;line-height:1.2;letter-spacing:-.04em;color:${DK}">${hi(t, w, EB)}</div>`;
const page = (bg, inner) => `<!doctype html><html lang="ko"><head><meta charset="utf-8">${BASE}</head><body style="background:${bg}">${inner}</body></html>`;

// 1 표지 — 주제 그림 가득 + 아래 어둡게 + 분류 칩 + 큰 제목 + 한 줄 부제
function cover(r) {
  return page('#050a1a', `${r.cover ? `<img class="a" src="${esc(src(r.cover))}" style="inset:0;width:1080px;height:1350px;object-fit:cover">` : ''}
  <div class="a" style="left:0;top:560px;width:1080px;height:790px;background:linear-gradient(180deg,rgba(5,10,26,0) 0%,rgba(5,10,26,.7) 40%,rgba(5,10,26,.94) 100%)"></div>
  <div class="a" style="left:0;top:0;width:1080px;height:300px;background:linear-gradient(180deg,rgba(5,10,26,.7),rgba(5,10,26,0))"></div>
  <div class="a lg w" style="left:84px;top:84px;width:200px">${LOGO}</div>
  <div class="a" style="left:84px;top:790px"><span class="chip">${esc(r.tag)} · ${esc(r.date)}</span></div>
  <div class="a" data-max="250" data-min="64" style="left:84px;top:880px;width:912px;font-weight:800;font-size:100px;line-height:1.18;letter-spacing:-.045em;color:#fff">${hi(r.title, r.hl, r.hlColor || HL)}</div>
  <div class="a" style="left:84px;top:1150px;width:912px;font-size:34px;font-weight:500;color:#fff;opacity:.75">${esc(r.sub || '')}</div>
  <div class="a" style="left:84px;top:1250px;width:912px;font-size:24px;color:#fff;opacity:.45">CFD는 레버리지 상품으로 원금 손실 위험이 있습니다. 투자 권유가 아닙니다.</div>`);
}
// 2 종목·지수 상세 — 큰 값 + 등락 칩 + 하루 흐름 차트(눈금·축) + 이유 3개
function detail(r) {
  const s = r.stock, up = !!s.up, col = up ? EB : RED, P = s.points || [];
  const mn = P.length ? Math.min(...P) : 0, mx = P.length ? Math.max(...P) : 1, W = 760, H = 150, X0 = 124, Y0 = 600;
  const pts = P.map((v, i) => `${(X0 + i * W / Math.max(P.length - 1, 1)).toFixed(1)},${(Y0 + 10 + (mx - v) / ((mx - mn) || 1) * H).toFixed(1)}`).join(' ');
  const mark = s.markAt != null ? X0 + s.markAt * W / Math.max(P.length - 1, 1) : null;
  return page(BG, `${head(r, '02 / 05')}
  <div class="a" style="left:84px;top:220px"><span class="chip" style="background:${DK};font-size:28px">${esc(s.name)}</span></div>
  <div class="a num" style="left:78px;top:286px;font-weight:700;font-size:128px;letter-spacing:-.03em;color:${DK}">${esc(s.price)}</div>
  <div class="a" style="left:84px;top:460px"><span class="chip" style="background:${col}">${esc(s.chg)}</span></div>
  <div class="a card" style="left:84px;top:560px;width:912px;height:250px"></div>
  ${[0, 1, 2].map(g => `<div class="a" style="left:124px;top:${610 + g * 70}px;width:760px;height:1px;background:${DK};opacity:.08"></div><div class="a num" style="left:896px;top:${598 + g * 70}px;font-size:22px;font-weight:600;color:${DK};opacity:.45">${esc((s.axis || [])[g] || '')}</div>`).join('')}
  <svg class="a" style="left:0;top:0" width="1080" height="1350"><polyline points="${pts}" fill="none" stroke="${col}" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/></svg>
  ${mark ? `<div class="a" style="left:${mark}px;top:590px;width:2px;height:200px;background:${DK};opacity:.25"></div><div class="a" style="left:${mark + 12}px;top:758px;font-size:22px;font-weight:700;color:${DK};opacity:.55">${esc(s.markLabel || '')}</div>` : ''}
  <div class="a" style="left:84px;top:856px;font-weight:800;font-size:48px;color:${DK}">${esc(s.whyTitle || (up ? '왜 올랐을까?' : '왜 내렸을까?'))}</div>
  ${(s.why || []).slice(0, 3).map((t, i) => `<div class="a num" style="left:84px;top:${950 + i * 90}px;width:48px;height:48px;border-radius:24px;background:${EB};color:#fff;font-weight:700;font-size:24px;display:flex;align-items:center;justify-content:center">${i + 1}</div>
    <div class="a" data-max="50" data-min="26" style="left:156px;top:${952 + i * 90}px;width:840px;font-weight:700;font-size:34px;line-height:1.3;color:${DK}">${esc(t)}</div>`).join('')}
  ${foot(s.src || '')}${dots(5, 1)}`);
}
// 3 막대 — 0 기준·눈금·길이를 값에 맞춰 자동
function bars(r) {
  const b = r.bars, rows = b.rows.slice(0, 6), mx = Math.max(...rows.map(x => Math.abs(x[1])), .1), neg = rows.some(x => x[1] < 0), pos = rows.some(x => x[1] > 0);
  // 막대 끝 + 값 글자(약 110px)가 카드(오른쪽 996px) 안에 들어오게: 양수 막대는 820px 까지 (2026-11-19 +12.1% 가 밖으로 나가던 것)
  const mP = Math.max(0, ...rows.map(x => x[1])), mN = Math.max(0, ...rows.map(x => -x[1]));
  const sc = pos && neg ? 420 / (mP + mN) : neg ? 500 / mx : 380 / mx, zx = pos && neg ? 400 + mN * sc : neg ? 900 : 440, step = [.5, 1, 2, 5, 10, 20, 50].find(t => t * sc >= 76) || 100;   // 눈금 글자끼리 겹치지 않게 (한 칸 76px 이상)
  let grid = ''; for (let g = -Math.ceil(mx / step) * step; g <= (pos ? Math.ceil(mx / step) * step : 0) + 1e-9; g += step) { const gx = zx + g * sc; if (gx < 390 || gx > 900) continue;
    grid += `<div class="a" style="left:${gx}px;top:600px;width:${Math.abs(g) < 1e-9 ? 2 : 1}px;height:540px;background:${DK};opacity:${Math.abs(g) < 1e-9 ? .25 : .08}"></div><div class="a num" style="left:${gx - 40}px;width:80px;text-align:center;top:564px;font-size:22px;font-weight:600;color:${DK};opacity:.45">${g > 0 ? '+' : g < 0 ? '−' : ''}${+Math.abs(g).toFixed(1)}%</div>`; }
  const rowsH = rows.map(([n, v], i) => { const y = 600 + i * 92, wv = Math.abs(v) * sc, c = v >= 0 ? EB : RED, lab = (v >= 0 ? '+' : '−') + Math.abs(v).toFixed(1) + '%';
    const inside = v < 0 && zx - wv - 14 - 110 < 330;
    return `<div class="a" style="left:124px;top:${y + 6}px;font-weight:700;font-size:32px;color:${DK}">${esc(n)}</div>
      <div class="a" style="left:${v >= 0 ? zx + 2 : zx - wv}px;top:${y + 14}px;width:${Math.max(wv, 4)}px;height:26px;border-radius:4px;background:${c}"></div>
      <div class="a num" style="${v >= 0 ? `left:${zx + 14 + wv}px` : inside ? `left:${zx - wv + 12}px` : `right:${1080 - (zx - wv - 14)}px`};top:${y + 10}px;font-weight:700;font-size:28px;color:${inside ? '#fff' : c}">${lab}</div>`; }).join('');
  return page(BG, `${head(r, '03 / 05')}${sub(b.sub || 'BY SECTOR')}${title(b.t, b.hl)}
  <div class="a card" style="left:84px;top:540px;width:912px;height:650px"></div>${grid}${rowsH}${foot(b.src || '')}${dots(5, 2)}`);
}
// 4 3줄 요약
function summary(r) {
  return page(BG, `${head(r, '04 / 05')}${sub('TODAY IN 3 LINES')}${title('오늘 시장,\n3줄로 정리하면', '3줄로 정리하면')}
  ${(r.sum || []).slice(0, 3).map((s, i) => { const y = 540 + i * 220; return `<div class="a card" style="left:84px;top:${y}px;width:912px;height:196px"></div>
    <div class="a num" style="left:124px;top:${y + 58}px;font-weight:700;font-size:56px;color:${EB}">0${i + 1}</div>
    <div class="a" data-max="52" data-min="28" style="left:250px;top:${y + 50}px;width:700px;font-weight:700;font-size:38px;line-height:1.25;color:${DK}">${esc(s[0])}</div>
    <div class="a" style="left:250px;top:${y + 112}px;width:700px;font-size:28px;font-weight:500;color:${DK};opacity:.55">${esc(s[1] || '')}</div>`; }).join('')}
  ${foot((r.date || '') + ' 종가 기준')}${dots(5, 3)}`);
}
// 5 내일 볼 것 — 2×2 일정 카드 + 남색 저장 바
function watch(r) {
  return page(BG, `${head(r, '05 / 05')}${sub('WHAT TO WATCH')}${title('내일은\n이것만 보세요', '이것만 보세요')}
  ${(r.watch || []).slice(0, 4).map((s, i) => { const x = 84 + (i % 2) * 468, y = 540 + Math.floor(i / 2) * 300; return `<div class="a card" style="left:${x}px;top:${y}px;width:444px;height:276px"></div>
    <div class="a num" style="left:${x + 32}px;top:${y + 32}px;width:104px;height:56px;border-radius:10px;background:${NAVY};color:#fff;font-weight:700;font-size:24px;letter-spacing:.04em;display:flex;align-items:center;justify-content:center">${esc(s[0])}</div>
    <div class="a num" style="left:${x + 32}px;top:${y + 158}px;font-weight:700;font-size:28px;color:${EB}">${esc(s[1])}</div>
    <div class="a" data-max="50" data-min="26" style="left:${x + 32}px;top:${y + 198}px;width:380px;font-weight:700;font-size:36px;line-height:1.3;color:${DK}">${esc(s[2])}</div>`; }).join('')}
  <div class="a" style="left:84px;top:1150px;width:912px;height:96px;border-radius:48px;background:#164492;display:flex;align-items:center;justify-content:space-between;padding:0 46px;color:#fff;font-weight:700;font-size:32px"><span>저장해 두고 내일 아침에 확인하세요</span><span class="num" style="font-size:40px">→</span></div>
  ${foot('한국 시간 기준')}${dots(5, 4)}`);
}
export const marketPages = r => [cover(r), detail(r), bars(r), summary(r), watch(r)];

// 명령줄: node insta/market.mjs req.json outDir
if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  const { chromium } = await import('playwright-core');
  const r = JSON.parse(readFileSync(process.argv[2], 'utf8')), out = process.argv[3] || join(here, '..', 'out', '_insta_market'); mkdirSync(out, { recursive: true });
  const browser = await chromium.launch(process.env.PW_EXEC ? { executablePath: process.env.PW_EXEC } : { channel: process.env.PW_CHANNEL || 'msedge' });
  const pg = await browser.newPage({ viewport: { width: 1080, height: 1350 }, deviceScaleFactor: 1 });
  for (const [i, html] of marketPages(r).entries()) {
    const tmp = join(out, '_p.html'); writeFileSync(tmp, html); await pg.goto(pathToFileURL(tmp).href, { waitUntil: 'networkidle' });   // 파일로 열어야 로컬 그림(file://)이 보임
    await pg.evaluate(() => document.fonts.ready); await pg.waitForFunction(() => document.body.dataset.ready === '1', null, { timeout: 15000 }).catch(() => { });
    await pg.screenshot({ path: join(out, `p${i + 1}.jpg`), type: 'jpeg', quality: 92 });
  }
  try { rmSync(join(out, '_p.html')); } catch (e) { }
  await browser.close(); console.log('ok', out);
}
