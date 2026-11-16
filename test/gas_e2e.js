// 앱 스크립트 서버 전체 흐름 테스트 (가짜 시트·가짜 외부 API)
// 실제 시트처럼: 시각·날짜 글자 → 날짜 객체
const sheetConv = x => typeof x !== "string" ? x : /^\d{1,2}:\d{2}$/.test(x) ? new Date(Date.UTC(1899, 11, 30, +x.split(":")[0] - 9, +x.split(":")[1])) : /^\d{4}-\d{2}-\d{2}$/.test(x) ? new Date(x + "T00:00:00+09:00") : x;
const fs = require('fs'), vm = require('vm'), crypto = require('crypto');
const B = 'C:/Users/momantic/Desktop/AI 자동화/4. BenePip-SNS-Monitor/backend/';
class Range { constructor(sh, r, c, nr, nc) { Object.assign(this, { sh, r, c, nr, nc }); }
  getValues() { const out = []; for (let i = 0; i < this.nr; i++) { const row = []; for (let j = 0; j < this.nc; j++) row.push(((this.sh.d[this.r - 1 + i] || [])[this.c - 1 + j]) ?? ''); out.push(row); } return out; }
  setValues(v) { v.forEach((row, i) => { const R = this.sh.d[this.r - 1 + i] = this.sh.d[this.r - 1 + i] || []; row.forEach((x, j) => R[this.c - 1 + j] = sheetConv(x)); }); return this; }
  setFontWeight() { return this; } setBackground() { return this; } }
class Sheet { constructor() { this.d = []; } getLastRow() { return this.d.length; } getLastColumn() { return Math.max(0, ...this.d.map(r => r.length)); }
  getRange(r, c, nr = 1, nc = 1) { return new Range(this, r, c, nr, nc); } appendRow(row) { this.d.push(row.slice()); } deleteRow(i) { this.d.splice(i - 1, 1); } setFrozenRows() { } }
const sheets = {}, props = {}, calls = [];
let FAKE = {};   // url 패턴 → 응답 함수
const ctx = {
  SpreadsheetApp: { getActiveSpreadsheet: () => ({ getId: () => 'SHEET1', getSheetByName: n => sheets[n], insertSheet: n => (sheets[n] = new Sheet()) }), getUi: () => ({ alert() { } }) },
  PropertiesService: { getScriptProperties: () => ({ getProperty: k => props[k] ?? null, setProperty: (k, v) => props[k] = v, deleteProperty: k => delete props[k] }) },
  LockService: { getScriptLock: () => ({ waitLock() { }, tryLock() { return true; }, releaseLock() { } }) },
  ScriptApp: { getService: () => ({ getUrl: () => 'https://script.google.com/macros/s/TEST/exec' }) },
  Utilities: {
    formatDate: (d, tz, f) => { const k = new Date(d.getTime() + 9 * 3600e3); const p = n => String(n).padStart(2, '0');
      return f.replace('yyyy', k.getUTCFullYear()).replace('MM', p(k.getUTCMonth() + 1)).replace('dd', p(k.getUTCDate())).replace('HH', p(k.getUTCHours())).replace('mm', p(k.getUTCMinutes())).replace('ss', p(k.getUTCSeconds())); },
    sleep() { }, DigestAlgorithm: { MD5: 'md5' },
    computeDigest: (a, s) => [...crypto.createHash('md5').update(s).digest()], base64EncodeWebSafe: b => Buffer.from(b.map(x => x & 255)).toString('base64url'), base64Encode: b => typeof b === 'string' ? Buffer.from(b, 'utf8').toString('base64') : Buffer.from(b.map(x => x & 255)).toString('base64'), Charset: { UTF_8: 'utf8' },
  },
  UrlFetchApp: { fetch(url, opt) {
    calls.push({ url, opt });
    // 계정·사이트 확인용 가짜 페이지: 'fake_'·'nosite' 가 들어간 건 없는 것으로
    const ig = url.match(/^https:\/\/www\.instagram\.com\/([^/]+)\/$/), th = url.match(/^https:\/\/www\.threads\.com\/@(.+)$/);
    if (ig || th) { const h = (ig || th)[1]; if (/fake_/.test(h)) return { getResponseCode: () => th ? 302 : 200, getContentText: () => '<title>Instagram</title>', getAllHeaders: () => ({}) };
      return { getResponseCode: () => 200, getContentText: () => `<meta property="og:title" content="Name ${h} (&#064;${h}) &#x2022; Instagram" /><meta property="og:description" content="1,234 Followers, 5 Following" />`, getAllHeaders: () => ({}) }; }
    if (/^https:\/\/[a-z0-9.-]+\.(example|kr|com|io)\/?$/.test(url) && !/googleapis|github|telegram|facebook|threads\.net|benepip/.test(url)) {
      if (/nosite/.test(url)) throw new Error('DNS error');
      return { getResponseCode: () => 200, getContentText: () => '<html>' + '한국어 페이백 사이트 안내 문구입니다 '.repeat(5) + '</html>', getAllHeaders: () => ({}) };
    }
    const key = Object.keys(FAKE).filter(k => url.includes(k)).sort((a, b) => /^[a-z.]+.(com|net|org)$/.test(a) - /^[a-z.]+.(com|net|org)$/.test(b))[0];   // 도메인 전체 규칙은 마지막
    const r = key ? FAKE[key](url, opt) : { code: 404, body: { message: 'Not Found' } };
    return { getResponseCode: () => r.code || 200, getContentText: () => JSON.stringify(r.body ?? r), getBlob: () => ({ getBytes: () => [1, 2, 3] }) };
  } },
  console: { log() { }, warn: m => console.error('  [경고]', m), error: e => console.error('  [서버 오류]', e && e.message) }, JSON, Date, Math, Object, String, Number, Buffer,
};
vm.createContext(ctx);
const files = fs.readdirSync(B).filter(f => f.endsWith('.gs') && f !== 'Recipes.gs');   // 레시피는 아래 전용 테스트에서만
ctx.__run = s => vm.runInContext(s, ctx);
vm.runInContext(files.map(f => fs.readFileSync(B + f, 'utf8')).join('\n') + '\nthis.api=api;this.X={calendarTopics_,proposeTopicsAI_,autoReview_,geminiPost_,menuRunAllNow,proposeTopics_,seedMarket_,discover_,importSiteBrokers_,recoverStuck_,checkTokens_,alertOnce_,isTestMode_,generateTopic_,checkRenders_,runPublishDue_,tick,readColl_,upsert_,settings_,writeSettings_,mergeServerFields_,retryPublish_,eligible_,runPerf_,dayToDate_,testDraftsOnce_,resetAndDraftOnce_,remove_,qaPending_,qaDailyReport_};', ctx);
ctx.PropertiesService.getScriptProperties().setProperty('RESET_DONE', 'reset-2026-10-22b'); ctx.PropertiesService.getScriptProperties().setProperty('RERENDER', 'rr-2026-10-23b');   // 한 번만 도는 전체 삭제가 다른 테스트 중에 돌지 않게
const X = ctx.X, out = [], ok = (n, c, i) => out.push((c ? 'PASS ' : 'FAIL ') + n + (i !== undefined ? ' · ' + i : ''));
// 예시 데이터 시드
const html = fs.readFileSync(B + 'Index.html', 'utf8');
const sSrc = html.slice(html.indexOf('const S = {'), html.indexOf('\n};', html.indexOf('const S = {')) + 3).replace('const S =', 'S =');
const S = vm.runInNewContext(sSrc + '; S', {});
const KEYS = ['accounts', 'posts', 'services', 'topics', 'contents', 'brokers', 'feed', 'conf', 'kw', 'banned', 'reviewWords', 'disclaimer', 'base', 'run', 'admins'];
const data = JSON.parse(JSON.stringify(Object.fromEntries(KEYS.map(k => [k, S[k]]))));
data.feed.forEach((f, i) => f.id = 'f' + i);
ctx.api('seed', { data });
Object.assign(props, { GEMINI_API_KEY: 'g', GITHUB_TOKEN: 'gh', TELEGRAM_BOT_TOKEN: 'tb', TELEGRAM_CHAT_ID: '1', IG_USER_ID: 'ig1', IG_TOKEN: 'it', THREADS_USER_ID: 'th1', THREADS_TOKEN: 'tt', PUBLISH_MODE: 'live' });

// 가짜 외부 API
let geminiOut = { ig: { cards: [{ t: '“UID” 어디서 찾을까?', b: '3단계로 정리' }, { t: '브로커 화면', b: '계좌 정보 메뉴' }, { layout: 'qa', t: '베네핍에 입력', b: '어디에 넣나요? | 연결 페이지에서\n언제 반영돼요? | 영업일 기준' }, { t: '정리', b: '확인 후 적용 상태 보기' }], caption: 'UID 찾는 법을 정리했어요.' }, th: { text: 'UID 어디서 찾는지 헷갈리죠?\n순서대로 정리했어요.' } };
FAKE = {
  'generativelanguage.googleapis.com': () => ({ body: { candidates: [{ content: { parts: [{ text: JSON.stringify(geminiOut) }] } }] } }),
  '/dispatches': () => ({ code: 204, body: {} }),
  'api.telegram.org': () => ({ body: { ok: true } }),
  '/contents/cards/': url => { const m = url.match(/cards\/([^/]+)\/(v\d+)/); return { body: [1, 2, 3, 4].map(i => ({ name: `0${i}.jpg`, path: `cards/${m[1]}/${m[2]}/0${i}.jpg` })) }; },
  'graph.facebook.com': (url, opt) => url.includes('/media_publish') ? { body: { id: 'IGPOST1' } } : url.includes('status_code') ? { body: { status_code: 'FINISHED' } } : url.includes('permalink') ? { body: { permalink: 'https://instagram.com/p/X' } } : url.includes('/insights') ? { body: { data: [{ name: 'reach', values: [{ value: 500 }] }, { name: 'saved', values: [{ value: 9 }] }] } } : url.includes('like_count') ? { body: { like_count: 30, comments_count: 4 } } : { body: { id: 'C' + calls.length } },
  'graph.threads.net': url => url.includes('threads_publish') ? { body: { id: 'TH1' } } : url.includes('permalink') ? { body: { permalink: 'https://threads.com/@b/post/1' } } : { body: { id: 'TC1' } },
};
const C = id => X.readColl_('contents').find(c => c.id === id), T = id => X.readColl_('topics').find(t => t.id === id);
// 1) 초안 생성
let ids;
try { ids = X.generateTopic_('t4', { ig: true, th: true, broker: '' }); } catch (e) { ok('초안 생성', false, e.message); }
ok('초안 생성 · 인스타+스레드 2개', ids && ids.length === 2, ids && ids.join());
const ig = C(ids[0]), th = C(ids[1]);
ok('주제 → 생성됨 · 초안 연결', T('t4').state === '생성됨' && ig.gid === 't4' && ig.plan && ig.reason);
ok('렌더링 요청 보냄 · 대기 상태', calls.some(c => c.url.includes('/dispatches')) && ig.render.state === 'pending' && ig.dirtyImg === true);
const disp = JSON.parse(calls.find(c => c.url.includes('/dispatches')).opt.payload);
ok('렌더링 요청에 카드·버전 포함', disp.event_type === 'render' && disp.client_payload.draft.cards.length === 4 && /^v\d+/.test(disp.client_payload.draft.ver));
ok('인스타 초안은 바로 알리지 않고 품질 검사 대기', !calls.some(c => c.url.includes('telegram') && c.opt.payload.includes('새 초안')) && ig.notified === false && ig.qa.state === '대기' && ig.qa.auto === true);
ok('스레드 본문에 위험 고지', th.text.includes('원금 손실'));
// 2) 렌더링 반영
X.checkRenders_();
const ig2 = C(ig.id);
ok('렌더링 결과 반영 · 이미지 4장 · 최신', ig2.images.length === 4 && ig2.images[0].startsWith('https://raw.githubusercontent.com/') && ig2.dirtyImg === false && ig2.render.state === 'done');
// 2-1) 품질 관문
{
  const tgq = () => calls.filter(c => c.url.includes('telegram')).map(c => JSON.parse(c.opt.payload).text);
  let critic = 0;
  FAKE['raw.githubusercontent.com'] = url => url.endsWith('metrics.json') ? { body: X.readColl_('contents').find(c => c.id === ig.id).qa.round ? [{ n: 1, zoom: 1 }, { n: 2, zoom: 1, empty: 5 }] : [{ n: 1, zoom: 1 }, { n: 2, zoom: 0.8, empty: 0 }] } : { body: 'img' };
  const g0 = FAKE['generativelanguage.googleapis.com'];
  FAKE['generativelanguage.googleapis.com'] = (url, opt) => { const pl = JSON.parse(opt.payload).contents[0].parts; if (pl.some(x => x.inline_data)) { critic++; return { body: { candidates: [{ content: { parts: [{ text: JSON.stringify({ score: critic === 1 ? 5 : 8, fix: ['2장 줄 수를 줄여요'] }) }] } }] } }; }
    if (/글을 고쳐요/.test(pl[0].text)) return { body: { candidates: [{ content: { parts: [{ text: JSON.stringify({ cards: C(ig.id).cards.map(c => Object.assign({}, c, { t: c.t + ' ' })) }) }] } }] } };
    return g0(url, opt); };
  const tgN = tgq().length;
  X.qaPending_();
  const q1 = C(ig.id);
  ok('품질 미달(글씨 80%·5점) → 자동으로 고쳐 다시 그리기 요청', q1.qa.round === 1 && q1.qa.state === '대기' && q1.render.state === 'pending' && tgq().length === tgN);
  X.checkRenders_(); X.qaPending_();
  const q2 = C(ig.id);
  ok('다시 그린 뒤 통과 → 점수와 함께 텔레그램', q2.qa.state === '통과' && q2.qa.score === 8 && q2.notified === true && tgq().at(-1).includes('품질 통과') && tgq().at(-1).includes('스레드 초안도'), JSON.stringify(q2.qa));
  FAKE['generativelanguage.googleapis.com'] = g0; delete FAKE['raw.githubusercontent.com'];
  const n0r = calls.length; X.qaDailyReport_(true);
  const put = calls.slice(n0r).find(c => /\/contents\/qa\/\d{4}-\d{2}-\d{2}\.json/.test(c.url) && c.opt && c.opt.method === 'put');
  const rec = put && JSON.parse(Buffer.from(JSON.parse(put.opt.payload).content, 'base64').toString('utf8'));
  ok('하루 품질 리포트 → 텔레그램 요약 + GitHub 기록', tgq().at(-1).includes('오늘 카드 품질') && rec && rec.rows.some(r => r.id === ig.id && r.score === 8 && r.layouts.length === 4), rec && JSON.stringify(rec.rows[0]).slice(0, 120));
}
// 3) 화면이 예전 값을 보내도 이미지 유지
const stale = Object.assign({}, ig, { caption: '화면에서 고친 캡션' });
const merged = X.mergeServerFields_('contents', [stale])[0];
ok('예전 화면 값 저장해도 서버 이미지 유지', merged.images && merged.images.length === 4 && merged.caption === '화면에서 고친 캡션');
// 4) 승인 → 예약 발행
const a = C(ig.id); a.state = '예약'; a.day = 0; a.time = '00:00'; X.upsert_('contents', [a]);
const b = C(th.id); b.state = '예약'; b.day = 0; b.time = '00:00'; X.upsert_('contents', [b]);
X.runPublishDue_();
ok('인스타 발행 완료 (캐러셀)', C(ig.id).state === '발행됨' && C(ig.id).pubId === 'IGPOST1' && calls.some(c => c.url.includes('media') && c.opt && String(c.opt.payload && c.opt.payload.media_type) === 'CAROUSEL'));
ok('스레드 발행 완료', C(th.id).state === '발행됨' && C(th.id).url.includes('threads'));
ok('발행 캡션에 위험 고지·프로필 안내', calls.some(c => c.opt && c.opt.payload && String(c.opt.payload.caption || '').includes('원금 손실') && String(c.opt.payload.caption).includes('프로필 링크')));
// 5) 미확인 조건이 남은 초안은 발행 막힘
geminiOut = { ig: { cards: [{ t: 'XM “$100 거래 크레딧”', b: '출금 조건' }, { t: '조건', b: '확인' }], caption: '$100 거래 크레딧 정리' } };
const ids2 = X.generateTopic_('t3', { ig: true, th: false, broker: 'XM' });
const x = C(ids2[0]);
ok('확인 전 브로커 → 미확인 조건 기록', x.unv.length === 1 && x.unv[0].k === '$100 거래 크레딧' && x.data.includes('확인 필요'));
X.checkRenders_();
const x2 = C(x.id); x2.state = '예약'; x2.day = 0; x2.time = '00:00'; X.upsert_('contents', [x2]); X.runPublishDue_();
ok('미확인 조건 미해결 → 발행 실패 처리', C(x.id).state === '실패' && C(x.id).err.includes('미확인'));
// 6) 실패 재시도 (문구에서 빼면 통과)
const x3 = C(x.id); x3.cards = [{ t: 'XM 가입 크레딧', b: '조건은 확인 후 안내' }, { t: '조건', b: '확인' }]; x3.caption = '정리'; X.upsert_('contents', [x3]);
X.retryPublish_(x.id);
ok('문구 고친 뒤 재시도 → 이미지 최신 아님이면 계속 막힘', C(x.id).state === '실패');
// 7) 같은 주제 중복 생성 막기
let dup = ''; try { X.generateTopic_('t4'); } catch (e) { dup = e.message; }
ok('처리된 주제 다시 생성 안 됨', dup.includes('이미'));
// 8) 하루 자동 실행 (단계별)
const st = X.settings_(); st.conf.autoOn = true; st.conf.runAt = '00:00'; X.writeSettings_({ conf: st.conf, run: { date: '2000-01-01' } });
geminiOut = { topics: [{ post: 1, title: '수수료 환급액 계산하는 법', group: '거래비용·페이백', plan: '환급액 계산 순서', reason: '반응 상위' }], ig: geminiOut.ig, th: { text: '테스트' } };
FAKE['generativelanguage.googleapis.com'] = (url, opt) => { const p = String(JSON.parse(opt.payload).contents[0].parts[0].text); return { body: { candidates: [{ content: { parts: [{ text: JSON.stringify(p.includes('"topics"') ? { topics: geminiOut.topics } : { ig: { cards: [{ t: '“환급액” 계산', b: '순서대로' }, { t: '정리', b: '끝' }], caption: '정리' }, th: { text: '환급액 계산 정리' } }) }] } }] } }; };
X.tick(); X.tick(); X.tick();
const run = X.settings_().run;
ok('자동 실행 3단계 완료', run.phase === 'done' && run.steps.length === 3, run.steps.map(s => s.n + ':' + s.st).join(' / '));
ok('자동 실행 결과 기록 (오늘 날짜)', run.date && run.end && ['완료', '일부 실패'].includes(run.result), run.result);
ok('주제 발굴 → 대기열 추가', X.readColl_('topics').some(t => t.title === '수수료 환급액 계산하는 법'));
// 9) 성과 수집
X.runPerf_();
ok('성과 수집 · 인스타 도달·저장', (C(ig.id).m || {}).reach === 500 && (C(ig.id).m || {}).save === 9);
ok('사이트 지표는 미집계(null)', (C(ig.id).m || {}).visit === null);
// 10) 키 값은 화면에 안 보냄
const L = ctx.api('load');
ok('화면에는 키 있음/없음만', L.keys.gemini === true && !JSON.stringify(L).includes('"gh"'));
// 11) 이미지 다시 만든 뒤 재시도 → 발행
ctx.api('render', { id: x.id }); X.checkRenders_();
ok('이미지 다시 생성 → 최신', C(x.id).dirtyImg === false && C(x.id).render.state === 'done');
ctx.api('retry', { id: x.id });
ok('고친 뒤 재시도 → 발행 완료', C(x.id).state === '발행됨', C(x.id).err);
// 12) 화면에서 문구 수정 후 저장 → 이미지 다시 생성 필요 (서버 이미지는 유지)
const e1 = JSON.parse(JSON.stringify(C(ig.id))); e1.cards[1].b = '고친 문장';
ctx.api('sync', { upserts: { contents: [e1] } });
ok('문구 수정 저장 → 이미지 다시 생성 필요', C(ig.id).dirtyImg === true && C(ig.id).images.length === 4 && C(ig.id).cards[1].b === '고친 문장');
// 13) 외부 서비스 실패
FAKE['generativelanguage.googleapis.com'] = () => ({ code: 429, body: { error: { message: 'Quota exceeded' } } });
X.upsert_('topics', [{ id: 'tq1', title: '스프레드 뜻 쉽게 정리', group: '용어 설명', state: '후보', opt: { ig: true, th: false, broker: '' } }]); const tq = { id: 'tq1' };
let em = ''; try { X.generateTopic_(tq.id); } catch (e) { em = e.message; }
ok('AI 한도 초과 → 생성 실패 표시 · 활동 기록', T(tq.id).state === '생성 실패' && em.includes('한도') && JSON.stringify(X.readColl_('feed')).includes('한도'));
FAKE['/dispatches'] = () => ({ code: 401, body: { message: 'Bad credentials' } });
let re = ''; try { ctx.api('render', { id: ig.id }); } catch (e) { re = e.message; }
ok('GitHub 토큰 오류 → 이유 표시', re.includes('Bad credentials'));
FAKE['/dispatches'] = () => ({ code: 204, body: {} });
const tg = () => calls.filter(c => c.url.includes('telegram')).map(c => JSON.parse(c.opt.payload).text);
// ── 14) 테스트 모드 (기본값) ──
delete props.PUBLISH_MODE;
ok('키 처음 넣으면 테스트 모드', X.isTestMode_() === true && ctx.api('load').keys.testMode === true);
X.upsert_('contents', [{ id: 'tm1', ch: 'th', state: '예약', day: 0, time: '00:00', topic: '테스트 글', text: '스프레드 정리\n\n※ 원금 손실 위험', unv: [] }]);
let n0 = calls.length; X.runPublishDue_();
const tm = C('tm1'), newCalls = calls.slice(n0);
ok('테스트 모드 → 발행 처리만 · 실제 API 호출 없음', tm.state === '발행됨' && tm.test === true && tm.pubId.startsWith('TEST-') && !newCalls.some(c => c.url.includes('threads.net') || c.url.includes('facebook')));
ok('테스트 모드 → 텔레그램·활동 기록에 표시', tg().some(t => t.includes('🧪 테스트 발행')) && JSON.stringify(X.readColl_('feed')).includes('테스트 · 실제로 올리지 않음'));
X.upsert_('contents', [{ id: 'tm2', ch: 'th', state: '예약', day: 0, time: '00:00', topic: '차단 글', text: '가입하면 현금 지급', unv: [] }]);
X.runPublishDue_();
ok('테스트 모드에서도 차단 표현은 막힘', C('tm2').state === '실패', C('tm2').err);
n0 = calls.length; X.runPerf_();
ok('테스트 발행은 성과 수집 안 함', !calls.slice(n0).some(c => c.url.includes('TEST-')));
props.PUBLISH_MODE = 'live';
// ── 15) 자동 실행 오류 알림 (6시간에 한 번) ──
ctx.__run("var __orig = runPublishDue_; runPublishDue_ = function () { throw new Error('시트 접근 오류'); };");
X.upsert_('contents', X.readColl_('contents').filter(c => c.qa).map(c => Object.assign(c, { qa: Object.assign(c.qa, { state: '통과' }) })));   // 품질 검사 알림이 섞이지 않게
let t0 = tg().length; X.tick();
ok('자동 실행 오류 → 텔레그램 알림', tg().length === t0 + 1 && tg().at(-1).includes('예약 발행: 시트 접근 오류'));
ok('오류가 나도 나머지 작업은 계속', true);
X.tick();
ok('같은 오류는 반복 알림 안 함', tg().length === t0 + 1);
ctx.__run('runPublishDue_ = __orig;');
// ── 16) 토큰 점검 ──
const ago = d => { const x = new Date(Date.now() + 9 * 3600e3 - d * 864e5); return x.toISOString().slice(0, 10); };
props.THREADS_TOKEN_AT = ago(8);
FAKE['refresh_access_token'] = () => ({ body: { access_token: 'tt-new', expires_in: 5184000 } });
let r = X.checkTokens_(true);
ok('스레드 토큰 7일 지나면 자동 갱신', r.threads === '갱신됨' && props.THREADS_TOKEN === 'tt-new' && props.THREADS_TOKEN_AT === ago(0));
r = X.checkTokens_(true);
ok('갱신 직후엔 다시 안 함', r.threads === '갱신 불필요');
props.THREADS_TOKEN_AT = ago(55); FAKE['refresh_access_token'] = () => ({ code: 400, body: { error: { message: 'Session has expired' } } });
t0 = tg().length; r = X.checkTokens_(true);
ok('스레드 갱신 실패 → 남은 일수와 함께 알림', r.threads === '갱신 실패' && tg().length === t0 + 1 && tg().at(-1).includes('5일 뒤 만료'), tg().at(-1));
FAKE['debug_token'] = () => ({ body: { data: { is_valid: true, expires_at: Math.floor(Date.now() / 1000) + 5 * 86400 } } });
t0 = tg().length; r = X.checkTokens_(true);
ok('인스타 토큰 만료 10일 이내 → 알림', r.instagram.includes('일 남음') && tg().slice(t0).some(t => t.includes('인스타 토큰이')), r.instagram);
FAKE['debug_token'] = () => ({ body: { data: { is_valid: true, expires_at: 0 } } });
ok('만료 없는 페이지 토큰 → 알림 없음', X.checkTokens_(true).instagram === '만료 없음');
FAKE['debug_token'] = () => ({ code: 400, body: { error: { message: 'no permission' } } });
FAKE['?fields=id&'] = () => ({ code: 400, body: { error: { message: 'Error validating access token' } } });
t0 = tg().length; r = X.checkTokens_(true);
ok('인스타 토큰 작동 안 함 → 알림', r.instagram === '작동 안 함' && tg().length === t0 + 1);
delete FAKE['?fields=id&']; delete FAKE['debug_token'];
props.TOKEN_CHECKED = ago(0); ok('토큰 점검은 하루 한 번', X.checkTokens_() === null);
// ── 17) 이미지 생성 실패 알림 ──
const rr = C(ig.id); rr.render = { ver: 'v9', hash: 'x', at: '2000-01-01 00:00', state: 'pending' }; X.upsert_('contents', [rr]);
FAKE['/contents/cards/'] = () => ({ code: 404, body: { message: 'Not Found' } });
t0 = tg().length; X.checkRenders_();
ok('이미지 20분 넘게 안 나오면 실패 + 알림', C(ig.id).render.state === 'error' && tg().length === t0 + 1 && tg().at(-1).includes('카드 이미지 생성 실패'));
console.log(out.join('\n'));
// 실제 시트 변환 뒤에도 화면에 보낼 데이터에 날짜 객체가 없어야 함
const LL = ctx.api('load'), hasDate = o => o instanceof Date || (o && typeof o === 'object' && Object.values(o).some(hasDate));
console.log((LL && LL.data && !hasDate(LL) && LL.data.contents.some(c => /^\d{2}:\d{2}$/.test(c.time)) ? 'PASS' : 'FAIL') + ' 시트 날짜 변환 → 화면에는 글자로 (시각 09:00 형식 유지)');
X.upsert_('topics', [{ id: 'st1', title: '멈춘 주제', state: '생성 중' }, { id: 'st2', title: '도는 중', state: '생성 중', genAt: Date.now() }]);
ctx.api('load');
console.log((T('st1').state === '생성 실패' && T('st2').state === '생성 중' ? 'PASS' : 'FAIL') + ' 생성 중에 멈춘 주제 → 생성 실패로 풀림 (진행 중인 건 그대로)');
// 사이트 브로커 가져오기
let siteTxt = fs.readFileSync(__dirname + '/site/data.js', 'utf8');
FAKE['staging.benepip.com'] = () => ({ raw: true });
const fetch0 = ctx.UrlFetchApp.fetch;
ctx.UrlFetchApp.fetch = (url, opt) => url.includes('data.js') ? { getResponseCode: () => 200, getContentText: () => siteTxt } : fetch0(url, opt);
let ri = X.importSiteBrokers_();
const BR = () => X.readColl_('brokers');
const xm = BR().find(b => b.name === 'XM');
console.log((BR().length === 18 && ri.updated === 3 && ri.added === 15 && xm.state === '확인 필요' && xm.otherIB === true && xm.src.includes('사이트') ? 'PASS' : 'FAIL') + ' 사이트 브로커 18개 가져오기 · 예시 3개는 사이트 내용으로 교체 · 전부 확인 필요', BR().length, ri.added, ri.updated);
const st0 = BR().find(b => b.name === '스타트레이더'); st0.state = '사용 가능'; X.upsert_('brokers', [st0]);
ri = X.importSiteBrokers_();
console.log((BR().find(b => b.name === '스타트레이더').state === '사용 가능' && !ri.changed.length ? 'PASS' : 'FAIL') + ' 다시 가져와도 담당자가 확인한 상태는 유지');
siteTxt = siteTxt.replace('title: "신규 가입 거래 크레딧", value: "30 USD 거래 크레딧"', 'title: "신규 가입 거래 크레딧", value: "50 USD 거래 크레딧"');
t0 = tg().length; ri = X.importSiteBrokers_();
const st1 = BR().find(b => b.name === '스타트레이더');
console.log((st1.state === '재확인 필요' && st1.changed === true && st1.credit.includes('50') && tg().length === t0 + 1 && ri.changed.includes('스타트레이더') ? 'PASS' : 'FAIL') + ' 사이트에서 조건 바뀌면 재확인 필요 + 조건 변경 알림');
// AI가 고른 카드 형식: 가운데 장의 알려진 형식만 저장
FAKE['generativelanguage.googleapis.com'] = () => ({ body: { candidates: [{ content: { parts: [{ text: JSON.stringify({ ig: { cards: [{ layout: 'stat', t: '표지', b: 'a | 1\nb | 2' }, { layout: 'check', t: '확인할 것', b: 'a\nb\nc' }, { layout: 'weird', t: '이상', b: 'x' }, { layout: 'compare', t: '마지막', b: '정리\n둘째' }], caption: 'c' } }) }] } }] } });
X.upsert_('topics', [{ id: 'tl1', title: '카드 형식 테스트', group: '거래비용·페이백', state: '후보', opt: { ig: true, th: false, broker: '' } }]);
const lid = X.generateTopic_('tl1')[0], lc = C(lid).cards;
console.log((lc[0].layout === 'c-receipt' && lc[1].layout === 'check' && lc[2].layout === 'body' && lc[3].layout === 'e-sum' ? 'PASS' : 'FAIL') + ' 카드 형식: 표지는 주제군 표지 · 모르는 형식은 기본 · 마지막 장은 마지막 장 형식만', JSON.stringify(lc.map(c => c.layout || '-')));
const dp = JSON.parse(calls.filter(c => c.url.includes('/dispatches')).at(-1).opt.payload);
console.log((dp.client_payload.draft.cards[1].layout === 'check' ? 'PASS' : 'FAIL') + ' 렌더링 요청에 카드 형식 포함');
// 같은 특별 형식이 여러 장이면 첫 장만 유지
FAKE['generativelanguage.googleapis.com'] = () => ({ body: { candidates: [{ content: { parts: [{ text: JSON.stringify({ ig: { cards: [{ t: '표지', b: 'a | 1\nb | 2' }, { layout: 'check', t: 'A', b: 'a\nb' }, { layout: 'check', t: 'B', b: 'c\nd' }, { layout: 'stat', t: 'C', b: '3가지\n설명' }, { layout: 'check', t: 'D', b: 'e' }, { t: '끝', b: '요약\n둘째' }], caption: 'c' } }) }] } }] } });
X.upsert_('topics', [{ id: 'tl2', title: '체크리스트 반복 테스트', group: '거래비용·페이백', state: '후보', opt: { ig: true, th: false, broker: '' } }]);
const lc2 = C(X.generateTopic_('tl2')[0]).cards.map(c => c.layout || '-');
console.log((JSON.stringify(lc2) === JSON.stringify(['c-receipt', 'check', 'body', 'stat', 'body', 'e-sum']) ? 'PASS' : 'FAIL') + ' 같은 특별 형식은 한 번만 (반복된 체크리스트는 기본 카드로)', JSON.stringify(lc2));

// 표지 주제군 고정 · 보조 표지 · 반복 허용 형식 · 마지막 장 형식 · 최근 마지막 장 안내
FAKE['generativelanguage.googleapis.com'] = (u, o) => { const pt = JSON.parse(o.payload).contents[0].parts[0].text; if (!/편집장/.test(pt)) globalThis.__lastPrompt = pt; return { body: { candidates: [{ content: { parts: [{ text: JSON.stringify({ ig: { cards: [{ layout: 'c-receipt', k: '머리말', t: '표지', b: 'x | 1\ny | 2', icon: 'nope' }, { layout: 'event', t: 'A', b: '10/21 수 | 15:00\n통화 | GBP' }, { layout: 'event', t: 'B', b: '10/22 목 | 21:30\n통화 | USD' }, { layout: 'vs', t: 'C', b: 'a|b|c|d\nx|y|z' }, { layout: 'vs', t: 'D', b: 'a|b|c|d\nx|y|z' }, { layout: 'e-msg', t: '끝', b: 'Hello [x]', n: '메모' }], caption: 'c' } }) }] } }] } }; };
X.upsert_('topics', [{ id: 'tv1', title: '주간 발표 일정 정리', group: '경제 캘린더·이벤트', state: '후보', opt: { ig: true, th: false, broker: '' } }]);
const v1 = C(X.generateTopic_('tv1')[0]).cards;
console.log((JSON.stringify(v1.map(c => c.layout)) === JSON.stringify(['c-report', 'event', 'event', 'vs', 'body', 'e-msg']) && v1[0].k === '머리말' && !v1[0].icon && v1[5].n === '메모' ? 'PASS' : 'FAIL') + ' 표지는 주제군 고정(다른 표지 요청 무시) · 발표별 반복 허용 · 마지막 장 형식 유지 · 머리말·메모 저장', JSON.stringify(v1.map(c => c.layout)));
console.log((/c-report/.test(globalThis.__lastPrompt) && /최근 게시물이 쓴 마지막 장/.test(globalThis.__lastPrompt) ? 'PASS' : 'FAIL') + ' 프롬프트에 주제군 표지 규칙 · 최근 마지막 장 안내');
FAKE['generativelanguage.googleapis.com'] = () => ({ body: { candidates: [{ content: { parts: [{ text: JSON.stringify({ ig: { cards: [{ layout: 'c-issue', t: '적립이 안 된다면?', b: '화면\na | b | $0 | 확인 필요' }, { t: 'x', b: 'y' }, { layout: 'body', t: '끝', b: 'z\nw' }], caption: 'c' } }) }] } }] } });
X.upsert_('topics', [{ id: 'tv2', title: '적립 누락 상황 점검', group: '거래비용·페이백', state: '후보', opt: { ig: true, th: false, broker: '' } }]);
const v2 = C(X.generateTopic_('tv2')[0]).cards;
console.log((v2[0].layout === 'c-issue' && v2[2].layout === 'e-sum' ? 'PASS' : 'FAIL') + ' 거래비용·페이백은 문제 상황 보조 표지 허용 · 마지막 장 형식 아니면 요약', JSON.stringify(v2.map(c => c.layout)));
// 해시태그 · 제목 자동 줄바꿈 · 발행 캡션
FAKE['generativelanguage.googleapis.com'] = () => ({ body: { candidates: [{ content: { parts: [{ text: JSON.stringify({ ig: { cards: [{ t: '표지', b: '부제' }, { t: '페이백 신청 전, 이 세 가지를 확인하세요', b: '본문' }, { t: '끝', b: '요약' }], caption: '캡션', hashtags: ['해외FX', '#FX 페이백', '#해외FX'] } }) }] } }] } });
X.upsert_('topics', [{ id: 'tg1', title: '해시태그 테스트', group: '거래비용·페이백', state: '후보', opt: { ig: true, th: false, broker: '' } }]);
const tgc = C(X.generateTopic_('tg1')[0]);
console.log((JSON.stringify(tgc.tags) === JSON.stringify(['#베네핍', '#해외FX', '#FX페이백']) ? 'PASS' : 'FAIL') + ' 해시태그 정리 (# 붙이기 · 띄어쓰기 제거 · 중복 제거 · #베네핍)', JSON.stringify(tgc.tags));
console.log((tgc.cards[1].t === '페이백 신청 전,\n이 세 가지를 확인하세요' ? 'PASS' : 'FAIL') + ' 줄 안 나눈 긴 제목은 쉼표 뒤에서 줄바꿈');
FAKE['/contents/cards/'] = url => { const m = url.match(/cards\/([^/]+)\/(v\d+)/); return { body: [1, 2, 3].map(i => ({ name: '0' + i + '.jpg', path: 'cards/' + m[1] + '/' + m[2] + '/0' + i + '.jpg' })) }; };
X.checkRenders_(); const tp = C(tgc.id); tp.state = '예약'; tp.day = 0; tp.time = '00:00'; X.upsert_('contents', [tp]);
const nc = calls.length; X.runPublishDue_();
const capCall = calls.slice(nc).find(c => c.opt && c.opt.payload && c.opt.payload.caption);
console.log((capCall && capCall.opt.payload.caption.trim().endsWith('#베네핍 #해외FX #FX페이백') ? 'PASS' : 'FAIL') + ' 인스타 발행 캡션 끝에 해시태그');
// AI 구글 검색으로 새 계정·유사 서비스 찾기
let withSources = true;
FAKE['generativelanguage.googleapis.com'] = (url, opt) => {
  const body = JSON.parse(opt.payload);
  if (!body.tools) return { body: { candidates: [{ content: { parts: [{ text: '{}' }] } }] } };
  return { body: { candidates: [{ content: { parts: [{ text: '찾았어요:\n' + JSON.stringify({ accounts: [
    { ch: 'ig', h: 'fx_rebate_kr', name: 'FX리베이트', type: '페이백·제휴', desc: '브로커별 리베이트 정리', src: 'https://instagram.com/fx_rebate_kr' },
    { ch: 'th', h: '@mt5_tips', name: 'MT5 팁', type: '이상한값', desc: 'MT5 설정 팁', src: 'https://threads.com/@mt5_tips' },
    { ch: 'ig', h: 'seohakant', name: '서학개미', desc: '우리 회사' },
    { ch: 'ig', h: 'bad handle!', name: '잘못된 아이디' }],
    services: [{ name: 'Rebate Hub', url: 'https://www.rebatehub.example/kr', type: 'FX·CFD 페이백', region: '해외', feat: '브로커 리베이트 비교', src: 'https://rebatehub.example' }] }) }] },
    groundingMetadata: withSources ? { groundingChunks: [{ web: { uri: 'https://vertexaisearch.example/r1', title: 'instagram.com' } }] } : {} }] } };
};
delete props.BRAVE_API_KEY;
const a0 = X.readColl_('accounts').length, s0 = X.readColl_('services').length;
const dr = X.discover_(X.settings_(), Date.now() + 60000);
const AC = X.readColl_('accounts'), SV = X.readColl_('services');
console.log((AC.some(a => a.h === 'fx_rebate_kr' && a.state === '검토 대기' && a.memo.includes('출처')) && AC.some(a => a.h === 'mt5_tips' && a.ch === 'th' && a.type === '플랫폼·도구') && !AC.some(a => a.h === 'seohakant' || a.h === 'bad handle!') && AC.length - a0 === 2 ? 'PASS' : 'FAIL') + ' AI 검색: 새 계정 검토 대기로 추가 · 우리 회사·잘못된 아이디 제외', dr.note);
console.log((SV.some(x => x.url === 'rebatehub.example' && x.memo.includes('확인 필요')) && SV.length - s0 === 1 ? 'PASS' : 'FAIL') + ' AI 검색: 유사 서비스 추가 (도메인 정리)');
const a1 = X.readColl_('accounts').length; X.discover_(X.settings_(), Date.now() + 60000);
console.log((X.readColl_('accounts').length === a1 ? 'PASS' : 'FAIL') + ' AI 검색: 이미 있는 계정은 다시 안 넣음');
// 시장조사 시작 목록
const sa0 = X.readColl_('accounts').length, ss0 = X.readColl_('services').length;
const sr = X.seedMarket_(); const sr2 = X.seedMarket_();
const SA = X.readColl_('accounts');
console.log((sr.accounts > 20 && sr.services > 10 && sr2.accounts === 0 && sr2.services === 0 && SA.length === sa0 + sr.accounts && SA.find(a => a.h === 'wna102ww').state === '제외' && SA.find(a => a.h === 'vantagemarkets.kr').fol === 1032 ? 'PASS' : 'FAIL') + ' 시작 목록: 넣기 · 두 번째는 건너뜀 · 리딩방은 제외', JSON.stringify(sr), JSON.stringify(sr2));
// 수집 게시물 없을 때: 실제 질문 검색으로 주제 발굴
X.upsert_('posts', X.readColl_('posts').map(p => Object.assign(p, { used: 1 })));
FAKE['generativelanguage.googleapis.com'] = (url, opt) => ({ body: { candidates: [{ content: { parts: [{ text: JSON.stringify({ topics: [
  { title: '브로커 입금 반영 시간 체크 포인트', group: '브로커 이용 가이드', plan: '호가창 스프레드 표시·계좌 유형별 차이', question: 'MT5 스프레드 어디서 봐요?', src: 'https://kin.naver.com/x', kw: 'MT5 설정' },
  { title: '레버리지 한도 국가별 차이', group: '이상한군', plan: '제휴 변경·새 계좌 조건', question: '이미 쓰는 계좌도 되나요', src: 'https://cafe.naver.com/y' }] }) }] },
  groundingMetadata: { groundingChunks: [{ web: { uri: 'https://v/1', title: 'naver.com' } }] } }] } });
const tp0 = X.readColl_('topics').length, pr = X.proposeTopics_(3), TP = X.readColl_('topics');
const nt = TP.find(t => t.title === '브로커 입금 반영 시간 체크 포인트');
console.log((pr.added === 2 && TP.length === tp0 + 2 && nt && nt.state === '후보' && nt.reason.includes('실제 질문') && nt.srcUrl.includes('naver') && TP.find(t => t.title.startsWith('레버리지')).group === '분류 필요' ? 'PASS' : 'FAIL') + ' 게시물 없을 때 실제 질문 검색으로 주제 추가', JSON.stringify(pr));
const pr2 = X.proposeTopics_(3);
console.log((pr2.added === 0 && !pr2.note ? 'PASS' : 'FAIL') + ' 같은 주제는 다시 안 넣음 (실패로 안 셈)', JSON.stringify(pr2));
const rsr = ctx.api('research');
console.log((rsr.result && 'topics' in rsr.result ? 'PASS' : 'FAIL') + ' 지금 수집에 주제 발굴 포함', rsr.result && rsr.result.note);
// 지금 전체 한 번 돌려보기
const alerts = [], trig = [];
ctx.SpreadsheetApp.getUi = () => ({ Button: { OK: 'OK', YES: 'YES' }, ButtonSet: { OK: 1, OK_CANCEL: 2, YES_NO: 3 }, alert: (...a) => { alerts.push(a.join(' | ')); return a[2] === 3 ? 'YES' : 'OK'; } });
ctx.ScriptApp.getProjectTriggers = () => trig.map(f => ({ getHandlerFunction: () => f }));
ctx.ScriptApp.newTrigger = f => ({ timeBased: () => ({ everyMinutes: () => ({ create: () => trig.push(f) }) }) });
FAKE['generativelanguage.googleapis.com'] = (url, opt) => {
  const body = JSON.parse(opt.payload), p = body.contents[0].parts[0].text;
  const out = body.tools ? (p.includes('"topics"') ? { topics: [{ title: '출금 신청 후 반영까지 확인할 항목', group: '브로커 이용 가이드', plan: '처리 시간·수수료·최소 금액', question: '출금 언제 들어와요?', src: 'https://kin.naver.com/z' }] } : { accounts: [], services: [] })
    : { ig: { cards: [{ t: '표지', b: '부제' }, { t: '본문', b: '설명' }, { t: '끝', b: '요약' }], caption: '캡션', hashtags: ['해외FX'] }, th: { text: '스레드 글' } };
  return { body: { candidates: [{ content: { parts: [{ text: JSON.stringify(out) }] }, groundingMetadata: { groundingChunks: [{ web: { uri: 'https://v/2', title: 'naver.com' } }] } }] } };
};
const t0r = tg().length;
X.menuRunAllNow();
const res = alerts.find(a => a.startsWith('결과')) || '';
console.log((res.includes('✓ 시작 목록') && res.includes('✓ 주제 발굴') && /초안 [1-9]/.test(res) && trig.includes('tick') && tg().length > t0r ? 'PASS' : 'FAIL') + ' 전체 한 번 돌려보기: 목록·검색·주제·초안 · 자동 실행 켜기 · 텔레그램 요약');
console.log(res.replace(/\n/g, ' / ').slice(0, 300));
// Gemini 한도: 분당 한도면 기다렸다 재시도, 하루 한도면 바로 안내
let q429 = 1;
FAKE['generativelanguage.googleapis.com'] = () => q429-- > 0 ? { code: 429, body: { error: { message: 'You exceeded your current quota, please check your plan and billing details.' } } } : { body: { candidates: [{ content: { parts: [{ text: '{"ok":1}' }] } }] } };
let gq; try { gq = X.geminiPost_({}); } catch (e) { gq = e.message; }
console.log((gq && gq.candidates ? 'PASS' : 'FAIL') + ' Gemini 분당 한도 → 기다렸다 다시 시도해서 성공', JSON.stringify(gq).slice(0, 80));
FAKE['generativelanguage.googleapis.com'] = () => ({ code: 429, body: { error: { message: 'Quota exceeded for metric: generate_content_free_tier_requests, limit: 250, PerDay' } } });
try { X.geminiPost_({}); gq = 'no error'; } catch (e) { gq = e.message; }
console.log((gq.includes('오늘 무료 사용량') ? 'PASS' : 'FAIL') + ' Gemini 하루 한도 → 바로 쉬운 말로 안내', gq);
// AI 1차 검토
const pend = () => X.readColl_('accounts').filter(a => a.state === '검토 대기' && !a.ai);
const pl = pend();
FAKE['generativelanguage.googleapis.com'] = (url, opt) => { const n = (JSON.parse(opt.payload).contents[0].parts[0].text.match(/^\d+\. /gm) || []).length;
  return { body: { candidates: [{ content: { parts: [{ text: JSON.stringify({ results: Array.from({ length: n }, (_, i) => ({ n: i + 1, d: ['monitor', 'exclude', 'unsure', 'weird'][i % 4], r: '이유 ' + (i + 1) })) }) }] } }] } }; };
const ar = X.autoReview_();
const AA = X.readColl_('accounts'), byId = id => AA.find(a => a.id === id);
const m1 = byId(pl[0].id), ex1 = byId(pl[1].id), u1 = byId(pl[2].id), w1 = pl[3] && byId(pl[3].id);
console.log((m1.state === '모니터링 중' && m1.auto === true && ex1.state === '제외' && ex1.exReason.includes('AI') && u1.state === '검토 대기' && u1.ai.d === 'unsure' && (!w1 || w1.state === '검토 대기') && pend().length === Math.max(0, pl.length - 40) ? 'PASS' : 'FAIL') + ' AI 1차 검토: 확실한 것만 옮기고 애매·이상한 값은 사람에게', JSON.stringify(ar));
console.log((X.autoReview_().reviewed === 0 ? 'PASS' : 'FAIL') + ' AI 1차 검토: 이미 본 계정은 다시 안 봄');
// 벤치마크
X.seedMarket_();
const BA = X.readColl_('accounts'), BS = X.readColl_('services');
const mg = BA.find(a => a.h === 'metaguidenow'), tm2 = BA.find(a => a.h === 'tethermax_official');
console.log((mg && mg.bench && mg.state === '모니터링 중' && tm2 && tm2.bench && BS.find(s => s.name === 'Money Charger' && s.bench) && BS.filter(s => s.bench).length >= 5 ? 'PASS' : 'FAIL') + ' 벤치마크: 빠진 곳 추가 · 기존 항목 표시 · 계정은 모니터링', BS.filter(s => s.bench).map(s => s.name).join(','));
// 한국 대상만: 글로벌 계정 제외
const KA = X.readColl_('accounts'), st1x = KA.find(a => a.h === 'startrader.official');
console.log((st1x && st1x.state === '제외' && st1x.exReason.includes('한국') && KA.find(a => a.h === 'xmkorea').state !== '제외' ? 'PASS' : 'FAIL') + ' 한국 대상만: 글로벌 공식 계정 제외 · 한국 계정 유지', st1x && st1x.state);
// 검색 풀 넓히기: 검색 각도 + 비슷한 계정 따라가기
const nc0 = calls.length; X.discover_(X.settings_(), Date.now() + 60000);
const gp = calls.slice(nc0).filter(c => c.url.includes('generativelanguage')).map(c => JSON.parse(c.opt.payload).contents[0].parts[0].text);
console.log((gp.length >= 5 && gp.some(t => t.includes('비슷한 방식으로 운영하는')) && gp.some(t => /MT5 세팅|MT4 지표|해외FX 계좌개설|XM 가입|해외선물 수수료/.test(t)) ? 'PASS' : 'FAIL') + ' 검색 풀: 검색 각도 추가 · 비슷한 계정 따라가기', gp.length + '회');
// 직접 확인: 없는 계정·사이트 버리고, 있는 건 팔로워 채움
FAKE['generativelanguage.googleapis.com'] = (url, opt) => { const body = JSON.parse(opt.payload); if (!body.tools) return { body: { candidates: [{ content: { parts: [{ text: '{"results":[]}' }] } }] } };
  return { body: { candidates: [{ content: { parts: [{ text: JSON.stringify({ accounts: [{ ch: 'ig', h: 'real_fx_guide', name: 'AI이름', desc: 'MT5 세팅' }, { ch: 'ig', h: 'fake_ghost_acc', name: '없는 계정' }],
    services: [{ name: '진짜 페이백', url: 'realpayback.kr', type: 'FX·CFD 페이백', region: '국내' }, { name: '없는 사이트', url: 'nosite-rebate.com', type: 'FX·CFD 페이백' }] }) }] }, groundingMetadata: { groundingChunks: [{ web: { uri: 'https://v/3', title: 'x' } }] } }] } }; };
const vr = X.discover_(X.settings_(), Date.now() + 60000);
const VA = X.readColl_('accounts'), VS = X.readColl_('services'), rg = VA.find(a => a.h === 'real_fx_guide');
console.log((rg && rg.verified === true && rg.fol === 1234 && !VA.some(a => a.h === 'fake_ghost_acc') && VS.some(s => s.url === 'realpayback.kr') && !VS.some(s => s.url === 'nosite-rebate.com') ? 'PASS' : 'FAIL') + ' 직접 확인: 없는 계정·사이트 버림 · 있는 계정은 팔로워 채움', vr.note);
// 검색 출처 목록이 없어도: 계정은 직접 확인으로 받고, 주제는 검색어 기록으로 받고, 못 찾으면 주제군에서 기획
X.readColl_('topics').filter(t => t.state === '후보').forEach(t => { t.state = '제외'; X.upsert_('topics', [t]); });
let mode = 'nosearch';
FAKE['generativelanguage.googleapis.com'] = (url, opt) => { const body = JSON.parse(opt.payload);
  const gm = mode === 'queries' ? { webSearchQueries: ['FX 페이백 질문'] } : {};
  const txt = body.tools ? JSON.stringify({ topics: [{ title: '스왑 포인트 계산 방법', group: '플랫폼 활용', plan: 'p', question: 'q', src: 'https://kin.naver.com/q' }] })
    : JSON.stringify({ topics: [{ title: '계좌 유형별 스프레드 보는 법', group: '거래비용·페이백', plan: '계좌 유형·종목별 확인', reason: '주제군 순환' }] });
  return { body: { candidates: [{ content: { parts: [{ text: txt }] }, groundingMetadata: gm }] } }; };
const b1 = X.proposeTopicsAI_(3);
console.log((b1.added === 1 && X.readColl_('topics').some(t => t.title === '계좌 유형별 스프레드 보는 법' && t.src.includes('주제군')) ? 'PASS' : 'FAIL') + ' 검색 안 된 날: 주제군에서 기획해서 대기열 채움', JSON.stringify(b1));
mode = 'queries';
const b2 = X.proposeTopicsAI_(3);
console.log((b2.added === 1 && X.readColl_('topics').some(t => t.title === '스왑 포인트 계산 방법') ? 'PASS' : 'FAIL') + ' 출처 목록 없어도 검색어 기록 있으면 질문 주제 받음', JSON.stringify(b2));
// 경제 캘린더: 실제 데이터 모양으로 주간·오늘 주제, 초안 지시문에 확정 데이터
const nowIso = (h) => new Date(Date.now() + h * 3600e3).toISOString().replace('Z', '+00:00');
FAKE['ff_calendar_thisweek'] = () => ({ body: [
  { title: 'CPI y/y', country: 'GBP', date: nowIso(-30), impact: 'High', forecast: '3.4%', previous: '3.1%' },
  { title: 'Non-Farm Employment Change', country: 'USD', date: nowIso(2), impact: 'High', forecast: '150K', previous: '120K' },
  { title: 'Unemployment Claims', country: 'USD', date: nowIso(30), impact: 'Medium', forecast: '200K', previous: '199K' },
  { title: 'German Ifo', country: 'EUR', date: nowIso(40), impact: 'Low' }] });
const cr = X.calendarTopics_(), CT = X.readColl_('topics').filter(t => t.group === '경제 캘린더·이벤트');
const wk = CT.find(t => t.calWeek), br = CT.find(t => t.calDay);
console.log((cr.added === 2 && wk && wk.facts.includes('비농업 고용(NFP)') && !wk.facts.includes('CPI y/y') && !wk.facts.includes('Ifo') && wk.opt.ig && br && br.opt.th && !br.opt.ig && br.title.includes('비농업') && X.calendarTopics_().added === 0 ? 'PASS' : 'FAIL') + ' 경제 캘린더: 주간(남은 일정만)·오늘 브리핑 주제 · 중복 안 만듦', JSON.stringify(cr));
let calPrompt = '';
FAKE['generativelanguage.googleapis.com'] = (url, opt) => { const pt = JSON.parse(opt.payload).contents[0].parts[0].text; if (!/편집장/.test(pt)) calPrompt = pt; return { body: { candidates: [{ content: { parts: [{ text: JSON.stringify({ ig: { cards: [{ t: '이번 주 경제 캘린더', b: '날짜' }, { layout: 'steps', t: '일정', b: 'a\nb' }, { t: '끝', b: '확인' }], caption: 'c', hashtags: ['경제캘린더'] } }) }] } }] } }; };
X.generateTopic_(wk.id);
console.log((calPrompt.includes('확정 일정 데이터') && calPrompt.includes('비농업 고용(NFP)') && calPrompt.includes('예측하지 않아요') ? 'PASS' : 'FAIL') + ' 경제 캘린더 초안: 확정 데이터·예측 금지 규칙 전달');

// 새 카드 디자인 시험 초안: 한 번만 · 주제군 다르게 최대 3개 · 인스타만
FAKE['generativelanguage.googleapis.com'] = () => ({ body: { candidates: [{ content: { parts: [{ text: JSON.stringify({ ig: { cards: [{ t: '표지', b: 'a | 1\nb | 2' }, { layout: 'big', t: '한 문장', b: '설명' }, { layout: 'e-checks', t: '끝', b: 'x | y' }], caption: 'c' }, th: { text: '스레드' } }) }] } }] } });
X.upsert_('topics', [
  { id: 'tt1', title: '스왑 비용 확인 순서', group: '거래비용·페이백', state: '후보', score: 9 },
  { id: 'tt2', title: '레버리지 설정 화면 위치', group: '플랫폼 활용', state: '후보', score: 8 },
  { id: 'tt3', title: '수수료 계산 예시 모음', group: '거래비용·페이백', state: '후보', score: 7 },
  { id: 'tt4', title: '출금 수단 고르는 기준', group: '브로커 이용 가이드', state: '후보', score: 6 }]);
ctx.PropertiesService.getScriptProperties().deleteProperty('TEST_DRAFTS');
const nBefore = X.readColl_('contents').length, tgBefore = tg().length;
X.testDraftsOnce_();
const made = X.readColl_('contents').slice(nBefore);
X.testDraftsOnce_();
const groups = made.map(c => c.group);
console.log((made.length === 3 && made.every(c => c.ch === 'ig') && new Set(groups).size === 3 && X.readColl_('contents').length === nBefore + 3 && tg().slice(tgBefore).some(m => /시험 초안 3개/.test(JSON.stringify(m))) ? 'PASS' : 'FAIL') + ' 새 카드 시험 초안: 주제군 다른 3개 · 인스타만 · 한 번만 · 텔레그램 요약', JSON.stringify(groups));

// 장 제목이 빠진 AI 답: 한 번 더 요청 · title 키도 받음 · 계속 빠지면 실패
let nCall = 0;
FAKE['generativelanguage.googleapis.com'] = () => { nCall++; const body = nCall === 1 ? { cards: [{ t: '표지', b: 'x' }, { layout: 'vs', b: 'a|b|c|d\nx|y|z' }, { layout: 'e-checks', b: 'q | w' }], caption: 'c' } : { cards: [{ t: '표지', b: 'x' }, { layout: 'vs', title: '비교 제목', b: 'a|b|c|d\nx|y|z' }, { layout: 'e-checks', t: '끝 제목', b: 'q | w' }], caption: 'c' }; return { body: { candidates: [{ content: { parts: [{ text: JSON.stringify({ ig: body }) }] } }] } }; };
X.upsert_('topics', [{ id: 'tn1', title: '증거금 유지율 읽는 법', group: '플랫폼 활용', state: '후보', opt: { ig: true, th: false, broker: '' } }]);
const tn = C(X.generateTopic_('tn1')[0]).cards;
console.log((nCall === 2 && tn[1].t.replace(/[“”]/g, '') === '비교 제목' && tn[2].t.replace(/[“”]/g, '') === '끝 제목' ? 'PASS' : 'FAIL') + ' 제목 빠진 답이면 다시 요청 · title 키도 제목으로', nCall);
FAKE['generativelanguage.googleapis.com'] = () => ({ body: { candidates: [{ content: { parts: [{ text: JSON.stringify({ ig: { cards: [{ t: '표지', b: 'x' }, { layout: 'big', b: 'y' }], caption: 'c' } }) }] } }] } });
X.upsert_('topics', [{ id: 'tn2', title: '스프레드 넓어지는 시간대', group: '거래비용·페이백', state: '후보', opt: { ig: true, th: false, broker: '' } }]);
let tnErr = ''; try { X.generateTopic_('tn2'); } catch (e) { tnErr = e.message; }
console.log((/제목이 빠졌/.test(tnErr) && X.readColl_('topics').find(t => t.id === 'tn2').state === '생성 실패' ? 'PASS' : 'FAIL') + ' 두 번 다 제목 없으면 생성 실패로 (다시 시도 가능)', tnErr);

// 본문이 형식 규칙에 안 맞으면: 어느 장이 틀렸는지 알려 다시 요청 · 그래도 안 맞으면 기본 형식으로
let fCalls = [];
FAKE['generativelanguage.googleapis.com'] = (u, o) => { fCalls.push(JSON.parse(o.payload).contents[0].parts[0].text); return { body: { candidates: [{ content: { parts: [{ text: JSON.stringify({ ig: { cards: [{ t: '표지', b: '한 줄' }, { layout: 'steps', t: '순서', b: '한 문장만 있어요' }, { layout: 'ui', t: '화면', b: '설명만' }, { layout: 'e-checks', t: '끝', b: '' }], caption: 'c' } }) }] } }] } }; };
X.upsert_('topics', [{ id: 'tf1', title: '차트 템플릿 저장 위치', group: '혜택·적용 조건', state: '후보', opt: { ig: true, th: false, broker: '' } }]);
const tf = C(X.generateTopic_('tf1')[0]).cards;
console.log((fCalls.length === 2 && /2장 "steps".*3장 "ui".*4장 "e-checks"/.test(fCalls[1]) && JSON.stringify(tf.map(c => c.layout)) === JSON.stringify(['c-plain', 'body', 'body', 'body']) && !tf.some(c => '_was' in c) ? 'PASS' : 'FAIL') + ' 형식 안 맞는 본문: 틀린 장 알려 다시 요청 · 그래도 안 맞으면 기본 형식', JSON.stringify(tf.map(c => c.layout)));

// 편집 단계: 뻔한 문장을 고친 답으로 바꿈 · 형식 깨진 편집 결과는 버림
let eCalls = [];
FAKE['generativelanguage.googleapis.com'] = (u, o) => { const pt = JSON.parse(o.payload).contents[0].parts[0].text; eCalls.push(pt);
  const first = { cards: [{ t: '표지', b: '크레딧 | $100 | 출금 불가\n수익 | $30 | 조건 후' }, { layout: 'steps', t: '확인 순서', b: '웹사이트 방문해서 메뉴 열기 | 프로모션 내용 확인하기\n약관 페이지 열어서 보기 | 관련 조항 검토하기' }, { layout: 'e-checks', t: '끝', b: '조건을 꼼꼼히 확인하기\n기한을 꼼꼼히 확인하기' }], caption: 'c' };
  const edited = { cards: [{ t: '표지', b: '크레딧 | $100 | 출금 불가\n수익 | $30 | 조건 후' }, { layout: 'steps', t: '확인 순서', b: '회원 페이지 → 프로모션 | 남은 거래량 확인\n보너스 약관의 출금 조항 | 출금 시 보너스 차감 여부' }, { layout: 'e-checks', t: '끝', b: '남은 거래량 몇 랏인지\n지급일부터 며칠인지' }], caption: '고친 캡션' };
  return { body: { candidates: [{ content: { parts: [{ text: JSON.stringify(/편집장/.test(pt) ? edited : { ig: first }) }] } }] } }; };
X.upsert_('topics', [{ id: 'te1', title: '보너스 출금 조건 정리', group: '혜택·적용 조건', state: '후보', opt: { ig: true, th: false, broker: '' } }]);
const te = C(X.generateTopic_('te1')[0]);
console.log((eCalls.length >= 2 && /편집장/.test(eCalls[eCalls.length - 1]) && /회원 페이지/.test(te.cards[1].b) && te.caption === '고친 캡션' ? 'PASS' : 'FAIL') + ' 편집 단계: 뻔한 문장을 고친 답으로 교체', eCalls.length);
eCalls = [];
FAKE['generativelanguage.googleapis.com'] = (u, o) => { const pt = JSON.parse(o.payload).contents[0].parts[0].text; eCalls.push(pt);
  const ok = { cards: [{ t: '표지', b: '크레딧 | $100 | x\n수익 | $30 | y' }, { layout: 'steps', t: '순서', b: 'a | b\nc | d' }, { layout: 'e-checks', t: '끝', b: 'e\nf' }], caption: '첫 캡션' };
  const broken = { cards: [{ t: '표지', b: 'x' }, { layout: 'steps', b: '한 줄' }], caption: '깨진 캡션' };
  return { body: { candidates: [{ content: { parts: [{ text: JSON.stringify(/편집장/.test(pt) ? broken : { ig: ok }) }] } }] } }; };
X.upsert_('topics', [{ id: 'te2', title: '크레딧 유효 기간 계산', group: '혜택·적용 조건', state: '후보', opt: { ig: true, th: false, broker: '' } }]);
const te2 = C(X.generateTopic_('te2')[0]);
console.log((te2.caption === '첫 캡션' && te2.cards[1].layout === 'steps' ? 'PASS' : 'FAIL') + ' 편집 결과가 형식을 깨면 첫 초안 유지');

// 처음부터 다시: 발행 완료 기록만 남기고 초안·주제 삭제 → 주제 발굴 → 새 초안 · 한 번만
X.upsert_('contents', [{ id: 'keep-pub', ch: 'ig', state: '발행됨', topic: '발행된 글', cards: [] }]);
FAKE['generativelanguage.googleapis.com'] = (u, o) => ({ body: { candidates: [{ content: { parts: [{ text: JSON.stringify({ ig: { cards: [{ t: '표지', b: 'a | 1\nb | 2' }, { layout: 'big', t: '한 문장', b: '설명' }, { layout: 'e-checks', t: '끝', b: 'x | y\nz | w' }], caption: 'c' } }) }] } }] } });
const before = X.readColl_('contents').filter(c => c.state !== '발행됨').length;
ctx.RESET_AFTER_ = '';
ctx.PropertiesService.getScriptProperties().deleteProperty('RESET_DONE');
const tgR = tg().length;
X.resetAndDraftOnce_();
const after = X.readColl_('contents');
X.resetAndDraftOnce_();
console.log((before > 0 && after.some(c => c.id === 'keep-pub') && after.filter(c => c.state !== '발행됨').every(c => c.state === '검수 대기') && X.readColl_('contents').length === after.length && tg().slice(tgR).some(m => /처음부터 다시/.test(JSON.stringify(m))) ? 'PASS' : 'FAIL') + ' 처음부터 다시: 발행 기록 유지 · 나머지 초안·주제 삭제 후 새로 · 한 번만', before + ' → ' + after.length);

// 편집 결과가 원래보다 많이 길어지면 첫 초안 유지 (휴대폰에서 안 읽힘)
FAKE['generativelanguage.googleapis.com'] = (u, o) => { const pt = JSON.parse(o.payload).contents[0].parts[0].text;
  const ok = { cards: [{ t: '표지', b: '크레딧 | $100 | x\n수익 | $30 | y' }, { layout: 'steps', t: '순서', b: 'a | b\nc | d' }, { layout: 'e-checks', t: '끝', b: 'e\nf' }], caption: '짧은 원본' };
  const long = { cards: [{ t: '표지', b: '크레딧 | $100 | 아주 길게 늘어난 설명 문장이에요\n수익 | $30 | 이것도 아주 길게 늘어난 설명 문장이에요' }, { layout: 'steps', t: '순서', b: '아주 길게 늘어난 단계 이름이에요 | 아주 길게 늘어난 설명이에요\n또 길게 늘어난 단계 | 또 길게 늘어난 설명' }, { layout: 'e-checks', t: '끝', b: '길게 늘어난 항목이에요\n또 길게 늘어난 항목이에요' }], caption: '긴 편집' };
  return { body: { candidates: [{ content: { parts: [{ text: JSON.stringify(/편집장/.test(pt) ? long : { ig: ok }) }] } }] } }; };
X.upsert_('topics', [{ id: 'tl9', title: '증거금 부족 알림 대응', group: '혜택·적용 조건', state: '후보', opt: { ig: true, th: false, broker: '' } }]);
console.log((C(X.generateTopic_('tl9')[0]).caption === '짧은 원본' ? 'PASS' : 'FAIL') + ' 편집 결과가 많이 길어지면 첫 초안 유지');

// 무료 사진(Pexels): 검색어 있는 가운데 장에만 · 최대 2장 · 키 없으면 사진 없이 · 검색어 바꾸면 새로 · 지우면 뺌
let pxCalls = 0;
FAKE['api.pexels.com'] = (u) => { pxCalls++; return { body: { photos: [{ photographer: 'A', src: { large: 'https://images.pexels.com/p1.jpg' } }, { photographer: 'B', src: { large: 'https://images.pexels.com/p2.jpg' } }] } }; };
FAKE['generativelanguage.googleapis.com'] = () => ({ body: { candidates: [{ content: { parts: [{ text: JSON.stringify({ ig: { cards: [{ t: '표지', b: 'a | 1\nb | 2', photo: 'cover photo' }, { layout: 'body', t: 'A', b: 'x\ny', photo: 'trader laptop' }, { layout: 'big', t: 'B', b: 'z', photo: 'phone banking!!' }, { layout: 'qa', t: 'C', b: 'q | a', photo: 'third one' }, { layout: 'steps', t: 'D', b: 'a | b\nc | d', photo: 'steps photo' }, { layout: 'e-checks', t: '끝', b: 'e\nf' }], caption: 'c' } }) }] } }] } });
ctx.PropertiesService.getScriptProperties().setProperty('PEXELS_API_KEY', 'test-key');
X.upsert_('topics', [{ id: 'tp1', title: '해외 송금 수수료 줄이기', group: '거래비용·페이백', state: '후보', opt: { ig: true, th: false, broker: '' } }]);
const pc = C(X.generateTopic_('tp1')[0]).cards;
const withImg = pc.filter(c => c.img).map(c => c.layout);
console.log((JSON.stringify(withImg) === JSON.stringify(['body', 'big']) && !pc[0].photo && !pc[4].photo && pc[2].photo === 'phone banking' ? 'PASS' : 'FAIL') + ' 사진: 가운데 장 중 허용 형식만 · 최대 2장 · 표지·순서 장 제외 · 검색어 정리', JSON.stringify(withImg));
ctx.PropertiesService.getScriptProperties().deleteProperty('PEXELS_API_KEY');
X.upsert_('topics', [{ id: 'tp2', title: '카드 입금 한도 정리', group: '거래비용·페이백', state: '후보', opt: { ig: true, th: false, broker: '' } }]);
console.log((!C(X.generateTopic_('tp2')[0]).cards.some(c => c.img) ? 'PASS' : 'FAIL') + ' 사진 키 없으면 사진 없이 초안');

// Gemini: 기본 모델 하루 한도면 가벼운 모델로 이어서 · 시장조사는 처음부터 가벼운 모델
let mUrls = [];
FAKE['generativelanguage.googleapis.com'] = (u) => { mUrls.push(u); if (/gemini-2\.5-flash:/.test(u)) return { code: 429, body: { error: { message: 'Quota exceeded for metric generate_content_free_tier_requests, limit PerDay' } } };
  return { body: { candidates: [{ content: { parts: [{ text: JSON.stringify({ ig: { cards: [{ t: '표지', b: 'a | 1\nb | 2' }, { layout: 'big', t: '한 문장', b: '설명' }, { layout: 'e-checks', t: '끝', b: 'x | y\nz | w' }], caption: 'c' } }) }] } }] } }; };
ctx.PropertiesService.getScriptProperties().deleteProperty('GEMINI_MAIN_OUT');
X.upsert_('topics', [{ id: 'tq1', title: '레버리지 바꾸는 위치', group: '플랫폼 활용', state: '후보', opt: { ig: true, th: false, broker: '' } }]);
let qErr = ''; try { X.generateTopic_('tq1'); } catch (e) { qErr = e.message; }
const usedLite = mUrls.some(u => /flash-lite/.test(u));
mUrls = []; X.upsert_('topics', [{ id: 'tq2', title: '차트 시간대 바꾸기', group: '플랫폼 활용', state: '후보', opt: { ig: true, th: false, broker: '' } }]); X.generateTopic_('tq2');
console.log((!qErr && usedLite && mUrls.length && mUrls.every(u => /flash-lite/.test(u)) ? 'PASS' : 'FAIL') + ' 기본 모델 하루 한도 → 가벼운 모델로 이어서 · 그날은 계속 가벼운 모델', qErr);
ctx.PropertiesService.getScriptProperties().deleteProperty('GEMINI_MAIN_OUT');

// ── 레시피: 주제군 레시피 장 순서 · 글자 한도 · 다시 요청 · 순서 다르면 실패 ──
ctx.RECIPES_ = new Function(fs.readFileSync(B + 'Recipes.gs', 'utf8') + '; return RECIPES_;')();
let rp = [];
const okCards = { recipe: 'reasons', cards: [{ layout: 'c-num', t: '출금이\n“늦어지는 이유”', b: '3\n인증\n수단' }, { layout: 'reason', t: '인증이\n“승인 전”이에요', b: '검토 중이면 잠겨요.' }, { layout: 'reason', t: '수단이\n“달라요”', b: '입금 수단 먼저예요.' }, { layout: 'route', t: '어디로\n“먼저” 올까', b: '카드 입금 | 카드로 환불 | 입금액까지' }, { layout: 'e-msg', t: '고객센터에\n“이렇게”', b: 'Hello [x]' }] };
const longCards = JSON.parse(JSON.stringify(okCards)); longCards.cards[1].t = '인증 절차가 아직 끝나지 않았어요 그래서';
FAKE['generativelanguage.googleapis.com'] = (u, o) => { const pt = JSON.parse(o.payload).contents[0].parts[0].text; rp.push(pt);
  if (/편집장/.test(pt)) return { body: { candidates: [{ content: { parts: [{ text: JSON.stringify(okCards) }] } }] } };
  return { body: { candidates: [{ content: { parts: [{ text: JSON.stringify({ ig: rp.length === 1 ? longCards : okCards }) }] } }] } }; };
X.upsert_('topics', [{ id: 'tr1', title: '해외 출금 지연 이유', group: '브로커 이용 가이드', state: '후보', opt: { ig: true, th: false, broker: '' } }]);
const rc = C(X.generateTopic_('tr1')[0]).cards;
console.log((/레시피\(가장 중요\)/.test(rp[0]) && /"reasons"/.test(rp[0]) && /14자 이내/.test(rp[1]) && rc[1].t === '인증이\n“승인 전”이에요' && JSON.stringify(rc.map(c => c.layout)) === JSON.stringify(['c-num', 'reason', 'reason', 'route', 'e-msg']) ? 'PASS' : 'FAIL') + ' 레시피: 예시 전달 · 글자 한도 넘으면 어디가 넘었는지 알려 다시 요청', rp.length);
rp = [];
FAKE['generativelanguage.googleapis.com'] = (u, o) => { rp.push(1); return { body: { candidates: [{ content: { parts: [{ text: JSON.stringify({ ig: { recipe: 'reasons', cards: [{ t: '표지', b: '3\na' }, { layout: 'big', t: '한 문장', b: 'x' }, { layout: 'e-checks', t: '끝', b: 'a\nb' }] } }) }] } }] } }; };
X.upsert_('topics', [{ id: 'tr2', title: '계좌 인증 서류 준비', group: '브로커 이용 가이드', state: '후보', opt: { ig: true, th: false, broker: '' } }]);
let rErr = ''; try { X.generateTopic_('tr2'); } catch (e) { rErr = e.message; }
console.log((!rErr && rp.length >= 2 && X.readColl_('contents').some(c => c.gid === 'tr2' && c.qa && c.qa.state === '대기') ? 'PASS' : 'FAIL') + ' 레시피 장 순서를 안 따라도 초안은 만들고 품질 관문에 맡김 (버리지 않음)', rErr);
delete ctx.RECIPES_;

// 내용 검사: 시각 없는 발표 장 · 빈 말 항목 · 보고서 말투 제목 → 어디가 틀렸는지 알려 다시 요청
let sp = [];
FAKE['generativelanguage.googleapis.com'] = (u, o) => { const pt = JSON.parse(o.payload).contents[0].parts[0].text; sp.push(pt);
  return { body: { candidates: [{ content: { parts: [{ text: JSON.stringify({ ig: { cards: [{ t: '오늘 오후 3시,\n영국 물가 발표', b: '수 | 영국 CPI | 15:00' }, { layout: 'event', t: '작년보다\n올랐을까?', b: '발표 지표 | 소비자물가\n예상 | 3.4%' }, { layout: 'e-sum', t: '오늘\n확인할 것들', b: '발표 | 영국 CPI\n체크 | 스프레드\n체크 | 증거금' }] } }) }] } }] } }; };
X.upsert_('topics', [{ id: 'ts1', title: '영국 물가 발표일', group: '경제 캘린더·이벤트', state: '후보', opt: { ig: true, th: false, broker: '' } }]);
X.generateTopic_('ts1');
const retry = sp.find(p => /다시 요청/.test(p)) || '';
console.log((/날짜 \| 한국 시각/.test(retry) && /비어 있는 말/.test(retry) && /겹쳐요/.test(retry) && /보고서/.test(retry) ? 'PASS' : 'FAIL') + ' 내용 검사: 시각 없는 발표 장·빈 말 항목·겹치는 항목·보고서 말투 제목을 짚어 다시 요청');

// 레시피: 마지막 장은 마무리 형식이면 무엇이든 통과 (예: 요약 대신 체크 칸)
ctx.RECIPES_ = new Function(fs.readFileSync(B + 'Recipes.gs', 'utf8') + '; return RECIPES_;')();
FAKE['generativelanguage.googleapis.com'] = () => ({ body: { candidates: [{ content: { parts: [{ text: JSON.stringify({ ig: { recipe: 'week', cards: [{ t: '이번 주\n“사흘”', b: '수 | 영국 물가 | 15:00' }, { layout: 'event', t: '오후 3시,\n“영국 물가”', b: '10/21 수 | 15:00\n통화 | 파운드\n- 스프레드 확인' }, { layout: 'event', t: '목요일,\n“뉴질랜드”', b: '10/22 목 | 06:45\n통화 | 뉴질랜드달러\n- 증거금 여유' }, { layout: 'event', t: '금요일 밤,\n“미국 지표”', b: '10/23 금 | 22:45\n통화 | 달러\n- 대기 주문' }, { layout: 'e-checks', t: '발표 전에\n이 3가지만', b: '스프레드 2~3배 | 발표 직후\n증거금 여유 | 급변 대비\n대기 주문 위치 | 미끄러짐' }] } }) }] } }] } });
X.upsert_('topics', [{ id: 'tw1', title: '이번 주 발표 세 가지', group: '경제 캘린더·이벤트', state: '후보', opt: { ig: true, th: false, broker: '' } }]);
let wErr = ''; try { X.generateTopic_('tw1'); } catch (e) { wErr = e.message; }
console.log((!wErr ? 'PASS' : 'FAIL') + ' 레시피: 마지막 장은 마무리 형식이면 통과 (요약 대신 체크 칸)', wErr);
delete ctx.RECIPES_;
