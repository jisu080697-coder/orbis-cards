// Orbis 인스타 카드 템플릿 키트 (2026-11-27 사용자: "다크·라이트 각각 표지 3 · 표 3 · 막대 3 · 이미지 설명 4 · 숫자 3 · 진짜 템플릿화")
// 다크 = 레퍼 1(다크 핀테크: 검정 + 연청 빛 · 크고 가는 제목 · 알약 · 3D · 유리 타일) · 라이트 = 레퍼 3(하늘 그라데이션 · 남색 굵은 제목 · 흰 카드 · 아래 시리즈 줄)
// 사용: r = { layout:'kit', theme:'dark'|'light', series, date, pages:[{ t:'<분류>.<번호>', ...칸 }] }
// 분류·칸 (모든 틀 공통: label 작은 라벨 · title 제목([[강조]] · \n 줄바꿈) · sub 설명 · src 출처 줄)
//   cover.1 3D 오브젝트 표지 { obj, pos, pills[2], title, sub, cta }        cover.2 인물 사진 표지 { photo, pos, title, sub }
//   cover.3 폰 화면 표지 { pills, title, sub, phone:{label,value,note,bars[[이름,값]]} }
//   table.1 기본 표 { head[], rows[][], hi:[행번호] }   table.2 두 칸 비교표 { cols[2], rows[[항목,왼쪽,오른쪽]] }   table.3 일정표 { rows[[날짜,요일,내용,상태('off'|'on'|'')]] }
//   bar.1 세로 막대 { bars[[이름,값]], unit }   bar.2 가로 막대 { bars, unit }   bar.3 강조 숫자 + 막대 { value, bars, unit }
//   ex.1 글 위·사진 아래 { no, title, body, photo }   ex.2 사진 위·글 아래   ex.3 사진 반 + 글 반   ex.4 사진 꽉 + 글 카드
//   num.1 큰 숫자 하나 { value, title }   num.2 숫자 흐름 { pair:[[이름,값],[이름,값]], note }   num.3 숫자 세 개 { stats[[값,이름,설명]] }
import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const WANTED = 'https://cdn.jsdelivr.net/gh/wanteddev/wanted-sans@v1.0.3/packages/wanted-sans/fonts/webfonts/variable/split/WantedSansVariable.min.css';
const INTER = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap';
const LOGO = readFileSync(join(here, '..', 'templates', 'orbis-logo-white.svg'), 'utf8').replace(/<\?xml[^>]*>/, '').replace(/<style>[\s\S]*?<\/style>/, '').replace('<svg', '<svg class="olg"');
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const br = s => esc(s).replace(/\[\[([\s\S]+?)\]\]/g, '<em>$1</em>').replace(/\*\*([\s\S]+?)\*\*/g, '<b>$1</b>').replace(/\n/g, '<br>');
const src = p => !p ? '' : /^(https?|file|data):/.test(p) ? p : pathToFileURL(resolve(here, '..', p)).href;
const RISK = '*모든 거래에는 손실 위험이 있으며, 관련 이용약관이 적용됩니다.';
const ICONS = {
  calendar: '<rect x="3.5" y="5" width="17" height="15.5" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
  clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>', down: '<path d="M7 7l10 10M17 9v8H9"/>',
  user: '<circle cx="12" cy="8.5" r="3.5"/><path d="M5 20c1.2-3.5 4-5 7-5s5.8 1.5 7 5"/>',
};
const ICON = (n, sz = 30, w = 1.8) => `<svg width="${sz}" height="${sz}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" style="display:block;flex:none">${ICONS[n] || ''}</svg>`;

// ── 테마 토큰 ── (다크: 레퍼 1 · 라이트: 레퍼 3)
const CSS = `<link rel="stylesheet" href="${WANTED}"><link rel="stylesheet" href="${INTER}"><style>
*{margin:0;padding:0;box-sizing:border-box}
body{--bg:#05070B;--fg:#F5F6F8;--fg2:rgba(245,246,248,.68);--fg3:rgba(245,246,248,.45);--line:rgba(245,246,248,.14);--acc:#8FB0EA;--acc2:#2B64A6;--on:#05070B;--card:linear-gradient(160deg,rgba(255,255,255,.075),rgba(255,255,255,.02));--cardb:1px solid rgba(255,255,255,.12);--shadow:0 30px 60px rgba(0,0,0,.35);--logo:#fff;--num:linear-gradient(180deg,#FFFFFF 0%,#C3CFE0 55%,#7D91B0 100%);--tw:400;--hw:400;
  width:1080px;height:1350px;overflow:hidden;background:var(--bg);color:var(--fg);font-family:'Wanted Sans Variable','Wanted Sans',sans-serif;-webkit-font-smoothing:antialiased;word-break:keep-all}
body{--sh:5,7,11;--so:1}body.mid{--bg:#4F5A6C;--sh:70,79,97;--so:.55;--fg:#fff;--fg2:rgba(255,255,255,.82);--fg3:rgba(255,255,255,.62);--line:rgba(255,255,255,.3);--acc:#D3E2FB;--logo:#fff}
body.light{--bg:linear-gradient(180deg,#D4E3F8 0%,#E9F1FC 45%,#F6F9FE 100%);--fg:#0E2F5C;--fg2:#41526A;--fg3:#6E7C8E;--line:rgba(14,47,92,.16);--acc:#164492;--acc2:#164492;--on:#fff;--card:#fff;--cardb:1px solid rgba(14,47,92,.06);--shadow:0 12px 34px rgba(14,47,92,.08);--logo:#164492;--num:linear-gradient(180deg,#0E2F5C,#164492);--tw:800;--hw:700}
body.light.inv{--bg:linear-gradient(165deg,#17407F 0%,#0E2F5C 55%,#0A2242 100%);--fg:#fff;--fg2:rgba(255,255,255,.78);--fg3:rgba(255,255,255,.55);--line:rgba(255,255,255,.2);--acc:#BFD3F5;--acc2:#8FB0EA;--on:#0E2F5C;--card:rgba(255,255,255,.08);--cardb:1px solid rgba(255,255,255,.16);--shadow:none;--logo:#fff;--num:linear-gradient(180deg,#fff,#BFD3F5)}
.a{position:absolute}em{font-style:normal;color:var(--acc);font-weight:700}.en{font-family:Inter,'Wanted Sans Variable',sans-serif}
.olg *{fill:var(--logo)!important}
.lab{font-size:26px;font-weight:600;color:var(--fg2)}
.ttl{font-weight:var(--tw);letter-spacing:-.035em;line-height:1.1}.ttl em{font-style:normal;color:var(--acc);font-weight:inherit}
.sub{font-size:28px;line-height:1.55;color:var(--fg2)}.sub b{color:var(--fg);font-weight:700}
.pills{display:flex;gap:12px}.pill{padding:9px 20px;border-radius:999px;font-size:20px;font-weight:600;white-space:nowrap}
.pill.o{border:1.5px solid var(--fg3);color:var(--fg)}.pill.f{background:var(--acc);color:var(--on)}
.cta{display:inline-flex;align-items:center;gap:18px;padding:14px 30px 14px 22px;border-radius:999px;background:var(--acc);color:var(--on);font-size:21px;font-weight:700;line-height:1.25}
.card{border-radius:30px;background:var(--card);border:var(--cardb);box-shadow:var(--shadow)}
.num{font-family:Inter,sans-serif;font-weight:500;letter-spacing:-.055em;line-height:.9;background:var(--num);-webkit-background-clip:text;background-clip:text;color:transparent}
.edge{font:500 16px Inter,sans-serif;letter-spacing:.3em;color:var(--fg3);opacity:.45;white-space:nowrap}
.risk{left:80px;bottom:52px;font-size:19px;color:var(--fg3)}
.src{left:80px;right:80px;bottom:96px;font-size:21px;line-height:1.6;color:var(--fg3)}
.bar{left:80px;right:80px;bottom:70px;padding-top:24px;border-top:1.5px solid var(--line);display:flex;justify-content:space-between;align-items:center;font-size:24px;font-weight:600;color:var(--fg)}
body.light .bar{bottom:60px}body.light .risk{display:none}
.tb{width:100%;border-collapse:collapse}.tb th{font-size:22px;font-weight:600;color:var(--fg3);text-align:left;padding:0 0 18px}.tb td{font-size:30px;padding:30px 0;border-top:1px solid var(--line)}
.tb tr.hi td{color:var(--acc);font-weight:700}
</style>`;
// 자동 배치: 본문이 하나의 덩어리면 남는 높이만큼 통째로 키워서(최대 1.32배) 제목~하단 사이를 채움.
// 여러 조각이면 크기는 두고 위치만 가운데로. data-fit="head" → [data-head] 아래 · "all" → 로고 아래 전부
const FIT_JS = `function kitFit(){var B=document.body,m=B.dataset.fit;if(!m)return;var H=document.querySelector('[data-head]');var lim=m==='head'&&H?H.getBoundingClientRect().bottom:(B.classList.contains('light')?90:170);
var F=[].slice.call(document.querySelectorAll('.src,.bar,.risk')).filter(function(e){return getComputedStyle(e).display!=='none'}).map(function(e){return e.getBoundingClientRect().top});var fy=Math.min.apply(null,[1290].concat(F));
var G=[].slice.call(B.children).filter(function(e){if(!e.classList.contains('a')||e.matches('[data-head],[data-bleed],[data-bg],.src,.bar,.risk,.edge,img'))return false;var r=e.getBoundingClientRect();return r.width*r.height>0&&!(r.width>=1000&&r.height>=1200)&&r.top>=lim-5});if(!G.length)return;
function box(){var t=1e9,b=-1e9;G.forEach(function(e){var r=e.getBoundingClientRect();t=Math.min(t,r.top);b=Math.max(b,r.bottom)});return [t,b]}
var minT=lim+(m==='head'?80:0),avail=fy-72-minT;
if(G.length===1&&m==='head'&&!G[0].hasAttribute('data-noscale')){var e=G[0],w=e.getBoundingClientRect().width;if(w>=760&&e.getBoundingClientRect().height<avail*.86){var lo=1,hi=1.32;e.style.right='auto';e.style.transformOrigin='0 0';for(var k=0;k<10;k++){var sc=(lo+hi)/2;e.style.width=(w/sc)+'px';e.style.transform='scale('+sc+')';if(e.getBoundingClientRect().height<=avail*.86)lo=sc;else hi=sc}e.style.width=(w/lo)+'px';e.style.transform='scale('+lo+')'}}
var bx=box(),room=avail-(bx[1]-bx[0]);if(room<=0)return;var d=minT+room*(m==='head'?.42:.48)-bx[0];if(d<4)return;G.forEach(function(e){e.style.top=(parseFloat(getComputedStyle(e).top)+d)+'px'})}`;
// ── 배경 변형 (2026-11-27 "배경 너무 다 똑같아") ── p.bg 로 바꿀 수 있음, 없으면 템플릿마다 정해 둔 기본값
const BIMG = (f, at, op) => `<img class="a" data-bg="1" src="${pathToFileURL(join(here, 'assets', 'onb', f + '.jpg')).href}" style="left:0;top:0;width:1080px;height:1350px;object-fit:cover;object-position:50% ${at};opacity:${op};${at === '100%' ? '-webkit-mask-image:linear-gradient(0deg,#000 0%,#000 18%,transparent 48%)' : ''}">`;
const BGV = {
  d: {
    glow: '',
    navy: '<div class="a" data-bg="1" style="inset:0;background:linear-gradient(165deg,#0C1B36 0%,#070D18 55%,#05070B 100%)"></div>',
    steel: '<div class="a" data-bg="1" style="inset:0;background:linear-gradient(160deg,#1D2129 0%,#0C0E12 58%,#07090C 100%)"></div>',
    grid: '<div class="a" data-bg="1" style="inset:0;background-image:linear-gradient(rgba(255,255,255,.055) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.055) 1px,transparent 1px);background-size:72px 72px;-webkit-mask-image:radial-gradient(85% 65% at 75% 25%,#000,transparent)"></div>',
    wave: () => BIMG('a5_wave', '100%', .5),
    horizon: () => BIMG('a2_planet', '100%', .75),
    planet: () => BIMG('a6_planetedge', '0%', .95),
  },
  l: {
    sky: '',
    white: '<div class="a" data-bg="1" style="inset:0;background:#F7F9FD"></div><div class="a" data-bg="1" style="inset:0;background:radial-gradient(55% 38% at 100% 0%,rgba(22,68,146,.13),rgba(22,68,146,0))"></div>',
    split: '<div class="a" data-bg="1" style="inset:0;background:#F7F9FD"></div><div class="a" data-bg="1" style="left:0;right:0;top:0;height:380px;background:linear-gradient(180deg,#CADCF5,#E6EEF9)"></div>',
    grid: '<div class="a" data-bg="1" style="inset:0;background-image:linear-gradient(rgba(14,47,92,.07) 1px,transparent 1px),linear-gradient(90deg,rgba(14,47,92,.07) 1px,transparent 1px);background-size:72px 72px;-webkit-mask-image:linear-gradient(180deg,#000 10%,transparent 90%)"></div>',
    wave: () => BIMG('ds_light_wave', '100%', 1),
    navy: '',
  },
};
const BG_DEF = {
  d: { 'ex.1': 'steel', 'table.1': 'navy', 'table.2': 'grid', 'table.3': 'wave', 'bar.1': 'horizon', 'bar.2': 'planet', 'bar.3': 'steel', 'num.2': 'grid', 'num.3': 'navy',
    'list.1': 'planet', 'list.2': 'steel', 'list.3': 'grid', 'step.1': 'horizon', 'step.2': 'navy', 'step.3': 'wave', 'quote.1': 'glow', 'qa.1': 'planet', 'qa.2': 'navy', 'cal.1': 'steel', 'cal.2': 'grid',
    'term.1': 'planet', 'term.2': 'wave', 'ratio.1': 'navy', 'ratio.2': 'glow', 'end.2': 'horizon', 'end.3': 'wave', 'sum.1': 'navy', 'rank.1': 'steel', 'news.1': 'grid', 'tip.1': 'planet',
    'pc.1': 'navy', 'ox.1': 'grid', 'quiz.1': 'steel', 'econ.1': 'navy', 'move.1': 'steel', 'flow.1': 'horizon', 'notice.1': 'planet' },
  l: { 'ex.1': 'white', 'table.1': 'white', 'table.2': 'split', 'table.3': 'wave', 'bar.1': 'grid', 'bar.2': 'white', 'bar.3': 'sky', 'num.2': 'split', 'num.3': 'navy',
    'list.1': 'white', 'list.2': 'navy', 'list.3': 'grid', 'step.1': 'wave', 'step.2': 'split', 'step.3': 'white', 'quote.1': 'navy', 'qa.1': 'white', 'qa.2': 'white', 'cal.1': 'grid', 'cal.2': 'sky',
    'term.1': 'navy', 'term.2': 'wave', 'ratio.1': 'white', 'ratio.2': 'navy', 'end.2': 'split', 'end.3': 'navy', 'sum.1': 'split', 'rank.1': 'white', 'news.1': 'grid', 'tip.1': 'wave',
    'pc.1': 'sky', 'ox.1': 'navy', 'quiz.1': 'white', 'econ.1': 'split', 'move.1': 'white', 'flow.1': 'grid', 'notice.1': 'wave' },
};
const bgOf = (r, p) => { const m = (p.theme || r.theme) === 'light' ? 'l' : 'd'; const k = p.bg || BG_DEF[m][p.t] || (m === 'l' ? 'sky' : 'glow'); const v = BGV[m][k]; return { k, html: typeof v === 'function' ? v() : (v || '') }; };
const page = (r, i, p, inner, o = {}) => { const L = (p.theme || r.theme) === 'light', bg = bgOf(r, p); return `<!doctype html><html lang="ko"><head><meta charset="utf-8">${CSS}</head><body class="${L ? 'light' : ''}${L && bg.k === 'navy' ? ' inv' : ''}${(p.theme || r.theme) === 'mid' ? 'mid' : ''}"${p._fit && p.fit !== false ? ` data-fit="${p._fit}"` : ''}>${bg.html}${o.pre || ''}${inner}
  ${L ? BAR(r, p) : `<div class="a risk">${RISK}</div>`}
  <script>${FIT_JS}window.addEventListener('load',()=>document.fonts.ready.then(()=>{kitFit();document.body.dataset.ready='1'}))</script></body></html>`; };
const dark = (r, p) => (p.theme || r.theme) !== 'light';
const GLOW = at => `<div class="a" style="inset:0;background:radial-gradient(55% 40% at ${at},rgba(43,100,166,.3),rgba(43,100,166,0) 70%)"></div>`;
const BAND = r => `<div class="a edge" data-bleed="1" style="left:-20px;top:22px">${Array(8).fill(esc(r.series || 'ORBIS MARKET NOTE')).join(' &nbsp;—&nbsp; ')}</div>`;
const LG = (x = 80, y = 64, w = 150, white) => `<div class="a" style="left:${x}px;top:${y}px;width:${w}px;${white ? '--logo:#fff' : ''}">${LOGO.replace('<svg', `<svg style="width:${w}px;height:auto;display:block"`)}</div>`;
const PILLS = (p) => (p.pills || []).length ? `<div class="pills">${p.pills.map((t, k) => `<span class="pill ${k ? 'f' : 'o'}">${esc(t)}</span>`).join('')}</div>` : '';
const LABEL = p => p.label ? `<div class="lab">${esc(p.label)}</div>` : '';
const CHEV = `<span style="display:flex;gap:4px">${[.35, .6, 1].map(o => `<svg width="24" height="28" viewBox="0 0 13 15" fill="none" stroke="currentColor" stroke-width="1.6" style="opacity:${o}"><path d="M3 2l6 5.5L3 13"/></svg>`).join('')}</span>`;
const BAR = (r, p) => `<div class="a bar" style="${p._barX ? `left:${p._barX}px;` : ''}${p._onPhoto ? 'color:#fff;border-top-color:rgba(255,255,255,.4);--logo:#fff' : ''}"><span style="display:flex;align-items:center;gap:18px"><span style="width:110px;display:block">${LOGO.replace('<svg', '<svg style="width:110px;height:auto;display:block"')}</span><span style="opacity:.8">${esc(p.series || r.exSeries || r.seriesKo || '')}</span></span>${CHEV}</div>`;
const SRC = p => p.src ? `<div class="a src" style="bottom:${p._light ? 130 : 96}px">${br(p.src)}</div>` : '';
// 제목 묶음 (왼쪽 정렬 · 가운데 정렬)
const HEAD = (p, top, size, center) => `<div class="a" data-head="1" style="left:80px;right:80px;top:${top}px;${center ? 'text-align:center' : ''}">${p.no ? `<div class="en" style="font-size:28px;font-weight:700;color:var(--acc)">${esc(p.no)}</div>` : LABEL(p)}<div class="ttl" style="font-size:${p.size || size}px;margin-top:20px">${br(p.title)}</div>${p.sub ? `<div class="sub" style="margin-top:22px">${br(p.sub)}</div>` : ''}</div>`;
const SHADE = (dir, light) => light ? `<div class="a" style="inset:0;background:linear-gradient(${dir},rgba(233,241,252,.96) 0%,rgba(233,241,252,.75) 45%,rgba(233,241,252,0) 80%)"></div>` : `<div class="a" style="inset:0;background:linear-gradient(${dir},rgba(5,7,11,.95) 0%,rgba(5,7,11,.65) 45%,rgba(5,7,11,0) 80%)"></div>`;
const IMG = (path, css, pos) => path ? `<img class="a" src="${esc(src(path))}" style="object-fit:cover;object-position:${pos || '50% 50%'};${css}">` : '';
const PHONE = (ph, x, y, w, h) => `<div class="a" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px;border-radius:${w * .16}px;background:linear-gradient(150deg,#3A3F48,#0B0E14 40%,#22262E);padding:${w * .035}px;box-shadow:0 60px 120px rgba(0,0,0,.45),inset 0 0 0 2px rgba(255,255,255,.22)">
  <div style="width:100%;height:100%;border-radius:${w * .13}px;background:linear-gradient(180deg,#1A2230,#0A0E15);overflow:hidden;position:relative;padding:${w * .2}px ${w * .08}px 0;color:#F5F6F8">
    <div style="position:absolute;left:50%;top:${w * .04}px;width:${w * .3}px;height:${w * .085}px;margin-left:-${w * .15}px;border-radius:40px;background:#000"></div>
    <div style="display:flex;justify-content:space-between"><div style="font-size:${w * .065}px;font-weight:500">${esc(ph.label || '')}</div><span style="opacity:.7">${ICON('user', w * .065)}</span></div>
    <div class="en" style="font-size:${w * .11}px;font-weight:500;letter-spacing:-.02em;margin-top:${w * .02}px">${esc(ph.value || '')}</div>
    <div style="font-size:${w * .05}px;color:rgba(245,246,248,.5);margin-top:4px">${esc(ph.note || '')}</div>
    <div style="display:flex;align-items:flex-end;justify-content:space-around;height:${w * .5}px;margin-top:${w * .06}px;border-bottom:1px solid rgba(245,246,248,.2)">${(ph.bars || []).map((b, k, a) => { const mx = Math.max(...a.map(x => x[1])), last = k === a.length - 1; return `<div style="width:${w * .24}px;text-align:center"><div class="en" style="font-size:${w * .055}px;margin-bottom:10px;${last ? 'color:#8FB0EA' : 'color:rgba(245,246,248,.6)'}">${esc(b[1])}${esc(ph.unit || '')}</div><div style="height:${b[1] / mx * w * .36}px;border-radius:14px 14px 0 0;${last ? 'background:linear-gradient(180deg,#8FB0EA,#2B64A6);box-shadow:0 0 40px rgba(143,176,234,.45)' : 'background:rgba(245,246,248,.18)'}"></div></div>`; }).join('')}</div>
    <div style="display:flex;justify-content:space-around;margin-top:12px;font-size:${w * .042}px;color:rgba(245,246,248,.6)">${(ph.bars || []).map(b => `<div style="width:${w * .24}px;text-align:center">${esc(b[0])}</div>`).join('')}</div></div></div>`;
const maxOf = a => Math.max(...a.map(x => +x[1]));

const T = {
  // ── 표지 ──
  'cover.1': (r, i, p) => { const L = !dark(r, p); return page(r, i, p, `${IMG(p.obj, 'inset:0;width:1080px;height:1350px', p.pos || '75% 50%')}${SHADE('90deg', L)}${L ? '' : GLOW('0% 0%')}${BAND(r)}${LG()}
    <div class="a" style="left:80px;top:170px">${PILLS(p)}</div>
    <div class="a" style="left:80px;width:${p.w || 720}px;top:${p.top || 260}px"><div class="ttl" style="font-size:${p.size || 110}px">${br(p.title)}</div>
      ${p.sub ? `<div class="sub" style="margin-top:38px;max-width:560px">${br(p.sub)}</div>` : ''}
      ${p.cta ? `<div class="cta" style="margin-top:40px">${ICON('arrow', 32, 2.2)}<span>${br(p.cta)}</span></div>` : ''}</div>`); },
  'cover.2': (r, i, p) => { const L = !dark(r, p); return page(r, i, p, `${IMG(p.photo, 'inset:0;width:1080px;height:1350px', p.pos || '70% 30%')}
    <div class="a" style="inset:0;background:linear-gradient(180deg,${L ? 'rgba(233,241,252,.0) 0%,rgba(233,241,252,0) 38%,rgba(233,241,252,.9) 62%,#EEF4FC 82%' : 'rgba(5,7,11,.25) 0%,rgba(5,7,11,0) 35%,rgba(5,7,11,.85) 62%,#05070B 85%'})"></div>${BAND(r)}${LG(80, 64, 150, true)}
    <div class="a" style="left:80px;right:180px;top:${p.top || 820}px">${PILLS(p)}<div class="ttl" style="font-size:${p.size || 80}px;margin-top:26px">${br(p.title)}</div>${p.sub ? `<div class="sub" style="margin-top:22px">${br(p.sub)}</div>` : ''}</div>`); },
  'cover.3': (r, i, p) => page(r, i, p, `${dark(r, p) ? GLOW('50% 95%') : ''}${BAND(r)}${LG()}
    <div class="a" style="left:80px;right:80px;top:${p.top || 170}px;text-align:center"><div style="display:flex;justify-content:center">${PILLS(p)}</div><div class="ttl" style="font-size:${p.size || 76}px;margin-top:28px">${br(p.title)}</div>${p.sub ? `<div class="sub" style="margin-top:20px">${br(p.sub)}</div>` : ''}</div>
    ${PHONE(p.phone || {}, 250, p.phoneTop || 545, 580, 1150)}
    <div class="a" style="left:0;right:0;bottom:0;height:200px;background:linear-gradient(0deg,${dark(r, p) ? '#05070B 35%,rgba(5,7,11,0)' : '#F4F8FE 45%,rgba(244,248,254,0)'})"></div>`),

  // ── 표 ──
  'table.1': (r, i, p) => page(r, i, p, `${dark(r, p) ? GLOW('100% 0%') : ''}${dark(r, p) ? BAND(r) + LG() : ''}${HEAD(p, dark(r, p) ? 190 : 110, 68)}
    <div class="a card" data-noscale="1" style="left:80px;right:80px;top:${p.tableTop || 520}px;padding:40px 44px 18px"><table class="tb"><tr>${(p.head || []).map((h, k) => `<th style="${k ? 'text-align:right' : ''}">${esc(h)}</th>`).join('')}</tr>
      ${(p.rows || []).map((row, n) => `<tr class="${(p.hi || []).includes(n) ? 'hi' : ''}">${row.map((c, k) => `<td style="${k ? 'text-align:right' : 'font-weight:600'}">${esc(c)}</td>`).join('')}</tr>`).join('')}</table></div>${SRC(p)}`),
  'table.2': (r, i, p) => page(r, i, p, `${dark(r, p) ? GLOW('0% 100%') + BAND(r) + LG() : ''}${HEAD(p, dark(r, p) ? 190 : 110, 68)}
    <div class="a" style="left:80px;right:80px;top:${p.tableTop || 520}px">
      <div style="display:grid;grid-template-columns:240px 1fr 1fr;gap:14px;margin-bottom:14px"><div></div>${(p.cols || []).map((c, k) => `<div style="padding:22px;border-radius:22px;text-align:center;font-size:26px;font-weight:700;${k ? 'background:var(--acc);color:var(--on)' : 'border:1.5px solid var(--line);color:var(--fg2)'}">${esc(c)}</div>`).join('')}</div>
      ${(p.rows || []).map(row => `<div style="display:grid;grid-template-columns:240px 1fr 1fr;gap:14px;align-items:center;padding:24px 0;border-top:1px solid var(--line)"><div style="font-size:24px;color:var(--fg2)">${esc(row[0])}</div><div class="en" style="font-size:34px;text-align:center;color:var(--fg2)">${esc(row[1])}</div><div class="en" style="font-size:36px;font-weight:600;text-align:center;color:var(--acc)">${esc(row[2])}</div></div>`).join('')}</div>${SRC(p)}`),
  'table.3': (r, i, p) => page(r, i, p, `${dark(r, p) ? GLOW('100% 100%') + BAND(r) + LG() : ''}${HEAD(p, dark(r, p) ? 190 : 110, 68)}
    <div class="a" style="left:80px;right:80px;top:${p.tableTop || 460}px">${(p.rows || []).map(row => { const st = row[3]; return `<div class="card" style="display:grid;grid-template-columns:120px 1fr auto;align-items:center;gap:24px;padding:22px 32px;margin-top:14px;${st ? 'border:1.5px solid var(--acc);' : 'opacity:.72;'}">
      <div><div class="en" style="font-size:44px;font-weight:600;letter-spacing:-.03em;${st ? 'color:var(--acc)' : ''}">${esc(row[0])}</div><div style="font-size:20px;color:var(--fg3)">${esc(row[1])}</div></div><div style="font-size:28px;font-weight:600">${esc(row[2])}</div>
      ${st ? `<span class="pill ${st === 'on' ? 'f' : 'o'}" style="font-size:20px">${st === 'on' ? '조기 폐장' : '휴장'}</span>` : `<span style="font-size:20px;color:var(--fg3)">정상</span>`}</div>`; }).join('')}</div>${SRC(p)}`),

  // ── 막대 ──
  'bar.1': (r, i, p) => { const B = p.bars || [], mx = maxOf(B), H = p.chartH || 440; return page(r, i, p, `${dark(r, p) ? GLOW('50% 100%') + BAND(r) + LG() : ''}${HEAD(p, dark(r, p) ? 190 : 110, 68)}
    <div class="a card" style="left:80px;right:80px;top:${p.chartTop || 520}px;padding:44px 50px 34px">
      <div style="display:flex;align-items:flex-end;justify-content:space-around;height:${H}px;border-bottom:1.5px solid var(--line)">${B.map((b, k) => { const last = k === B.length - 1; return `<div style="width:${Math.min(200, 700 / B.length)}px;text-align:center"><div class="en" style="font-size:${last ? 46 : 36}px;font-weight:600;margin-bottom:14px;${last ? 'color:var(--acc)' : 'color:var(--fg2)'}">${esc(b[1])}${esc(p.unit || '')}</div><div style="height:${b[1] / mx * (H - 90)}px;border-radius:16px 16px 0 0;${last ? 'background:linear-gradient(180deg,var(--acc),var(--acc2))' : 'background:var(--line)'}"></div></div>`; }).join('')}</div>
      <div style="display:flex;justify-content:space-around;margin-top:16px">${B.map(b => `<div style="width:${Math.min(200, 700 / B.length)}px;text-align:center;font-size:24px;color:var(--fg2)">${esc(b[0])}</div>`).join('')}</div></div>${SRC(p)}`); },
  'bar.2': (r, i, p) => { const B = p.bars || [], mx = maxOf(B) || 1; return page(r, i, p, `${dark(r, p) ? GLOW('0% 50%') + BAND(r) + LG() : ''}${HEAD(p, dark(r, p) ? 190 : 110, 68)}
    <div class="a" style="left:80px;right:80px;top:${p.chartTop || 520}px">${B.map((b, k) => { const on = (p.hi || []).includes(k); return `<div style="display:grid;grid-template-columns:200px 1fr 170px;align-items:center;gap:22px;padding:30px 0;border-top:1px solid var(--line)"><div style="font-size:28px;${on ? 'font-weight:700' : 'color:var(--fg2)'}">${esc(b[0])}</div>
      <div style="height:22px;border-radius:11px;background:var(--line)"><div style="height:100%;width:${Math.max(b[1] / mx * 100, b[1] ? 2 : 0)}%;border-radius:11px;background:${on ? 'linear-gradient(90deg,var(--acc2),var(--acc))' : 'var(--fg3)'}"></div></div>
      <div class="en" style="font-size:30px;text-align:right;${on ? 'color:var(--acc);font-weight:700' : 'color:var(--fg2)'}">${esc(b[2] || (b[1] + (p.unit || '')))}</div></div>`; }).join('')}</div>${SRC(p)}`); },
  'bar.3': (r, i, p) => { const B = p.bars || [], mx = maxOf(B); return page(r, i, p, `${dark(r, p) ? GLOW('100% 30%') + BAND(r) + LG() : ''}${HEAD(p, dark(r, p) ? 190 : 110, 64)}
    <div class="a" style="left:80px;top:${p.numTop || 520}px"><div class="lab">${esc(p.valueLabel || '')}</div><div class="num" style="font-size:${p.numSize || 210}px;margin-top:24px">${esc(p.value || '')}</div></div>
    <div class="a card" style="left:80px;right:80px;top:${p.chartTop || 820}px;padding:34px 44px">${B.map((b, k) => { const last = k === B.length - 1; return `<div style="display:grid;grid-template-columns:180px 1fr 110px;align-items:center;gap:20px;margin-top:${k ? 18 : 0}px"><div style="font-size:25px;${last ? 'font-weight:700' : 'color:var(--fg2)'}">${esc(b[0])}</div><div style="height:16px;border-radius:8px;background:var(--line)"><div style="height:100%;width:${b[1] / mx * 100}%;border-radius:8px;background:${last ? 'var(--acc)' : 'var(--fg3)'}"></div></div><div class="en" style="font-size:30px;text-align:right;${last ? 'color:var(--acc);font-weight:700' : 'color:var(--fg2)'}">${esc(b[1])}${esc(p.unit || '')}</div></div>`; }).join('')}</div>${SRC(p)}`); },

  // ── 이미지 설명형 ──
  'ex.1': (r, i, p) => page(r, i, p, `${dark(r, p) ? GLOW('100% 0%') + BAND(r) + LG() : ''}${HEAD(p, dark(r, p) ? 190 : 110, 76)}
    ${p.body ? `<div class="a sub" style="left:80px;right:80px;top:${p.bodyTop || (dark(r, p) ? 420 : 340)}px;font-size:34px;line-height:1.55;color:var(--fg)">${br(p.body)}</div>` : ''}
    ${IMG(p.photo, `left:80px;width:920px;top:${p.photoTop || 700}px;height:${p.photoH || 400}px;border-radius:24px`, p.pos)}${SRC(p)}`),
  'ex.2': (r, i, p) => page(r, i, p, `${IMG(p.photo, `left:0;top:0;width:1080px;height:${p.photoH || 620}px`, p.pos)}
    <div class="a" style="left:0;top:${(p.photoH || 620) - 260}px;width:1080px;height:262px;background:linear-gradient(180deg,${dark(r, p) ? 'rgba(5,7,11,0),#05070B' : 'rgba(216,230,249,0),#DCE8FA'})"></div>${dark(r, p) ? LG() : ''}
    ${HEAD(p, (p.photoH || 620) - 40, 72)}
    ${p.body ? `<div class="a sub" style="left:80px;right:80px;top:${p.bodyTop || (p.photoH || 620) + 260}px;font-size:32px;line-height:1.6;color:var(--fg)">${br(p.body)}</div>` : ''}${SRC(p)}`),
  'ex.3': (r, i, p) => page(r, i, p, `${IMG(p.photo, 'left:0;top:0;width:470px;height:1350px', p.pos)}${dark(r, p) ? LG(540) : ''}
    <div class="a" style="left:540px;right:70px;top:${p.top || (dark(r, p) ? 230 : 140)}px">${p.no ? `<div class="en" style="font-size:28px;font-weight:700;color:var(--acc)">${esc(p.no)}</div>` : LABEL(p)}<div class="ttl" style="font-size:${p.size || 64}px;margin-top:20px">${br(p.title)}</div>
      ${p.body ? `<div class="sub" style="margin-top:34px;font-size:29px;line-height:1.6;color:var(--fg)">${br(p.body)}</div>` : ''}
      ${(p.points || []).length ? `<div style="margin-top:34px">${p.points.map(x => `<div style="padding:18px 0;border-top:1px solid var(--line)"><div style="font-size:22px;font-weight:600;color:var(--acc)">${esc(x[0])}</div><div style="font-size:28px;font-weight:600;margin-top:6px">${esc(x[1])}</div></div>`).join('')}</div>` : ''}</div>
    ${p.src ? `<div class="a" style="left:540px;right:70px;bottom:${dark(r, p) ? 96 : 130}px;font-size:20px;color:var(--fg3)">${br(p.src)}</div>` : ''}`),
  'ex.4': (r, i, p) => page(r, i, p, `${IMG(p.photo, 'inset:0;width:1080px;height:1350px', p.pos)}
    <div class="a" style="inset:0;background:linear-gradient(180deg,rgba(5,7,11,.45),rgba(5,7,11,0) 30%)"></div>${LG(80, 64, 150, true)}
    <div class="a card" style="left:60px;right:60px;bottom:${p.cardBottom || 150}px;padding:50px 50px 44px;${dark(r, p) ? 'background:rgba(10,14,21,.72);backdrop-filter:blur(22px)' : 'background:rgba(255,255,255,.94)'}">
      ${p.no ? `<div class="en" style="font-size:26px;font-weight:700;color:var(--acc)">${esc(p.no)}</div>` : LABEL(p)}<div class="ttl" style="font-size:${p.size || 62}px;margin-top:16px">${br(p.title)}</div>
      ${p.body ? `<div class="sub" style="margin-top:26px;font-size:28px;line-height:1.6;color:var(--fg)">${br(p.body)}</div>` : ''}
      ${p.src ? `<div style="margin-top:22px;font-size:20px;color:var(--fg3)">${br(p.src)}</div>` : ''}</div>`),

  // ── 숫자형 ──
  'num.1': (r, i, p) => page(r, i, p, `${IMG(p.obj, 'inset:0;width:1080px;height:1350px', p.pos || '85% 60%')}${p.obj ? SHADE('90deg', !dark(r, p)) : ''}${dark(r, p) ? GLOW('20% 45%') + BAND(r) + LG() : ''}
    <div class="a" style="left:80px;right:80px;top:${p.top || (dark(r, p) ? 300 : 200)}px">${LABEL(p)}<div class="num" style="font-size:${p.numSize || 300}px;margin-top:30px">${esc(p.value || '')}</div>
      <div class="ttl" style="font-size:${p.size || 72}px;margin-top:40px">${br(p.title)}</div>${p.sub ? `<div class="sub" style="margin-top:22px">${br(p.sub)}</div>` : ''}</div>${SRC(p)}`),
  'num.2': (r, i, p) => { const [a, b] = p.pair || [['', ''], ['', '']]; return page(r, i, p, `${dark(r, p) ? GLOW('80% 60%') + BAND(r) + LG() : ''}${HEAD(p, dark(r, p) ? 190 : 110, 68)}
    <div class="a" style="left:80px;right:80px;top:${p.top || 560}px;display:grid;grid-template-columns:1fr 90px 1fr;align-items:end">
      <div><div class="lab">${esc(a[0])}</div><div class="en" style="font-size:150px;font-weight:500;letter-spacing:-.055em;line-height:.9;color:var(--fg3);margin-top:20px">${esc(a[1])}</div></div>
      <div style="color:var(--acc);padding-bottom:30px">${ICON('arrow', 64, 1.6)}</div>
      <div><div class="lab" style="color:var(--acc)">${esc(b[0])}</div><div class="num" style="font-size:190px;margin-top:20px">${esc(b[1])}</div></div></div>
    ${p.note ? `<div class="a card" style="left:80px;right:80px;top:${(p.top || 560) + 290}px;padding:30px 36px;font-size:28px;line-height:1.5">${br(p.note)}</div>` : ''}${SRC(p)}`); },
  'num.3': (r, i, p) => page(r, i, p, `${dark(r, p) ? GLOW('0% 100%') + BAND(r) + LG() : ''}${HEAD(p, dark(r, p) ? 190 : 110, 68)}
    <div class="a" style="left:80px;right:80px;top:${p.top || 520}px">${(p.stats || []).map((s, k) => `<div class="card" style="display:grid;grid-template-columns:1fr 330px;align-items:center;gap:20px;padding:42px 44px;margin-top:${k ? 20 : 0}px">
      <div class="${k === 0 ? 'num' : 'en'}" style="font-size:${k === 0 ? 96 : 72}px;${k === 0 ? '' : 'font-weight:500;letter-spacing:-.04em;line-height:1;color:var(--fg2)'}">${esc(s[0])}</div><div><div style="font-size:28px;font-weight:700">${esc(s[1])}</div><div style="font-size:22px;color:var(--fg3);margin-top:6px">${esc(s[2] || '')}</div></div></div>`).join('')}</div>${SRC(p)}`),
};

// ── 키트 2차 분류 (2026-11-27 "분류 더 다양하게") ──
// list.1 체크 목록 { items[[제목,설명]] }   list.2 번호 카드 { items }   list.3 아이콘 2×2 { cells[[아이콘,제목,설명]] }
// step.1 가로 타임라인 { points[[위 글,아래 글,on]] }   step.2 세로 타임라인 { items[[시각,제목,설명,on]] }   step.3 단계 화살표 { items[[제목,설명]] }
// quote.1 한 문장 { text, by }   quote.2 인물 + 인용 { photo, text, by }   qa.1 큰 Q/A { q, a }   qa.2 말풍선 { items[[질문,답]] }
// cal.1 한 주 달력 { days[[요일,날짜,'off'|'on'|'',아래 글]] }   cal.2 월간 달력 { year, month, marks{날짜:{k,t}} }
// term.1 용어 { word, en, mean, ex[[이름,값]] }   term.2 용어 둘 비교 { cols[[낱말,뜻]] }
// ratio.1 도넛 { pct, value, valueNote }   ratio.2 원형 눈금 { pct, value, valueNote }
// end.1 프로필 + 팔로우 { title, sub }   end.2 다음 편 예고 { title, next }   end.3 브랜드 한 문장 { title }
const ICONS2 = {
  check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>', pause: '<circle cx="12" cy="12" r="8.5"/><path d="M10 9v6M14 9v6"/>',
  bag: '<path d="M5 8h14l-1 12.5H6z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/>', chart: '<path d="M4 20h16"/><path d="M5 16l4.5-5 3.5 3 6-7"/><path d="M15 7h4v4"/>',
  wave: '<path d="M3 15c2.5 0 2.5-6 5-6s2.5 6 5 6 2.5-6 5-6 2.5 3 3 3"/>', building: '<path d="M4 9.5L12 4l8 5.5"/><path d="M5 20h14M6 10v8M10 10v8M14 10v8M18 10v8"/>',
  globe: '<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.5 2.5 3.5 5.5 3.5 8.5s-1 6-3.5 8.5c-2.5-2.5-3.5-5.5-3.5-8.5s1-6 3.5-8.5z"/>',
};
Object.assign(ICONS, ICONS2);
const D = (r, p) => dark(r, p);
const DECO = (r, p, at) => D(r, p) ? GLOW(at) + BAND(r) + LG() : '';
const TOP = (r, p) => D(r, p) ? 190 : 110;
const SQ = (n, sz = 64) => `<div style="width:${sz}px;height:${sz}px;border-radius:${sz * .28}px;background:linear-gradient(145deg,#1B4CA6,#0E2A5E);color:#fff;display:grid;place-items:center;flex:none">${n}</div>`;
Object.assign(T, {
  // ── 목록 ──
  'list.1': (r, i, p) => page(r, i, p, `${DECO(r, p, '100% 0%')}${HEAD(p, TOP(r, p), 68)}
    <div class="a card" style="left:80px;right:80px;top:${p.top || 540}px;padding:16px 44px">${(p.items || []).map((x, k) => `<div style="display:flex;gap:26px;align-items:flex-start;padding:36px 0;${k ? 'border-top:1px solid var(--line)' : ''}"><div style="width:52px;height:52px;border-radius:50%;background:var(--acc);color:var(--on);display:grid;place-items:center;flex:none">${ICON('check', 26, 2.6)}</div><div><div style="font-size:38px;font-weight:700">${esc(x[0])}</div><div style="font-size:28px;color:var(--fg2);margin-top:10px;line-height:1.45">${br(x[1] || '')}</div></div></div>`).join('')}</div>${SRC(p)}`),
  'list.2': (r, i, p) => page(r, i, p, `${DECO(r, p, '0% 100%')}${HEAD(p, TOP(r, p), 68)}
    <div class="a" style="left:80px;right:80px;top:${p.top || 540}px">${(p.items || []).map((x, k) => `<div class="card" style="display:flex;align-items:center;gap:30px;padding:42px 40px;margin-top:${k ? 20 : 0}px">${SQ(`<span class="en" style="font-size:26px;font-weight:600">${String(k + 1).padStart(2, '0')}</span>`)}<div><div style="font-size:38px;font-weight:700">${esc(x[0])}</div><div style="font-size:27px;color:var(--fg2);margin-top:10px">${br(x[1] || '')}</div></div></div>`).join('')}</div>${SRC(p)}`),
  'list.3': (r, i, p) => page(r, i, p, `${DECO(r, p, '90% 10%')}${HEAD(p, TOP(r, p), 68)}
    <div class="a" style="left:80px;right:80px;top:${p.top || 540}px;display:grid;grid-template-columns:1fr 1fr;gap:20px">${(p.cells || []).map(c => `<div class="card" style="height:${p.h || 320}px;padding:38px 36px;display:flex;flex-direction:column">${SQ(ICON(c[0], 30), 60)}<div style="font-size:36px;font-weight:700;margin-top:auto">${esc(c[1])}</div><div style="font-size:23px;color:var(--fg2);margin-top:8px;line-height:1.45">${br(c[2] || '')}</div></div>`).join('')}</div>${SRC(p)}`),
  // ── 단계·타임라인 ──
  'step.1': (r, i, p) => { const P = p.points || [], n = P.length; return page(r, i, p, `${DECO(r, p, '50% 70%')}${HEAD(p, TOP(r, p), 68)}
    <div class="a" style="left:0;right:0;top:${p.lineY || 780}px;height:2px;background:var(--fg3)"></div>
    ${P.map((x, k) => { const cx = 80 + (k + .5) * 920 / n, on = !!x[2]; return `<div class="a" style="left:${cx - 16}px;top:${(p.lineY || 780) - 15}px;width:32px;height:32px;border-radius:50%;${on ? 'background:var(--acc);box-shadow:0 0 0 8px rgba(143,176,234,.2)' : 'background:var(--bg);border:2px solid var(--fg3)'}"></div>
      <div class="a" style="left:${cx - 100}px;width:200px;top:${(p.lineY || 780) - 110}px;text-align:center;font-size:24px;font-weight:600;${on ? 'color:var(--acc)' : 'color:var(--fg2)'}">${esc(x[0])}</div>
      <div class="a" style="left:${cx - 100}px;width:200px;top:${(p.lineY || 780) + 50}px;text-align:center;font-size:${on ? 32 : 26}px;font-weight:${on ? 700 : 500};line-height:1.35;${on ? '' : 'color:var(--fg2)'}">${br(x[1])}</div>`; }).join('')}${SRC(p)}`); },
  'step.2': (r, i, p) => page(r, i, p, `${DECO(r, p, '0% 50%')}${HEAD(p, TOP(r, p), 68)}
    <div class="a" style="left:80px;right:80px;top:${p.top || 520}px;border-left:2px solid var(--line);padding-left:50px">${(p.items || []).map(x => `<div style="position:relative;padding:24px 0 46px"><i style="position:absolute;left:-63px;top:32px;width:24px;height:24px;border-radius:50%;${x[3] ? 'background:var(--acc)' : 'background:var(--bg);border:2px solid var(--fg3)'}"></i>
      <div class="en" style="font-size:24px;font-weight:600;${x[3] ? 'color:var(--acc)' : 'color:var(--fg3)'}">${esc(x[0])}</div><div style="font-size:40px;font-weight:700;margin-top:10px">${esc(x[1])}</div><div style="font-size:27px;color:var(--fg2);margin-top:8px">${br(x[2] || '')}</div></div>`).join('')}</div>${SRC(p)}`),
  'step.3': (r, i, p) => page(r, i, p, `${DECO(r, p, '100% 100%')}${HEAD(p, TOP(r, p), 68)}
    <div class="a" style="left:80px;right:80px;top:${p.top || 560}px;display:flex;align-items:stretch;gap:10px">${(p.items || []).map((x, k, a) => `<div class="card" style="flex:1;padding:34px 26px;min-height:${p.h || 400}px;display:flex;flex-direction:column;${k === a.length - 1 ? 'border:1.5px solid var(--acc)' : ''}"><div class="en" style="font-size:22px;font-weight:600;color:var(--acc)">STEP ${k + 1}</div><div style="font-size:32px;font-weight:700;margin-top:auto;line-height:1.3">${br(x[0])}</div><div style="font-size:22px;color:var(--fg2);margin-top:12px;line-height:1.45">${br(x[1] || '')}</div></div>${k < a.length - 1 ? `<div style="display:grid;place-items:center;color:var(--acc)">${ICON('arrow', 30, 2)}</div>` : ''}`).join('')}</div>${SRC(p)}`),
  // ── 인용 ──
  'quote.1': (r, i, p) => page(r, i, p, `${DECO(r, p, '50% 50%')}
    <div class="a" style="left:110px;right:110px;top:${p.top || 380}px;text-align:center"><div class="en" style="font-size:180px;line-height:.6;color:var(--acc);font-weight:300">“</div>
      <div class="ttl" style="font-size:${p.size || 60}px;line-height:1.35;margin-top:40px">${br(p.text || '')}</div><div style="width:60px;height:2px;background:var(--acc);margin:40px auto 0"></div><div style="font-size:24px;color:var(--fg2);margin-top:26px">${esc(p.by || '')}</div></div>${SRC(p)}`),
  'quote.2': (r, i, p) => page(r, i, p, `${D(r, p) ? IMG(p.photo, 'inset:0;width:1080px;height:1350px', p.pos || '75% 40%') + SHADE('90deg', false) + LG() : IMG(p.photo, 'left:580px;top:80px;width:420px;height:1060px;border-radius:30px;box-shadow:0 24px 60px rgba(14,47,92,.18)', p.lpos || '80% 40%')}
    <div class="a" style="left:80px;width:${D(r, p) ? 620 : 460}px;top:${p.top || 420}px"><div class="en" style="font-size:150px;line-height:.6;color:var(--acc);font-weight:300">“</div>
      <div class="ttl" style="font-size:${p.size || 54}px;line-height:1.35;margin-top:36px">${br(p.text || '')}</div><div style="font-size:24px;color:var(--fg2);margin-top:30px">${esc(p.by || '')}</div></div>${SRC(p)}`),
  // ── 묻고 답하기 ──
  'qa.1': (r, i, p) => page(r, i, p, `${DECO(r, p, '0% 0%')}
    <div class="a" style="left:80px;right:80px;top:${p.top || (D(r, p) ? 220 : 140)}px;display:grid;grid-template-columns:170px 1fr;column-gap:20px">
      <div class="en" style="font-size:200px;font-weight:600;line-height:.8">Q</div><div class="ttl" style="font-size:${p.qSize || 54}px;line-height:1.3;padding-top:4px">${br(p.q || '')}</div>
      <div style="grid-column:1/3;height:2px;background:var(--line);margin:56px 0"></div>
      <div class="en" style="font-size:200px;font-weight:600;line-height:.8;color:var(--acc)">A</div><div style="font-size:${p.aSize || 32}px;line-height:1.6;padding-top:4px">${br(p.a || '')}</div></div>${SRC(p)}`),
  'qa.2': (r, i, p) => page(r, i, p, `${DECO(r, p, '100% 60%')}${HEAD(p, TOP(r, p), 64)}
    <div class="a" style="left:80px;right:80px;top:${p.top || 500}px">${(p.items || []).map(x => `<div class="card" style="width:82%;padding:28px 32px;border-radius:30px 30px 30px 8px"><div style="font-size:21px;color:var(--fg3);font-weight:600">질문</div><div style="font-size:32px;font-weight:700;margin-top:8px;line-height:1.4">${br(x[0])}</div></div>
      <div style="margin:18px 0 36px 160px;padding:30px 34px;border-radius:30px 30px 8px 30px;background:linear-gradient(150deg,#1B4CA6,#0E2A5E);color:#fff"><div style="font-size:21px;color:rgba(255,255,255,.7);font-weight:600">답</div><div style="font-size:28px;line-height:1.55;margin-top:8px">${br(x[1])}</div></div>`).join('')}</div>${SRC(p)}`),
  // ── 달력 ──
  'cal.1': (r, i, p) => page(r, i, p, `${DECO(r, p, '50% 100%')}${HEAD(p, TOP(r, p), 68)}
    <div class="a" style="left:80px;right:80px;top:${p.top || 560}px;display:grid;grid-template-columns:repeat(${(p.days || []).length || 7},1fr);gap:10px">${(p.days || []).map(d => `<div class="card" style="height:${p.h || 300}px;padding:26px 0;text-align:center;display:flex;flex-direction:column;align-items:center;${d[2] === 'on' ? 'background:var(--acc);color:var(--on);' : d[2] === 'off' ? 'border:2px solid var(--acc);' : 'opacity:.6;'}">
      <div style="font-size:22px;font-weight:600">${esc(d[0])}</div><div class="en" style="font-size:54px;font-weight:600;letter-spacing:-.03em;margin-top:16px">${esc(d[1])}</div><div style="font-size:19px;font-weight:700;margin-top:auto;line-height:1.3;padding:0 6px;${d[2] === 'off' ? 'color:var(--acc)' : ''}">${br(d[3] || '')}</div></div>`).join('')}</div>${SRC(p)}`),
  'cal.2': (r, i, p) => { const y = p.year, m = p.month, f = new Date(Date.UTC(y, m - 1, 1)).getUTCDay(), n = new Date(Date.UTC(y, m, 0)).getUTCDate(), C = []; for (let k = 0; k < f; k++) C.push(0); for (let d = 1; d <= n; d++) C.push(d); while (C.length % 7) C.push(0); const mk = p.marks || {};
    return page(r, i, p, `${DECO(r, p, '100% 0%')}${HEAD(p, TOP(r, p), 64)}
    <div class="a card" style="left:80px;right:80px;top:${p.top || 470}px;padding:30px 34px">
      <div style="display:grid;grid-template-columns:repeat(7,1fr);text-align:center;font-size:20px;color:var(--fg3);font-weight:600;padding-bottom:14px">${['일', '월', '화', '수', '목', '금', '토'].map(w => `<div>${w}</div>`).join('')}</div>
      <div style="display:grid;grid-template-columns:repeat(7,1fr);row-gap:8px;text-align:center">${C.map(d => { const x = mk[d]; return `<div style="height:${p.rowH || 92}px;display:flex;flex-direction:column;align-items:center;justify-content:flex-start;padding-top:12px;border-radius:16px;${x ? (x.k === 'on' ? 'background:var(--acc);color:var(--on)' : 'box-shadow:inset 0 0 0 2px var(--acc)') : ''}"><span class="en" style="font-size:26px;font-weight:${x ? 700 : 400};${x || !d ? '' : 'color:var(--fg2)'}">${d || ''}</span>${x ? `<span style="font-size:15px;font-weight:700;margin-top:6px;${x.k === 'on' ? '' : 'color:var(--acc)'}">${esc(x.t)}</span>` : ''}</div>`; }).join('')}</div></div>${SRC(p)}`); },
  // ── 용어 ──
  'term.1': (r, i, p) => page(r, i, p, `${DECO(r, p, '85% 20%')}
    <div class="a" data-head="1" style="left:80px;right:80px;top:${p.top || (D(r, p) ? 230 : 150)}px">${LABEL(p)}<div class="ttl" style="font-size:${p.size || 130}px;margin-top:20px">${esc(p.word || '')}</div>${p.en ? `<div class="en" style="font-size:26px;color:var(--fg3);margin-top:14px">${esc(p.en)}</div>` : ''}</div>
    <div class="a card" style="left:80px;right:80px;top:${p.cardTop || (D(r, p) ? 560 : 480)}px;padding:40px 44px"><div style="font-size:33px;line-height:1.55">${br(p.mean || '')}</div>
      ${(p.ex || []).length ? `<div style="margin-top:26px">${p.ex.map(e => `<div style="display:grid;grid-template-columns:170px 1fr;padding:16px 0;border-top:1px solid var(--line);font-size:27px"><span style="color:var(--fg3)">${esc(e[0])}</span><b style="font-weight:700">${esc(e[1])}</b></div>`).join('')}</div>` : ''}</div>${SRC(p)}`),
  'term.2': (r, i, p) => page(r, i, p, `${DECO(r, p, '50% 0%')}${HEAD(p, TOP(r, p), 64)}
    <div class="a" style="left:80px;right:80px;top:${p.top || 520}px;display:grid;grid-template-columns:1fr 1fr;gap:20px">${(p.cols || []).map((c, k) => `<div class="card" style="min-height:${p.h || 360}px;padding:40px 36px;${k ? 'border:1.5px solid var(--acc)' : ''}"><div class="en" style="font-size:22px;font-weight:600;color:var(--acc)">${k ? 'B' : 'A'}</div><div style="font-size:52px;font-weight:700;letter-spacing:-.03em;margin-top:14px">${esc(c[0])}</div><div style="font-size:27px;color:var(--fg2);margin-top:24px;line-height:1.55">${br(c[1] || '')}</div></div>`).join('')}</div>${SRC(p)}`),
  // ── 비율 ──
  'ratio.1': (r, i, p) => { const R = 230, C = 2 * Math.PI * R, f = Math.max(0, Math.min(1, (p.pct || 0) / 100)); return page(r, i, p, `${DECO(r, p, '50% 60%')}${HEAD(p, TOP(r, p), 64, true)}
    <svg class="a" style="left:${540 - R - 30}px;top:${p.cy ? p.cy - R - 30 : 520}px" width="${2 * R + 60}" height="${2 * R + 60}"><circle cx="${R + 30}" cy="${R + 30}" r="${R}" fill="none" stroke="var(--line)" stroke-width="44"/><circle cx="${R + 30}" cy="${R + 30}" r="${R}" fill="none" stroke="var(--acc)" stroke-width="44" stroke-linecap="round" stroke-dasharray="${C * f} ${C}" transform="rotate(-90 ${R + 30} ${R + 30})"/></svg>
    <div class="a" style="left:0;right:0;top:${(p.cy || 520 + R + 30) - 70}px;text-align:center"><div class="en" style="font-size:110px;font-weight:600;letter-spacing:-.04em;line-height:1">${esc(p.value || '')}</div><div style="font-size:24px;color:var(--fg2);margin-top:10px">${esc(p.valueNote || '')}</div></div>${SRC(p)}`); },
  'ratio.2': (r, i, p) => { const N = 72, f = (p.pct || 0) / 100, cx = 540, cy = p.cy || 800, R = 290; let s = ''; for (let k = 0; k < N; k++) { const a = k / N * 360 - 90, on = k < Math.round(f * N); s += `<div class="a" style="left:${cx}px;top:${cy}px;width:${on ? 62 : 44}px;height:5px;margin-top:-2.5px;transform-origin:0 50%;transform:rotate(${a}deg) translateX(${R - (on ? 62 : 44)}px);border-radius:3px;background:${on ? 'var(--acc)' : 'var(--line)'}"></div>`; }
    return page(r, i, p, `${DECO(r, p, '50% 60%')}${HEAD(p, TOP(r, p), 64, true)}${s}
    <div class="a" style="left:0;right:0;top:${cy - 80}px;text-align:center"><div class="en" style="font-size:120px;font-weight:600;letter-spacing:-.04em;line-height:1">${esc(p.value || '')}</div><div style="font-size:24px;color:var(--fg2);margin-top:10px">${esc(p.valueNote || '')}</div></div>${SRC(p)}`); },
  // ── 마무리 ──
  'end.1': (r, i, p) => page(r, i, p, `${IMG(p.obj, 'inset:0;width:1080px;height:1350px', p.pos || '50% 60%')}${p.obj ? `<div class="a" style="inset:0;background:linear-gradient(180deg,var(--bg) 0%,${D(r, p) ? 'rgba(5,7,11,.7)' : 'rgba(233,241,252,.75)'} 40%,rgba(0,0,0,0) 75%)"></div>` : ''}${D(r, p) ? BAND(r) + LG() : ''}
    <div class="a" style="left:80px;right:80px;top:${p.top || (D(r, p) ? 240 : 160)}px">${LABEL(p)}<div class="ttl" style="font-size:${p.size || 84}px;margin-top:20px">${br(p.title)}</div>${p.sub ? `<div class="sub" style="margin-top:24px">${br(p.sub)}</div>` : ''}</div>
    <div class="a card" style="left:80px;right:80px;top:${p.cardTop || 640}px;padding:24px 26px;display:flex;align-items:center;gap:24px">${SQ(`<div style="width:58px;--logo:#fff">${LOGO.replace('<svg', '<svg style="width:58px;height:auto;display:block"')}</div>`, 92)}<div style="flex:1"><div class="en" style="font-size:32px;font-weight:600">@orbis_securities</div><div style="font-size:22px;color:var(--fg2);margin-top:4px">오르비스 시큐리티즈</div></div><span class="cta" style="padding:14px 26px;font-size:22px">팔로우 ${ICON('arrow', 22, 2.2)}</span></div>`),
  'end.2': (r, i, p) => page(r, i, p, `${DECO(r, p, '80% 80%')}
    <div class="a" style="left:80px;right:80px;top:${p.top || (D(r, p) ? 260 : 170)}px">${LABEL(p)}<div class="ttl" style="font-size:${p.size || 84}px;margin-top:20px">${br(p.title)}</div></div>
    <div class="a card" style="left:80px;right:80px;top:${p.cardTop || 620}px;padding:36px 40px;display:flex;align-items:center;gap:28px">${SQ(ICON('calendar', 32), 72)}<div style="flex:1"><div style="font-size:22px;color:var(--fg3);font-weight:600">${esc(p.nextLabel || '다음 편')}</div><div style="font-size:34px;font-weight:700;margin-top:8px">${esc(p.next || '')}</div></div></div>
    <div class="a" style="left:80px;top:${(p.cardTop || 620) + 190}px"><span class="cta">@orbis_securities 팔로우 ${ICON('arrow', 24, 2.2)}</span></div>`),
  'end.3': (r, i, p) => page(r, i, p, `${D(r, p) ? GLOW('50% 50%') : ''}
    <div class="a" style="left:0;right:0;top:${p.top || 420}px;display:flex;flex-direction:column;align-items:center;text-align:center">
      <div style="width:300px">${LOGO.replace('<svg', '<svg style="width:300px;height:auto;display:block"')}</div>
      <div class="ttl" style="font-size:${p.size || 56}px;margin-top:80px;line-height:1.35">${br(p.title || '')}</div><div class="en" style="font-size:28px;color:var(--fg2);margin-top:36px">@orbis_securities</div></div>`),
});


// ── 키트 3차: 실제 카드뉴스 단골 형식 (2026-11-27 "실제 카드뉴스에서 많이 쓰는 형식들로") ──
// sum.1 3줄 요약 { items[3] }   rank.1 순위 TOP3 { items[[제목,설명,값]] }   news.1 기사 스크랩 { press, date, head, body }
// tip.1 팁 박스 { tip, body }   pc.1 알아둘 점·주의할 점 두 칸 { good[], warn[] }   ox.1 OX 퀴즈 { q, ans:'O'|'X', why }
// quiz.1 객관식 { q, opts[4], ans(1~4), why }   econ.1 경제지표 일정표 { rows[[날짜,시각,나라,지표,중요도1~3]] }
// move.1 등락표 { rows[[이름,값,등락%]] }   flow.1 원 흐름도 { steps[[제목,설명]] }   col.1 사진 콜라주 { photos[3], title, sub }   notice.1 안내문 { tag, title, rows[[이름,값]], body }
const STARS = n => `<span style="letter-spacing:2px">${[1, 2, 3].map(k => `<span style="color:${k <= n ? 'var(--acc)' : 'var(--line)'}">●</span>`).join('')}</span>`;
Object.assign(T, {
  'sum.1': (r, i, p) => page(r, i, p, `${DECO(r, p, '100% 0%')}${HEAD(p, TOP(r, p), 68)}
    <div class="a" style="left:80px;right:80px;top:${p.top || 520}px">${(p.items || []).map((x, k) => `<div class="card" style="display:grid;grid-template-columns:100px 1fr;align-items:center;padding:46px 44px;margin-top:${k ? 20 : 0}px"><div class="en" style="font-size:64px;font-weight:300;color:var(--acc);line-height:1">${k + 1}</div><div style="font-size:35px;font-weight:600;line-height:1.45">${br(x)}</div></div>`).join('')}</div>${SRC(p)}`),
  'rank.1': (r, i, p) => page(r, i, p, `${DECO(r, p, '0% 30%')}${HEAD(p, TOP(r, p), 68)}
    <div class="a" style="left:80px;right:80px;top:${p.top || 520}px">${(p.items || []).map((x, k) => `<div class="card" style="display:grid;grid-template-columns:150px 1fr auto;align-items:center;gap:20px;padding:40px 44px 40px 30px;margin-top:${k ? 20 : 0}px;${k ? '' : 'border:1.5px solid var(--acc)'}">
      <div class="en" style="font-size:${k ? 92 : 110}px;font-weight:600;letter-spacing:-.05em;line-height:1;text-align:center;${k ? 'color:var(--fg3)' : 'color:var(--acc)'}">${k + 1}</div><div><div style="font-size:38px;font-weight:700">${esc(x[0])}</div><div style="font-size:26px;color:var(--fg2);margin-top:10px">${br(x[1] || '')}</div></div><div class="en" style="font-size:30px;font-weight:600;${k ? 'color:var(--fg2)' : 'color:var(--acc)'}">${esc(x[2] || '')}</div></div>`).join('')}</div>${SRC(p)}`),
  'news.1': (r, i, p) => page(r, i, p, `${DECO(r, p, '80% 20%')}${HEAD(p, TOP(r, p), 60)}
    <div class="a card" style="left:80px;right:80px;top:${p.top || 470}px;padding:44px 48px">
      <div style="display:flex;justify-content:space-between;align-items:center;padding-bottom:24px;border-bottom:1.5px solid var(--line)"><span class="pill f" style="font-size:20px">${esc(p.press || '')}</span><span class="en" style="font-size:22px;color:var(--fg3)">${esc(p.date || '')}</span></div>
      <div style="font-size:44px;font-weight:800;letter-spacing:-.03em;line-height:1.35;margin-top:30px">${br(p.head || '')}</div>
      <div style="font-size:27px;color:var(--fg2);line-height:1.65;margin-top:26px">${br(p.body || '')}</div>
      ${(p.hl || []).length ? `<div style="display:flex;gap:12px;margin-top:30px">${p.hl.map(h => `<span class="pill o" style="font-size:20px">${esc(h)}</span>`).join('')}</div>` : ''}</div>${SRC(p)}`),
  'tip.1': (r, i, p) => page(r, i, p, `${DECO(r, p, '100% 100%')}${HEAD(p, TOP(r, p), 68)}
    ${p.body ? `<div class="a sub" style="left:80px;right:80px;top:${p.bodyTop || 450}px;font-size:31px;line-height:1.6;color:var(--fg)">${br(p.body)}</div>` : ''}
    <div class="a" style="left:80px;right:80px;top:${p.tipTop || 720}px;padding:40px 44px;border-radius:30px;background:linear-gradient(150deg,#1B4CA6,#0E2A5E);color:#fff">
      <div style="display:flex;align-items:center;gap:14px"><span class="en" style="padding:8px 18px;border-radius:999px;background:#fff;color:#0E2A5E;font-size:20px;font-weight:700">TIP</span><span style="font-size:24px;color:rgba(255,255,255,.75)">${esc(p.tipLabel || '알아두면 좋아요')}</span></div>
      <div style="font-size:33px;font-weight:600;line-height:1.5;margin-top:24px">${br(p.tip || '')}</div></div>${SRC(p)}`),
  'pc.1': (r, i, p) => page(r, i, p, `${DECO(r, p, '50% 0%')}${HEAD(p, TOP(r, p), 64)}
    <div class="a" style="left:80px;right:80px;top:${p.top || 500}px;display:grid;grid-template-columns:1fr 1fr;gap:20px">${[['good', p.goodLabel || '알아둘 점', 'check'], ['warn', p.warnLabel || '주의할 점', 'pause']].map(([key, lab, ic], k) => `<div class="card" style="min-height:${p.h || 0}px;padding:40px 36px 44px;${k ? 'border:1.5px solid var(--acc)' : ''}"><div style="display:flex;align-items:center;gap:14px">${SQ(ICON(ic, 26), 52)}<span style="font-size:30px;font-weight:700">${esc(lab)}</span></div>
      ${(p[key] || []).map(x => `<div style="display:flex;gap:14px;margin-top:30px;font-size:28px;line-height:1.5"><span style="color:var(--acc);margin-top:2px">—</span><span>${br(x)}</span></div>`).join('')}</div>`).join('')}</div>${SRC(p)}`),
  'ox.1': (r, i, p) => page(r, i, p, `${DECO(r, p, '50% 50%')}
    <div class="a" data-head="1" style="left:80px;right:80px;top:${p.top || (D(r, p) ? 210 : 130)}px;text-align:center"><span class="pill f">${esc(p.label || 'OX 퀴즈')}</span><div class="ttl" style="font-size:${p.size || 56}px;line-height:1.35;margin-top:34px">${br(p.q || '')}</div></div>
    <div class="a" style="left:160px;right:160px;top:${p.oxTop || 620}px;display:grid;grid-template-columns:1fr 1fr;gap:30px">${['O', 'X'].map(c => `<div class="card" style="height:300px;display:grid;place-items:center;${c === p.ans ? 'background:var(--acc);border-color:var(--acc)' : 'opacity:.45'}"><span class="en" style="font-size:210px;font-weight:600;line-height:1;${c === p.ans ? 'color:var(--on)' : ''}">${c}</span></div>`).join('')}</div>
    ${p.why ? `<div class="a sub" style="left:80px;right:80px;top:${(p.oxTop || 620) + 340}px;text-align:center;font-size:28px">${br(p.why)}</div>` : ''}${SRC(p)}`),
  'quiz.1': (r, i, p) => page(r, i, p, `${DECO(r, p, '0% 50%')}
    <div class="a" data-head="1" style="left:80px;right:80px;top:${p.top || (D(r, p) ? 200 : 120)}px"><span class="pill f">${esc(p.label || '퀴즈')}</span><div class="ttl" style="font-size:${p.size || 56}px;line-height:1.35;margin-top:30px">${br(p.q || '')}</div></div>
    <div class="a" style="left:80px;right:80px;top:${p.optTop || 520}px">${(p.opts || []).map((o, k) => { const on = k + 1 === p.ans; return `<div class="card" style="display:flex;align-items:center;gap:24px;padding:32px 34px;margin-top:${k ? 16 : 0}px;${on ? 'border:2px solid var(--acc)' : ''}"><span class="en" style="width:52px;height:52px;border-radius:50%;display:grid;place-items:center;font-size:24px;font-weight:700;flex:none;${on ? 'background:var(--acc);color:var(--on)' : 'border:1.5px solid var(--fg3);color:var(--fg2)'}">${k + 1}</span><span style="font-size:32px;font-weight:${on ? 700 : 500}">${esc(o)}</span>${on ? `<span style="margin-left:auto;color:var(--acc)">${ICON('check', 34, 2.6)}</span>` : ''}</div>`; }).join('')}</div>
    ${p.why ? `<div class="a sub" style="left:80px;right:80px;top:${(p.optTop || 520) + (p.opts || []).length * 136 + 34}px;font-size:27px">${br(p.why)}</div>` : ''}${SRC(p)}`),
  'econ.1': (r, i, p) => page(r, i, p, `${DECO(r, p, '100% 0%')}${HEAD(p, TOP(r, p), 64)}
    <div class="a card" style="left:80px;right:80px;top:${p.top || 470}px;padding:30px 40px">
      <div style="display:grid;grid-template-columns:${p.noStar ? '170px 120px 1fr' : '150px 110px 1fr 100px'};font-size:20px;color:var(--fg3);font-weight:600;padding-bottom:14px">${(p.noStar ? ['날짜', '시각', '지표'] : ['날짜', '시각', '지표', '중요도']).map((h, k) => `<div style="${k === 3 ? 'text-align:right' : ''}">${h}</div>`).join('')}</div>
      ${(p.rows || []).map(x => `<div style="display:grid;grid-template-columns:${p.noStar ? '170px 120px 1fr' : '150px 110px 1fr 100px'};align-items:center;padding:32px 0;border-top:1px solid var(--line)"><div style="font-size:27px;font-weight:600">${esc(x[0])}</div><div class="en" style="font-size:24px;color:var(--fg2)">${esc(x[1])}</div><div><span class="en" style="font-size:18px;font-weight:700;color:var(--acc);margin-right:10px">${esc(x[2])}</span><span style="font-size:29px;font-weight:600">${esc(x[3])}</span></div>${p.noStar ? '' : `<div style="text-align:right;font-size:18px">${STARS(+x[4] || 1)}</div>`}</div>`).join('')}</div>${SRC(p)}`),
  'move.1': (r, i, p) => page(r, i, p, `${DECO(r, p, '0% 0%')}${HEAD(p, TOP(r, p), 64)}
    <div class="a" style="left:80px;right:80px;top:${p.top || 500}px">${(p.rows || []).map(x => { const v = parseFloat(x[2]), up = v > 0, dn = v < 0, col = up ? '#E5484D' : dn ? (D(r, p) ? '#6EA0FF' : '#2B64D6') : 'var(--fg3)'; return `<div class="card" style="display:grid;grid-template-columns:1fr auto 190px;align-items:center;gap:20px;padding:44px 42px;margin-top:20px"><div style="font-size:36px;font-weight:700">${esc(x[0])}</div><div class="en" style="font-size:30px;color:var(--fg2)">${esc(x[1])}</div><div class="en" style="text-align:right;font-size:34px;font-weight:700;color:${col}">${up ? '▲' : dn ? '▼' : '–'} ${esc(String(x[2]).replace('-', ''))}</div></div>`; }).join('')}</div>${SRC(p)}`),
  'flow.1': (r, i, p) => { const S = p.steps || [], n = S.length; return page(r, i, p, `${DECO(r, p, '50% 60%')}${HEAD(p, TOP(r, p), 64, true)}
    <div class="a" style="left:${80 + 920 / n / 2}px;right:${80 + 920 / n / 2}px;top:${(p.cy || 760)}px;height:2px;background:var(--line)"></div>
    ${S.map((x, k) => { const cx = 80 + (k + .5) * 920 / n, on = k === n - 1; return `<div class="a" style="left:${cx - 110}px;top:${(p.cy || 760) - 110}px;width:220px;height:220px;border-radius:50%;display:grid;place-items:center;text-align:center;${on ? 'background:var(--acc);color:var(--on)' : 'background:var(--card);border:var(--cardb);box-shadow:var(--shadow)'}"><div><div class="en" style="font-size:20px;font-weight:700;${on ? '' : 'color:var(--acc)'}">0${k + 1}</div><div style="font-size:30px;font-weight:700;margin-top:6px;line-height:1.25">${br(x[0])}</div></div></div>
      <div class="a" style="left:${cx - 140}px;width:280px;top:${(p.cy || 760) + 140}px;text-align:center;font-size:24px;color:var(--fg2);line-height:1.45">${br(x[1] || '')}</div>`; }).join('')}${SRC(p)}`); },
  'col.1': (r, i, p) => { const ph = p.photos || []; return page(r, i, p, `${D(r, p) ? LG() : ''}
    ${IMG(ph[0], `left:40px;top:${D(r, p) ? 150 : 40}px;width:600px;height:620px;border-radius:30px`)}${IMG(ph[1], `left:660px;top:${D(r, p) ? 150 : 40}px;width:380px;height:300px;border-radius:30px`)}${IMG(ph[2], `left:660px;top:${D(r, p) ? 470 : 360}px;width:380px;height:300px;border-radius:30px`)}
    <div class="a" style="left:80px;right:80px;top:${p.top || (D(r, p) ? 820 : 720)}px">${LABEL(p)}<div class="ttl" style="font-size:${p.size || 68}px;margin-top:18px">${br(p.title)}</div>${p.sub ? `<div class="sub" style="margin-top:20px">${br(p.sub)}</div>` : ''}</div>${SRC(p)}`); },
  'notice.1': (r, i, p) => page(r, i, p, `${DECO(r, p, '100% 0%')}
    <div class="a" data-head="1" style="left:80px;right:80px;top:${p.top || (D(r, p) ? 210 : 120)}px"><span class="pill f">${esc(p.tag || '안내')}</span><div class="ttl" style="font-size:${p.size || 72}px;margin-top:30px">${br(p.title)}</div></div>
    <div class="a card" style="left:80px;right:80px;top:${p.cardTop || (D(r, p) ? 520 : 440)}px;padding:20px 44px">${(p.rows || []).map((x, k) => `<div style="display:grid;grid-template-columns:200px 1fr;padding:36px 0;${k ? 'border-top:1px solid var(--line)' : ''}"><span style="font-size:26px;color:var(--fg3)">${esc(x[0])}</span><b style="font-size:30px;font-weight:700">${br(x[1])}</b></div>`).join('')}</div>
    ${p.body ? `<div class="a sub" style="left:80px;right:80px;top:${(p.cardTop || (D(r, p) ? 520 : 440)) + (p.rows || []).length * 126 + 70}px;font-size:28px">${br(p.body)}</div>` : ''}${SRC(p)}`),
});


// ── 위클리 캘린더 표지 시안 (2026-11-27 · 레퍼 1: 크고 얇은 제목 + 알약 2개 + 기울인 폰 화면 + 은은한 빛) ──
// wk.cover { pills[2], title, sub, cta, phone{label, value, note, rows[[날짜,요일,일정,강조]]} }
const SE = '<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:block;flex:none;margin-top:6px"><path d="M6 6l12 12M18 9v9H9"/></svg>';
const WKPHONE = ph => `<div class="a" data-bleed="1" style="left:600px;top:330px;width:560px;height:1140px;transform:rotate(9deg);border-radius:92px;background:linear-gradient(150deg,#4A505B,#0B0E14 35%,#2A2F38 70%,#0B0E14);padding:16px;box-shadow:0 80px 160px rgba(0,0,0,.6),0 0 140px rgba(143,176,234,.22),inset 0 0 0 2px rgba(255,255,255,.25)">
  <div style="width:100%;height:100%;border-radius:78px;background:linear-gradient(180deg,#151C28 0%,#0A0E15 65%);overflow:hidden;position:relative;padding:118px 44px 0;color:#F5F6F8">
    <div style="position:absolute;left:50%;top:26px;width:150px;height:44px;margin-left:-75px;border-radius:30px;background:#000"></div>
    <div style="display:flex;justify-content:space-between;align-items:center"><div class="en" style="font-size:28px;font-weight:500;color:rgba(245,246,248,.65)">${esc(ph.label || '')}</div><span style="opacity:.7">${ICON('calendar', 32)}</span></div>
    <div style="font-size:58px;font-weight:500;letter-spacing:-.03em;margin-top:10px">${esc(ph.value || '')}</div>
    <div style="font-size:24px;color:rgba(245,246,248,.5);margin-top:6px">${esc(ph.note || '')}</div>
    <div style="margin-top:34px">${(ph.rows || []).map(x => { const on = !!x[3]; return `<div style="display:grid;grid-template-columns:80px 1fr;align-items:center;gap:20px;padding:20px 24px;margin-top:14px;border-radius:28px;${on ? 'background:linear-gradient(135deg,rgba(143,176,234,.30),rgba(43,100,166,.16));box-shadow:0 0 44px rgba(143,176,234,.38),inset 0 0 0 1.5px rgba(143,176,234,.75)' : 'background:rgba(255,255,255,.045);box-shadow:inset 0 0 0 1px rgba(255,255,255,.08)'}">
      <div style="text-align:center"><div class="en" style="font-size:42px;font-weight:500;line-height:1;${on ? 'color:#C9DAF7' : ''}">${esc(x[0])}</div><div style="font-size:18px;color:rgba(245,246,248,.5);margin-top:6px">${esc(x[1])}</div></div>
      <div style="font-size:28px;font-weight:${on ? 700 : 500};letter-spacing:-.02em">${esc(x[2])}</div></div>`; }).join('')}</div>
  </div></div>`;
Object.assign(T, {
  'wk.cover': (r, i, p) => page(r, i, p, `<style>.wkt em{font-weight:inherit}</style>
    <div class="a" data-bg="1" style="inset:0;background:radial-gradient(55% 42% at 88% 52%,rgba(43,100,166,.38),rgba(43,100,166,0) 70%),radial-gradient(40% 30% at 0% 100%,rgba(143,176,234,.16),rgba(143,176,234,0) 70%)"></div>
    ${BAND(r)}${LG()}${WKPHONE(p.phone || {})}
    <div class="a" data-bg="1" style="left:0;right:0;bottom:0;height:190px;background:linear-gradient(0deg,#05070B 40%,rgba(5,7,11,0))"></div>
    <div class="a" style="left:80px;top:${p.top || 200}px;width:${p.w || 500}px">
      ${PILLS(p)}
      <div class="wkt" style="font-size:${p.size || 104}px;font-weight:300;letter-spacing:-.045em;line-height:1.1;margin-top:44px">${br(p.title)}</div>
      ${p.sub ? `<div style="display:flex;gap:16px;margin-top:48px;font-size:27px;line-height:1.5;color:var(--fg2)"><span style="color:var(--acc)">${SE}</span><span>${br(p.sub)}</span></div>` : ''}
      ${p.cta ? `<div style="margin-top:48px"><span class="cta" style="font-size:22px">${ICON('arrow', 28, 2.2)}<span>${br(p.cta)}</span></span></div>` : ''}
    </div>`),
});


// wk.cover2 — 3D 오브젝트 표지 (cover.1 계열) · 글자 위계 정리: 영문 머리말 → 큰 제목 → 기간 → 핵심 일정 3줄 → 넘김 안내
// { obj, pos, eyebrow, title, range, rows[[날짜,요일,일정,강조]], cta }
Object.assign(T, {
  'wk.cover2': (r, i, p) => page(r, i, p, `<div class="a" data-bg="1" style="inset:0;background:${p.bgFill || 'rgb(var(--sh))'}"></div>${IMG(p.obj, p.objCss || 'inset:0;width:1080px;height:1350px', p.pos || '75% 55%')}
    <div class="a" data-bg="1" style="inset:0;background:linear-gradient(90deg,rgba(var(--sh),calc(.96*var(--so))) 0%,rgba(var(--sh),calc(.82*var(--so))) 38%,rgba(var(--sh),0) 70%)"></div>
    <div class="a" data-bg="1" style="left:0;right:0;bottom:0;height:260px;background:linear-gradient(0deg,rgba(var(--sh),.9),rgba(var(--sh),0))"></div>
    <div class="a" data-bg="1" style="left:0;right:0;top:0;height:340px;background:${p.bgFill ? 'none' : 'linear-gradient(180deg,rgb(var(--sh)) 35%,rgba(var(--sh),0))'}"></div>
    ${BAND(r)}${LG()}
    <div class="a" style="left:80px;top:${p.top || 215}px;width:620px">
      <div class="en" style="display:flex;align-items:center;gap:18px;font-size:20px;font-weight:600;letter-spacing:.32em;color:var(--acc)">${esc(p.eyebrow || 'WEEKLY CALENDAR')}<i style="display:block;width:64px;height:1.5px;background:var(--acc);opacity:.6"></i></div>
      <div class="ttl" style="font-size:${p.size || 128}px;font-weight:400;letter-spacing:-.05em;line-height:1.04;margin-top:34px">${br(p.title)}</div>
      <div class="en" style="font-size:52px;font-weight:300;letter-spacing:-.02em;color:var(--fg2);margin-top:26px">${esc(p.range || '')}</div>
    </div>
    <div class="a" style="left:80px;width:${p.listW || 500}px;top:${p.listTop || 840}px">${(p.rows || []).map((x, k) => { const on = !!x[3]; return `<div style="display:grid;grid-template-columns:150px 1fr;align-items:baseline;padding:20px 0;${k ? '' : 'border-top:1px solid var(--line);'}border-bottom:1px solid var(--line)">
      <div><span class="en" style="font-size:30px;font-weight:500;${on ? 'color:var(--acc)' : ''}">${esc(x[0])}</span><span style="font-size:20px;color:var(--fg3);margin-left:8px">${esc(x[1])}</span></div>
      <div style="font-size:29px;font-weight:${on ? 700 : 500};${on ? '' : 'color:var(--fg2)'}">${esc(x[2])}</div></div>`; }).join('')}
      ${p.cta ? `<div style="display:flex;align-items:center;gap:12px;margin-top:30px;font-size:23px;font-weight:600;color:var(--fg2)">${esc(p.cta)}<span style="color:var(--acc)">${ICON('arrow', 26, 2.2)}</span></div>` : ''}
    </div>`),
});


// wk.cover3 — 위클리 캘린더 중간 톤 표지 (2026-11-27 "중간 톤으로 하되 디자인 개선")
// 바뀐 점: 피드 3:4 썸네일 안전 여백(좌우 110) · 굵기로 위계(가는 '다음 주' / 굵은 '경제 일정') · 날짜 크게 · 일정은 서리 유리 패널 · 띠 글자 제거
// { obj, objCss, bgFill, eyebrow, pre, title, range, week, rows[[날짜,요일,일정,강조]], cta }
Object.assign(T, {
  'wk.cover3': (r, i, p) => page(r, i, p, `<div class="a" data-bg="1" style="inset:0;background:${p.bgFill || '#5F697C'}"></div>
    ${IMG(p.obj, p.objCss || 'inset:0;width:1080px;height:1350px', p.pos || '50% 50%')}
    <div class="a" data-bg="1" style="inset:0;background:linear-gradient(90deg,rgba(58,66,82,.62) 0%,rgba(58,66,82,.34) 40%,rgba(58,66,82,0) 66%)"></div>
    <div class="a" data-bg="1" style="inset:0;background:radial-gradient(70% 45% at 20% 0%,rgba(255,255,255,.10),rgba(255,255,255,0) 70%)"></div>
    <div class="a" data-bg="1" style="left:0;right:0;bottom:0;height:150px;background:linear-gradient(0deg,rgba(50,57,72,.92) 30%,rgba(50,57,72,0))"></div>
    ${LG(110, 74, 150)}
    <div class="a en" style="right:110px;top:92px;font-size:18px;font-weight:600;letter-spacing:.28em;color:rgba(255,255,255,.7)">${esc(p.week || '')}</div>
    <div class="a" style="left:110px;top:${p.top || 236}px;width:620px">
      <div class="en" style="display:flex;align-items:center;gap:16px;font-size:19px;font-weight:600;letter-spacing:.34em;color:rgba(255,255,255,.88)"><i style="display:block;width:10px;height:10px;border-radius:50%;background:#D3E2FB;box-shadow:0 0 18px rgba(211,226,251,.9)"></i>${esc(p.eyebrow || 'WEEKLY CALENDAR')}</div>
      <div style="font-size:${p.preSize || 92}px;font-weight:300;letter-spacing:-.045em;line-height:1.08;margin-top:34px;color:rgba(255,255,255,.86)">${esc(p.pre || '')}</div>
      <div style="font-size:${p.size || 132}px;font-weight:700;letter-spacing:-.055em;line-height:1.02;margin-top:2px;color:#fff">${esc(p.title || '')}</div>
      <div class="en" style="display:flex;align-items:center;gap:20px;margin-top:34px;font-size:46px;font-weight:300;letter-spacing:-.02em;color:#fff">${esc(p.range || '')}<span style="font-size:20px;font-weight:600;letter-spacing:.06em;padding:8px 16px;border-radius:999px;border:1.5px solid rgba(255,255,255,.55);color:rgba(255,255,255,.9)">${esc(p.tz || '한국시간')}</span></div>
    </div>
    <div class="a" style="left:110px;width:${p.listW || 520}px;top:${p.listTop || 790}px;padding:14px 32px;border-radius:30px;background:linear-gradient(160deg,rgba(255,255,255,.20),rgba(255,255,255,.08));border:1px solid rgba(255,255,255,.28);backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);box-shadow:0 30px 60px rgba(30,36,48,.28)">
      ${(p.rows || []).map((x, k) => { const on = !!x[3]; return `<div style="display:grid;grid-template-columns:128px 1fr auto;align-items:center;padding:22px 0;${k ? 'border-top:1px solid rgba(255,255,255,.22)' : ''}">
        <div><span class="en" style="font-size:31px;font-weight:600;color:#fff">${esc(x[0])}</span><span style="font-size:19px;color:rgba(255,255,255,.7);margin-left:8px">${esc(x[1])}</span></div>
        <div style="font-size:28px;font-weight:${on ? 700 : 500};color:${on ? '#fff' : 'rgba(255,255,255,.9)'}">${esc(x[2])}</div>
        ${on ? '<span style="font-size:17px;font-weight:700;padding:7px 14px;border-radius:999px;background:#fff;color:#2E3A52">핵심</span>' : '<span></span>'}</div>`; }).join('')}
    </div>
    ${p.cta ? `<div class="a" style="left:110px;top:${(p.listTop || 790) + 34 + (p.rows || []).length * 82 + 40}px;display:flex;align-items:center;gap:12px;font-size:22px;font-weight:600;color:rgba(255,255,255,.88)">${esc(p.cta)}${ICON('arrow', 24, 2.2)}</div>` : ''}`),
});


// wk.cover4 — 위클리 캘린더 표지 · Orbis 디자인 가이드(스튜디오 디자인 시스템 · 2026-11-26) 규칙대로
// Wanted Sans · 바깥 여백 80 · 로고 190 · 오른쪽 위 "자료명 | 쪽" 24px · 라벨 600 26px(점) · 제목 600 84px 자간 -3% 둘째 줄 강조색
// 본문 400 32px 보조색 · 표 줄 30px · 유의사항 400 20px 40% · CSS 유리·글로우로 입체감 흉내 내지 않음 (장면은 이미지)
Object.assign(T, {
  'wk.cover4': (r, i, p) => page(r, i, p, `<style>.risk{display:none}.wk4t em{font-weight:inherit}</style><div class="a" data-bg="1" style="inset:0;background:${p.bgFill || '#5F697C'}"></div>
    ${IMG(p.obj, p.objCss || 'inset:0;width:1080px;height:1350px', p.pos || '50% 50%')}
    <div class="a" data-bg="1" style="inset:0;background:linear-gradient(90deg,rgba(58,66,82,.55) 0%,rgba(58,66,82,.3) 42%,rgba(58,66,82,0) 66%)"></div>
    <div class="a" data-bg="1" style="left:0;right:0;bottom:0;height:150px;background:linear-gradient(0deg,rgba(50,57,72,.9) 30%,rgba(50,57,72,0))"></div>
    ${LG(80, 72, 190)}
    <div class="a" style="right:80px;top:88px;font-size:24px;font-weight:500;color:rgba(255,255,255,.72)">${esc(p.head || '위클리 캘린더')}<span style="margin:0 14px;opacity:.5">|</span><span class="en">${esc(p.pn || '01 / 05')}</span></div>
    <div class="a" style="left:80px;top:${p.top || 250}px;width:640px">
      <div style="display:flex;align-items:center;gap:12px;font-size:26px;font-weight:600;color:#fff"><i style="display:block;width:10px;height:10px;border-radius:50%;background:var(--acc)"></i>${esc(p.label || 'Weekly Calendar')}</div>
      <div class="wk4t" style="font-size:${p.size || 128}px;font-weight:700;letter-spacing:-.045em;line-height:1.06;margin-top:30px;color:#fff">${br(p.title)}</div>
      <div style="font-size:34px;font-weight:400;line-height:1.55;margin-top:30px;color:var(--fg2)">${br(p.sub || '')}</div>
    </div>
    <div class="a" style="left:80px;width:${p.listW || 540}px;top:${p.listTop || 820}px;padding:14px 32px;border-radius:30px;background:linear-gradient(160deg,rgba(255,255,255,.20),rgba(255,255,255,.08));border:1px solid rgba(255,255,255,.28);backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);box-shadow:0 30px 60px rgba(30,36,48,.28)">
      ${(p.rows || []).map((x, k) => { const on = !!x[3]; return `<div style="display:grid;grid-template-columns:128px 1fr auto;align-items:center;padding:22px 0;${k ? 'border-top:1px solid rgba(255,255,255,.22)' : ''}">
        <div><span class="en" style="font-size:31px;font-weight:600;color:#fff">${esc(x[0])}</span><span style="font-size:19px;color:rgba(255,255,255,.7);margin-left:8px">${esc(x[1])}</span></div>
        <div style="font-size:28px;font-weight:${on ? 700 : 500};color:${on ? '#fff' : 'rgba(255,255,255,.9)'}">${esc(x[2])}</div>
        ${on ? '<span style="font-size:17px;font-weight:700;padding:7px 14px;border-radius:999px;background:#fff;color:#2E3A52">핵심</span>' : '<span></span>'}</div>`; }).join('')}
    </div>
    <div class="a" style="left:80px;bottom:56px;font-size:20px;font-weight:400;color:rgba(255,255,255,.45)">*거래에는 손실 위험이 있습니다. 이용약관이 적용됩니다.</div>`),
});


// wk.type — 위클리 캘린더 글자형 표지 (그림 없이 · 가이드 'Deep Blue' 그라데이션 #0E2D6C → #164492 → #3A66BF)
// 큰 기간 숫자가 주인공 · 매주 숫자만 바뀌어 시리즈로 알아보기 쉬움
Object.assign(T, {
  'wk.type': (r, i, p) => page(r, i, p, `<style>.risk{display:none}</style>
    <div class="a" data-bg="1" style="inset:0;background:${p.bgFill || 'linear-gradient(180deg,#0E2D6C 0%,#164492 55%,#3A66BF 100%)'}"></div>
    ${LG(80, 72, 190, true)}
    <div class="a" style="right:80px;top:88px;font-size:24px;font-weight:500;color:rgba(255,255,255,.72)">${esc(p.head || '위클리 캘린더')}<span style="margin:0 14px;opacity:.5">|</span><span class="en">${esc(p.pn || '01 / 05')}</span></div>
    <div class="a" style="left:80px;right:80px;top:${p.top || 250}px">
      <div style="display:flex;align-items:center;gap:12px;font-size:26px;font-weight:600;color:#fff"><i style="display:block;width:10px;height:10px;border-radius:50%;background:#fff"></i>${esc(p.label || 'Weekly Calendar')}</div>
      <div style="font-size:${p.size || 112}px;font-weight:700;letter-spacing:-.045em;line-height:1.08;margin-top:30px;color:#fff">${br(p.title)}</div>
    </div>
    <div class="a en" data-bleed="1" style="left:66px;top:${p.numTop || 560}px;font-size:${p.numSize || 250}px;font-weight:300;letter-spacing:-.06em;line-height:1;color:#fff;white-space:nowrap">${esc(p.big || '')}</div>
    <div class="a" style="left:80px;right:80px;top:${p.listTop || 860}px">
      ${(p.rows || []).map((x, k) => { const on = !!x[3]; return `<div style="display:grid;grid-template-columns:170px 1fr auto;align-items:center;padding:24px 0;border-top:1px solid rgba(255,255,255,${k ? .25 : .6})">
        <div><span class="en" style="font-size:32px;font-weight:600;color:#fff">${esc(x[0])}</span><span style="font-size:22px;color:rgba(255,255,255,.65);margin-left:8px">${esc(x[1])}</span></div>
        <div style="font-size:31px;font-weight:${on ? 700 : 400};color:${on ? '#fff' : 'rgba(255,255,255,.85)'}">${esc(x[2])}</div>
        ${on ? '<span style="font-size:18px;font-weight:700;padding:8px 16px;border-radius:999px;background:#fff;color:#164492">핵심</span>' : '<span></span>'}</div>`; }).join('')}
      <div style="border-top:1px solid rgba(255,255,255,.25)"></div>
    </div>
    <div class="a" style="left:80px;bottom:56px;font-size:20px;color:rgba(255,255,255,.5)">*거래에는 손실 위험이 있습니다. 이용약관이 적용됩니다.</div>`),
});


// wk.ill — 위클리 캘린더 일러스트 표지 (밝은 바탕 · 남색 글자) · 가이드 글꼴·여백·로고·머리글·유의 문구
Object.assign(T, {
  'wk.ill': (r, i, p) => page(r, i, p, `<style>.risk{display:none}.wkI em{font-weight:inherit;color:#164492}</style>
    <div class="a" data-bg="1" style="inset:0;background:${p.bgFill || '#EEF2F8'}"></div>
    ${IMG(p.obj, p.objCss || 'inset:0;width:1080px;height:1350px', p.pos || '50% 50%')}
    <div class="a" style="left:80px;top:72px;width:190px;--logo:#164492">${LOGO.replace('<svg', '<svg style="width:190px;height:auto;display:block"')}</div>
    <div class="a" style="right:80px;top:88px;font-size:24px;font-weight:500;color:#5B6B80">${esc(p.head || '위클리 캘린더')}<span style="margin:0 14px;opacity:.5">|</span><span class="en">${esc(p.pn || '01 / 05')}</span></div>
    <div class="a" style="left:80px;top:${p.top || 240}px;width:700px">
      <div style="display:flex;align-items:center;gap:12px;font-size:26px;font-weight:600;color:#164492"><i style="display:block;width:10px;height:10px;border-radius:50%;background:#164492"></i>${esc(p.label || 'Weekly Calendar')}</div>
      <div class="wkI" style="font-size:${p.size || 124}px;font-weight:700;letter-spacing:-.045em;line-height:1.06;margin-top:28px;color:#0E2F5C">${br(p.title)}</div>
      <div style="font-size:32px;font-weight:400;margin-top:26px;color:#5B6B80">${br(p.sub || '')}</div>
    </div>
    <div class="a" style="left:80px;width:${p.listW || 560}px;top:${p.listTop || 700}px;padding:10px 30px;border-radius:28px;background:rgba(255,255,255,.82);border:1px solid rgba(14,47,92,.08);box-shadow:0 16px 40px rgba(14,47,92,.08)">
      ${(p.rows || []).map((x, k) => { const on = !!x[3]; return `<div style="display:grid;grid-template-columns:128px 1fr auto;align-items:center;padding:20px 0;${k ? 'border-top:1px solid rgba(14,47,92,.1)' : ''}">
        <div><span class="en" style="font-size:30px;font-weight:600;color:#0E2F5C">${esc(x[0])}</span><span style="font-size:19px;color:#7A889A;margin-left:8px">${esc(x[1])}</span></div>
        <div style="font-size:28px;font-weight:${on ? 700 : 500};color:${on ? '#0E2F5C' : '#41526A'}">${esc(x[2])}</div>
        ${on ? '<span style="font-size:17px;font-weight:700;padding:7px 14px;border-radius:999px;background:#164492;color:#fff">핵심</span>' : '<span></span>'}</div>`; }).join('')}
    </div>
    <div class="a" style="left:80px;bottom:56px;font-size:20px;color:rgba(14,47,92,.45)">*거래에는 손실 위험이 있습니다. 이용약관이 적용됩니다.</div>`),
});


// wk.sign — 위클리 캘린더 '이정표' 표지 (흰 바탕 실사 표지판 · 판 위에 그 주 핵심 일정을 코드로 얹음 · 매주 글자만 교체)
// signs[[날짜,요일,일정,강조]] · 판 위치는 wk_sign1.jpg 기준 (y 중심·기울기)
const SIGN_POS = [{ y: 707, rot: 0 }, { y: 915, rot: -1.6 }, { y: 1122, rot: .5 }];
Object.assign(T, {
  'wk.sign': (r, i, p) => page(r, i, p, `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@500;700&display=swap"><style>.risk{display:none}.wkS em{font-family:'Noto Serif KR',serif;font-style:italic;font-weight:500;color:#164492;letter-spacing:-.02em}</style>
    <div class="a" data-bg="1" style="inset:0;background:#fff"></div>
    ${IMG(p.obj || 'insta/assets/onb/wk_sign1.jpg', 'inset:0;width:1080px;height:1350px')}
    <div class="a" style="left:80px;top:72px;width:190px;--logo:#164492">${LOGO.replace('<svg', '<svg style="width:190px;height:auto;display:block"')}</div>
    <div class="a" style="right:80px;top:88px;font-size:24px;font-weight:500;color:#657B7E">${esc(p.head || '위클리 캘린더')}<span style="margin:0 14px;opacity:.5">|</span><span class="en">${esc(p.pn || '01 / 05')}</span></div>
    <div class="a wkS" style="left:60px;right:60px;top:${p.top || 215}px;text-align:center">
      <div style="font-size:${p.size || 88}px;font-weight:700;letter-spacing:-.04em;line-height:1.18;color:#164492">${br(p.title)}</div>
      <div style="font-size:30px;font-weight:500;margin-top:26px;color:#07181C">${br(p.sub || '')}</div>
    </div>
    ${(p.signs || []).map((x, k) => { const s = SIGN_POS[k]; if (!s) return ''; const on = !!x[3]; return `<div class="a" style="left:140px;width:740px;top:${s.y - 40}px;height:80px;display:flex;align-items:center;gap:28px;transform:rotate(${s.rot}deg);transform-origin:50% 50%;color:#fff">
      <span class="en" style="font-size:44px;font-weight:600;letter-spacing:-.02em">${esc(x[0])}<span style="font-size:26px;font-weight:500;opacity:.75;margin-left:8px">${esc(x[1])}</span></span>
      <span style="font-size:42px;font-weight:${on ? 700 : 500};letter-spacing:-.03em">${esc(x[2])}</span>${on ? '<span style="font-size:20px;font-weight:700;padding:6px 14px;border-radius:999px;background:#fff;color:#164492">핵심</span>' : ''}</div>`; }).join('')}
    <div class="a" style="right:80px;bottom:52px;text-align:right;font-size:20px;line-height:1.5;color:rgba(7,24,28,.45)">*거래에는 손실 위험이 있습니다.<br>이용약관이 적용됩니다.</div>`),
});


// wk.glass — 위클리 캘린더 가운데 정렬 표지 (2026-11-27 레퍼: 검정 배경 + 가운데 유리 3D 달력 아이콘 + 빛나는 굵은 제목 + 알약)
// { obj, title, pill, rows[[날짜,요일,일정,강조]] }
Object.assign(T, {
  'wk.glass': (r, i, p) => page(r, i, p, `<style>.risk{display:none}.wkG em{font-weight:inherit;color:${p.em || '#BFD3F5'}}</style>
    <div class="a" data-bg="1" style="inset:0;background:${p.bgFill || '#05070B'}"></div>
    ${IMG(p.obj, p.objCss || 'inset:0;width:1080px;height:1350px', p.pos || '50% 50%')}
    ${p.pn ? `<div class="a en" style="right:80px;top:84px;font-size:22px;font-weight:500;color:rgba(255,255,255,.7)">${esc(p.pn)}</div>` : ''}<div class="a" style="left:0;right:0;top:70px;display:flex;justify-content:center"><div style="width:170px;--logo:#fff">${LOGO.replace('<svg', '<svg style="width:170px;height:auto;display:block"')}</div></div>
    <div class="a wkG" style="left:60px;right:60px;top:${p.top || 205}px;text-align:center">
      <div style="font-size:${p.size || 108}px;font-weight:700;letter-spacing:-.045em;line-height:1.1;color:#fff;text-shadow:${p.glow || '0 0 28px rgba(143,176,234,.55),0 0 70px rgba(143,176,234,.25)'}">${br(p.title)}</div>
      ${p.pill ? `<div style="display:inline-block;margin-top:38px;padding:20px 44px;border-radius:999px;border:1.5px solid ${p.pillBd || 'rgba(143,176,234,.55)'};background:${p.pillBg || 'rgba(255,255,255,.06)'};font-size:31px;font-weight:500;line-height:1.4;color:#F5F6F8">${br(p.pill)}</div>` : ''}
    </div>
    ${(p.tags || []).length ? `<div class="a" style="left:0;right:0;top:${p.listTop || 1100}px;display:flex;flex-direction:column;align-items:center;gap:16px">${p.tags.map((t, k) => `<div style="display:flex;align-items:center;gap:12px;padding:${k ? '12px 28px' : '15px 34px'};border-radius:999px;border:1.5px solid ${k ? (p.pillBd || 'rgba(143,176,234,.55)') : 'rgba(255,255,255,.95)'};background:${k ? (p.pillBg || 'rgba(255,255,255,.06)') : 'rgba(255,255,255,.95)'};color:${k ? '#fff' : '#1E3157'};font-size:${k ? 22 : 27}px;font-weight:${k ? 500 : 700};letter-spacing:${k ? '.06em' : '-.01em'}">${esc(t)}${k ? '' : ICON('arrow', 26, 2.4)}</div>`).join('')}</div>` : ''}
    ${p.cols ? `<div class="a" style="left:90px;right:90px;top:${p.listTop || 1080}px;display:grid;grid-template-columns:repeat(${(p.rows || []).length},1fr);border-radius:30px;border:1.5px solid ${p.pillBd || 'rgba(143,176,234,.55)'};background:${p.pillBg || 'rgba(255,255,255,.06)'}">
      ${(p.rows || []).map((x, k) => { const on = !!x[3]; return `<div style="padding:24px 10px 22px;text-align:center;${k ? `border-left:1px solid ${p.pillBd || 'rgba(143,176,234,.4)'}` : ''}">
        <div style="color:#fff"><span class="en" style="font-size:36px;font-weight:600;letter-spacing:-.02em">${esc(x[0])}</span><span style="font-size:21px;opacity:.75;margin-left:6px">${esc(x[1])}</span></div>
        <div style="font-size:23px;font-weight:${on ? 700 : 500};margin-top:8px;color:${on ? '#fff' : 'rgba(255,255,255,.82)'}">${on ? '<i style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#fff;margin-right:8px;vertical-align:middle"></i>' : ''}${esc(x[2])}</div></div>`; }).join('')}
    </div>` : `<div class="a" style="left:0;right:0;top:${p.listTop || 1080}px;display:flex;flex-direction:column;align-items:center;gap:10px">
      ${(p.rows || []).map(x => { const on = !!x[3]; return `<div style="display:flex;align-items:center;gap:16px;padding:10px 28px;border-radius:999px;border:1.5px solid ${on ? 'rgba(255,255,255,.9)' : (p.pillBd || 'rgba(143,176,234,.45)')};background:${on ? (p.onBg || 'rgba(143,176,234,.22)') : (p.pillBg || 'rgba(255,255,255,.05)')};font-size:25px;color:#F5F6F8">
        <span class="en" style="font-weight:600">${esc(x[0])}</span><span style="font-size:21px;opacity:.7">${esc(x[1])}</span><span style="font-weight:${on ? 700 : 500}">${esc(x[2])}</span></div>`; }).join('')}
    </div>`}
    <div class="a" style="left:0;right:0;bottom:30px;text-align:center;font-size:19px;color:${p.riskC || 'rgba(245,246,248,.45)'}">*거래에는 손실 위험이 있습니다. 이용약관이 적용됩니다.</div>`),
});


// 위클리 캘린더 속 장 (표지 wk.glass 미디엄 톤과 같은 세계) · 2026-11-27
// 공통: 회청색 그라데이션 + 위쪽 은은한 빛 · 왼쪽 위 로고 · 오른쪽 위 쪽 번호 · 흰 글자 · 반투명 패널
const WKM_BG = `<div class="a" data-bg="1" style="inset:0;background:linear-gradient(180deg,#6F7D99 0%,#62708C 45%,#4A566E 100%)"></div><div class="a" data-bg="1" style="inset:0;background:radial-gradient(60% 38% at 50% 0%,rgba(255,255,255,.16),rgba(255,255,255,0) 70%)"></div>`;
const WKM_TOP = p => `<div class="a" style="left:80px;top:72px;width:150px;--logo:#fff">${LOGO.replace('<svg', '<svg style="width:150px;height:auto;display:block"')}</div>
  <div class="a en" style="right:80px;top:84px;font-size:24px;font-weight:500;color:rgba(255,255,255,.75)">${esc(p.pn || '')}</div>`;
const WKM_RISK = `<div class="a" style="left:0;right:0;bottom:30px;text-align:center;font-size:19px;color:rgba(255,255,255,.6)">*거래에는 손실 위험이 있습니다. 이용약관이 적용됩니다.</div>`;
const WKM_HEAD = (p, top) => `<div class="a wkM" style="left:80px;right:80px;top:${top}px">
  ${p.label ? `<div style="display:inline-block;padding:10px 24px;border-radius:999px;border:1.5px solid rgba(255,255,255,.55);background:rgba(255,255,255,.12);font-size:24px;font-weight:600;color:#fff">${esc(p.label)}</div>` : ''}
  <div style="font-size:${p.size || 84}px;font-weight:700;letter-spacing:-.045em;line-height:1.12;margin-top:28px;color:#fff;text-shadow:0 2px 24px rgba(30,38,56,.3)">${br(p.title)}</div>
  ${p.sub ? `<div style="font-size:30px;margin-top:20px;color:rgba(255,255,255,.82)">${br(p.sub)}</div>` : ''}</div>`;
const WKM_PANEL = 'border-radius:30px;border:1.5px solid rgba(255,255,255,.4);background:rgba(255,255,255,.12)';
const WKM_CSS = '<style>.risk{display:none}.wkM em{font-weight:inherit;color:#DCE8FC}</style>';
Object.assign(T, {
  // 일정표 { rows[[날짜·요일, 시각, 나라, 일정, 강조]], src }
  'wk.list': (r, i, p) => page(r, i, p, `${WKM_CSS}${WKM_BG}${WKM_TOP(p)}${WKM_HEAD(p, p.top || 190)}
    <div class="a" style="left:80px;right:80px;top:${p.listTop || 520}px;padding:8px 36px;${WKM_PANEL}">
      ${(p.rows || []).map((x, k) => { const on = !!x[4]; return `<div style="display:grid;grid-template-columns:170px 110px 1fr auto;align-items:center;padding:38px 0;${k ? 'border-top:1px solid rgba(255,255,255,.22)' : ''}">
        <div style="font-size:29px;font-weight:600;color:#fff">${esc(x[0])}</div>
        <div class="en" style="font-size:27px;font-weight:500;color:rgba(255,255,255,.8)">${esc(x[1])}</div>
        <div><span class="en" style="font-size:18px;font-weight:700;color:#DCE8FC;margin-right:10px">${esc(x[2])}</span><span style="font-size:31px;font-weight:${on ? 700 : 500};color:#fff">${esc(x[3])}</span></div>
        ${on ? '<span style="font-size:18px;font-weight:700;padding:7px 15px;border-radius:999px;background:#fff;color:#1E3157">핵심</span>' : '<span></span>'}</div>`; }).join('')}
    </div>
    ${p.src ? `<div class="a" style="left:80px;right:80px;bottom:78px;font-size:20px;line-height:1.6;color:rgba(255,255,255,.62)">${br(p.src)}</div>` : ''}${WKM_RISK}`),
  // 핵심 지표 하나 { label, title, when, body, rows[[이름,값]] }
  'wk.focus': (r, i, p) => page(r, i, p, `${WKM_CSS}${WKM_BG}${WKM_TOP(p)}${WKM_HEAD(p, p.top || 190)}
    <div class="a en" style="left:80px;top:${p.whenTop || 470}px;font-size:${p.whenSize || 150}px;font-weight:300;letter-spacing:-.05em;line-height:1;color:#fff">${esc(p.when || '')}</div>
    <div class="a" style="left:80px;right:80px;top:${p.bodyTop || 680}px;padding:40px 44px;${WKM_PANEL}">
      <div style="font-size:33px;line-height:1.65;color:#fff">${br(p.body || '')}</div>
      ${(p.rows || []).length ? `<div style="margin-top:26px">${p.rows.map(x => `<div style="display:grid;grid-template-columns:190px 1fr;padding:26px 0;border-top:1px solid rgba(255,255,255,.25);font-size:29px"><span style="color:rgba(255,255,255,.7)">${esc(x[0])}</span><b style="font-weight:600;color:#fff">${esc(x[1])}</b></div>`).join('')}</div>` : ''}
    </div>${WKM_RISK}`),
  // 시각이 주인공인 목록 { items[[시각, 날짜, 제목, 설명, 강조]] }
  'wk.times': (r, i, p) => page(r, i, p, `${WKM_CSS}${WKM_BG}${WKM_TOP(p)}${WKM_HEAD(p, p.top || 190)}
    <div class="a" style="left:80px;right:80px;top:${p.listTop || 520}px">
      ${(p.items || []).map((x, k) => { const on = !!x[4]; return `<div style="display:grid;grid-template-columns:330px 1fr;align-items:center;padding:46px 0;border-top:1px solid rgba(255,255,255,${k ? .25 : .55})">
        <div><div class="en" style="font-size:96px;font-weight:300;letter-spacing:-.05em;line-height:1;color:#fff">${esc(x[0])}</div><div style="font-size:24px;margin-top:10px;color:rgba(255,255,255,.75)">${esc(x[1])}</div></div>
        <div><div style="font-size:38px;font-weight:${on ? 700 : 600};color:#fff">${esc(x[2])}</div><div style="font-size:25px;margin-top:10px;color:rgba(255,255,255,.75)">${br(x[3] || '')}</div></div></div>`; }).join('')}
      <div style="border-top:1px solid rgba(255,255,255,.25)"></div>
    </div>
    ${p.src ? `<div class="a" style="left:80px;right:80px;bottom:78px;font-size:20px;color:rgba(255,255,255,.62)">${br(p.src)}</div>` : ''}${WKM_RISK}`),
  // 마무리 { obj, title, sub, next }
  'wk.end': (r, i, p) => page(r, i, p, `${WKM_CSS}<div class="a" data-bg="1" style="inset:0;background:#5F6C86"></div>${IMG(p.obj, 'inset:0;width:1080px;height:1350px')}
    <div class="a" style="left:0;right:0;top:70px;display:flex;justify-content:center"><div style="width:170px;--logo:#fff">${LOGO.replace('<svg', '<svg style="width:170px;height:auto;display:block"')}</div></div>
    <div class="a wkM" style="left:60px;right:60px;top:${p.top || 205}px;text-align:center">
      <div style="font-size:${p.size || 92}px;font-weight:700;letter-spacing:-.045em;line-height:1.12;color:#fff;text-shadow:0 2px 24px rgba(30,38,56,.35)">${br(p.title)}</div>
      ${p.sub ? `<div style="font-size:30px;margin-top:22px;color:rgba(255,255,255,.85)">${br(p.sub)}</div>` : ''}</div>
    ${p.next ? `<div class="a" style="left:0;right:0;top:${p.nextTop || 1130}px;display:flex;justify-content:center"><div style="display:flex;align-items:center;gap:14px;padding:16px 36px;border-radius:999px;background:rgba(255,255,255,.95);color:#1E3157;font-size:27px;font-weight:700"><span style="font-weight:500;color:#5B6B80">다음 편</span>${esc(p.next)}</div></div>` : ''}${WKM_RISK}`),
});


// 위클리 캘린더 가운데 구성 속 장 (표지 wk.glass 공식 그대로: 위 제목 · 가운데 유리 아이콘 · 아래 알약/카드) · 2026-11-27
const WKC_TOP = p => `<div class="a" style="left:0;right:0;top:70px;display:flex;justify-content:center"><div style="width:150px;--logo:#fff">${LOGO.replace('<svg', '<svg style="width:150px;height:auto;display:block"')}</div></div>${p.pn ? `<div class="a en" style="right:80px;top:84px;font-size:22px;font-weight:500;color:rgba(255,255,255,.7)">${esc(p.pn)}</div>` : ''}`;
const WKC_TITLE = (p, top) => `<div class="a wkM" style="left:${p.align === 'left' ? 80 : 60}px;right:${p.align === 'left' ? 80 : 60}px;top:${top}px;text-align:${p.align === 'left' ? 'left' : 'center'}">
  ${p.label ? `<div style="display:inline-block;padding:10px 26px;border-radius:999px;border:1.5px solid rgba(255,255,255,.55);background:rgba(255,255,255,.12);font-size:24px;font-weight:600;color:#fff;margin-bottom:26px">${esc(p.label)}</div>` : ''}
  <div style="font-size:${p.size || 92}px;font-weight:700;letter-spacing:-.045em;line-height:1.12;color:#fff;text-shadow:0 2px 24px rgba(30,38,56,.35)">${br(p.title)}</div>
  ${p.sub ? `<div style="font-size:30px;margin-top:20px;color:rgba(255,255,255,.85);line-height:1.5">${br(p.sub)}</div>` : ''}</div>`;
const WKC_IMG = p => `<div class="a" data-bg="1" style="inset:0;background:${p.bgFill || '#62708C'}"></div>${IMG(p.obj, p.objCss || 'inset:0;width:1080px;height:1350px')}${p.tint ? `<div class="a" data-bg="1" style="inset:0;background:${p.tint}"></div>` : ''}`;
Object.assign(T, {
  // 일정 알약 목록 { obj, label, title, rows[[날짜·요일, 시각, 일정, 강조]], src }
  'wk.cpills': (r, i, p) => page(r, i, p, `${WKM_CSS}${WKC_IMG(p)}${WKC_TOP(p)}${WKC_TITLE(p, p.top || 175)}
    <div class="a" style="left:0;right:0;top:${p.listTop || 860}px;display:flex;flex-direction:column;align-items:center;gap:${p.gap || 22}px">
      ${(p.rows || []).map(x => { const on = !!x[3]; return `<div style="display:grid;grid-template-columns:200px 125px 1fr;align-items:center;width:920px;padding:${p.rowPad || 32}px 44px;border-radius:999px;border:1.5px solid ${on ? '#fff' : 'rgba(255,255,255,.5)'};background:${on ? 'rgba(255,255,255,.95)' : 'rgba(255,255,255,.12)'};color:${on ? '#1E3157' : '#fff'}">
        <span style="font-size:31px;font-weight:600">${esc(x[0])}</span><span class="en" style="font-size:30px;opacity:.8">${esc(x[1])}</span><span style="font-size:33px;font-weight:${on ? 800 : 600}">${esc(x[2])}</span></div>`; }).join('')}
      ${p.note ? `<div style="margin-top:16px;font-size:25px;color:rgba(255,255,255,.85)">${br(p.note)}</div>` : ''}
    </div>
    ${p.src ? `<div class="a" style="left:80px;right:80px;bottom:70px;text-align:center;font-size:19px;line-height:1.55;color:rgba(255,255,255,.62)">${br(p.src)}</div>` : ''}${WKM_RISK}`),
  // 핵심 지표 { obj, label, title, when, body }
  'wk.cfocus': (r, i, p) => page(r, i, p, `${WKM_CSS}${WKC_IMG(p)}${WKC_TOP(p)}${WKC_TITLE(p, p.top || 175)}
    <div class="a" style="left:0;right:0;top:${p.whenTop || 1000}px;display:flex;flex-direction:column;align-items:center;gap:20px">
      <div style="display:flex;align-items:center;gap:16px;padding:16px 40px;border-radius:999px;background:rgba(255,255,255,.95);color:#1E3157"><span style="font-size:27px;font-weight:600">${esc(p.whenDate || '')}</span><span class="en" style="font-size:40px;font-weight:700;letter-spacing:-.02em">${esc(p.when || '')}</span></div>
      <div style="max-width:860px;text-align:center;font-size:28px;line-height:1.6;color:rgba(255,255,255,.9)">${br(p.body || '')}</div>
    </div>${WKM_RISK}`),
  // 마무리 (기존 발행본 end 방식: 제목 + 프로필 카드 CTA) { obj, title, sub, cta }
  'wk.cend': (r, i, p) => page(r, i, p, `${WKM_CSS}${WKC_IMG(p)}${p.mark ? `<div class="a" data-bg="1" style="left:${p.markX || 330}px;top:${p.markY || 560}px;width:${p.markW || 1000}px;opacity:${p.markO || .07};--logo:#fff">${LOGO.replace('viewBox="0 0 552 201"', 'viewBox="0 0 201 201"').replace('<svg', `<svg style="width:${p.markW || 1000}px;height:auto;display:block"`)}</div>` : ''}${WKC_TOP(p)}${WKC_TITLE(p, p.top || 175)}
    <div class="a" style="left:0;right:0;top:${p.cardTop || 1040}px;display:flex;justify-content:center"><div style="width:820px;display:flex;align-items:center;gap:28px;padding:22px 26px;border-radius:999px;${p.solid ? 'background:rgba(255,255,255,.96);color:#1E3157;box-shadow:0 24px 60px rgba(20,28,50,.28)' : 'border:1.5px solid rgba(255,255,255,.55);background:rgba(255,255,255,.16);color:#fff'}">
      <div style="width:100px;height:100px;border-radius:50%;background:${p.solid ? '#164492' : '#fff'};display:grid;place-items:center;flex:none"><div style="width:70px;--logo:${p.solid ? '#fff' : '#164492'}">${LOGO.replace('<svg', '<svg style="width:70px;height:auto;display:block"')}</div></div>
      <div style="flex:1"><div class="en" style="font-size:34px;font-weight:700;letter-spacing:-.01em">@orbis_securities</div><div style="font-size:24px;opacity:.85;margin-top:6px">오르비스 시큐리티즈</div></div>
      <div style="width:78px;height:78px;margin-right:8px;border-radius:50%;${p.solid ? 'background:#164492;color:#fff;' : 'border:1.5px solid rgba(255,255,255,.55);'}display:grid;place-items:center;flex:none">${ICON('arrow', 30, 2.2)}</div></div></div>
    ${p.cta ? `<div class="a" style="left:80px;right:80px;top:${(p.cardTop || 1040) + 175}px;text-align:center;font-size:27px;color:rgba(255,255,255,.88)">${br(p.cta)}</div>` : ''}${WKM_RISK}`),
});


// wk.brief — 핵심 지표 설명 장 (일정·시간 / 지표 설명 / 체크 포인트 / 지난달 결과) · 오른쪽 위 작은 유리 아이콘
// { obj, objCss, label, title, secs[[머리, 본문]], last[[이름, 값]] , lastHead }
Object.assign(T, {
  'wk.brief': (r, i, p) => page(r, i, p, `${WKM_CSS}<div class="a" data-bg="1" style="inset:0;background:${p.bgFill || 'linear-gradient(180deg,#707E9A 0%,#64728E 45%,#4E5A72 100%)'}"></div>
    <div class="a" data-bg="1" style="inset:0;background:radial-gradient(60% 40% at 50% 0%,rgba(255,255,255,.18),rgba(255,255,255,0) 70%)"></div>
    ${p.obj ? IMG(p.obj, p.objCss || 'right:20px;top:80px;width:380px;height:475px;-webkit-mask-image:radial-gradient(50% 50% at 50% 55%,#000 55%,transparent 100%)') : ''}
    ${WKC_TOP(p)}
    ${WKC_TITLE(p, p.top || 190)}
    <div class="a" style="left:80px;right:80px;top:${p.bodyTop || 420}px;padding:12px 44px;border-radius:30px;border:1.5px solid rgba(255,255,255,.4);background:rgba(255,255,255,.12)">
      ${(p.secs || []).map((x, k) => `<div style="padding:26px 0;${k ? 'border-top:1px solid rgba(255,255,255,.22)' : ''}"><div style="font-size:24px;font-weight:700;color:#DCE8FC">${esc(x[0])}</div><div style="font-size:30px;line-height:1.55;margin-top:10px;color:#fff">${br(x[1])}</div></div>`).join('')}
      ${(p.last || []).length ? `<div style="padding:26px 0;border-top:1px solid rgba(255,255,255,.22)"><div style="font-size:24px;font-weight:700;color:#DCE8FC">${esc(p.lastHead || '지난달 결과')}</div>
        <div style="display:grid;grid-template-columns:repeat(${p.last.length},1fr);gap:14px;margin-top:16px">${p.last.map(x => `<div style="padding:18px 10px;border-radius:20px;background:rgba(255,255,255,.14);text-align:center"><div class="en" style="font-size:40px;font-weight:700;letter-spacing:-.02em;color:#fff">${esc(x[1])}</div><div style="font-size:21px;margin-top:6px;color:rgba(255,255,255,.8)">${esc(x[0])}</div></div>`).join('')}</div></div>` : ''}
    </div>
    ${p.src ? `<div class="a" style="left:80px;right:80px;bottom:70px;text-align:center;font-size:19px;color:rgba(255,255,255,.62)">${br(p.src)}</div>` : ''}${WKM_RISK}`),
});

const FIT_HEAD = new Set(['step.1','flow.1','table.1','table.2','table.3','bar.1','bar.2','bar.3','num.2','num.3','list.1','list.2','list.3','step.2','step.3','qa.2','cal.1','cal.2','term.1','term.2','ratio.1','ratio.2','sum.1','rank.1','news.1','tip.1','pc.1','ox.1','quiz.1','econ.1','move.1','notice.1']);
const FIT_ALL = new Set(['qa.1','end.2']);
export const kitPages = r => (r.pages || []).map((p, i) => (T[p.t] || T['cover.1'])(r, i, Object.assign({}, p, { _light: (p.theme || r.theme) === 'light', _onPhoto: p.t === 'ex.4', _barX: p.t === 'ex.3' ? 540 : 0, _fit: FIT_ALL.has(p.t) ? 'all' : FIT_HEAD.has(p.t) ? 'head' : '' })));
export const KIT_TYPES = Object.keys(T);
