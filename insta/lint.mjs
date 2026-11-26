// 카드 레이아웃 자동 점검 (2026-11-26 사용자: "줄바꿈이랑 항상 제대로 확인하는 거 맞지?")
// 렌더한 페이지 안에서 실행 → 사람이 보기 전에 넘침·겹침·어색한 줄바꿈을 찾아 문장 목록으로 돌려줌
// 사용: const issues = await pg.evaluate(LINT)   (market.mjs 명령줄이 장마다 실행 → outDir/check.json)
// 잡는 것
//  1) 화면 가장자리 넘침: 글자가 카드 바깥 여백(40px) 밖으로 나감
//  2) 칸 넘침: 높이가 정해진 칸(달력 칸·박스) 밖으로 글자가 삐져나감
//  3) 글자 겹침: 서로 다른 글 덩어리가 겹쳐 보임
//  4) 한 글자 줄: 한 글자만 다음 줄로 떨어짐 (2줄 이상인 글)
//  5) 제목 줄 늘어남: 제목(.big)이 직접 넣은 줄바꿈보다 더 많은 줄로 나뉨 (너무 길어 저절로 접힘)
export const LINT = () => {
  const W = innerWidth, H = innerHeight, M = 40, out = [];
  const cut = s => { s = String(s).replace(/\s+/g, ' ').trim(); return s.length > 16 ? s.slice(0, 16) + '…' : s; };
  const hidden = el => { for (let e = el; e && e !== document.body; e = e.parentElement) { const cs = getComputedStyle(e); if (cs.display === 'none' || cs.visibility === 'hidden' || +cs.opacity === 0) return true; } return false; };
  // 글자마다 위치를 재서 줄로 묶음
  const nodes = [], tw = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let n; (n = tw.nextNode());) {
    if (!n.data.trim() || n.parentElement.closest('svg,script,style') || hidden(n.parentElement)) continue;
    const chars = [], rg = document.createRange();
    for (let i = 0; i < n.data.length; i++) {
      if (!n.data[i].trim()) continue;
      rg.setStart(n, i); rg.setEnd(n, i + 1); const r = rg.getBoundingClientRect(); if (!r.width && !r.height) continue;
      chars.push({ c: n.data[i], l: r.left, r: r.right, t: r.top, b: r.bottom });
    }
    if (!chars.length) continue;
    const lines = []; chars.forEach(ch => { const L = lines.find(x => Math.abs(x.t - ch.t) < (ch.b - ch.t) * .5); if (L) { L.cs.push(ch); L.l = Math.min(L.l, ch.l); L.r = Math.max(L.r, ch.r); L.b = Math.max(L.b, ch.b); } else lines.push({ t: ch.t, b: ch.b, l: ch.l, r: ch.r, cs: [ch] }); });
    nodes.push({ n, el: n.parentElement, text: n.data, chars, lines });
  }
  const seen = new Set(), add = m => { if (!seen.has(m)) { seen.add(m); out.push(m); } };
  nodes.forEach(o => {
    // 1) 화면 가장자리
    if (o.chars.some(c => c.l < M - 1 || c.r > W - M + 1 || c.t < 20 || c.b > H - 20)) add(`화면 가장자리 넘침: "${cut(o.text)}"`);
    // 2) 높이가 정해진 칸 밖으로
    for (let e = o.el; e && e !== document.body; e = e.parentElement) {
      if (!e.style || !e.style.height || /%$/.test(e.style.height)) continue;
      const R = e.getBoundingClientRect(); if (R.height < 40) break;
      if (o.chars.some(c => c.b > R.bottom + 2 || c.r > R.right + 2 || c.l < R.left - 2)) add(`칸 밖으로 넘침: "${cut(o.text)}"`);
      break;
    }
    // 4) 한 글자 줄
    if (o.lines.length >= 2 && o.lines.some(L => L.cs.length === 1 && /[가-힣A-Za-z0-9]/.test(L.cs[0].c))) add(`한 글자만 다음 줄로 떨어짐: "${cut(o.text)}"`);
  });
  // 3) 서로 다른 글 덩어리 겹침 (2px 여유)
  const boxes = []; nodes.forEach((o, k) => o.lines.forEach(L => boxes.push({ k, l: L.l + 4, r: L.r - 4, t: L.t + (L.b - L.t) * .12, b: L.b - (L.b - L.t) * .12, text: o.text })   /* 글자 상자는 줄 간격보다 커서 위아래 12%는 빼고 봄 (여러 줄 제목 오탐 방지) */));
  for (let i = 0; i < boxes.length; i++) for (let j = i + 1; j < boxes.length; j++) {
    const a = boxes[i], b = boxes[j]; if (a.k === b.k) continue;
    if (a.l < b.r && b.l < a.r && a.t < b.b && b.t < a.b) add(`글자 겹침: "${cut(a.text)}" ↔ "${cut(b.text)}"`);
  }
  // 5) 제목 줄 늘어남
  document.querySelectorAll('.big').forEach(el => {
    if (hidden(el)) return;
    const want = el.querySelectorAll('br').length + 1, tops = [];
    nodes.filter(o => el.contains(o.n)).forEach(o => o.lines.forEach(L => { if (!tops.some(t => Math.abs(t - L.t) < (L.b - L.t) * .5)) tops.push(L.t); }));
    if (tops.length > want) add(`제목이 길어 ${want}줄 → ${tops.length}줄로 늘어남: "${cut(el.textContent)}"`);
  });
  return out;
};
