// 시장 카드 '매거진' 시안 (2026-11-26 사용자 레퍼: 사진 중심 잡지형 · 머리글 선 · 한 가지 강조색 · 문단형 본문 · 브랜드 서명)
// 브랜드 가이드 값: 여백 80 · 글꼴 Wanted Sans · 메인 #164492 · 강조 연청 #A6BEEB · Ink #07181C · Slate #657B7E · Tint #E8EBFB
// r = { layout:'mag', series:'Orbis Market Note', topic:'미국 증시 일정', pages:[{ type, photo, ... }] }
import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const WANTED = 'https://cdn.jsdelivr.net/gh/wanteddev/wanted-sans@v1.0.3/packages/wanted-sans/fonts/webfonts/variable/split/WantedSansVariable.min.css';
const LOGO = readFileSync(join(here, '..', 'templates', 'orbis-logo-white.svg'), 'utf8').replace(/<\?xml[^>]*>/, '');
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const src = p => !p ? '' : /^(https?|file|data):/.test(p) ? p : pathToFileURL(resolve(here, '..', p)).href;
// 강조: [[단어]] → 연청색
const hl = s => esc(s).replace(/\[\[(.+?)\]\]/g, '<em>$1</em>').replace(/\n/g, '<br>');
const SKY = '#8FB0EA', MC = '#164492', LB = '#2B64A6';   // 글 강조 #7F9CC6 (2026-11-26 사용자: #2B64A6보다 이전 색이 나음) · Line Blue는 막대·머리글 선에만
const RISK = '*모든 거래에는 손실 위험이 있으며, 관련 이용약관이 적용됩니다.';

const CSS = `<link rel="stylesheet" href="${WANTED}"><style>
*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1350px;overflow:hidden;background:#05070B;color:#fff;font-family:'Wanted Sans Variable','Wanted Sans','Pretendard Variable',sans-serif;-webkit-font-smoothing:antialiased;word-break:keep-all;letter-spacing:-.01em}
.a{position:absolute}em{font-style:normal;color:${SKY}}
.ph{position:absolute;inset:0;width:1080px;height:1350px;object-fit:cover}
.dim{position:absolute;inset:0}
.hd{left:80px;right:80px;top:64px;display:flex;justify-content:space-between;align-items:center;padding-bottom:22px;border-bottom:1.5px solid rgba(255,255,255,.4);font-size:24px;font-weight:600}
.hd .l{display:flex;align-items:center;gap:14px;letter-spacing:.08em;text-transform:uppercase;font-size:22px}.hd .l i{width:14px;height:14px;border-radius:3px;background:#fff;display:block}
.hd .r{opacity:.9}.hd .r b{font-weight:700}.hd .r span{opacity:.6;margin:0 10px}
.pn{right:80px;bottom:60px;padding:8px 20px;border-radius:999px;background:rgba(255,255,255,.16);backdrop-filter:blur(10px);font-size:22px;font-weight:600}
.sig{left:0;right:0;bottom:60px;display:flex;justify-content:center}.sig svg{width:150px;height:auto}.sig svg *{fill:#fff!important}
.risk{left:80px;bottom:66px;font-size:19px;opacity:.5}
.kick{font-size:26px;font-weight:700;color:${SKY};letter-spacing:.02em}
.cap{font-size:24px;font-weight:600;letter-spacing:.22em;opacity:.85}
.big{font-weight:700;letter-spacing:-.035em;line-height:1.12}
.para{font-size:31px;line-height:1.62;opacity:.92;font-weight:500}
.gc{border-radius:28px;background:linear-gradient(160deg,rgba(255,255,255,.08),rgba(255,255,255,.025));border:1px solid rgba(255,255,255,.13)}
.sv{background:linear-gradient(180deg,#FFFFFF,#C3CFE0 55%,#7D91B0);-webkit-background-clip:text;background-clip:text;color:transparent}
.glass{background:rgba(255,255,255,.14);border:1.5px solid rgba(255,255,255,.28);backdrop-filter:blur(18px);border-radius:999px}
</style>`;
const HD = {
  // 기존: 흰 네모 + ORBIS MARKET NOTE · 아래 선
  o: (r, right) => `<div class="a hd"><div class="l"><i></i>${esc(r.series || 'Orbis Market Note')}</div><div class="r">${right || ''}</div></div>`,
  // A 로고형: 왼쪽 흰 로고 · 오른쪽 MARKET NOTE (가는 글씨) | 주제
  a: (r, right) => `<style>.sig,.clogo{display:none}</style><div class="a" style="left:80px;right:80px;top:62px;display:flex;justify-content:space-between;align-items:center"><div style="width:150px">${LOGO.replace('<svg', '<svg style="width:150px;height:auto;display:block"')}</div><div style="font-size:21px;letter-spacing:.2em;font-weight:500;opacity:.85">MARKET NOTE<span style="display:inline-block;width:1.5px;height:18px;background:rgba(255,255,255,.35);margin:0 18px;vertical-align:-2px"></span><b style="letter-spacing:0;font-weight:600">${right ? right.replace(/<[^>]+>/g, '') : ''}</b></div></div>`,
  // B 워드마크형: ORBIS 굵게 + 파란 세로선 + MARKET NOTE 가늘게 · 선 없음 · 오른쪽 날짜
  b: (r, right) => `<div class="a" style="left:80px;right:80px;top:70px;display:flex;justify-content:space-between;align-items:center"><div style="display:flex;align-items:center;font-size:24px;letter-spacing:.18em"><b style="font-weight:800">ORBIS</b><i style="width:3px;height:22px;background:${LB};margin:0 16px;display:block"></i><span style="font-weight:300;opacity:.9">MARKET NOTE</span></div><div style="font-size:22px;font-weight:500;opacity:.7;letter-spacing:.04em">${esc(r.date || '')}</div></div>`,
  // C 제호형: 위 작은 ORBIS SECURITIES · 아래 큰 Market Note · 파란 짧은 선 · 오른쪽 주제
  c: (r, right) => `<div class="a" style="left:80px;right:80px;top:58px;display:flex;justify-content:space-between;align-items:flex-end;padding-bottom:20px;border-bottom:1px solid rgba(255,255,255,.22)"><div><div style="font-size:16px;letter-spacing:.32em;font-weight:600;opacity:.6">ORBIS SECURITIES</div><div style="font-size:38px;font-weight:600;letter-spacing:-.01em;margin-top:4px">Market Note<i style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${LB};margin-left:8px"></i></div></div><div style="font-size:22px;font-weight:600;opacity:.85;padding-bottom:6px">${right || ''}</div></div>`,
};
const head = (r, right) => (HD[r.hd] || HD.o)(r, right);
const shell = (r, i, p, inner, o = {}) => `<!doctype html><html lang="ko"><head><meta charset="utf-8">${CSS}</head><body${o.bg ? ` style="background:${o.bg};color:${o.fg || '#fff'}"` : ''}>
  ${p.photo ? `<img class="ph" src="${esc(src(p.photo))}" alt="">` : ''}${o.dim || ''}
  ${inner}
  ${o.noPn ? '' : `<div class="a pn"${o.fg ? ` style="background:rgba(7,24,28,.07);color:${o.fg}"` : ''}>${i + 1} / ${r.pages.length}</div>`}
  <script>window.addEventListener('load',()=>document.fonts.ready.then(()=>{document.body.dataset.ready='1'}))</script></body></html>`;

const foot = (lines, color) => (lines || []).length ? `<div class="a" style="left:80px;right:80px;bottom:140px;font-size:22px;line-height:1.65;opacity:.55;${color ? `color:${color}` : ''}">${lines.map(esc).join('<br>')}</div>` : '';
const T = {
  // 1 HEADLINE · 표지: 꽉 찬 사진 · 아래 어둡게 · 큰 제목(핵심 줄 강조) · 두 줄 설명 · 오른쪽 아래 흰 로고 (영문 머리말 없음)
  cover: (r, i, p) => shell(r, i, p, `${head(r, `<b>${esc(r.topic || '')}</b>`)}
    <div class="a" style="left:80px;right:80px;bottom:260px">
      <div class="big" style="font-size:${p.size || 104}px">${hl(p.title)}</div>
      ${p.sub ? `<div style="font-size:31px;font-weight:500;opacity:.85;margin-top:36px;line-height:1.6">${hl(p.sub)}</div>` : ''}</div>
    <div class="a risk">${RISK}</div><div class="a clogo" style="right:80px;bottom:56px;width:150px">${LOGO.replace('<svg', '<svg style="width:150px;height:auto"')}</div>`,
    { dim: `${p.shade ? `<div class="dim" style="background:rgba(5,7,11,${p.shade})"></div>` : ''}<div class="dim" style="background:linear-gradient(180deg,rgba(5,7,11,.55) 0%,rgba(5,7,11,0) 22%,rgba(5,7,11,0) 34%,rgba(5,7,11,.84) 66%,rgba(5,7,11,.97) 100%)"></div>`, noPn: true }),
  // 2 SCHEDULE · 일정: 사진 어둡게 · 제목 · 기준 표기 · 날짜/시간 | 거래 상태 줄 · 참고 문단 · 각주
  list: (r, i, p) => shell(r, i, p, `${head(r, `<b>${esc(r.topic || '')}</b>`)}
    <div class="a" style="left:80px;right:80px;top:230px"><div class="big" style="font-size:72px">${hl(p.title)}</div>
      ${p.basis ? `<div style="font-size:26px;font-weight:600;color:${SKY};margin-top:24px">${esc(p.basis)}</div>` : ''}</div>
    <div class="a" style="left:80px;right:80px;top:540px">${(p.rows || []).map(x => `<div style="display:grid;grid-template-columns:400px 1fr;align-items:baseline;padding:34px 0;border-top:1.5px solid rgba(255,255,255,.2)"><div style="font-size:32px;font-weight:600;opacity:.75">${esc(x[0])}</div><div style="font-size:40px;font-weight:700;letter-spacing:-.02em">${esc(x[1])}</div></div>`).join('')}<div style="border-top:1.5px solid rgba(255,255,255,.2)"></div></div>
    ${p.note ? `<div class="a para" style="left:80px;right:80px;top:1010px;font-size:28px">${hl(p.note)}</div>` : ''}
    ${foot(p.foot)}`,
    { dim: `<div class="dim" style="background:rgba(5,7,11,.72)"></div>` }),
  // 3 MARKET DATA · 데이터: 검정 바탕 · 제목 · 의미 한 줄 · 다크 유리 카드(막대 비교 + 규모) · 출처 각주
  data: (r, i, p) => shell(r, i, p, `${head(r, `<b>${esc(r.topic || '')}</b>`)}
    <div class="a" style="left:80px;top:230px;right:80px"><div class="big" style="font-size:72px">${hl(p.title)}</div>
      ${p.sub ? `<div style="font-size:28px;opacity:.75;margin-top:24px;line-height:1.5">${hl(p.sub)}</div>` : ''}</div>
    <div class="a gc" style="left:80px;top:540px;width:520px;height:560px;padding:40px">
      <div style="font-size:27px;font-weight:700">${esc(p.chartTitle || '')}</div>
      <div style="position:absolute;left:40px;right:40px;bottom:60px;height:380px;display:flex;align-items:flex-end;justify-content:space-around">${(p.bars || []).map((b, k) => { const last = k === p.bars.length - 1; return `<div style="text-align:center;width:150px"><div class="${last ? 'sv' : ''}" style="font-size:44px;font-weight:700;margin-bottom:12px;${last ? '' : 'opacity:.55'}">${esc(b[1])}%</div><div style="height:${b[1] * 68}px;border-radius:16px 16px 0 0;background:${last ? `linear-gradient(180deg,#3E6BC4,${LB})` : 'rgba(255,255,255,.16)'}"></div><div style="font-size:22px;opacity:.6;margin-top:14px">${esc(b[0])}</div></div>`; }).join('')}</div></div>
    ${(p.tiles || []).slice(0, 1).map(t => `<div class="a gc" style="left:630px;top:540px;width:370px;height:560px;padding:40px;display:flex;flex-direction:column"><div style="font-size:27px;font-weight:700">${esc(t[0])}</div><div style="flex:1;display:flex;flex-direction:column;justify-content:center;padding-bottom:20px"><div class="sv" style="font-size:48px;font-weight:700;letter-spacing:-.03em;line-height:1.25">${esc(t[1]).replace(/\n/g, '<br>')}</div><div style="font-size:22px;opacity:.6;margin-top:22px;line-height:1.45">${esc(t[2] || '').replace(/\n/g, '<br>')}</div></div></div>`).join('')}
    ${foot(p.foot)}`,
    { dim: `<div class="dim" style="background:radial-gradient(120% 70% at 80% 0%,rgba(43,100,166,.18),rgba(5,7,11,0) 60%)"></div>` }),
  // 4 MARKET INSIGHT · 관전 포인트: 사진 · 아래 어둡게 · 제목 · 번호 + 키워드 + 짧은 설명 세 줄 · 아래 가운데 서명
  points: (r, i, p) => shell(r, i, p, `${head(r, `<b>${esc(r.topic || '')}</b>`)}
    <div class="a" style="left:80px;right:80px;top:${p.top || 470}px"><div class="big" style="font-size:64px">${hl(p.title)}</div>
      <div style="margin-top:48px">${(p.items || []).map((x, k) => `<div style="display:grid;grid-template-columns:90px 1fr;padding:28px 0;border-top:1.5px solid rgba(255,255,255,.2)"><div style="font-size:34px;font-weight:700;color:${SKY}">${String(k + 1).padStart(2, '0')}</div><div><div style="font-size:38px;font-weight:700;letter-spacing:-.02em">${esc(x[0])}</div><div style="font-size:27px;opacity:.75;margin-top:8px">${esc(x[1] || '')}</div></div></div>`).join('')}</div></div>
    <div class="a sig">${LOGO}</div>`,
    { dim: `<div class="dim" style="background:linear-gradient(180deg,rgba(5,7,11,.55) 0%,rgba(5,7,11,.45) 22%,rgba(5,7,11,.88) 45%,rgba(5,7,11,.96) 100%)"></div>` }),
  // 5 BRAND · 공통 엔딩: 사진 어둡게 · 가운데 두 줄 · 설명 · 유리 프로필 카드 · 팔로우 안내 · 위험 고지 · 로고
  // 2 일정 (예전 구성): 가운데 정렬 · 기준 표기 · 제목 · 날짜(연청)/내용 줄 · 유리 알약 + 가운데 문단 · 각주
  sched: (r, i, p) => shell(r, i, p, `${head(r, `<b>${esc(r.topic || '')}</b>`)}
    <div class="a" style="left:80px;right:80px;top:250px;text-align:center"><div class="cap" style="letter-spacing:.08em">${esc(p.cap || '')}</div>
      <div class="big" style="font-size:64px;margin-top:22px">${hl(p.title)}</div></div>
    <div class="a" style="left:80px;right:80px;top:505px;text-align:center">${(p.rows || []).map(x => `<div style="padding:22px 0;border-top:1.5px solid rgba(255,255,255,.18)"><div style="font-size:26px;font-weight:600;color:${SKY}">${esc(x[0])}</div><div style="font-size:40px;font-weight:700;margin-top:8px;letter-spacing:-.02em">${esc(x[1])}</div></div>`).join('')}<div style="border-top:1.5px solid rgba(255,255,255,.18)"></div></div>
    ${p.note ? `<div class="a" style="left:0;right:0;top:${p.noteTop || 965}px;display:flex;justify-content:center"><div class="glass" style="padding:14px 36px;font-size:26px;font-weight:700;color:${SKY}">${esc(p.noteLabel || '참고')}</div></div>
      <div class="a para" style="left:110px;right:110px;top:${(p.noteTop || 965) + 88}px;text-align:center;font-size:29px">${hl(p.note)}</div>` : ''}
    ${(p.foot || []).length ? `<div class="a" style="left:80px;right:80px;bottom:140px;text-align:center;font-size:22px;line-height:1.65;opacity:.55">${p.foot.map(esc).join('<br>')}</div>` : ''}`,
    { dim: p.photo ? `<div class="dim" style="background:rgba(5,7,11,.66)"></div>` : `<div class="dim" style="background:radial-gradient(120% 70% at 80% 0%,rgba(43,100,166,.18),rgba(5,7,11,0) 60%)"></div>` }),
  // 4 관전 포인트 (예전 구성): 위 사진 · 계정 줄 · 소제목 · 제목 · 연청 강조 줄 · 문단 (세 항목은 짧은 줄로) · 아래 가운데 로고
  essay: (r, i, p) => shell(r, i, p, `${head(r, `<b>${esc(r.topic || '')}</b>`)}
    <div class="a" style="left:80px;right:80px;top:${p.top || 560}px">
      <div style="display:flex;align-items:center;gap:20px;font-size:24px;opacity:.8"><span>@orbis.securities</span><i style="flex:1;height:1.5px;background:rgba(255,255,255,.45)"></i></div>
      ${p.kicker ? `<div class="kick" style="margin-top:34px">${esc(p.kicker)}</div>` : ''}
      <div class="big" style="font-size:64px;margin-top:${p.kicker ? 14 : 36}px">${hl(p.title)}</div>
      ${p.quote ? `<div style="font-size:32px;font-weight:600;color:${SKY};margin-top:30px;line-height:1.55">${hl(p.quote)}</div>` : ''}
      ${p.body ? `<div class="para" style="margin-top:34px;line-height:1.7">${hl(p.body)}</div>` : ''}
      ${(p.items || []).length ? `<div style="margin-top:30px">${p.items.map(x => `<div class="para" style="font-size:29px;margin-top:10px"><b style="color:${SKY};font-weight:700">${esc(x[0])}</b><span style="opacity:.6"> · </span>${esc(x[1] || '')}</div>`).join('')}</div>` : ''}</div>
    <div class="a sig">${LOGO}</div>`,
    { dim: `<div class="dim" style="background:linear-gradient(180deg,rgba(5,7,11,.5) 0%,rgba(5,7,11,.3) 25%,rgba(5,7,11,.85) 50%,rgba(5,7,11,.95) 100%)"></div>` }),
  // 2 일정 v2 (2026-11-26 피드백): 상태·시간을 크게 · 한국/미국 날짜 구분 · 알약 없음 · 정규장 시간 표시
  // blocks: [{ status, time, lines:[...], chip }]
  times: (r, i, p) => shell(r, i, p, `${head(r, `<b>${esc(r.topic || '')}</b>`)}
    <div class="a" style="left:80px;right:80px;top:200px"><div class="big" style="font-size:68px">${hl(p.title)}</div>
      ${p.basis ? `<div style="font-size:26px;font-weight:600;opacity:.6;margin-top:22px">${esc(p.basis)}</div>` : ''}</div>
    <div class="a" style="left:80px;right:80px;top:${p.top || 470}px">${(p.blocks || []).map(b => `<div style="display:grid;grid-template-columns:270px 1fr;padding:40px 0;border-top:1.5px solid rgba(255,255,255,.2)">
      <div style="font-size:50px;font-weight:700;letter-spacing:-.03em;color:${SKY};line-height:1.15">${esc(b.status)}</div>
      <div><div style="font-size:54px;font-weight:700;letter-spacing:-.03em;line-height:1.1">${esc(b.time)}</div>
        ${(b.lines || []).map((l, k) => `<div style="font-size:26px;margin-top:${k ? 6 : 18}px;opacity:${k ? .6 : .85};font-weight:500">${esc(l)}</div>`).join('')}
        ${b.chip ? `<div style="display:inline-block;margin-top:20px;padding:10px 22px;border-radius:999px;border:1.5px solid rgba(143,176,234,.45);font-size:24px;font-weight:600;color:${SKY}">${esc(b.chip)}</div>` : ''}</div></div>`).join('')}<div style="border-top:1.5px solid rgba(255,255,255,.2)"></div></div>
    ${p.note ? `<div class="a para" style="left:80px;right:80px;bottom:${p.noteBottom || 200}px;font-size:28px;opacity:.85">${hl(p.note)}</div>` : ''}
    ${foot(p.foot)}`,
    { dim: `<div class="dim" style="background:radial-gradient(120% 70% at 80% 0%,rgba(43,100,166,.18),rgba(5,7,11,0) 60%)"></div>` }),
  // 3 데이터 v2 (2026-11-26 피드백): 박스 없이 큰 수치 · 가로 막대 비교 · 규모 한 줄을 한 흐름으로
  figure: (r, i, p) => shell(r, i, p, `${head(r, `<b>${esc(r.topic || '')}</b>`)}
    <div class="a" style="left:80px;right:80px;top:200px"><div class="big" style="font-size:68px">${hl(p.title)}</div>
      ${p.sub ? `<div style="font-size:27px;opacity:.7;margin-top:22px;line-height:1.5">${hl(p.sub)}</div>` : ''}</div>
    <div class="a" style="left:80px;right:80px;top:${p.top || 500}px">
      <div style="font-size:26px;font-weight:600;opacity:.75">${esc(p.label || '')}</div>
      <div style="display:flex;align-items:baseline;gap:28px;margin-top:6px"><div class="sv" style="font-size:190px;font-weight:700;letter-spacing:-.05em;line-height:1">${esc(p.value || '')}</div>
        <div style="font-size:27px;opacity:.75;line-height:1.45;padding-bottom:18px">${hl(p.valueNote || '')}</div></div>
      <div style="margin-top:44px">${(p.bars || []).map((b, k, a) => { const mx = Math.max(...a.map(x => x[1])); const last = k === a.length - 1; return `<div style="display:grid;grid-template-columns:170px 1fr 110px;align-items:center;gap:20px;margin-top:${k ? 18 : 0}px"><div style="font-size:24px;opacity:${last ? .9 : .6}">${esc(b[0])}</div><div style="height:18px;border-radius:9px;background:rgba(255,255,255,.08)"><div style="height:100%;width:${b[1] / mx * 100}%;border-radius:9px;background:${last ? LB : 'rgba(255,255,255,.32)'}"></div></div><div style="font-size:30px;font-weight:700;text-align:right;${last ? '' : 'opacity:.6'}">${esc(b[1])}%</div></div>`; }).join('')}</div>
      ${p.row ? `<div style="display:flex;justify-content:space-between;align-items:baseline;margin-top:54px;padding-top:30px;border-top:1.5px solid rgba(255,255,255,.2)"><div style="font-size:27px;opacity:.75">${esc(p.row[0])}</div><div style="font-size:44px;font-weight:700;letter-spacing:-.02em">${esc(p.row[1])}</div></div>` : ''}</div>
    ${foot(p.foot)}`,
    { dim: `<div class="dim" style="background:radial-gradient(120% 70% at 80% 0%,rgba(43,100,166,.18),rgba(5,7,11,0) 60%)"></div>` }),
  // 2 일정 v3 (2026-11-26): 예전 가운데 구조 유지 · 상태·시간을 크게 · 위 한국 날짜(연청) · 아래 미국 현지(회색) · 알약 없음
  sched2: (r, i, p) => shell(r, i, p, `${head(r, `<b>${esc(r.topic || '')}</b>`)}
    <div class="a" style="left:80px;right:80px;top:210px;text-align:center"><div style="font-size:27px;font-weight:600;opacity:.65">${esc(p.cap || '')}</div>
      <div class="big" style="font-size:68px;margin-top:22px">${hl(p.title)}</div></div>
    <div class="a" style="left:80px;right:80px;top:${p.top || 470}px;text-align:center">${(p.rows || []).map(x => `<div style="padding:${p.rowPad || 24}px 0;border-top:1.5px solid rgba(255,255,255,.18)"><div style="font-size:${p.dateSize || 26}px;font-weight:600;color:${SKY}">${esc(x[0])}</div><div style="font-size:${p.bigSize || 48}px;font-weight:700;margin-top:10px;letter-spacing:-.03em;line-height:1.15">${esc(x[1])}</div>${x[2] ? `<div style="font-size:${p.subSize || 24}px;opacity:.6;margin-top:12px;font-weight:500">${esc(x[2])}</div>` : ''}</div>`).join('')}<div style="border-top:1.5px solid rgba(255,255,255,.18)"></div></div>
    ${p.note ? `<div class="a para" style="left:110px;right:110px;bottom:${p.noteBottom || 210}px;text-align:center;font-size:29px;line-height:1.65;opacity:.85">${hl(p.note)}</div>` : ''}
    ${(p.foot || []).length ? `<div class="a" style="left:80px;right:80px;bottom:140px;text-align:center;font-size:22px;line-height:1.65;opacity:.55">${p.foot.map(esc).join('<br>')}</div>` : ''}`,
    { dim: `<div class="dim" style="background:radial-gradient(120% 70% at 80% 0%,rgba(43,100,166,.18),rgba(5,7,11,0) 60%)"></div>` }),
  // 3 데이터 v3 (2026-11-26 사용자 레퍼): 박스 없음 · 이름 · 강조 수치 · 설명 · 세로 막대(바닥선) · 규모 한 줄
  chart: (r, i, p) => shell(r, i, p, `${head(r, `<b>${esc(r.topic || '')}</b>`)}
    <div class="a" style="left:80px;right:80px;top:200px"><div class="big" style="font-size:68px">${hl(p.title)}</div>
      ${p.sub ? `<div style="font-size:27px;opacity:.7;margin-top:22px;line-height:1.5">${hl(p.sub)}</div>` : ''}</div>
    <div class="a" style="left:80px;right:80px;top:${p.top || 500}px">
      <div style="font-size:28px;font-weight:700">${esc(p.label || '')}</div>
      <div style="font-size:76px;font-weight:700;letter-spacing:-.04em;color:${SKY};line-height:1;margin-top:12px">${esc(p.value || '')}</div>
      <div style="font-size:24px;opacity:.6;margin-top:12px">${esc(p.valueNote || '')}</div>
      <div style="position:relative;height:${p.chartH || 330}px;margin-top:20px;border-bottom:2px solid rgba(255,255,255,.35);display:flex;justify-content:space-around;align-items:flex-end">${(p.bars || []).map((b, k, a) => { const mx = Math.max(...a.map(x => x[1])); const last = k === a.length - 1; return `<div style="width:220px;text-align:center"><div style="font-size:36px;font-weight:600;margin-bottom:12px;${last ? '' : 'opacity:.75'}">${esc(b[1])}%</div><div style="height:${Math.round(b[1] / mx * ((p.chartH || 330) - 90))}px;background:${last ? LB : '#6E7682'}"></div></div>`; }).join('')}</div>
      <div style="display:flex;justify-content:space-around;margin-top:18px">${(p.bars || []).map(b => `<div style="width:220px;text-align:center;font-size:28px;font-weight:500;opacity:.85">${esc(b[0])}</div>`).join('')}</div>
      ${p.row ? `<div style="display:flex;justify-content:space-between;align-items:baseline;margin-top:34px;padding-top:24px;border-top:1.5px solid rgba(255,255,255,.2)"><div style="font-size:27px;opacity:.75">${esc(p.row[0])}</div><div style="font-size:40px;font-weight:700;letter-spacing:-.02em">${esc(p.row[1])}</div></div>` : ''}</div>
    ${foot(p.foot)}`,
    { dim: `<div class="dim" style="background:radial-gradient(120% 70% at 80% 0%,rgba(43,100,166,.18),rgba(5,7,11,0) 60%)"></div>` }),
  // 2 일정 v4 (2026-11-26 "디자인 별로" → 잡지형): 큰 날짜 두 칸 + 단축 거래시간 막대
  // days:[{ month, day, dow, status, time, us }], bar:{ label, start, end, full, cut, endLabel, fullLabel, dur }
  tl: (r, i, p) => shell(r, i, p, `${head(r, `<b>${esc(r.topic || '')}</b>`)}
    <div class="a" style="left:80px;right:80px;top:200px"><div class="big" style="font-size:68px">${hl(p.title)}</div>
      ${p.basis ? `<div style="font-size:25px;font-weight:600;opacity:.55;margin-top:22px">${esc(p.basis)}</div>` : ''}</div>
    <div class="a" style="left:80px;right:80px;top:${p.top || 480}px;display:grid;grid-template-columns:1fr 1fr;border-top:1.5px solid rgba(255,255,255,.2)">${(p.days || []).map((d, k) => `<div style="padding:34px 0 0 ${k ? 44 : 0}px;${k ? 'border-left:1.5px solid rgba(255,255,255,.2)' : ''}">
      <div style="font-size:24px;font-weight:600;color:${SKY}">${esc(d.month)}</div>
      <div style="display:flex;align-items:baseline;gap:14px;margin-top:4px"><div class="sv" style="font-size:150px;font-weight:700;letter-spacing:-.05em;line-height:1">${esc(d.day)}</div><div style="font-size:32px;font-weight:600;opacity:.7">${esc(d.dow)}</div></div>
      <div style="font-size:44px;font-weight:700;letter-spacing:-.03em;margin-top:14px">${esc(d.status)}</div>
      ${d.time ? `<div style="font-size:30px;font-weight:600;margin-top:6px">${esc(d.time)}</div>` : ''}
      <div style="font-size:22px;opacity:.5;margin-top:10px">${esc(d.us)}</div></div>`).join('')}</div>
    ${p.bar ? (() => { const b = p.bar, W = 920, x = v => (v - b.start) / (b.full - b.start) * W; return `<div class="a" style="left:80px;width:920px;top:${p.barTop || 960}px">
      <div style="display:flex;justify-content:space-between;align-items:baseline"><div style="font-size:24px;font-weight:600;opacity:.75">${esc(b.label)}</div><div style="font-size:30px;font-weight:700;color:${SKY}">${esc(b.dur)}</div></div>
      <div style="position:relative;height:16px;margin-top:20px;border-radius:8px;background:rgba(255,255,255,.12)"><div style="position:absolute;left:0;top:0;bottom:0;width:${x(b.cut)}px;border-radius:8px;background:linear-gradient(90deg,${LB},${SKY})"></div></div>
      <div style="position:relative;height:34px;margin-top:12px;font-size:22px">
        <div style="position:absolute;left:0">${esc(b.startLabel)}</div>
        <div style="position:absolute;left:${x(b.cut)}px;transform:translateX(-50%);color:${SKY};font-weight:600">${esc(b.cutLabel)}</div>
        <div style="position:absolute;right:0;opacity:.5">${esc(b.fullLabel)}</div></div></div>`; })() : ''}
    ${foot(p.foot)}`,
    { dim: `<div class="dim" style="background:radial-gradient(120% 70% at 80% 0%,rgba(43,100,166,.18),rgba(5,7,11,0) 60%)"></div>` }),
  // 3 데이터 v4: 세로 막대(가늘게 · 위 값 크게) + 오른쪽 증가 폭 + 아래 규모 큰 수치
  chart2: (r, i, p) => shell(r, i, p, `${head(r, `<b>${esc(r.topic || '')}</b>`)}
    <div class="a" style="left:80px;right:80px;top:200px"><div class="big" style="font-size:68px">${hl(p.title)}</div>
      ${p.sub ? `<div style="font-size:29px;opacity:.75;margin-top:26px;line-height:1.6">${hl(p.sub)}</div>` : ''}</div>
    <div class="a" style="left:80px;right:80px;top:${p.top || 500}px">
      <div style="font-size:26px;font-weight:600;opacity:.75">${esc(p.label || '')}</div>
      <div style="position:relative;height:${p.chartH || 360}px;margin-top:10px;border-bottom:1.5px solid rgba(255,255,255,.3)">
        ${(p.bars || []).map((b, k, a) => { const mx = Math.max(...a.map(x => x[1])); const last = k === a.length - 1; const h = Math.round(b[1] / mx * ((p.chartH || 360) - 120)); const L = p.center ? (920 - a.length * 220 - (a.length - 1) * (p.gap || 80)) / 2 + k * (220 + (p.gap || 80)) : 10 + k * 260; return `<div style="position:absolute;bottom:0;left:${L}px;width:220px;text-align:center"><div class="${last ? 'sv' : ''}" style="font-size:${last ? 64 : 42}px;font-weight:700;letter-spacing:-.03em;margin-bottom:14px;${last ? '' : 'opacity:.55'}">${esc(b[1])}%</div><div style="height:${h}px;width:150px;margin:0 auto;border-radius:12px 12px 0 0;background:${last ? `linear-gradient(180deg,${SKY},${LB})` : 'rgba(255,255,255,.16)'}"></div></div>`; }).join('')}
        ${p.delta ? `<div style="position:absolute;right:0;bottom:30px;text-align:right"><div style="font-size:60px;font-weight:700;color:${SKY};letter-spacing:-.03em">${esc(p.delta)}</div><div style="font-size:23px;opacity:.6;margin-top:8px;line-height:1.45">${hl(p.deltaNote || '')}</div></div>` : ''}</div>
      <div style="position:relative;height:44px;margin-top:16px;font-size:27px">${(p.bars || []).map((b, k, a) => `<div style="position:absolute;left:${p.center ? (920 - a.length * 220 - (a.length - 1) * (p.gap || 80)) / 2 + k * (220 + (p.gap || 80)) : 10 + k * 260}px;width:220px;text-align:center;opacity:${k === p.bars.length - 1 ? .9 : .55}">${esc(b[0])}</div>`).join('')}</div>
      ${p.row ? `<div style="margin-top:34px;padding-top:30px;border-top:1.5px solid rgba(255,255,255,.2);display:flex;justify-content:space-between;align-items:center"><div style="font-size:27px;font-weight:600;opacity:.75;line-height:1.5">${hl(p.row[0])}</div><div class="${p.rowSize ? '' : 'sv'}" style="font-size:${p.rowSize || 60}px;font-weight:700;letter-spacing:-.02em;line-height:1">${esc(p.row[1])}</div></div>` : ''}</div>
    ${foot(p.foot)}`,
    { dim: `<div class="dim" style="background:radial-gradient(120% 70% at 80% 0%,rgba(43,100,166,.18),rgba(5,7,11,0) 60%)"></div>` }),
  // 2 일정 달력형 (2026-11-26): 한 주 달력 · 휴장/조기 폐장 칸 표시 · 27~28일 걸친 거래시간 막대 · 아래 설명 두 줄
  // days:[[요일, 날짜, 표시(''|'off'|'short'), 칸 아래 글]], span:{ from, to, label } (칸 번호), items:[[점 색 off|short, 굵은 글, 설명]]
  week: (r, i, p) => shell(r, i, p, `${head(r, `<b>${esc(r.topic || '')}</b>`)}
    <div class="a" style="left:80px;right:80px;top:200px"><div class="big" style="font-size:68px">${hl(p.title)}</div>
      ${p.basis ? `<div style="font-size:27px;font-weight:600;opacity:.6;margin-top:22px">${esc(p.basis)}</div>` : ''}</div>
    <div class="a" style="left:80px;width:920px;top:${p.top || 470}px">
      <div style="font-size:26px;font-weight:600;opacity:.75;margin-bottom:18px">${esc(p.month || '')}</div>
      <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:8px">${(p.days || []).map(d => { const off = d[2] === 'off', sh = d[2] === 'short';
        return `<div style="height:${p.cellH || 180}px;border-radius:18px;padding:18px 0;text-align:center;${off ? `background:rgba(255,255,255,.05);border:2px solid ${SKY}` : sh ? `background:linear-gradient(180deg,rgba(143,176,234,.28),rgba(43,100,166,.28));border:2px solid rgba(143,176,234,.5)` : 'background:rgba(255,255,255,.04);border:1.5px solid rgba(255,255,255,.08)'}">
          <div style="font-size:22px;font-weight:600;opacity:${off || sh ? .9 : .45}">${esc(d[0])}</div>
          <div style="font-size:50px;font-weight:700;letter-spacing:-.03em;margin-top:10px;${off || sh ? '' : 'opacity:.45'}">${esc(d[1])}</div>
          ${d[3] ? `<div style="font-size:22px;font-weight:700;margin-top:12px;color:${SKY}">${esc(d[3])}</div>` : ''}</div>`; }).join('')}</div>
      ${p.span ? (() => { const c = (920 - 6 * 8) / 7, x0 = p.span.from * (c + 8) + c * .5, x1 = p.span.to * (c + 8) + c * .5; return `<div style="position:relative;height:64px;margin-top:16px"><div style="position:absolute;left:${x0}px;width:${x1 - x0}px;top:0;height:8px;border-radius:4px;background:linear-gradient(90deg,${LB},${SKY})"></div><div style="position:absolute;left:${x0 - 7}px;top:-3px;width:14px;height:14px;border-radius:50%;background:${LB}"></div><div style="position:absolute;left:${x1 - 7}px;top:-3px;width:14px;height:14px;border-radius:50%;background:${SKY}"></div><div style="position:absolute;left:${(x0 + x1) / 2}px;transform:translateX(-50%);white-space:nowrap;top:24px;font-size:26px;font-weight:700;color:${SKY}">${esc(p.span.label)}</div></div>`; })() : ''}</div>
    <div class="a" style="left:80px;right:80px;top:${p.itemsTop || 830}px">${(p.items || []).map(x => `<div style="display:grid;grid-template-columns:34px 1fr;padding:24px 0;border-top:1.5px solid rgba(255,255,255,.16)"><i style="width:16px;height:16px;border-radius:5px;margin-top:12px;display:block;${x[0] === 'off' ? `border:2.5px solid ${SKY}` : `background:${SKY}`}"></i><div><div style="font-size:34px;font-weight:700;letter-spacing:-.02em">${esc(x[1])}</div><div style="font-size:27px;opacity:.65;margin-top:8px">${esc(x[2])}</div></div></div>`).join('')}</div>
    ${foot(p.foot)}`,
    { dim: `<div class="dim" style="background:radial-gradient(120% 70% at 80% 0%,rgba(43,100,166,.18),rgba(5,7,11,0) 60%)"></div>` }),
  // 2 일정 달력형 v2: 박스 없는 한 줄 달력 · 휴장=테두리 원 · 조기 폐장=채운 원 → 다음날 작은 원으로 이어짐 · 아래 두 칸 설명
  // days:[[요일, 날짜, ''|'off'|'open'|'close', 아래 글]], cols:[{ label, big, lines:[] }]
  week2: (r, i, p) => shell(r, i, p, `${head(r, `<b>${esc(r.topic || '')}</b>`)}
    <div class="a" style="left:80px;right:80px;top:200px"><div class="big" style="font-size:68px">${hl(p.title)}</div>
      ${p.basis ? `<div style="font-size:27px;font-weight:600;opacity:.6;margin-top:22px">${esc(p.basis)}</div>` : ''}</div>
    ${(() => { const days = p.days || [], c = 920 / days.length, oi = days.findIndex(d => d[2] === 'open'), ci = days.findIndex(d => d[2] === 'close'), T = p.top || 480;
      return `<div class="a" style="left:80px;width:920px;top:${T}px">
      <div style="display:flex;justify-content:space-between;align-items:baseline;padding-bottom:20px;border-bottom:1.5px solid rgba(255,255,255,.2)"><div style="font-size:27px;font-weight:700">${esc(p.month || '')}</div><div style="font-size:23px;opacity:.5">${esc(p.monthNote || '')}</div></div>
      <div style="position:relative;height:290px">
        ${oi >= 0 && ci >= 0 ? `<div style="position:absolute;left:${(oi + .5) * c}px;width:${(ci - oi) * c}px;top:${92 + 52 - 2}px;height:4px;background:linear-gradient(90deg,${SKY},rgba(143,176,234,.5))"></div>` : ''}
        ${days.map((d, k) => { const t = d[2], on = !!t; const circ = t === 'off' ? `border:3px solid ${SKY};color:#fff` : t === 'open' ? `background:linear-gradient(160deg,${SKY},${LB});color:#fff` : t === 'close' ? `background:#05070B;border:3px solid rgba(143,176,234,.6);color:#fff` : 'opacity:.38';
          return `<div style="position:absolute;left:${k * c}px;width:${c}px;top:0;text-align:center">
          <div style="font-size:23px;font-weight:600;margin-top:34px;opacity:${on ? .85 : .4}">${esc(d[0])}</div>
          <div style="width:104px;height:104px;margin:14px auto 0;border-radius:50%;display:grid;place-items:center;font-size:46px;font-weight:700;letter-spacing:-.03em;position:relative;${circ}">${esc(d[1])}</div>
          ${d[3] ? `<div style="font-size:24px;font-weight:700;margin-top:16px;color:${SKY};line-height:1.35">${esc(d[3]).replace(/\n/g, '<br>')}</div>` : ''}</div>`; }).join('')}</div>
      <div style="border-top:1.5px solid rgba(255,255,255,.2)"></div></div>`; })()}
    <div class="a" style="left:80px;right:80px;top:${p.colsTop || 820}px;display:grid;grid-template-columns:1fr 1fr">${(p.cols || []).map((x, k) => `<div style="padding:${k ? '0 0 0 44px' : '0 30px 0 0'};${k ? 'border-left:1.5px solid rgba(255,255,255,.2)' : ''}">
      <div style="font-size:25px;font-weight:600;color:${SKY}">${esc(x.label)}</div>
      <div style="font-size:52px;font-weight:700;letter-spacing:-.03em;margin-top:10px">${esc(x.big)}</div>
      ${(x.lines || []).length ? `<div style="font-size:27px;margin-top:14px;opacity:.75;line-height:1.55">${x.lines.map(esc).join('<br>')}</div>` : ''}</div>`).join('')}</div>
    ${foot(p.foot)}`,
    { dim: `<div class="dim" style="background:radial-gradient(120% 70% at 80% 0%,rgba(43,100,166,.18),rgba(5,7,11,0) 60%)"></div>` }),
  // 2 일정 잡지형 (2026-11-26 "AI 티" → 장식 없이 글자로만): 가는 큰 날짜 숫자 · 굵은 상태 · 한 줄 시간 · 가는 선
  // rows:[{ mon, day, dow, status, time, sub }]
  digits: (r, i, p) => shell(r, i, p, `${head(r, `<b>${esc(r.topic || '')}</b>`)}
    <div class="a" style="left:80px;right:80px;top:200px"><div class="big" style="font-size:68px">${hl(p.title)}</div>
      ${p.basis ? `<div style="font-size:27px;font-weight:500;opacity:.6;margin-top:22px">${esc(p.basis)}</div>` : ''}</div>
    <div class="a" style="left:80px;right:80px;top:${p.top || 480}px">${(p.rows || []).map(x => `<div style="display:grid;grid-template-columns:300px 1fr;align-items:center;padding:36px 0;border-top:1px solid rgba(255,255,255,.28)">
      <div><div style="font-size:24px;font-weight:500;opacity:.6">${esc(x.mon)} · ${esc(x.dow)}</div><div style="font-size:176px;font-weight:300;letter-spacing:-.06em;line-height:.9;margin-top:6px">${esc(x.day)}</div></div>
      <div><div style="font-size:58px;font-weight:700;letter-spacing:-.03em">${esc(x.status)}</div>
        ${x.time ? `<div style="font-size:31px;font-weight:600;color:${SKY};margin-top:12px">${esc(x.time)}</div>` : ''}
        <div style="font-size:27px;opacity:.65;margin-top:10px">${esc(x.sub || '')}</div></div></div>`).join('')}<div style="border-top:1px solid rgba(255,255,255,.28)"></div></div>
    ${foot(p.foot)}`,
    { dim: p.photo ? `<div class="dim" style="background:linear-gradient(180deg,rgba(5,7,11,.72),rgba(5,7,11,.88) 40%,rgba(5,7,11,.95))"></div>` : '' }),
  // 2 일정 월간 달력 (2026-11-26 "달력인데 AI 티 없이"): 실제 플래너처럼 가는 선 격자 · 칸 왼쪽 위 날짜 · 표시는 단색 칠만
  // year, month(1~12), marks:{ 날짜: { kind:'off'|'on'|'soft', text } }, items:[[kind, 굵은 글, 설명]]
  month: (r, i, p) => shell(r, i, p, `${head(r, `<b>${esc(r.topic || '')}</b>`)}
    <div class="a" style="left:80px;right:80px;top:200px"><div class="big" style="font-size:68px">${hl(p.title)}</div>
      ${p.basis ? `<div style="font-size:27px;font-weight:500;opacity:.6;margin-top:22px">${esc(p.basis)}</div>` : ''}</div>
    ${(() => { const y = p.year, m = p.month, first = new Date(Date.UTC(y, m - 1, 1)).getUTCDay(), n = new Date(Date.UTC(y, m, 0)).getUTCDate(), cells = [];
      for (let k = 0; k < first; k++) cells.push(0); for (let d = 1; d <= n; d++) cells.push(d); while (cells.length % 7) cells.push(0);
      if (p.week) { const r0 = cells.indexOf(p.week); cells.splice(0, r0 - r0 % 7); cells.length = 7; }
      const RH = p.rowH || 96, mk = p.marks || {}, LN = 'rgba(255,255,255,.14)';
      return `<div class="a" style="left:80px;width:920px;top:${p.top || 455}px">
      <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:16px"><div style="font-size:30px;font-weight:700">${m}월</div><div style="font-size:24px;font-weight:500;opacity:.6">${esc(p.monthNote || y)}</div></div>
      <div style="display:grid;grid-template-columns:repeat(7,1fr);border-top:1.5px solid rgba(255,255,255,.5)">${['일', '월', '화', '수', '목', '금', '토'].map(w => `<div style="font-size:21px;font-weight:600;opacity:.5;padding:12px 12px">${w}</div>`).join('')}</div>
      <div style="display:grid;grid-template-columns:repeat(7,1fr);border-top:1px solid ${LN}">${cells.map((d, k) => { const x = mk[d]; const bg = x ? (x.kind === 'on' ? `background:${SKY};color:#05070B` : x.kind === 'soft' ? 'background:rgba(143,176,234,.09);box-shadow:inset 0 0 0 1px rgba(143,176,234,.35)' : `box-shadow:inset 0 0 0 2px ${SKY}`) : '';
        return `<div style="height:${RH}px;padding:${p.cellPad || '10px 12px'};border-bottom:1px solid ${LN};${k % 7 ? `border-left:1px solid ${LN};` : ''}${bg}">${d ? `<div style="font-size:${p.numSize || 26}px;font-weight:${x ? 700 : 500};letter-spacing:-.02em;${x ? '' : 'opacity:.45'}">${d}</div>${x ? `<div style="font-size:${p.tagSize || 19}px;font-weight:700;margin-top:6px;line-height:1.25;${x.kind === 'on' ? '' : `color:${SKY}`}">${esc(x.text).replace(/\n/g, '<br>')}</div>` : ''}` : ''}</div>`; }).join('')}</div></div>`; })()}
    <div class="a" style="left:80px;right:80px;top:${p.itemsTop || 1010}px">${(p.items || []).map(x => `<div style="display:grid;grid-template-columns:40px 1fr;align-items:baseline;margin-top:14px"><i style="width:20px;height:20px;display:block;transform:translateY(3px);${x[0] === 'on' ? `background:${SKY}` : `box-shadow:inset 0 0 0 2px ${SKY}`}"></i><div style="font-size:28px;line-height:1.45"><b style="font-weight:700">${esc(x[1])}</b><span style="opacity:.6"> · ${esc(x[2])}</span></div></div>`).join('')}</div>
    ${foot(p.foot)}`,
    { dim: `<div class="dim" style="background:radial-gradient(120% 70% at ${p.glowAt || '15% 100%'},rgba(43,100,166,.18),rgba(5,7,11,0) 60%)"></div>` }),
  end: (r, i, p) => shell(r, i, p, `<div class="a" style="left:80px;right:80px;top:${p.top || 300}px;text-align:center"><div class="big" style="font-size:76px">${hl(p.title)}</div>
      ${p.sub ? `<div style="font-size:30px;opacity:.85;margin-top:30px;line-height:1.6">${hl(p.sub)}</div>` : ''}</div>
    <div class="a" style="left:0;right:0;top:${p.cardTop || 720}px;display:flex;justify-content:center"><div class="glass" style="width:840px;display:flex;align-items:center;gap:32px;padding:26px;border-radius:999px">
      <div style="width:112px;height:112px;border-radius:50%;background:#fff;display:grid;place-items:center;flex:none"><div style="width:80px">${LOGO.replace('<svg', `<svg style="width:80px;height:auto"`).replace(/<style>[\s\S]*?<\/style>/, `<style>*{fill:${MC}!important}</style>`)}</div></div>
      <div style="flex:1"><div style="font-size:36px;font-weight:700;letter-spacing:-.01em">@orbis.securities</div><div style="font-size:25px;opacity:.8;margin-top:8px">오르비스 시큐리티즈</div></div>
      <div style="width:84px;height:84px;margin-right:14px;border-radius:50%;border:1.5px solid rgba(255,255,255,.35);display:grid;place-items:center;flex:none"><svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path style="fill:none!important" d="M9 5l7 7-7 7"/></svg></div></div></div>
    ${p.cta ? `<div class="a" style="left:80px;right:80px;top:${(p.cardTop || 720) + 210}px;text-align:center;font-size:29px;opacity:.85">${hl(p.cta)}</div>` : ''}
    <div class="a risk" style="left:0;right:0;text-align:center;bottom:150px">${RISK}</div>
    <div class="a sig">${LOGO}</div>`,
    { dim: `<div class="dim" style="background:rgba(5,7,11,.62)"></div>`, noPn: true }),
};
export const magPages = r => (r.pages || []).map((p, i) => (T[p.type] || T.points)(r, i, p));
