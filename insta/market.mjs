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
window.addEventListener('load', () => { document.querySelectorAll('[data-fitw]').forEach(el => { const mn = +el.dataset.fitw || 20; let fs = parseFloat(getComputedStyle(el).fontSize); while (el.scrollWidth > el.clientWidth + 1 && fs > mn) { fs -= 2; el.style.fontSize = fs + 'px'; } });   // data-fitw: 한 줄이 칸 너비를 넘으면 글자를 줄임 (2026-11-23)
  document.querySelectorAll('[data-max]').forEach(el => { const mx = +el.dataset.max, mn = +el.dataset.min || 24; let fs = parseFloat(getComputedStyle(el).fontSize); while (el.scrollHeight > mx && fs > mn) { fs -= 2; el.style.fontSize = fs + 'px'; } }); document.body.dataset.ready = '1'; });
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
  <div class="a" style="left:84px;top:1250px;width:912px;font-size:24px;color:#fff;opacity:.45">*거래에는 손실 위험이 있습니다. 이용약관이 적용됩니다.</div>`);
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
  ${(s.why || []).slice(0, 3).map((t, i, A) => { const N = (s.whyNote || [])[i], g = (s.whyNote || []).some(Boolean) ? 112 : A.length < 3 ? 120 : 90, y0 = (s.whyNote || []).some(Boolean) ? 936 : 950; return `<div class="a num" style="left:84px;top:${y0 + i * g}px;width:48px;height:48px;border-radius:24px;background:${EB};color:#fff;font-weight:700;font-size:24px;display:flex;align-items:center;justify-content:center">${i + 1}</div>
    <div class="a" data-max="50" data-min="26" style="left:156px;top:${y0 + 2 + i * g}px;width:840px;font-weight:700;font-size:34px;line-height:1.3;color:${DK}">${esc(t)}</div>${N ? `<div class="a" data-max="40" data-min="20" style="left:156px;top:${y0 + 50 + i * g}px;width:840px;font-size:26px;font-weight:500;line-height:1.35;color:${DK};opacity:.55">${esc(N)}</div>` : ''}`; }).join('')}
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
    <div class="a" data-max="52" data-min="28" style="left:250px;top:${y + (s[2] ? 30 : 50)}px;width:700px;font-weight:700;font-size:38px;line-height:1.25;color:${DK}">${esc(s[0])}</div>
    <div class="a num" style="left:250px;top:${y + (s[2] ? 86 : 112)}px;width:700px;font-size:28px;font-weight:600;color:${EB}">${esc(s[1] || '')}</div>${s[2] ? `<div class="a" data-max="36" data-min="20" style="left:250px;top:${y + 132}px;width:700px;font-size:25px;font-weight:500;color:${DK};opacity:.55">${esc(s[2])}</div>` : ''}`; }).join('')}
  ${foot((r.date || '') + ' 종가 기준')}${dots(5, 3)}`);
}
// 국기 + 나라 이름 (2026-11-19 사용자: 나라 코드 대신 국기) · 그림은 flagcdn.com 공개 국기 SVG
const FLAG = { US: ['us', '미국'], FED: ['us', '미국 연준'], EU: ['eu', '유로존'], UK: ['gb', '영국'], GB: ['gb', '영국'], JP: ['jp', '일본'], CN: ['cn', '중국'], CA: ['ca', '캐나다'], AU: ['au', '호주'], NZ: ['nz', '뉴질랜드'], CH: ['ch', '스위스'], KR: ['kr', '한국'], DE: ['de', '독일'] };
const flag = (c, x, y) => { const f = FLAG[String(c || '').toUpperCase()]; return f ? `<img class="a" src="https://flagcdn.com/${f[0]}.svg" style="left:${x}px;top:${y}px;width:66px;height:44px;object-fit:cover;border-radius:6px;border:1px solid #dde3ee"><div class="a" style="left:${x + 82}px;top:${y + 4}px;font-weight:700;font-size:28px;color:${DK}">${esc(f[1])}</div>`
  : `<div class="a num" style="left:${x}px;top:${y}px;width:104px;height:56px;border-radius:10px;background:${NAVY};color:#fff;font-weight:700;font-size:24px;display:flex;align-items:center;justify-content:center">${esc(c)}</div>`; };
// 5 내일 볼 것 — 2×2 일정 카드 + 남색 저장 바
function watch(r) {
  return page(BG, `${head(r, '05 / 05')}${sub('WHAT TO WATCH')}${title(r.watchT || '다가오는\n주요 발표 일정', String(r.watchT || '다가오는\n주요 발표 일정').split('\n').pop())}
  ${(r.watch || []).slice(0, 4).map((s, i) => { const x = 84 + (i % 2) * 468, y = 540 + Math.floor(i / 2) * 300; return `<div class="a card" style="left:${x}px;top:${y}px;width:444px;height:276px"></div>
    ${flag(s[0], x + 32, y + 32)}
    <div class="a num" style="left:${x + 32}px;top:${y + (s[3] ? 104 : 158)}px;font-weight:700;font-size:28px;color:${EB}">${esc(s[1])}</div>
    <div class="a" data-max="50" data-min="26" style="left:${x + 32}px;top:${y + (s[3] ? 146 : 198)}px;width:380px;font-weight:700;font-size:34px;line-height:1.3;color:${DK}">${esc(s[2])}</div>${s[3] ? `<div class="a" data-max="64" data-min="20" style="left:${x + 32}px;top:${y + 200}px;width:380px;font-size:24px;font-weight:500;line-height:1.35;color:${DK};opacity:.55">${esc(s[3])}</div>` : ''}`; }).join('')}
  <div class="a" style="left:84px;top:1150px;width:912px;height:96px;border-radius:48px;background:#164492;display:flex;align-items:center;justify-content:space-between;padding:0 46px;color:#fff;font-weight:700;font-size:32px"><span>${esc(r.watchBar || '저장해 두고 발표 시간에 확인하세요')}</span><span class="num" style="font-size:40px">→</span></div>
  ${foot('한국 시간 기준')}${dots(5, 4)}`);
}
// ── 주제별 틀 (2026-11-19 사용자: 글마다 구성 다르게 · '주제별 틀 3종') ──
// r.layout = 'stock'(종목 주인공 · 기본) | 'macro'(지수·금리·환율 주인공) | 'data'(경제지표 발표)
const pctTxt = v => (v > 0 ? '+' : v < 0 ? '−' : '') + Math.abs(Number(v)).toFixed(1) + '%';
function spark(P, x, y, w, h, col) {
  if (!P || P.length < 2) return '';
  const mn = Math.min(...P), mx = Math.max(...P);
  const pts = P.map((v, i) => `${(x + i * w / (P.length - 1)).toFixed(1)},${(y + (mx - v) / ((mx - mn) || 1) * h).toFixed(1)}`).join(' ');
  return `<svg class="a" style="left:0;top:0" width="1080" height="1350"><polyline points="${pts}" fill="none" stroke="${col}" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/></svg>`;
}
// macro 2장 — 주요 지수 3개: 이름·종가·등락 칩·하루 흐름 + 쉬운 설명
function indices(r) {
  const L = (r.idx || []).slice(0, 3);
  return page(BG, `${head(r, '02 / 05')}${sub(r.idxSub || 'MAJOR INDICES')}${title(r.idxT || '미국 3대 지수\n한눈에 보기', r.idxHl || String(r.idxT || '미국 3대 지수\n한눈에 보기').split('\n').pop())}
  ${L.map((s, i) => { const y = 540 + i * 232, up = s.pct >= 0, col = up ? EB : RED; return `<div class="a card" style="left:84px;top:${y}px;width:912px;height:208px"></div>
    <div class="a" style="left:124px;top:${y + 34}px;font-weight:700;font-size:30px;color:${DK}">${esc(s.name)}</div>
    <div class="a num" style="left:120px;top:${y + 78}px;font-weight:700;font-size:56px;letter-spacing:-.02em;color:${DK}">${esc(s.price)}</div>
    <div class="a" style="left:124px;top:${y + 150}px"><span class="chip" style="background:${col};font-size:24px;padding:8px 18px">${pctTxt(s.pct)}</span></div>
    ${s.note ? `<div class="a" data-max="34" data-min="20" style="left:270px;top:${y + 156}px;width:380px;font-size:24px;font-weight:500;color:${DK};opacity:.55">${esc(s.note)}</div>` : ''}
    ${spark(s.points, 660, y + 46, 296, 116, col)}`; }).join('')}
  ${foot(r.idxSrc || '')}${dots(5, 1)}`);
}
// macro 3장 — 자산별 타일 2×3: 금리·달러·유가·금·비트코인·변동성
function tiles(r) {
  const L = (r.tiles || []).slice(0, 6);
  return page(BG, `${head(r, '03 / 05')}${sub(r.tilesSub || 'RATES · FX · COMMODITIES')}${title(r.tilesT || '금리·달러·원자재\n움직임', String(r.tilesT || '금리·달러·원자재\n움직임').split('\n').pop())}
  ${L.map((s, i) => { const x = 84 + (i % 2) * 468, y = 540 + Math.floor(i / 2) * 212, col = s.up == null ? DK : s.up ? EB : RED; return `<div class="a card" style="left:${x}px;top:${y}px;width:444px;height:192px"></div>
    <div class="a" style="left:${x + 32}px;top:${y + 28}px;font-weight:700;font-size:26px;color:${DK};opacity:.7">${esc(s.name)}</div>
    <div class="a num" style="left:${x + 30}px;top:${y + 66}px;font-weight:700;font-size:48px;letter-spacing:-.02em;color:${DK}">${esc(s.val)}</div>
    <div class="a num" style="right:${1080 - (x + 444 - 32)}px;top:${y + 80}px;font-weight:700;font-size:30px;color:${col}">${esc(s.chg)}</div>
    ${s.note ? `<div class="a" data-max="34" data-min="18" style="left:${x + 32}px;top:${y + 140}px;width:380px;font-size:22px;font-weight:500;color:${DK};opacity:.55">${esc(s.note)}</div>` : ''}`; }).join('')}
  ${foot(r.tilesSrc || '')}${dots(5, 2)}`);
}
// data 2장 — 경제지표: 실제값 크게 + 예상·이전 비교 막대 + 무엇을 뜻하는지
function indicator(r) {
  const d = r.ind || {}, vals = [['실제', d.actual, EB], ['예상', d.forecast, '#9aa8c4'], ['이전', d.previous, '#c9d2e3']].filter(x => x[1] != null && x[1] !== '');
  const num = v => parseFloat(String(v).replace(/[^\d.\-−]/g, '').replace('−', '-')), mx = Math.max(...vals.map(x => Math.abs(num(x[1])) || 0), 1e-9);
  return page(BG, `${head(r, '02 / 05')}
  <div class="a" style="left:84px;top:220px"><span class="chip" style="background:${DK};font-size:28px">${esc(d.flag ? (FLAG[d.flag] || [, d.flag])[1] + ' · ' : '')}${esc(d.name || '')}</span></div>
  <div class="a" style="left:84px;top:290px;font-size:28px;font-weight:600;color:${DK};opacity:.55">${esc(d.period || '')}</div>
  <div class="a num" style="left:78px;top:330px;font-weight:700;font-size:128px;letter-spacing:-.03em;color:${DK}">${esc(d.actual || '')}</div>
  ${d.verdict ? `<div class="a" style="left:84px;top:500px"><span class="chip" style="background:${d.up === false ? RED : EB}">${esc(d.verdict)}</span></div>` : ''}
  <div class="a card" style="left:84px;top:590px;width:912px;height:250px"></div>
  ${vals.map(([k, v, c], i) => { const y = 626 + i * 70, w = Math.max(8, Math.abs(num(v)) / mx * 560); return `<div class="a" style="left:124px;top:${y}px;font-weight:700;font-size:28px;color:${DK};opacity:${i ? .6 : 1}">${k}</div>
    <div class="a" style="left:230px;top:${y + 6}px;width:${w}px;height:26px;border-radius:4px;background:${c}"></div>
    <div class="a num" style="left:${244 + w}px;top:${y - 2}px;font-weight:700;font-size:30px;color:${i ? DK : EB};opacity:${i ? .6 : 1}">${esc(v)}</div>`; }).join('')}
  <div class="a" style="left:84px;top:880px;font-weight:800;font-size:48px;color:${DK}">${esc(d.whyTitle || '무슨 뜻일까?')}</div>
  ${(d.why || []).slice(0, 3).map((w, i) => { const y = 966 + i * 100; return `<div class="a num" style="left:84px;top:${y}px;width:48px;height:48px;border-radius:24px;background:${EB};color:#fff;font-weight:700;font-size:24px;display:flex;align-items:center;justify-content:center">${i + 1}</div>
    <div class="a" data-max="48" data-min="24" style="left:156px;top:${y + 2}px;width:840px;font-weight:700;font-size:32px;color:${DK}">${esc(w[0])}</div>${w[1] ? `<div class="a" data-max="36" data-min="20" style="left:156px;top:${y + 48}px;width:840px;font-size:25px;font-weight:500;color:${DK};opacity:.55">${esc(w[1])}</div>` : ''}`; }).join('')}
  ${foot(d.src || '')}${dots(5, 1)}`);
}
// 설명형 카드 — 그날 글에 나온 어려운 용어 하나 (2026-11-19 사용자: 설명형 카드도 있으면 좋겠음)
// r.explain = { term, title, hl, def, how:[[라벨, 설명, up(true/false/null)] ×2], today }
function explain(r) {
  const e = r.explain || {}, H = (e.how || []).slice(0, 2), t = e.title || (e.term ? e.term + ',\n무슨 뜻일까?' : '');
  return page(BG, `${head(r, '04 / 06')}${sub(e.sub || 'EASY WORDS')}${title(t, e.hl || String(t).split('\n').pop())}
  <div class="a card" style="left:84px;top:540px;width:912px;height:236px"></div>
  <div class="a" style="left:124px;top:578px"><span class="chip" style="background:${DK};font-size:26px">${esc(e.term || '')}</span></div>
  <div class="a" data-max="110" data-min="26" style="left:124px;top:648px;width:832px;font-weight:700;font-size:38px;line-height:1.4;color:${DK}">${esc(e.def || '')}</div>
  ${H.map((h, i) => { const x = 84 + i * 468, col = h[2] === false ? RED : h[2] === true ? EB : DK; return `<div class="a card" style="left:${x}px;top:800px;width:444px;height:300px"></div>
    <div class="a" style="left:${x + 32}px;top:832px;display:flex;align-items:center;gap:14px"><span style="display:inline-flex;width:52px;height:52px;border-radius:26px;background:${col};color:#fff;font-weight:800;font-size:30px;align-items:center;justify-content:center">${h[2] === false ? '↓' : h[2] === true ? '↑' : '·'}</span><span style="font-weight:800;font-size:34px;color:${col}">${esc(h[0])}</span></div>
    <div class="a" data-max="170" data-min="22" style="left:${x + 32}px;top:912px;width:380px;font-size:30px;font-weight:500;line-height:1.45;color:${DK};opacity:.8">${esc(h[1])}</div>`; }).join('')}
  ${e.today ? `<div class="a" style="left:84px;top:1130px;width:912px;height:110px;border-radius:24px;background:#164492;display:flex;align-items:center;gap:22px;padding:0 40px;color:#fff"><span style="flex:none;font-weight:800;font-size:26px;background:rgba(255,255,255,.16);border-radius:999px;padding:8px 18px">오늘은?</span><span data-max="80" data-min="22" style="font-weight:700;font-size:30px;line-height:1.35">${esc(e.today)}</span></div>` : ''}
  ${foot(e.src || '알고 보면 쉬운 금융 용어')}${dots(6, 3)}`);
}
// 쪽 번호·점을 실제 장 수에 맞게 다시 씀 (틀마다 05·06 이 섞이지 않게)
function renumber(pages) {
  const n = pages.length, nn = String(n).padStart(2, '0');
  return pages.map((h, i) => h.replace(/>0\d \/ 0\d</, `>${String(i + 1).padStart(2, '0')} / ${nn}<`)
    .replace(/<div class="dots">[\s\S]*?<\/div>/, dots(n, i)));
}
// ── 설명형 6장 세트 (layout 'story' · 2026-11-20 사용자 확정 · 피그마 플러그인 '①-4 설명형 세트'와 같은 좌표) ──
// 표지 → 핵심 숫자 → 왜 올랐을까(사진 + 글) → 오늘의 한 단어(남색 · 3D 그림) → 함께 움직인 종목 → 정리·일정·저장 안내
// r.k = { tagA, tagB, title, hl[], points[], up, close, ext, stat:[[이름, 큰 숫자, 작은 줄, 파랑?] ×2], src }
// r.why = { tagA, tagB, title, hl[], photo, labels:[l1, l2], text, textHl[], points:[줄 ×2~3], src }
// r.word = { word, en, mean, today, art }   r.peers = { tagA, tagB, title, hl[], rows:[[이름, 값, 비교?]], src }
// r.end = { sum:[[굵게, 숫자]] ×3, watch:[[나라, 시각, 이름]] ×3 }
const hiM = (t, words, col) => { let h = esc(t); (words || []).filter(Boolean).forEach(w => { const e = esc(w); h = h.split(e).join(`\u0001${e}\u0002`); }); return h.replace(/\u0001/g, `<span style="color:${col || EB}">`).replace(/\u0002/g, '</span>').replace(/\n/g, '<br>'); };
const tagPair = (a, b, dark) => `<div class="a" style="left:0;width:1080px;top:196px;display:flex;gap:10px;justify-content:center"><span style="border-radius:999px;padding:10px 22px;font-weight:700;font-size:26px;background:${EB};color:#fff">${esc(a)}</span>${b ? `<span style="border-radius:999px;padding:8px 20px;font-weight:700;font-size:26px;background:${dark ? '#16234a' : '#fff'};color:${dark ? '#fff' : DK};border:2px solid ${dark ? '#2a3a66' : '#dde3ee'}">${esc(b)}</span>` : ''}</div>`;
const cTitle = (t, hl, top, size, maxH) => `<div class="a" data-max="${maxH || 160}" data-min="40" style="left:84px;top:${top}px;width:912px;text-align:center;font-weight:800;font-size:${size}px;line-height:1.28;letter-spacing:-.03em;color:${DK}">${hiM(t, hl)}</div>`;
const headD = (r, page) => `<div class="a lg w" style="left:84px;top:72px;width:150px">${LOGO}</div>
  <div class="a num" style="left:260px;top:90px;font-weight:600;font-size:24px;letter-spacing:.04em;color:#fff;opacity:.45">${esc(r.series)}</div>
  <div class="a num" style="right:84px;top:88px;font-weight:600;font-size:26px;color:#fff;opacity:.55">${page}</div>
  <div class="a" style="left:84px;top:150px;width:912px;height:2px;background:#fff;opacity:.1"></div>`;
const dots6 = (cur, dark) => `<div class="dots">${Array.from({ length: 6 }, (_, i) => `<i class="${i === cur ? 'on' : ''}" ${dark && i !== cur ? 'style="background:#fff;opacity:.25"' : ''}></i>`).join('')}</div>`;
const lab = (t, bg) => `<span style="display:inline-block;border-radius:10px;padding:10px 18px;background:${bg};color:#fff;font-weight:700;font-size:24px;white-space:nowrap">${esc(t)}</span>`;

// 2 핵심 숫자
function sKey(r) {
  const k = r.k || {}, P = k.points || [], col = k.up === false ? RED : EB, W = 780, H = 300, X = 150, Y = 560;
  const mn = P.length ? Math.min(...P) : 0, mx = P.length ? Math.max(...P) : 1, px = i => X + i * W / Math.max(P.length - 1, 1), py = v => Y + (mx - v) / ((mx - mn) || 1) * H;
  const ei = k.up === false ? P.indexOf(mx) : P.indexOf(mn);   // 오른 날은 저점, 내린 날은 고점 표시
  return page(BG, `${head(r, '02 / 06')}${tagPair(k.tagA || '핵심 숫자', k.tagB || '하루 주가 흐름')}${cTitle(k.title, k.hl, 280, 60)}
  <div class="a card" style="left:84px;top:470px;width:912px;height:470px"></div>
  ${[0, 1, 2].map(g => `<div class="a" style="left:${X}px;top:${Y + g * H / 2}px;width:${W}px;height:1px;background:${DK};opacity:.08"></div>`).join('')}
  ${P.length > 1 ? `<svg class="a" style="left:0;top:0" width="1080" height="1350"><polyline points="${P.map((v, i) => px(i).toFixed(1) + ',' + py(v).toFixed(1)).join(' ')}" fill="none" stroke="${col}" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"/>
    <circle cx="${px(ei)}" cy="${py(P[ei])}" r="9" fill="${k.up === false ? EB : RED}"/><circle cx="${px(P.length - 1)}" cy="${py(P[P.length - 1])}" r="9" fill="${col}"/></svg>
    ${k.ext ? `<div class="a" style="left:${Math.min(Math.max(px(ei) - 20, 100), 760)}px;top:${k.up === false ? py(P[ei]) - 66 : py(P[ei]) + 18}px">${lab(k.ext, k.up === false ? EB : RED)}</div>` : ''}
    ${k.close ? `<div class="a" style="right:${1080 - (X + W + 10)}px;top:${k.up === false ? py(P[P.length - 1]) + 18 : py(P[P.length - 1]) - 66}px">${lab(k.close, col)}</div>` : ''}` : ''}
  ${(k.stat || []).slice(0, 2).map((s, i) => { const x = 84 + i * 468, c = s[3] === 'red' ? RED : s[3] ? EB : DK; return `<div class="a card" style="left:${x}px;top:970px;width:444px;height:200px;border-radius:28px"></div>
    <div class="a" style="left:${x}px;top:996px;width:444px;text-align:center;font-weight:700;font-size:26px;color:${DK};opacity:.55">${esc(s[0])}</div>
    <div class="a num" style="left:${x}px;top:1032px;width:444px;text-align:center;font-weight:700;font-size:56px;color:${c}">${esc(s[1])}</div>
    <div class="a" style="left:${x}px;top:1116px;width:444px;text-align:center;font-weight:500;font-size:24px;color:${DK};opacity:.6">${esc(s[2] || '')}</div>`; }).join('')}
  ${foot(k.src || '')}${dots6(1)}`);
}
// 3 왜 올랐을까 — 사진 + 사진 위 라벨 2개 + 강조 섞인 문단 + 요점 줄
function sWhy(r) {
  const w = r.why || {}, L = w.labels || [];
  return page(BG, `${head(r, '03 / 06')}${tagPair(w.tagA || '이유', w.tagB)}${cTitle(w.title, w.hl, 270, 54, 150)}
  <div class="a" style="left:84px;top:440px;width:912px;height:420px;border-radius:28px;overflow:hidden;background:#1b2a52">${w.photo ? `<img src="${esc(src(w.photo))}" style="width:100%;height:100%;object-fit:cover">` : ''}
    <div class="a" style="left:0;bottom:0;width:100%;height:160px;background:linear-gradient(180deg,rgba(5,10,26,0),rgba(5,10,26,.55))"></div></div>
  ${L[0] ? `<div class="a" style="left:112px;top:792px">${lab(L[0], NAVY)}</div>` : ''}${L[1] ? `<div class="a" style="right:112px;top:792px">${lab(L[1], EB)}</div>` : ''}
  <div class="a" data-max="160" data-min="24" style="left:84px;top:900px;width:912px;text-align:center;font-weight:500;font-size:32px;line-height:1.52;color:${DK}">${hiM(w.text, w.textHl).replace(/<span style="color:([^"]+)">/g, '<span style="color:$1;font-weight:700">')}</div>
  <div class="a" data-max="140" data-min="20" style="left:84px;top:1076px;width:912px;text-align:center;font-weight:500;font-size:28px;line-height:1.55;color:${DK};opacity:.8">${(w.points || []).slice(0, 3).map(p => '- ' + esc(p)).join('<br>')}</div>
  ${foot(w.src || '')}${dots6(2)}`);
}
// 4 오늘의 한 단어 — 남색 · 큰 영문 단어 흐리게 · 3D 그림 오른쪽 · 단어 · 뜻 한 줄 · 오늘 칩
function sWord(r) {
  const d = r.word || {}, en = String(d.en || '').toUpperCase().replace(/[^A-Z0-9 &]/g, ''), cut = Math.ceil(en.replace(/\s+/g, '').length / 2), enT = en.indexOf(' ') > 0 ? en.split(/\s+/).slice(0, 2).join('<br>') : en.slice(0, cut) + '<br>' + en.slice(cut);
  return page(NAVY, `${headD(r, '04 / 06')}
  <div class="a num" style="left:60px;top:170px;font-weight:800;font-size:${en.length > 12 ? 170 : 250}px;letter-spacing:-.06em;line-height:.9;color:#fff;opacity:.06">${enT}</div>
  ${d.art ? `<img class="a" src="${esc(src(d.art))}" style="left:430px;top:300px;width:600px;height:600px;object-fit:contain">` : ''}
  <div class="a" style="left:84px;top:236px;font-weight:700;font-size:26px;color:${HL}">오늘의 한 단어</div>
  <div class="a" data-max="130" data-min="64" style="left:84px;top:896px;width:912px;font-weight:800;font-size:116px;letter-spacing:-.04em;line-height:1.05;color:#fff">${esc(d.word || '')}</div>
  <div class="a" style="left:84px;top:1036px;width:912px;font-weight:500;font-size:36px;color:#fff;opacity:.75">${esc(d.mean || '')}</div>
  ${d.today ? `<div class="a" style="left:84px;top:1110px"><span class="chip" style="font-size:30px;padding:14px 30px">${esc(d.today)}</span></div>` : ''}
  ${dots6(3, true)}`);
}
// 5 함께 움직인 종목 — 막대 카드 (마지막 줄은 비교용 회색)
function sPeers(r) {
  const p = r.peers || {}, rows = (p.rows || []).slice(0, 6), mx = Math.max(...rows.map(x => Math.abs(x[1])), .1), neg = rows.some(x => x[1] < 0 && !x[2]), pos = rows.some(x => x[1] > 0 && !x[2]);
  const mP = Math.max(0, ...rows.map(x => x[1])), mN = Math.max(0, ...rows.map(x => -x[1]));
  const sc = mP > 0 && mN > 0 ? 400 / (mP + mN) : mN > 0 ? 440 / mx : 380 / mx, zx = mP > 0 && mN > 0 ? 440 + mN * sc : mN > 0 ? 900 : 460;
  const step = [.5, 1, 2, 5, 10, 20].find(t => t * sc >= 76) || 50; let grid = '';
  for (let g = -Math.ceil(mN / step) * step; g <= Math.ceil(mP / step) * step + 1e-9; g += step) { const gx = zx + g * sc; if (gx < 420 || gx > 920) continue;
    grid += `<div class="a" style="left:${gx}px;top:540px;width:${Math.abs(g) < 1e-9 ? 2 : 1}px;height:550px;background:${DK};opacity:${Math.abs(g) < 1e-9 ? .25 : .08}"></div><div class="a num" style="left:${gx - 40}px;width:80px;text-align:center;top:504px;font-size:22px;font-weight:600;color:${DK};opacity:.45">${g > 0 ? '+' : g < 0 ? '−' : ''}${+Math.abs(g).toFixed(1)}%</div>`; }
  const rowsH = rows.map(([n, v, cmp], i) => { const y = 562 + i * 100, wv = Math.abs(v) * sc, c = cmp ? '#9aa8c4' : v >= 0 ? EB : RED, lab2 = (v >= 0 ? '+' : '−') + Math.abs(v).toFixed(1) + '%', inside = v < 0 && zx - wv - 14 - 110 < 400;
    return `<div class="a" style="left:124px;top:${y + 4}px;width:300px;font-weight:700;font-size:28px;color:${DK};opacity:${cmp ? .55 : 1};white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(n)}</div>
      <div class="a" style="left:${v >= 0 ? zx + 2 : zx - wv}px;top:${y + 10}px;width:${Math.max(wv, 4)}px;height:24px;border-radius:4px;background:${c}"></div>
      <div class="a num" style="${v >= 0 ? `left:${zx + 16 + wv}px` : inside ? `left:${zx - wv + 12}px` : `right:${1080 - (zx - wv - 14)}px`};top:${y + 4}px;font-weight:700;font-size:26px;color:${inside ? '#fff' : cmp ? DK : c};opacity:${cmp && !inside ? .55 : 1}">${lab2}</div>`; }).join('');
  return page(BG, `${head(r, '05 / 06')}${tagPair(p.tagA || '같이 움직인 종목', p.tagB)}${cTitle(p.title, p.hl, 280, 56)}
  <div class="a card" style="left:84px;top:480px;width:912px;height:640px"></div>${grid}${rowsH}${foot(p.src || '')}${dots6(4)}`);
}
// 6 정리와 일정 — 번호 3줄 · 구분선 · 국기 일정 · 저장 안내 띠 · 위험 고지
function sEnd(r) {
  const e = r.end || {};
  return page(BG, `${head(r, '06 / 06')}${cTitle('오늘 시장,\n한 장으로 정리하면', ['한 장으로 정리하면'], 196, 64)}
  ${(e.sum || []).slice(0, 3).map((s, i) => { const y = 400 + i * 120; return `<div class="a num" style="left:124px;top:${y + 6}px;font-weight:700;font-size:44px;color:${EB}">0${i + 1}</div>
    <div class="a" data-max="48" data-min="26" style="left:230px;top:${y}px;width:760px;font-weight:800;font-size:36px;color:${DK}">${esc(s[0])}</div>
    <div class="a" style="left:230px;top:${y + 54}px;width:760px;font-weight:500;font-size:26px;color:${DK};opacity:.6;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(s[1] || '')}</div>`; }).join('')}
  <div class="a" style="left:84px;top:770px;width:912px;height:2px;background:${DK};opacity:.1"></div>
  <div class="a" style="left:84px;top:792px;font-weight:700;font-size:28px;color:${DK};opacity:.7">다음 일정 (한국 시간)</div>
  ${(e.watch || []).slice(0, 3).map((w, i) => { const y = 844 + i * 86, f = FLAG[String(w[0] || '').toUpperCase()]; return `<div class="a card" style="left:84px;top:${y}px;width:912px;height:72px;border-radius:18px"></div>
    ${f ? `<img class="a" src="https://flagcdn.com/${f[0]}.svg" style="left:112px;top:${y + 18}px;width:54px;height:36px;object-fit:cover;border-radius:5px;border:1px solid #dde3ee">` : `<div class="a num" style="left:112px;top:${y + 22}px;font-weight:700;font-size:22px">${esc(w[0])}</div>`}
    <div class="a num" style="left:190px;top:${y + 20}px;font-weight:700;font-size:26px;color:${EB}">${esc(w[1])}</div>
    <div class="a" style="left:400px;top:${y + 18}px;width:570px;font-weight:700;font-size:28px;color:${DK};white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(w[2])}</div>`; }).join('')}
  <div class="a" style="left:84px;top:1120px;width:912px;height:96px;border-radius:48px;background:#164492;display:flex;align-items:center;justify-content:space-between;padding:0 46px;color:#fff;font-weight:700;font-size:32px"><span>저장해 두고 발표 시간에 확인하세요</span><span class="num" style="font-size:40px">→</span></div>
  <div class="a" style="left:84px;top:1232px;width:912px;font-size:20px;color:${DK};opacity:.45">*거래에는 손실 위험이 있습니다. 이용약관이 적용됩니다.</div>
  ${dots6(5)}`);
}


// ── v5 시장·경제 이슈 6장 (2026-11-23 사용자 확정 · 피그마 '확정 디자인' 페이지 · 플러그인 ①-4 v5 와 같은 좌표) ──
// 색은 Orbis 메인 컬러 #164492 와 옅은 색만 · 표지: 사진 꽉 + 로고 + 분류 칩 + 첫 줄 + 형광펜 박스 줄 · 2 주가(그래프+인용) · 3 이유(사진 두 장+화살표)
// 4 용어(흰 카드 3개 + vs/+ 연결 · 결론 박스) · 5 업종(목록 카드) · 6 마무리(어두운 사진 + 박스 제목 + 일정 · 한국 시간 기준)
// r.k = { tagA, tagB, title, hl[], points, up, ext, close, text, textHl[], quote, quoteHl[] }
// r.why = { tagA, tagB, title, hl[], photo, photo2, labels[2], text, textHl[], points[3] }
// r.concept = { tagA, tagB, title, cards:[[icon, name, desc]] ×3, joins:['vs','+'], concl1, concl2 }
// r.peers = { tagA, tagB, title, hl[], rows:[[이름, 등락, 비교?, 분야, 주인공?]], cmp }   r.end = { watch:[[나라, 시각, 이름]], photo }
const MC = '#164492', MT1 = '#e4eaf4', MT2 = '#f6f8fc', INK = '#14161c', MSUB = '#9fb3d6';
const ICON = k => 'insta/assets/icons/' + (/^[a-z_]+$/.test(String(k || '')) ? k : 'chartup') + '.png';
const pills5 = (a, b, dark) => `<div class="a" style="left:0;width:1080px;top:110px;display:flex;gap:10px;justify-content:center"><span style="border-radius:999px;padding:10px 22px;font-weight:700;font-size:26px;background:${dark ? '#fff' : MC};color:${dark ? MC : '#fff'}">${esc(a)}</span>${b ? `<span style="border-radius:999px;padding:8px 20px;font-weight:700;font-size:26px;background:${dark ? MC : '#fff'};color:${dark ? '#fff' : DK};border:2px solid ${dark ? '#fff' : '#dde3ee'}">${esc(b)}</span>` : ''}</div>`;
const cT5 = (t, hl, top, size, color, maxH) => `<div class="a" data-max="${maxH || 170}" data-min="40" style="left:84px;top:${top}px;width:912px;text-align:center;font-weight:800;font-size:${size}px;line-height:1.28;letter-spacing:-.03em;color:${color || DK}">${hiM(t, hl, MC)}</div>`;
const para5 = (t, hl, top, size, color, maxH) => `<div class="a" data-max="${maxH || 150}" data-min="22" style="left:84px;top:${top}px;width:912px;text-align:center;font-weight:500;font-size:${size}px;line-height:1.52;color:${color || DK}">${hiM(t, hl, color === '#fff' ? '#fff' : MC).replace(/<span style="color:([^"]+)">/g, '<span style="color:$1;font-weight:800">')}</div>`;
const box5 = (t, size, bg, fg) => `<span style="display:inline-block;background:${bg};color:${fg};font-weight:800;font-size:${size}px;letter-spacing:-.03em;line-height:1.18;padding:${Math.round(size * .06)}px ${Math.round(size * .22)}px ${Math.round(size * .1)}px">${esc(t)}</span>`;
const pg5 = (s, dark) => `<div class="a num" style="right:84px;top:1270px;font-weight:600;font-size:24px;color:${dark ? '#fff' : DK};opacity:.5">${s}</div>`;
const lab5 = (t, bg) => `<span style="display:inline-block;border-radius:10px;padding:10px 18px;background:${bg};color:#fff;font-weight:700;font-size:24px;white-space:nowrap">${esc(t)}</span>`;
const posCss = p => { p = p || {}; const x = Math.max(0, Math.min(100, Number(p.x == null ? 50 : p.x))), y = Math.max(0, Math.min(100, Number(p.y == null ? 50 : p.y))), z = Math.max(1, Math.min(2, Number(p.z || 1))); return `object-position:${x}% ${y}%;transform:scale(${z});transform-origin:${x}% ${y}%`; };   // 사진 위치·확대 (검수 화면에서 고름 · 2026-11-23)
const risk5 = (top, dark) => `<div class="a" style="left:84px;top:${top}px;width:912px;font-size:20px;color:${dark ? '#fff' : DK};opacity:.5">*거래에는 손실 위험이 있습니다. 이용약관이 적용됩니다.</div>`;

function v5Cover(r) {
  return page('#050a1a', `${r.cover ? `<div class="a" style="inset:0;width:1080px;height:1350px;overflow:hidden"><img src="${esc(src(r.cover))}" style="width:1080px;height:1350px;object-fit:cover;${posCss(r.coverPos)}"></div>` : ''}
  <div class="a" style="left:0;top:560px;width:1080px;height:790px;background:linear-gradient(180deg,rgba(5,10,26,0) 0%,rgba(5,10,26,.7) 40%,rgba(5,10,26,.94) 100%)"></div>
  <div class="a" style="left:0;top:0;width:1080px;height:300px;background:linear-gradient(180deg,rgba(5,10,26,.7),rgba(5,10,26,0))"></div>
  <div class="a lg w" style="left:84px;top:84px;width:200px">${LOGO}</div>
  <div class="a" style="left:84px;top:790px"><span class="chip" style="background:${MC}">${esc(r.tag)} · ${esc(r.date)}</span></div>
  <div class="a" data-max="116" data-min="60" style="left:84px;top:880px;width:912px;font-weight:800;font-size:92px;line-height:1.18;letter-spacing:-.045em;color:#fff;white-space:nowrap">${esc(r.title1 || '')}</div>
  <div class="a" style="left:66px;top:1000px">${box5(r.title2 || '', 96, MC, '#fff')}</div>
  <div class="a" style="left:84px;top:1160px;width:912px;font-size:34px;font-weight:500;color:#fff;opacity:.75;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(r.sub || '')}</div>
  ${risk5(1250, true)}`);
}
function v5Key(r) {
  const k = r.k || {}, P = k.points || [], W = 760, H = 300, X = 160, Y = 510;
  const mn = P.length ? Math.min(...P) : 0, mx = P.length ? Math.max(...P) : 1, px = i => X + i * W / Math.max(P.length - 1, 1), py = v => Y + (mx - v) / ((mx - mn) || 1) * H;
  const ei = k.up === false ? P.indexOf(mx) : P.indexOf(mn);
  return page(`linear-gradient(180deg,${MT1},${MT2})`, `${pills5(k.tagA || '주가', k.tagB)}${cT5(k.title, k.hl, 200, 62)}
  <div class="a" style="left:84px;top:400px;width:912px;height:520px;border-radius:36px;background:#fff"></div>
  ${[0, 1, 2].map(g => `<div class="a" style="left:${X}px;top:${Y + g * H / 2}px;width:${W}px;height:1px;background:${DK};opacity:.08"></div>`).join('')}
  ${P.length > 1 ? `<svg class="a" style="left:0;top:0" width="1080" height="1350"><polyline points="${P.map((v, i) => px(i).toFixed(1) + ',' + py(v).toFixed(1)).join(' ')}" fill="none" stroke="${MC}" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"/>
    <circle cx="${px(ei)}" cy="${py(P[ei])}" r="10" fill="${DK}"/><circle cx="${px(P.length - 1)}" cy="${py(P[P.length - 1])}" r="10" fill="${MC}"/></svg>
    ${k.ext ? `<div class="a" style="left:${Math.min(Math.max(px(ei) - 20, 100), 740)}px;top:${k.up === false ? py(P[ei]) - 70 : py(P[ei]) + 26}px">${lab5(k.ext, DK)}</div>` : ''}
    ${k.close ? `<div class="a" style="right:${1080 - (X + W + 16)}px;top:${k.up === false ? py(P[P.length - 1]) + 26 : py(P[P.length - 1]) - 76}px">${lab5(k.close, MC)}</div>` : ''}` : ''}
  ${para5(k.text || '', k.textHl, 960, 32, DK, 110)}
  ${k.quote ? `<div class="a" data-max="64" data-min="28" style="left:84px;top:1110px;width:912px;text-align:center;font-weight:800;font-size:44px;color:${DK};white-space:nowrap">“ ${hiM(k.quote, k.quoteHl, MC)} ”</div>` : ''}
  ${pg5('2/6')}`);
}
function v5Why(r) {
  const w = r.why || {}, L = w.labels || [];
  const ph = (p, x) => `<div class="a" style="left:${x}px;top:400px;width:410px;height:330px;border-radius:24px;overflow:hidden;background:#1b2a52">${p ? `<img src="${esc(src(p))}" style="width:100%;height:100%;object-fit:cover">` : ''}</div>`;
  return page('#ffffff', `${pills5(w.tagA || '이유', w.tagB)}${cT5(w.title, w.hl, 200, 56, DK, 150)}
  ${ph(w.photo, 84)}${ph(w.photo2 || w.photo, 586)}
  <div class="a num" style="left:504px;top:529px;width:72px;height:72px;border-radius:50%;background:${MC};color:#fff;font-weight:700;font-size:40px;display:flex;align-items:center;justify-content:center">→</div>
  ${L[0] ? `<div class="a" style="left:104px;top:680px">${lab5(L[0], INK)}</div>` : ''}${L[1] ? `<div class="a" style="left:606px;top:680px">${lab5(L[1], MC)}</div>` : ''}
  ${para5(w.text || '', w.textHl, 780, 32, DK, 160)}
  <div class="a" data-max="150" data-min="20" style="left:84px;top:1000px;width:912px;text-align:center;font-weight:500;font-size:28px;line-height:1.6;color:${DK};opacity:.75">${(w.points || []).slice(0, 3).map(p => '- ' + esc(p)).join('<br>')}</div>
  ${pg5('3/6')}`);
}
function v5Concept(r) {
  const c = r.concept || {}, cards = (c.cards || []).slice(0, 3), J = c.joins || ['vs', '+'], CW = 248, GAP = 84;
  return page(MC, `${pills5(c.tagA || '알아 둘 말', c.tagB, true)}
  <div class="a" data-max="170" data-min="40" style="left:84px;top:200px;width:912px;text-align:center;font-weight:800;font-size:64px;line-height:1.25;letter-spacing:-.03em;color:#fff">${esc(c.title || '').replace(/\n/g, '<br>')}</div>
  ${cards.map((d, i) => { const x = 84 + i * (CW + GAP); return `<div class="a" style="left:${x}px;top:430px;width:${CW}px;height:420px;border-radius:28px;background:#fff"></div>
    <img class="a" src="${esc(src(ICON(d[0])))}" style="left:${x + (CW - 150) / 2}px;top:478px;width:150px;height:150px;object-fit:contain">
    <div class="a" data-max="50" data-min="24" style="left:${x}px;top:668px;width:${CW}px;text-align:center;font-weight:800;font-size:36px;color:${MC};white-space:nowrap">${esc(d[1] || '')}</div>
    <div class="a" data-max="80" data-min="18" style="left:${x + 16}px;top:724px;width:${CW - 32}px;text-align:center;font-weight:500;font-size:25px;line-height:1.4;color:${DK};opacity:.7">${esc(d[2] || '').replace(/\n/g, '<br>')}</div>
    ${i < cards.length - 1 ? `<div class="a num" style="left:${x + CW + GAP / 2 - 26}px;top:614px;width:52px;height:52px;border-radius:50%;background:#fff;border:3px solid ${MC};color:${MC};font-weight:700;font-size:${J[i] === 'vs' ? 20 : 30}px;display:flex;align-items:center;justify-content:center">${esc(J[i] || '+')}</div>` : ''}`; }).join('')}
  ${c.concl1 ? `<div class="a" style="left:0;width:1080px;top:950px;text-align:center;font-weight:700;font-size:36px;color:#fff">${esc(c.concl1)}</div>` : ''}
  ${c.concl2 ? `<div class="a" style="left:0;width:1080px;top:1010px;text-align:center">${box5(c.concl2, 52, '#fff', MC)}</div>` : ''}
  ${pg5('4/6', true)}`);
}
function v5Peers(r) {
  const p = r.peers || {}, rows = (p.rows || []).filter(x => !x[2]).slice(0, 5);
  return page(`linear-gradient(180deg,${MT2},${MT1})`, `${pills5(p.tagA || '같은 업종', p.tagB)}${cT5(p.title, p.hl, 200, 56, DK, 150)}
  ${rows.map(([n, v, , sec, me], i) => { const y = 400 + i * 148; return `<div class="a" style="left:84px;top:${y}px;width:912px;height:128px;border-radius:24px;background:#fff;${me ? `border:4px solid ${MC}` : ''}"></div>
    <div class="a num" style="left:116px;top:${y + 34}px;width:60px;height:60px;border-radius:50%;background:${me ? MC : MT1};color:${me ? '#fff' : DK};font-weight:700;font-size:28px;display:flex;align-items:center;justify-content:center">${i + 1}</div>
    <div class="a" style="left:204px;top:${y + 26}px;width:540px;font-weight:800;font-size:34px;color:${DK};white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(n)}</div>
    <div class="a" style="left:204px;top:${y + 76}px;width:540px;font-weight:500;font-size:24px;color:${DK};opacity:.55;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(sec || '')}</div>
    <div class="a num" style="right:${1080 - 960}px;top:${y + 36}px;font-weight:700;font-size:46px;color:${MC}">${(v > 0 ? '+' : v < 0 ? '−' : '') + Math.abs(v).toFixed(1)}%</div>`; }).join('')}
  ${p.cmp ? `<div class="a" style="left:84px;top:1150px;width:912px;text-align:center;font-weight:700;font-size:28px;color:${DK};opacity:.6">${esc(p.cmp)}</div>` : ''}
  ${pg5('5/6')}`);
}
function v5End(r) {
  const e = r.end || {}, W = (e.watch || []).slice(0, 3), bg = e.photo || (r.why || {}).photo || r.cover;
  return page('#07090f', `${bg ? `<img class="a" src="${esc(src(bg))}" style="inset:0;width:1080px;height:1350px;object-fit:cover">` : ''}<div class="a" style="inset:0;background:rgba(7,9,15,.72)"></div>
  <div class="a" style="left:0;width:1080px;top:170px;text-align:center">${box5('다음 주요 일정', 64, '#fff', '#0c1a3a')}</div>
  <div class="a" style="left:0;width:1080px;top:290px;text-align:center;font-weight:700;font-size:38px;color:#fff">한국 시간 기준</div>
  ${W.length ? W.map((w, i) => { const y = 420 + i * 120, f = FLAG[String(w[0] || '').toUpperCase()]; return `<div class="a" style="left:84px;top:${y}px;width:912px;height:100px;border-radius:20px;background:rgba(255,255,255,.12);border:2px solid rgba(255,255,255,.25)"></div>
    ${f ? `<img class="a" src="https://flagcdn.com/${f[0]}.svg" style="left:116px;top:${y + 30}px;width:60px;height:40px;object-fit:cover;border-radius:6px">` : `<div class="a num" style="left:116px;top:${y + 32}px;font-weight:700;font-size:24px;color:#fff">${esc(w[0])}</div>`}
    <div class="a num" style="left:200px;top:${y + 32}px;font-weight:700;font-size:30px;color:${MSUB}">${esc(w[1])}</div>
    <div class="a" style="left:420px;top:${y + 30}px;width:560px;font-weight:700;font-size:32px;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(w[2])}</div>`; }).join('')
    : `<div class="a" style="left:0;width:1080px;top:470px;text-align:center;font-weight:700;font-size:34px;color:#fff;opacity:.8">다음 거래일 주요 발표 없음</div>`}
  <div class="a" style="left:84px;top:900px;width:912px;text-align:center;font-weight:500;font-size:32px;line-height:1.55;color:#fff">오르비스 시큐리티즈는 매일 미국 장 마감 뒤<br>주요 종목과 일정을 정리해 올려요.</div>
  ${risk5(1230, true)}${pg5('6/6', true)}`);
}


// ── v6 시장·경제 이슈 5장 (2026-11-23 사용자 확정 · 피그마 ①-4 v6 와 같은 좌표) · 1 표지(v5) → 2 가격 → 3 이유 → 4 세 종목 흐름 → 5 같은 업종(v5) · 6장 일정은 뺌 ──
// r.why = { tagA, tagB, title, hl[], photo, reasons:[[제목(명사형), 두 줄 풀이]] ×3 }
// r.trio = { tagA, tagB, title, hl[], rows:[[이름, 한 줄 풀이(두 줄), 등락, 작은 그래프 점들]] ×3, icons: '아이콘 3개 한 장 경로' }
const spark6 = (P, x, y, w, h, col, sw) => { if (!P || P.length < 2) return ''; const mn = Math.min(...P), mx = Math.max(...P);
  return `<svg class="a" style="left:${x}px;top:${y}px;overflow:visible" width="${w}" height="${h}"><polyline points="${P.map((v, i) => (i * w / (P.length - 1)).toFixed(1) + ',' + ((mx - v) / ((mx - mn) || 1) * h).toFixed(1)).join(' ')}" fill="none" stroke="${col}" stroke-width="${sw || 4}" stroke-linejoin="round" stroke-linecap="round"/></svg>`; };
function v6Key(r) {
  const k = r.k || {}, P = k.points || [], W = 760, H = 250, X = 160, Y = 500;
  const mn = P.length ? Math.min(...P) : 0, mx = P.length ? Math.max(...P) : 1, px = i => X + i * W / Math.max(P.length - 1, 1), py = v => Y + (mx - v) / ((mx - mn) || 1) * H;
  const ei = k.up === false ? P.indexOf(mx) : P.indexOf(mn);
  return page(`linear-gradient(180deg,${MT1},${MT2})`, `${pills5(k.tagA || '가격', k.tagB)}${cT5(k.title, k.hl, 200, 60)}
  <div class="a" style="left:84px;top:400px;width:912px;height:460px;border-radius:36px;background:#fff"></div>
  ${[0, 1, 2].map(g => `<div class="a" style="left:${X}px;top:${Y + g * H / 2}px;width:${W}px;height:1px;background:${DK};opacity:.08"></div>`).join('')}
  ${P.length > 1 ? `<svg class="a" style="left:0;top:0" width="1080" height="1350"><polyline points="${P.map((v, i) => px(i).toFixed(1) + ',' + py(v).toFixed(1)).join(' ')}" fill="none" stroke="${MC}" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"/>
    <circle cx="${px(ei)}" cy="${py(P[ei])}" r="10" fill="${DK}"/><circle cx="${px(P.length - 1)}" cy="${py(P[P.length - 1])}" r="10" fill="${MC}"/></svg>
    ${k.ext ? `<div class="a" style="left:${Math.min(Math.max(px(ei) - 120, 100), 640)}px;top:${k.up === false ? py(P[ei]) - 70 : py(P[ei]) + 22}px">${lab5(k.ext, DK)}</div>` : ''}
    ${k.close ? `<div class="a" style="right:${1080 - (X + W + 16)}px;top:${k.up === false ? py(P[P.length - 1]) + 26 : py(P[P.length - 1]) - 76}px">${lab5(k.close, MC)}</div>` : ''}` : ''}
  ${para5(k.text || '', k.textHl, 900, 30, DK, 200)}
  ${k.quote ? `<div class="a" data-max="64" data-min="28" style="left:84px;top:1135px;width:912px;text-align:center;font-weight:800;font-size:40px;color:${DK};white-space:nowrap">“ ${hiM(k.quote, k.quoteHl, MC)} ”</div>` : ''}
  ${pg5('2/5')}`);
}
function v6Why(r) {
  const w = r.why || {}, R = (w.reasons || []).slice(0, 3);
  return page('#ffffff', `${pills5(w.tagA || '이유', w.tagB)}${cT5(w.title, w.hl, 200, 60, DK, 160)}
  <div class="a" style="left:84px;top:380px;width:912px;height:360px;border-radius:28px;overflow:hidden;background:#1b2a52">${w.photo ? `<img src="${esc(src(w.photo))}" style="width:100%;height:100%;object-fit:cover;${posCss(w.photoPos)}">` : ''}</div>
  ${R.map((x, i) => { const y = 780 + i * 160; return `${i ? `<div class="a" style="left:84px;top:${y - 18}px;width:912px;height:2px;background:${DK};opacity:.08"></div>` : ''}
    <div class="a num" style="left:84px;top:${y + 2}px;width:56px;height:56px;border-radius:50%;background:${MC};color:#fff;font-weight:700;font-size:26px;display:flex;align-items:center;justify-content:center">${i + 1}</div>
    <div class="a" data-fitw="24" style="left:168px;top:${y + 4}px;width:828px;font-weight:800;font-size:34px;color:${DK};white-space:nowrap">${esc(x[0] || '')}</div>
    <div class="a" data-fitw="18" style="left:168px;top:${y + 58}px;width:828px;font-weight:500;font-size:25px;line-height:1.5;color:${DK};opacity:.7;white-space:pre">${esc(x[1] || '')}</div>`; }).join('')}
  ${pg5('3/5')}`);
}
// 5 이번 주 볼 것 (v6 · 2026-11-23 확정) · r.watch5 = { tagA, tagB, title, hl[], rows:[[날짜(요일), 나라, 이름, 왜 보나]] ×3, note }
// ── v7 표지 3종 + 마지막 장 Orbis 소개 (피그마 '[시안] v7 · 표지 A/B/C' · '[새 시안] v18' 확정 2026-11-24) ──
// 표지는 r.cover7 = 'a' | 'b' | 'c' (스튜디오가 날마다 돌려 씀) · 분류 칩(알약) 없음 · 강조: A 형광펜 박스 · B 밑줄 띠 · C 그라데이션 글자
const coverPhoto = (r, x, y, w, h, rad) => r.cover ? `<div class="a" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px;overflow:hidden;${rad ? `border-radius:${rad}px;box-shadow:inset 0 0 0 2px rgba(255,255,255,.15)` : ''}"><img src="${esc(src(r.cover))}" style="width:${w}px;height:${h}px;object-fit:cover;${posCss(r.coverPos)}"></div>` : '';
const LGRAD = '#0b1428', LDARK = '#05060a', SOFT = '#8fb0ea';
function v7CoverA(r) {
  return page('#050a1a', `${coverPhoto(r, 0, 0, 1080, 1350)}
  <div class="a" style="left:0;top:560px;width:1080px;height:790px;background:linear-gradient(180deg,rgba(5,10,26,0) 0%,rgba(5,10,26,.7) 40%,rgba(5,10,26,.94) 100%)"></div>
  <div class="a" style="left:0;top:0;width:1080px;height:300px;background:linear-gradient(180deg,rgba(5,10,26,.7),rgba(5,10,26,0))"></div>
  <div class="a lg w" style="left:84px;top:84px;width:200px">${LOGO}</div>
  <div class="a" style="left:84px;top:822px;width:48px;height:4px;border-radius:2px;background:#fff;opacity:.9"></div>
  <div class="a" style="left:148px;top:802px;font-weight:700;font-size:30px;color:#fff;opacity:.85;white-space:nowrap">${esc(r.tag)}  ·  ${esc(r.date)}</div>
  <div class="a" data-fitw="60" style="left:84px;top:880px;width:912px;font-weight:800;font-size:92px;line-height:1.18;letter-spacing:-.045em;color:#fff;white-space:nowrap">${esc(r.title1 || '')}</div>
  <div class="a" style="left:66px;top:1000px">${box5(r.title2 || '', 86, MC, '#fff')}</div>
  <div class="a" style="left:84px;top:1150px;width:912px;font-size:32px;font-weight:500;color:#fff;opacity:.75;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(r.sub || '')}</div>
  ${risk5(1250, true)}`);
}
function v7CoverB(r) {
  return page(`linear-gradient(160deg,${LGRAD},${LDARK})`, `<div class="a lg w" style="left:84px;top:84px;width:200px">${LOGO}</div>
  <div class="a" style="left:84px;top:230px;font-weight:700;font-size:30px;color:#fff;opacity:.65;white-space:nowrap">${esc(r.tag)}  |  ${esc(r.date)}</div>
  <div class="a" data-fitw="56" style="left:84px;top:290px;width:912px;font-weight:800;font-size:84px;line-height:1.18;letter-spacing:-.04em;color:#fff;white-space:nowrap">${esc(r.title1 || '')}</div>
  <div class="a" data-fitw="56" style="left:84px;top:395px;width:912px;font-weight:800;font-size:84px;line-height:1.18;letter-spacing:-.04em;color:#fff;white-space:nowrap"><span style="background:linear-gradient(180deg,transparent 64%,${MC} 64%,${MC} 92%,transparent 92%);padding:0 8px;margin-left:-8px">${esc(r.title2 || '')}</span></div>
  ${coverPhoto(r, 84, 560, 912, 560, 32)}
  <div class="a" style="left:84px;top:1166px;width:6px;height:40px;border-radius:3px;background:${MSUB}"></div>
  <div class="a" style="left:112px;top:1166px;width:884px;font-size:30px;font-weight:500;color:#fff;opacity:.8;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(r.sub || '')}</div>
  ${risk5(1250, true)}`);
}
function v7CoverC(r) {
  return page('#050a1a', `${coverPhoto(r, 0, 0, 1080, 1350)}
  <div class="a" style="left:0;top:440px;width:1080px;height:910px;background:linear-gradient(180deg,rgba(5,6,10,0) 0%,rgba(5,6,10,.8) 42%,rgba(5,6,10,.97) 100%)"></div>
  <div class="a" style="left:0;top:0;width:1080px;height:300px;background:linear-gradient(180deg,rgba(5,10,26,.7),rgba(5,10,26,0))"></div>
  <div class="a" style="left:40px;top:40px;width:1000px;height:1270px;border:2px solid rgba(255,255,255,.3);box-sizing:border-box"></div>
  <div class="a lg w" style="left:84px;top:84px;width:200px">${LOGO}</div>
  <div class="a" style="left:0;top:772px;width:1080px;text-align:center;font-weight:700;font-size:26px;letter-spacing:.06em;color:#fff;opacity:.75">${esc(r.tag)}  ·  ${esc(r.date)}</div>
  <div class="a" data-fitw="44" style="left:84px;top:830px;width:912px;text-align:center;font-weight:500;font-size:62px;letter-spacing:-.03em;color:#fff;opacity:.92;white-space:nowrap">${esc(r.title1 || '')}</div>
  <div class="a" data-fitw="60" style="left:60px;top:916px;width:960px;text-align:center;font-weight:800;font-size:100px;line-height:1.18;letter-spacing:-.04em;white-space:nowrap"><span style="background:linear-gradient(90deg,#fff 0%,${SOFT} 100%);-webkit-background-clip:text;background-clip:text;color:transparent">${esc(r.title2 || '')}</span></div>
  <div class="a" style="left:500px;top:1070px;width:80px;height:5px;border-radius:3px;background:${SOFT}"></div>
  <div class="a" style="left:84px;top:1104px;width:912px;text-align:center;font-size:30px;font-weight:500;color:#fff;opacity:.75;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(r.sub || '')}</div>
  <div class="a" style="left:84px;top:1240px;width:912px;text-align:center;font-size:20px;color:#fff;opacity:.45">*거래에는 손실 위험이 있습니다. 이용약관이 적용됩니다.</div>`);
}
const v7Cover = r => ({ b: v7CoverB, c: v7CoverC })[String(r.cover7 || '').toLowerCase()] ? ({ b: v7CoverB, c: v7CoverC })[String(r.cover7).toLowerCase()](r) : v7CoverA(r);
// 마지막 장 Orbis 소개 (매일 같음 · 내용은 회사 사실 파일 기준 · 사용자 확정 문구 그대로)
const INTRO_NUM = [['80+', '거래 가능 상품'], ['MT4 · MT5', '거래 프로그램'], ['0.0', '스프레드부터'], ['24시간', '한국어 지원']];
const INTRO_ROWS = [['거래 자산', '외환부터 금 · 지수 · 암호화폐까지 한 계좌로'], ['소액 거래', '적은 금액으로도 가볍게 시작'], ['수수료', '거래 수수료 없는 계좌로 부담 없이'], ['입출금', '원화도 코인도 간편하게']];
function v7Intro(pn) {
  return page(`linear-gradient(160deg,${LGRAD},${LDARK})`, `<div class="a lg w" style="left:370px;top:130px;width:340px">${LOGO}</div>
  <div class="a" style="left:84px;top:340px;width:912px;text-align:center;font-weight:800;font-size:46px;letter-spacing:-.02em;color:#fff">다양한 해외 자산을 하나의 플랫폼에서</div>
  <div class="a" style="left:84px;top:470px;width:912px;height:2px;background:#fff;opacity:.15"></div><div class="a" style="left:84px;top:690px;width:912px;height:2px;background:#fff;opacity:.15"></div>
  ${INTRO_NUM.map((c, k) => { const x = 84 + k * 228, ko = /[가-힣]/.test(c[0]); return `${k ? `<div class="a" style="left:${x}px;top:506px;width:2px;height:150px;background:#fff;opacity:.15"></div>` : ''}
    <div class="a ${ko ? '' : 'num'}" style="left:${x + 4}px;top:${c[0].length > 6 ? 538 : 530}px;width:220px;text-align:center;font-weight:${ko ? 800 : 700};font-size:${c[0].length > 6 ? 34 : 46}px;letter-spacing:-.02em;color:${MSUB}">${esc(c[0])}</div>
    <div class="a" style="left:${x + 4}px;top:612px;width:220px;text-align:center;font-weight:500;font-size:22px;color:#fff;opacity:.7">${esc(c[1])}</div>`; }).join('')}
  <div class="a" style="left:124px;top:748px;font-weight:700;font-size:26px;color:#fff;opacity:.6">Orbis Securities를 선택하는 이유</div>
  ${INTRO_ROWS.map((c, k) => { const y = 800 + k * 92; return `<div class="a" style="left:84px;top:${y}px;width:912px;height:76px;border-radius:18px;background:rgba(255,255,255,.06);border:1.5px solid rgba(255,255,255,.1);box-sizing:border-box"></div>
    <div class="a" style="left:124px;top:${y + 22}px;font-weight:700;font-size:24px;color:${MSUB}">${esc(c[0])}</div>
    <div class="a" style="left:304px;top:${y + 20}px;width:670px;font-weight:500;font-size:26px;color:#fff;opacity:.9;white-space:nowrap">${esc(c[1])}</div>`; }).join('')}
  <div class="a" style="left:84px;top:1180px;width:912px;text-align:center;font-weight:700;font-size:26px;color:#fff;opacity:.8">카카오톡 상담 · 자세한 내용은 프로필 링크에서</div>
  <div class="a" style="left:84px;top:1250px;width:912px;text-align:center;font-size:20px;color:#fff;opacity:.45">*거래에는 손실 위험이 있습니다. 이용약관이 적용됩니다.</div>
  ${pg5(pn || '5/5', true)}`);
}
function v6Watch(r) {
  const w = r.watch5 || {}, rows = (w.rows || []).slice(0, 3);
  return page(`linear-gradient(180deg,${MT2},${MT1})`, `${pills5(w.tagA || '다음에 볼 것', w.tagB)}${cT5(w.title, w.hl, 200, 60)}
  ${rows.map((x, i) => { const y = 410 + i * 236, f = FLAG[String(x[1] || '').toUpperCase()]; return `<div class="a" style="left:84px;top:${y}px;width:912px;height:206px;border-radius:28px;background:#fff;border:2px solid #dde3ee;box-sizing:border-box"></div>
    <div class="a" style="left:124px;top:${y + 40}px"><span class="chip" style="background:${MC};font-size:26px">${esc(x[0] || '')}</span></div>
    ${f ? `<img class="a" src="https://flagcdn.com/${f[0]}.svg" style="left:314px;top:${y + 50}px;width:48px;height:32px;object-fit:cover;border-radius:5px">` : ''}
    <div class="a" data-fitw="24" style="left:380px;top:${y + 42}px;width:576px;font-weight:800;font-size:36px;color:${DK};white-space:nowrap">${esc(x[2] || '')}</div>
    <div class="a" data-fitw="18" style="left:124px;top:${y + 120}px;width:832px;font-weight:500;font-size:26px;line-height:1.45;color:${DK};opacity:.7;white-space:nowrap">${esc(x[3] || '')}</div>`; }).join('')}
  ${w.note ? `<div class="a" style="left:84px;top:1150px;width:912px;text-align:center;font-weight:700;font-size:26px;color:${DK};opacity:.55">${esc(w.note)}</div>` : ''}
  ${pg5('5/5')}`);
}
const COIN_LOGO = { BTC: 'bitcoin', '비트코인': 'bitcoin', ETH: 'ethereum', '이더리움': 'ethereum', XRP: 'xrp', '리플': 'xrp', SOL: 'solana', '솔라나': 'solana', DOGE: 'dogecoin', '도지코인': 'dogecoin', ADA: 'cardano', '카르다노': 'cardano', '에이다': 'cardano', LTC: 'litecoin', '라이트코인': 'litecoin' };   // 로고 파일: insta/assets/coins (Simple Icons · CC0 · 2026-11-23)
const coinLogo = (name, sym) => COIN_LOGO[String(sym || '').toUpperCase().replace(/-USD$/, '')] || COIN_LOGO[String(name || '').trim()] || '';
const coinBadge = (slug, x, y) => `<div class="a" style="left:${x}px;top:${y}px;width:120px;height:120px;border-radius:50%;background:radial-gradient(circle at 32% 28%,#ffffff 0%,#eef2fa 38%,#c4d0e6 100%);box-shadow:inset -7px -9px 16px rgba(22,68,146,.22),inset 6px 6px 12px rgba(255,255,255,.95),0 12px 22px rgba(22,68,146,.20)"><div style="position:absolute;inset:13px;border-radius:50%;background:linear-gradient(145deg,#f7f9fd 0%,#dbe3f1 100%);box-shadow:inset 3px 3px 6px rgba(22,68,146,.22),inset -3px -3px 6px rgba(255,255,255,.95);display:flex;align-items:center;justify-content:center"><img src="${esc(src('insta/assets/coins/' + slug + '.svg'))}" style="width:50px;height:50px;filter:drop-shadow(0 3px 3px rgba(22,68,146,.35))"></div></div>`;   // 우윳빛 서리 유리 동전 + 파란 로고 (Orbis 3D 아이콘 무드 · 2026-11-23)
function v6Trio(r) {
  const t = r.trio || {}, rows = (t.rows || []).slice(0, 3);
  return page(`linear-gradient(180deg,${MT1},${MT2})`, `${pills5(t.tagA || '세 종목 흐름', t.tagB)}${cT5(t.title, t.hl, 200, 58)}
  ${rows.map((x, i) => { const y = 420 + i * 236, v = Number(x[2]) || 0, up = v >= 0, col = up ? MC : DK; return `<div class="a" style="left:84px;top:${y}px;width:912px;height:196px;border-radius:28px;background:#fff;border:2px solid #dde3ee;box-sizing:border-box"></div>
    ${coinLogo(x[0], x[4]) ? coinBadge(coinLogo(x[0], x[4]), 112, y + 38) : t.icons ? `<div class="a" style="left:112px;top:${y + 38}px;width:120px;height:120px;background:url('${esc(src(t.icons))}') ${i * 50}% 50% / 300% auto no-repeat"></div>` : `<div class="a" style="left:112px;top:${y + 38}px;width:120px;height:120px;border-radius:50%;background:${MT1}"></div>`}
    <div class="a" data-fitw="24" style="left:260px;top:${y + 36}px;width:370px;font-weight:800;font-size:36px;color:${DK};white-space:nowrap">${esc(x[0] || '')}</div>
    <div class="a" data-fitw="16" style="left:260px;top:${y + 92}px;width:370px;font-weight:500;font-size:22px;line-height:1.45;color:${DK};opacity:.65;white-space:pre">${esc(x[1] || '')}</div>
    ${spark6(x[3], 650, y + 58, 150, 80, col, 4)}
    <div class="a num" style="right:${1080 - 966}px;top:${y + 72}px;font-weight:700;font-size:44px;color:${col}">${(v > 0 ? '+' : v < 0 ? '−' : '') + Math.abs(v).toFixed(1)}%</div>`; }).join('')}
  ${pg5('4/5')}`);
}


// ── 경제 캘린더 한 장 (2026-11-23 사용자 확정 · 피그마 '확정 디자인' · 캘린더 밝은형) ──
// r = { layout:'cal', label:'11월 넷째 주 · 11.23 ~ 11.27', title1:'이번 주 주요', title2:'경제 일정 5', rows:[[요일, 날짜, 나라, 시각, 이름, 핵심?, 휴장?]], note }
function calPage(r) {
  const rows = (r.rows || []).slice(0, 5);
  return page('#f5f7fb', `<div class="a lg" style="left:84px;top:84px;width:200px">${LOGO_C}</div>
  <img class="a" src="${esc(src('insta/assets/icons/hero_calendar.png'))}" style="left:760px;top:40px;width:270px;height:270px;object-fit:contain">
  <div class="a" style="left:84px;top:236px;font-weight:700;font-size:32px;color:${MC}">${esc(r.label || '')}</div>
  <div class="a" style="left:84px;top:300px;font-weight:800;font-size:80px;letter-spacing:-.04em;line-height:1.2;color:${DK}">${esc(r.title1 || '이번 주 주요')}</div>
  <div class="a" style="left:68px;top:400px">${box5(r.title2 || '', 80, MC, '#fff')}</div>
  <div class="a" style="left:84px;top:560px;width:912px;height:640px;border-radius:36px;background:#fff;border:2px solid #dde3ee"></div>
  ${rows.map((e, i) => { const y = 580 + i * 120, key = !!e[5], hol = !!e[6], f = FLAG[String(e[2] || '').toUpperCase()];
    return `${key ? `<div class="a" style="left:100px;top:${y + 4}px;width:880px;height:112px;border-radius:20px;background:${MT1}"></div>` : i && !(rows[i - 1] || [])[5] ? `<div class="a" style="left:124px;top:${y - 2}px;width:832px;height:2px;background:${DK};opacity:.08"></div>` : ''}
    <div class="a" style="left:124px;top:${y + 32}px"><span style="display:inline-block;border-radius:999px;padding:9px 22px;font-weight:700;font-size:26px;background:${hol ? MT1 : MC};color:${hol ? MC : '#fff'};white-space:nowrap">${esc(e[0])} ${esc(e[1])}</span></div>
    ${f ? `<img class="a" src="https://flagcdn.com/${f[0]}.svg" style="left:270px;top:${y + 46}px;width:42px;height:28px;object-fit:cover;border-radius:4px;border:1px solid #dde3ee">` : ''}
    <div class="a" style="left:330px;top:${y + 38}px;width:470px;font-weight:${key ? 800 : 700};font-size:34px;color:${key ? MC : DK};white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(e[4])}</div>
    <div class="a num" style="right:${1080 - 956}px;top:${y + 42}px;font-weight:700;font-size:30px;color:${hol ? DK : MC};opacity:${hol ? .45 : 1}">${esc(e[3])}</div>`; }).join('')}
  <div class="a" style="left:84px;top:1215px;width:912px;text-align:center;font-weight:500;font-size:24px;color:${DK};opacity:.5">${esc(r.note || '한국 시간 기준 · 일정은 발표 기관 사정에 따라 바뀔 수 있음')}</div>
  <div class="a" style="left:84px;top:1258px;width:912px;text-align:center;font-size:20px;color:${DK};opacity:.45">*거래에는 손실 위험이 있습니다. 이용약관이 적용됩니다.</div>`);
}


// ── 트레이딩 교육 7장 (2026-11-23 사용자 확정 · 피그마 '확정 디자인' 트레이딩 교육 v3 · 남색 바탕 하나 · 강조는 연파랑 글자만 · 표지 강조 없음) ──
// r = { layout:'edu', series, tag, title, sub, cover, prob:{title,hl,a:[이름,값,설명],b:[…],concl,conclHl}, tool:{word,mean,text,icon},
//       chart:{title,hl,name,c:[[o,h,l,c]],concl} (없으면 6장), steps:{title,hl,cards:[[icon,이름,설명]],note}, apply:{title,hl,rows:[[굵게,풀이]]}, sum:{rows:[[이름,핵심]],concl,conclHl} }
const ENV = '#0a1838', ELB = '#9fb3d6';
const eHi = (t, w) => hi(t, w, ELB);
const eHead = (r, p, n) => `<div class="a lg w" style="left:84px;top:72px;width:150px">${LOGO}</div>
  <div class="a" style="left:260px;top:88px;font-weight:700;font-size:24px;color:#fff;opacity:.45">${esc(r.series || '')}</div>
  <div class="a num" style="right:84px;top:86px;font-weight:600;font-size:26px;color:#fff;opacity:.55">${p}/${n}</div>
  <div class="a" style="left:84px;top:150px;width:912px;height:2px;background:#fff;opacity:.14"></div>`;
const eDots = (cur, n) => `<div class="a" style="left:84px;top:1272px;display:flex;gap:10px">${Array.from({ length: n }, (_, i) => `<i style="display:block;height:12px;width:${i === cur ? 40 : 12}px;border-radius:6px;background:${i === cur ? ELB : '#fff'};opacity:${i === cur ? 1 : .2}"></i>`).join('')}</div>`;
const eTitle = (t, w, y) => `<div class="a" data-max="200" data-min="56" style="left:84px;top:${y || 230}px;width:912px;font-weight:800;font-size:76px;line-height:1.2;letter-spacing:-.04em;color:#fff">${eHi(t, w)}</div>`;
const eRisk = `<div class="a" style="left:84px;top:1250px;width:912px;font-size:24px;color:#fff;opacity:.45">*거래에는 손실 위험이 있습니다. 이용약관이 적용됩니다.</div>`;
const eIcon = k => src('insta/assets/icons/' + (/^[a-z_]+$/.test(String(k || '')) ? k : 'chartup') + '.png');
const br = t => esc(t).replace(/\n/g, '<br>');

function eduCover(r, n) {
  return page('#050a1a', `<img class="a" src="${esc(src(r.cover || 'insta/assets/edu_chess.jpg'))}" style="left:0;top:240px;width:1080px;height:1350px;object-fit:cover">
  <div class="a" style="left:0;top:240px;width:1080px;height:260px;background:linear-gradient(180deg,#070d20,rgba(7,13,32,0))"></div>
  <div class="a" style="left:0;top:0;width:1080px;height:720px;background:linear-gradient(180deg,rgba(3,5,11,.9) 0%,rgba(3,5,11,.55) 60%,rgba(3,5,11,0) 100%)"></div>
  <div class="a" style="left:0;top:1120px;width:1080px;height:230px;background:linear-gradient(180deg,rgba(3,5,11,0),rgba(3,5,11,.85) 45%,#03050b)"></div>
  <div class="a lg w" style="left:84px;top:84px;width:200px">${LOGO}</div>
  <div class="a num" style="right:84px;top:100px;font-weight:600;font-size:26px;color:#fff;opacity:.55">1/${n}</div>
  <div class="a" style="left:84px;top:236px;width:912px;text-align:center;font-weight:700;font-size:32px;color:#fff;opacity:.7">${esc(r.tag || '')}</div>
  <div class="a" data-fitw="64" style="left:84px;top:300px;width:912px;text-align:center;font-weight:800;font-size:110px;line-height:1.07;letter-spacing:-.04em;color:#fff;white-space:pre">${esc(r.title)}</div>
  <div class="a" data-fitw="26" style="left:84px;top:580px;width:912px;text-align:center;font-weight:500;font-size:38px;color:#fff;opacity:.85;white-space:nowrap">${esc(r.sub || '')}</div>
  ${eRisk}`);
}
function eduProb(r, p, n) {
  const x = r.prob || {}, col = (c, left, good) => { const [nm, v, d] = c || []; return `<div class="a" style="left:${left}px;top:480px;width:444px;height:620px;border-radius:28px;${good ? 'background:#fff' : 'background:rgba(255,255,255,.05);border:2px solid rgba(255,255,255,.16)'}"></div>
    <div class="a" style="left:${left + 44}px;top:536px;font-weight:700;font-size:38px;color:${good ? MC : '#fff'};opacity:${good ? 1 : .75}">${esc(nm)}</div>
    <div class="a num" data-fitw="40" style="left:${left + 44}px;top:616px;width:370px;font-weight:700;font-size:${good ? 80 : 96}px;line-height:1.1;letter-spacing:-.02em;color:${good ? MC : '#fff'};opacity:${good ? 1 : .55};white-space:nowrap">${esc(v)}</div>
    <div class="a" style="left:${left + 44}px;top:780px;width:356px;height:2px;background:${good ? MC : '#fff'};opacity:.2"></div>
    <div class="a" data-fitw="26" style="left:${left + 44}px;top:830px;width:356px;font-weight:700;font-size:40px;line-height:1.4;color:${good ? DK : '#fff'};opacity:${good ? 1 : .7};white-space:pre">${esc(d)}</div>`; };
  return page(ENV, `${eHead(r, p, n)}${eTitle(x.title, x.hl)}${col(x.a, 84, false)}${col(x.b, 552, true)}
  <div class="a" data-fitw="32" style="left:84px;top:1150px;width:912px;text-align:center;font-weight:800;font-size:52px;letter-spacing:-.03em;color:#fff;white-space:nowrap">${eHi(x.concl, x.conclHl)}</div>${eDots(p - 1, n)}`);
}
function eduTool(r, p, n) {
  const x = r.tool || {}, big = String(x.word || ''), fs = big.length <= 4 ? 200 : big.length <= 7 ? 140 : 100;
  return page(ENV, `${eHead(r, p, n)}
  <div class="a num" style="left:72px;top:${190 + (200 - fs) * .6}px;font-weight:700;font-size:${fs}px;letter-spacing:-.03em;line-height:1.1;color:#fff;white-space:nowrap">${esc(big)}</div>
  <div class="a" data-fitw="36" style="left:84px;top:436px;width:912px;font-weight:800;font-size:64px;letter-spacing:-.04em;color:${ELB};white-space:nowrap">${esc(x.mean || '')}</div>
  <div class="a" data-fitw="26" style="left:84px;top:560px;width:912px;font-weight:500;font-size:36px;line-height:1.5;color:#fff;opacity:.85;white-space:pre">${esc(x.text)}</div>
  <img class="a" src="${esc(eIcon(x.icon || 'hero_magnifier'))}" style="left:330px;top:770px;width:420px;height:420px;object-fit:contain">${eDots(p - 1, n)}`);
}
function eduChart(r, p, n) {
  const x = r.chart || {}, C = (x.c || []).slice(-14), hs = C.map(c => c[1]), ls = C.map(c => c[2]), mx = Math.max(...hs), mn = Math.min(...ls), T = 540, B = 960, y = v => T + (mx - v) / ((mx - mn) || 1) * (B - T);
  const cw = Math.min(40, 820 / Math.max(C.length, 1) * .55), step = 820 / Math.max(C.length, 1);
  return page(ENV, `${eHead(r, p, n)}${eTitle(x.title, x.hl)}
  <div class="a" style="left:84px;top:470px;width:912px;height:700px;border-radius:20px;background:rgba(255,255,255,.05);border:2px solid rgba(255,255,255,.16)"></div>
  ${C.map((c, i) => { const up = c[3] >= c[0], col = up ? ELB : '#fff', op = up ? 1 : .35, cx = 130 + i * step + step / 2; return `<div class="a" style="left:${cx - 2}px;top:${y(c[1])}px;width:4px;height:${Math.max(2, y(c[2]) - y(c[1]))}px;border-radius:2px;background:${col};opacity:${op}"></div>
    <div class="a" style="left:${cx - cw / 2}px;top:${Math.min(y(c[0]), y(c[3]))}px;width:${cw}px;height:${Math.max(6, Math.abs(y(c[0]) - y(c[3])))}px;border-radius:4px;background:${col};opacity:${op}"></div>`; }).join('')}
  <div class="a" style="left:110px;top:1010px;width:860px;height:2px;background:#fff;opacity:.12"></div>
  <div class="a" style="left:120px;top:1040px;width:840px;font-weight:700;font-size:30px;color:#fff;opacity:.7">${esc(x.name || '')}</div>
  <div class="a" style="left:120px;top:1090px;width:840px;font-weight:500;font-size:24px;color:#fff;opacity:.45">${esc(x.src || '')}</div>
  <div class="a" data-fitw="24" style="left:84px;top:1196px;width:912px;text-align:center;font-weight:700;font-size:32px;color:#fff;white-space:nowrap">${esc(x.concl || '')}</div>${eDots(p - 1, n)}`);
}
function eduSteps(r, p, n) {
  const x = r.steps || {}, CW = 248, GAP = 84;
  return page(ENV, `${eHead(r, p, n)}${eTitle(x.title, x.hl)}
  ${(x.cards || []).slice(0, 3).map((c, i) => { const X = 84 + i * (CW + GAP); return `<div class="a" style="left:${X}px;top:480px;width:${CW}px;height:580px;border-radius:28px;background:#fff"></div>
    <img class="a" src="${esc(eIcon(c[0]))}" style="left:${X + (CW - 200) / 2}px;top:530px;width:200px;height:200px;object-fit:contain">
    <div class="a" data-fitw="28" style="left:${X}px;top:770px;width:${CW}px;text-align:center;font-weight:800;font-size:44px;letter-spacing:-.03em;color:${MC};white-space:nowrap">${esc(c[1])}</div>
    <div class="a" data-fitw="20" style="left:${X + 12}px;top:840px;width:${CW - 24}px;text-align:center;font-weight:500;font-size:29px;line-height:1.45;color:${DK};opacity:.75;white-space:pre">${esc(c[2])}</div>
    ${i < 2 ? `<div class="a" style="left:${X + CW + GAP / 2 - 28}px;top:742px;width:56px;height:56px;border-radius:50%;background:${ELB};color:${ENV};font:700 32px Inter,sans-serif;display:flex;align-items:center;justify-content:center">→</div>` : ''}`; }).join('')}
  <div class="a" data-fitw="22" style="left:84px;top:1110px;width:912px;text-align:center;font-weight:500;font-size:30px;color:#fff;opacity:.75;white-space:nowrap">${esc(x.note || '')}</div>${eDots(p - 1, n)}`);
}
function eduApply(r, p, n) {
  const x = r.apply || {};
  return page(ENV, `${eHead(r, p, n)}${eTitle(x.title, x.hl)}
  ${(x.rows || []).slice(0, 3).map((s, i) => { const Y = 480 + i * 245; return `<div class="a" style="left:84px;top:${Y}px;width:912px;height:215px;border-radius:28px;background:#fff"></div>
    <div class="a num" style="left:120px;top:${Y + 60}px;width:96px;height:96px;border-radius:50%;background:${MC};color:#fff;font-weight:700;font-size:46px;display:flex;align-items:center;justify-content:center">${i + 1}</div>
    <div class="a" data-fitw="34" style="left:250px;top:${Y + 46}px;width:710px;font-weight:800;font-size:52px;letter-spacing:-.03em;color:${DK};white-space:nowrap">${esc(s[0])}</div>
    <div class="a" data-fitw="24" style="left:250px;top:${Y + 122}px;width:710px;font-weight:500;font-size:34px;color:${DK};opacity:.65;white-space:nowrap">${esc(s[1])}</div>`; }).join('')}${eDots(p - 1, n)}`);
}
function eduSum(r, p, n) {
  const x = r.sum || {};
  return page(ENV, `${eHead(r, p, n)}${eTitle(x.title || '오늘 정리', x.hl || '정리')}
  <div class="a" style="left:132px;top:470px;width:4px;height:560px;border-radius:2px;background:${ELB};opacity:.45"></div>
  ${(x.rows || []).slice(0, 3).map((s, i) => { const Y = 420 + i * 270; return `<div class="a num" style="left:84px;top:${Y}px;width:100px;height:100px;border-radius:50%;background:${ELB};color:${ENV};font-weight:700;font-size:48px;display:flex;align-items:center;justify-content:center">${i + 1}</div>
    <div class="a" style="left:230px;top:${Y - 2}px;font-weight:700;font-size:32px;color:${ELB}">${esc(s[0])}</div>
    <div class="a" data-fitw="34" style="left:230px;top:${Y + 44}px;width:780px;font-weight:800;font-size:56px;letter-spacing:-.03em;color:#fff;white-space:nowrap">${esc(s[1])}</div>`; }).join('')}
  <div class="a" data-fitw="24" style="left:84px;top:1180px;width:912px;font-weight:700;font-size:36px;color:#fff;white-space:nowrap">${eHi(x.concl, x.conclHl)}</div>${eRisk}`);
}
function eduPages(r) {
  const L = [eduProb, eduTool].concat(r.chart && (r.chart.c || []).length >= 5 ? [eduChart] : [], [eduSteps, eduApply, eduSum]), n = L.length + 1;
  return [eduCover(r, n)].concat(L.map((f, i) => f(r, i + 2, n)));
}


// ── 회사·서비스 소식 2장 (2026-11-23 사용자 확정 · 피그마 '확정 디자인' 회사 소식 v3 · 표지 + 내용 1장 · 밝은 바탕 · 메인 컬러만) ──
// r = { layout:'news', chip:'서비스 소식 · 11.23', title:'원유·천연가스,\nMT5 거래 추가', hl:'MT5 거래 추가', icon:'megaphone',
//       body:{ chip:'무엇이 바뀌나', title:'원자재 3종목,\nMT5에서 거래', hl:'MT5에서 거래', icon:'oil', rows:[[항목, 내용]×3], note } }
const nChip = (t, bg, fg, size) => `<span style="display:inline-block;border-radius:999px;padding:12px 26px;font-weight:700;font-size:${size}px;background:${bg};color:${fg};white-space:nowrap">${esc(t)}</span>`;
const nHead = p => `<div class="a lg" style="left:84px;top:84px;width:200px">${LOGO_C}</div>
  <div class="a num" style="right:84px;top:100px;font-weight:600;font-size:26px;color:${DK};opacity:.5">${p}/2</div>`;
const nRisk = `<div class="a" style="left:84px;top:1260px;width:912px;text-align:center;font-size:24px;color:${DK};opacity:.45">*거래에는 손실 위험이 있습니다. 이용약관이 적용됩니다.</div>`;
const nIcon = k => src('insta/assets/icons/' + (/^[a-z_]+$/.test(String(k || '')) ? k : 'megaphone') + '.png');
function newsCover(r) {
  return page('#f5f7fb', `${nHead(1)}
  <img class="a" src="${esc(nIcon(r.icon || 'megaphone'))}" style="left:250px;top:190px;width:580px;height:580px;object-fit:contain">
  <div class="a" style="left:0;top:800px;width:1080px;text-align:center">${nChip(r.chip || '', MC, '#fff', 30)}</div>
  <div class="a" data-fitw="56" style="left:84px;top:890px;width:912px;text-align:center;font-weight:800;font-size:92px;line-height:1.2;letter-spacing:-.04em;color:${DK};white-space:pre">${hi(r.title || '', r.hl, MC).replace(/<br>/g, '\n')}</div>
  ${nRisk}`);
}
function newsBody(r) {
  const b = r.body || {}, rows = (b.rows || []).slice(0, 3);
  return page('#f5f7fb', `${nHead(2)}
  <img class="a" src="${esc(nIcon(b.icon || r.icon || 'megaphone'))}" style="left:760px;top:170px;width:236px;height:236px;object-fit:contain">
  <div class="a" style="left:84px;top:236px">${nChip(b.chip || '무엇이 바뀌나', MC, '#fff', 28)}</div>
  <div class="a" data-fitw="50" style="left:84px;top:320px;width:660px;font-weight:800;font-size:84px;line-height:1.22;letter-spacing:-.04em;color:${DK};white-space:pre">${hi(b.title || '', b.hl, MC).replace(/<br>/g, '\n')}</div>
  <div class="a" style="left:84px;top:580px;width:912px;height:${rows.length * 150 + 30}px;border-radius:36px;background:#fff;border:2px solid #dde3ee"></div>
  ${rows.map((q, i) => { const y = 610 + i * 150; return `${i ? `<div class="a" style="left:124px;top:${y - 8}px;width:832px;height:2px;background:${DK};opacity:.08"></div>` : ''}
    <div class="a" style="left:124px;top:${y + 40}px">${nChip(q[0], '#e4eaf4', MC, 28)}</div>
    <div class="a" data-fitw="26" style="left:300px;top:${y + 44}px;width:656px;font-weight:700;font-size:38px;color:${DK};white-space:nowrap">${esc(q[1])}</div>`; }).join('')}
  ${b.note ? `<div class="a" data-fitw="20" style="left:84px;top:${610 + rows.length * 150 + 40}px;width:912px;text-align:center;font-weight:500;font-size:26px;color:${DK};opacity:.5;white-space:nowrap">${esc(b.note)}</div>` : ''}
  ${nRisk}`);
}

export const marketPages = r => {
  if (r.layout === 'news') return [newsCover(r), newsBody(r)];   // 회사·서비스 소식 2장 (2026-11-23 확정)
  if (r.layout === 'edu') return eduPages(r);   // 트레이딩 교육 6~7장 (2026-11-23 확정)
  if (r.layout === 'cal') return [calPage(r)];   // 경제 캘린더 한 장 (2026-11-23 확정)
  if (r.layout === 'v5' && r.trio && r.intro) return [r.cover7 ? v7Cover(r) : v5Cover(r), v6Key(r), v6Why(r), v6Trio(r), v7Intro('5/5')];   // v7 (2026-11-24): 표지 3종 돌려쓰기 · 마지막 장 Orbis 소개
  if (r.layout === 'v5' && r.trio) return [v5Cover(r), v6Key(r), v6Why(r), v6Trio(r), (r.watch5 && (r.watch5.rows || []).length ? v6Watch(r) : v5Peers(r).replace('>5/6<', '>5/5<'))];   // v6 5장 (2026-11-23 확정 · 일정 장 뺌)
  if (r.layout === 'v5') return [v5Cover(r), v5Key(r), v5Why(r), v5Concept(r), v5Peers(r), v5End(r)];   // 시장·경제 이슈 v5 6장 (2026-11-23 사용자 확정)
  if (r.layout === 'story') return [cover(r), sKey(r), sWhy(r), sWord(r), sPeers(r), sEnd(r)];   // 설명형 6장 (2026-11-20 확정)
  const L = r.layout === 'macro' ? [cover(r), indices(r), tiles(r), summary(r), watch(r)]
    : r.layout === 'data' ? [cover(r), indicator(r), bars(r), summary(r), watch(r)]
    : [cover(r), detail(r), bars(r), summary(r), watch(r)];
  if (r.explain && r.explain.term) L.splice(3, 0, explain(r));   // 설명형 카드는 3장 뒤 (전체 6장)
  return renumber(L);
};

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
