// 인스타 온보딩 카드 틀 (2026-11-26 사용자: GPT 시안 톤 · 그림은 이미지 자산, 글자는 HTML)
// 장 종류: cover · info · number · steps · compare · summary  (1080×1350)
// req = { layout:'onb', ep:'01', total:6, pages:[{ type, scene?, label?, title, sub?, rows?, num?, items?, cols? }], risk? }
//   scene = 글자 없는 장면 이미지 경로(렌더러 기준 상대 경로 · http · data) · 없으면 남흑색 바탕만 (CSS로 물체를 그리지 않음)
import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const FONT = 'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css';
const INTER = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap';
const LOGO = readFileSync(join(here, '..', 'templates', 'orbis-logo-white.svg'), 'utf8').replace(/<\?xml[^>]*>/, '');
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const br = s => esc(s).replace(/\n/g, '<br>');
const src = p => !p ? '' : /^(https?|file|data):/.test(p) ? p : pathToFileURL(resolve(here, '..', p)).href;
const RISK = '*거래에는 손실 위험이 있습니다. 이용약관이 적용됩니다.';

const CSS = `<link rel="stylesheet" href="${FONT}"><link rel="stylesheet" href="${INTER}"><style>
*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1350px;overflow:hidden;background:#05070b;color:#F5F6F8;font-family:'Pretendard Variable',Pretendard,'Noto Sans KR',sans-serif;-webkit-font-smoothing:antialiased;word-break:keep-all}
.a{position:absolute}.en{font-family:Inter,'Pretendard Variable',sans-serif}
.scene{position:absolute;inset:0;width:1080px;height:1350px;object-fit:cover}
.shade{position:absolute;left:0;right:0;top:0;height:720px;background:linear-gradient(180deg,rgba(5,7,11,.88) 0%,rgba(5,7,11,.55) 55%,rgba(5,7,11,0) 100%)}
.shadeL{position:absolute;left:0;top:0;bottom:0;width:980px;background:linear-gradient(90deg,rgba(5,7,11,.94) 0%,rgba(5,7,11,.82) 45%,rgba(5,7,11,.4) 75%,rgba(5,7,11,0) 100%)}
.lg{left:80px;top:80px;width:190px}.lg svg{width:100%;height:auto;display:block}.lg svg *{fill:#fff!important}
.pno{right:80px;top:92px;font:500 24px Inter,sans-serif;letter-spacing:.06em;color:rgba(245,246,248,.55)}
.lab{font:500 26px Inter,'Pretendard Variable',sans-serif;color:rgba(245,246,248,.72);letter-spacing:.01em}
.ttl{font-weight:500;letter-spacing:-.03em;line-height:1.16;color:#F5F6F8}
.sub{font-size:30px;line-height:1.55;color:rgba(245,246,248,.62)}
.rule{height:2px;width:56px;background:#2B64A6;margin-top:30px}
.rows{width:560px}.rows div{display:grid;grid-template-columns:220px 1fr;padding:20px 0;border-bottom:1px solid rgba(245,246,248,.14);font-size:27px}.rows span{color:rgba(245,246,248,.55)}
.huge{font:600 300px/.86 Inter,sans-serif;letter-spacing:-.055em;background:linear-gradient(180deg,#FFFFFF 0%,#C3CFE0 55%,#7D91B0 100%);-webkit-background-clip:text;background-clip:text;color:transparent}
.list div{display:flex;justify-content:space-between;width:420px;padding:16px 0;border-bottom:1px solid rgba(245,246,248,.14);font-size:27px}.list span{font:500 21px Inter,sans-serif;color:rgba(245,246,248,.45);padding-top:5px}
.steps div{display:flex;align-items:center;gap:22px;width:430px;padding:20px 0;border-bottom:1px solid rgba(245,246,248,.12);font-size:30px}
.ck{width:34px;height:34px;border-radius:6px;background:#2B64A6;display:grid;place-items:center;flex:none}
.ck svg{width:20px;height:20px}
.cols{display:grid;grid-template-columns:1fr 1fr;width:920px}.cols>div{padding-right:40px}.cols>div+div{border-left:1px solid rgba(245,246,248,.18);padding:0 0 0 44px}
.cols h4{font:600 34px Inter,sans-serif;margin-bottom:22px;letter-spacing:-.01em}.cols p{display:flex;gap:16px;align-items:center;font-size:26px;padding:12px 0;color:rgba(245,246,248,.85)}
.sum>div{display:grid;grid-template-columns:150px 1fr;padding:34px 0;border-bottom:1px solid rgba(245,246,248,.12)}
.sum em{font:300 84px/1 Inter,sans-serif;color:#2B64A6;font-style:normal;letter-spacing:-.03em}.sum b{display:block;font-size:34px;font-weight:500;margin-top:6px}.sum span{display:block;font-size:24px;color:rgba(245,246,248,.55);margin-top:8px}
.nx{margin-top:60px;display:flex;align-items:center;gap:18px;font-size:27px;color:rgba(245,246,248,.78)}.nx i{display:block;width:60px;height:2px;background:#2B64A6}
.tb{width:920px}.th,.tr{display:grid;grid-template-columns:290px 1fr 1fr 1fr;align-items:baseline}
.th{padding-bottom:18px;border-bottom:1px solid rgba(245,246,248,.3);font-size:22px;color:rgba(245,246,248,.5)}
.tr{padding:30px 0;border-bottom:1px solid rgba(245,246,248,.12);font-size:28px}.tr b{font-size:40px;font-weight:600;letter-spacing:-.02em}.tr span{color:rgba(245,246,248,.88)}
.acs{display:grid;grid-template-columns:1fr 1fr;gap:20px;width:920px}
.ac{height:350px;padding:34px 36px;border-radius:26px;background:linear-gradient(160deg,rgba(255,255,255,.08),rgba(255,255,255,.025));border:1px solid rgba(255,255,255,.13);backdrop-filter:blur(14px)}
.ac>i{display:block;font:500 18px Inter,sans-serif;letter-spacing:.16em;color:#7f9cc6;font-style:normal}
.ac>b{display:block;font-size:38px;font-weight:600;letter-spacing:-.02em;margin-top:8px}
.ac .num{font-size:66px;font-weight:500;letter-spacing:-.04em;margin:18px 0 14px;line-height:1}.ac .num small{font-size:24px;font-weight:500;margin-left:8px;color:rgba(245,246,248,.6);letter-spacing:0}
.ac p{display:flex;gap:14px;align-items:center;font-size:24px;padding:7px 0;color:rgba(245,246,248,.82)}
.chip{display:flex;align-items:center;gap:20px;padding:20px 30px 20px 20px;border-radius:24px;background:linear-gradient(150deg,rgba(255,255,255,.12),rgba(255,255,255,.04));border:1px solid rgba(255,255,255,.16);backdrop-filter:blur(18px);box-shadow:0 20px 50px rgba(0,0,0,.45);z-index:3}
.chip>i{width:64px;height:64px;border-radius:16px;background:linear-gradient(145deg,#1B4CA6,#0E2A5E);display:grid;place-items:center;font:600 18px Inter,sans-serif;font-style:normal;letter-spacing:.02em;color:#fff}
.chip b{display:block;font-size:28px;font-weight:600;letter-spacing:-.01em}.chip span{display:block;font-size:22px;color:rgba(245,246,248,.6);margin-top:4px}
.tag{display:flex;align-items:baseline;gap:16px;transform-origin:0 50%;text-shadow:0 2px 12px rgba(0,0,0,.6)}.tag b{font-size:36px;font-weight:500;letter-spacing:.01em;color:#E4E9F1}.tag span{font-size:24px;color:rgba(238,242,248,.62)}
.acs.tight .ac{height:328px;padding:28px 34px}.acs.tight .ac .num{font-size:58px;margin:12px 0 10px}
.dash{display:block;width:22px;height:2px;background:#5b7fb0;flex:none}
.risk{left:80px;bottom:58px;font-size:20px;color:rgba(245,246,248,.42)}
</style>`;
const CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';

const shell = (r, i, p, inner, shadeKind) => `<!doctype html><html lang="ko"><head><meta charset="utf-8">${CSS}</head><body>
  ${p.scene ? `<img class="scene" src="${esc(src(p.scene))}" alt=""${p.shift ? ` style="transform-origin:100% 100%;transform:${esc(p.shift)}${p.fade ? ';-webkit-mask-image:radial-gradient(ellipse 37% 34% at 63% 62%,#000 35%,rgba(0,0,0,.6) 65%,transparent 100%)' : ''}"` : ''}>` : ''}
  ${shadeKind === 'none' ? '' : `<div class="${shadeKind === 'left' ? 'shadeL' : 'shade'}"></div>`}
  <div class="a lg">${LOGO}</div><div class="a pno">${String(i + 1).padStart(2, '0')} / ${String(r.pages.length).padStart(2, '0')}</div>
  ${inner}
  ${p.risk || i === 0 || i === r.pages.length - 1 ? `<div class="a" style="left:0;right:0;bottom:0;height:240px;background:linear-gradient(0deg,rgba(5,7,11,.92),rgba(5,7,11,0))"></div><div class="a risk">${esc(r.risk || RISK)}</div>` : ''}
  <script>window.addEventListener('load',()=>document.fonts.ready.then(()=>{document.body.dataset.ready='1'}))</script></body></html>`;

const T = {
  // 1 표지: 위쪽 제목 · 아래쪽은 장면 주인공
  // p.pos='bottom' → 제목을 왼쪽 아래로 · p.chips=[[큰 글자, 작은 글자]] → 왼쪽 위에 떠 있는 유리 카드 (가격 숫자 넣지 않기)
  cover: p => `${(p.chips || []).slice(0, 3).map((c, k) => `<div class="a chip" style="left:${p.pos === 'bottom' ? 240 + k * 110 : 200 + k * 110}px;top:${p.pos === 'bottom' ? 250 + k * 140 : 760 + k * 140}px"><i class="en">${esc(c[2] || c[0].slice(0, 3))}</i><div><b class="en">${esc(c[0])}</b><span>${esc(c[1] || '')}</span></div></div>`).join('')}
  <div class="a" style="left:80px;${p.pos === 'bottom' ? 'bottom:150px' : 'top:250px'};width:${p.pos === 'bottom' ? 600 : 920}px">${p.label ? `<div class="lab">${esc(p.label)}</div>` : ''}
    <div class="ttl" style="font-size:${p.pos === 'bottom' || p.chips ? 70 : 84}px;margin-top:22px">${br(p.title)}</div><div class="rule"></div>
    ${p.sub ? `<div class="sub" style="margin-top:30px">${br(p.sub)}</div>` : ''}</div>`,
  // 2 정보 표: 라벨 · 제목 · 얇은 정보 줄
  info: p => `<div class="a" style="left:80px;top:250px">${p.label ? `<div class="lab">${esc(p.label)}</div>` : ''}
    <div class="ttl" style="font-size:76px;margin-top:22px">${br(p.title)}</div>
    <div class="rows" style="margin-top:56px">${(p.rows || []).map(x => `<div><span>${esc(x[0])}</span><b style="font-weight:500">${esc(x[1])}</b></div>`).join('')}</div>
    ${p.next ? `<div class="nx">${esc(p.next)}<i></i></div>` : ''}</div>`,
  // 3 큰 숫자: 은빛 숫자 · 제목 · 목록 (장면은 오른쪽)
  number: p => `${p.label ? `<div class="a lab" style="left:80px;top:200px">${esc(p.label)}</div>` : ''}<div class="a" style="left:66px;top:${p.label ? 250 : 220}px"><div class="huge">${esc(p.num)}</div></div>
    <div class="a" style="left:80px;top:${p.label ? 545 : 500}px"><div class="ttl" style="font-size:72px">${br(p.title)}</div>${p.sub ? `<div class="sub" style="margin-top:22px">${br(p.sub)}</div>` : ''}</div>
    ${p.tags ? p.tags.map(t => `<div class="a tag" style="left:${t.x}px;top:${t.y}px;transform:${esc(t.tf || '')}"><b class="en">${esc(t.t)}</b><span>${esc(t.k || '')}</span></div>`).join('')
      : `<div class="a list" style="left:80px;top:${(p.sub ? 830 : 740) + (p.label ? 45 : 0)}px">${(p.items || []).map(x => `<div>${esc(x[0])}<span>${esc(x[1] || '')}</span></div>`).join('')}</div>`}`,
  // tags = 장면 속 판 위에 얹는 이름표 [{ t:'Currencies', k:'외환', x, y, tf:'rotate(-14deg) skewX(10deg)' }]
  // 4 단계: 체크 목록 (장면 = 오른쪽 휴대폰)
  steps: p => `<div class="a" style="left:80px;top:250px">${p.label ? `<div class="lab">${esc(p.label)}</div>` : ''}
    <div class="ttl" style="font-size:76px;margin-top:22px">${br(p.title)}</div>
    <div class="steps" style="margin-top:56px">${(p.items || []).map(x => `<div><span class="ck">${CHECK}</span>${esc(x)}</div>`).join('')}</div></div>`,
  // 5 비교: 큰 영문 두 단어 · 두 칸 비교 (장면 = 아래쪽)
  compare: p => `<div class="a" style="left:80px;top:250px">${p.label ? `<div class="lab">${esc(p.label)}</div>` : ''}
    <div class="ttl en" style="font-size:${(p.cols || []).map(c => c.name).join('').length > 12 ? 92 : 118}px;font-weight:600;letter-spacing:-.04em;margin-top:18px">${(p.cols || []).map(c => esc(c.name)).join('<span style="font-weight:300;color:rgba(245,246,248,.4);margin:0 28px">/</span>')}</div>
    ${p.sub ? `<div class="sub" style="margin-top:18px">${br(p.sub)}</div>` : ''}
    <div class="cols" style="margin-top:64px">${(p.cols || []).map(c => `<div><h4>${esc(c.name)}</h4>${(c.items || []).map(x => `<p><i class="dash"></i>${esc(x)}</p>`).join('')}</div>`).join('')}</div></div>`,
  // 7 표: 계좌 4종처럼 이름 + 값 3칸 (head = 칸 이름 4개 · rows = [이름, 값, 값, 값] · note = 아래 작은 공통 조건)
  table: p => `<div class="a" style="left:80px;top:250px;width:920px">${p.label ? `<div class="lab">${esc(p.label)}</div>` : ''}
    <div class="ttl" style="font-size:76px;margin-top:22px">${br(p.title)}</div>
    <div class="tb" style="margin-top:56px">${p.head ? `<div class="th">${p.head.map(h => `<span>${esc(h)}</span>`).join('')}</div>` : ''}
    ${(p.rows || []).map(x => `<div class="tr"><b class="en">${esc(x[0])}</b>${x.slice(1, 4).map(v => `<span>${esc(v)}</span>`).join('')}</div>`).join('')}</div>
    ${p.note ? `<div class="sub" style="font-size:23px;margin-top:28px">${br(p.note)}</div>` : ''}</div>`,
  // 8 계좌 카드: 2×2 카드 (cards = [{ tier, name, num, unit, feats:[2~3] }] · note = 아래 공통 조건)
  accounts: p => `<div class="a" style="left:80px;top:222px;width:920px">${p.label ? `<div class="lab">${esc(p.label)}</div>` : ''}
    <div class="ttl" style="font-size:64px;margin-top:16px">${br(p.title)}</div></div>
    <div class="a acs${p.title && p.title.includes(String.fromCharCode(10)) ? ' tight' : ''}" style="left:80px;top:${p.title && p.title.includes(String.fromCharCode(10)) ? 470 : 420}px">${(p.cards || []).slice(0, 4).map(c => `<div class="ac">
      <i class="en">${esc(c.tier || '')}</i><b class="en">${esc(c.name)}</b>
      <div class="num en">${esc(c.num || '')}<small>${esc(c.unit || '')}</small></div>
      ${(c.feats || []).slice(0, 3).map(f => `<p><i class="dash"></i>${esc(f)}</p>`).join('')}</div>`).join('')}</div>
    ${p.note ? `<div class="a sub" style="left:80px;bottom:110px;font-size:21px">${esc(p.note)}</div>` : ''}`,
  // 6 요약: 큰 번호 세 줄
  summary: p => `<div class="a" style="left:80px;top:250px">${p.label ? `<div class="lab">${esc(p.label)}</div>` : ''}
    <div class="ttl" style="font-size:76px;margin-top:22px">${br(p.title)}</div>
    <div class="sum" style="margin-top:50px;width:660px">${(p.items || []).map((x, k) => `<div><em>${String(k + 1).padStart(2, '0')}</em><div><b>${esc(x[0])}</b><span>${esc(x[1] || '')}</span></div></div>`).join('')}</div></div>`,
};
const SHADE = { number: 'left', steps: 'left', info: 'left', summary: 'left' };

export const onbPages = r => (r.pages || []).map((p, i) => shell(r, i, p, (T[p.type] || T.info)(p), p.shade || SHADE[p.type]));
