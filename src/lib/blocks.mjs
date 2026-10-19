import { esc, hash, shuffle, won, josa } from './util.mjs';
import { frame, callBox } from './html.mjs';
import { ANCHOR, FAQ_POOL, STEP_SETS, NOTICE, SEC, COURSE_ANCHOR, DOC_LINKS, CLS_ORDER, clsName, fk, fa, fb } from '../content/copy.mjs';

const at = (h, arr, slot = 0) => arr[parseInt(h.substr((slot * 3) % 29, 3), 16) % arr.length];

/** 한글 첫소리 — 동 이름을 묶을 때 쓴다. */
const CHO = ['ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
const MERGE = { 'ㄲ': 'ㄱ', 'ㄸ': 'ㄷ', 'ㅃ': 'ㅂ', 'ㅆ': 'ㅅ', 'ㅉ': 'ㅈ' };
export function choOf(name) {
  const c = name.codePointAt(0) - 0xac00;
  if (c < 0 || c >= 11172) return '#';
  const k = CHO[Math.floor(c / 588)];
  return MERGE[k] || k;
}

/* ── 세 자 막대 — 80m · 240m · 720m 로 잰 둘레를 가로 막대 셋으로 ─────
   막대 길이는 80m 자로 잰 값을 100%로 둔 비례다. */
export function rulerBars(v) {
  const names = ['80m 자', '240m 자', '720m 자'];
  const top = v[0] || 1;
  return `<div class="el-rb" role="img" aria-label="80m 자 ${esc(fk(v[0]))}, 240m 자 ${esc(fk(v[1]))}, 720m 자 ${esc(fk(v[2]))}">
${v.map((x, i) => `  <p class="el-rb-r"><span class="el-rb-n">${names[i]}</span><span class="el-rb-t"><i style="width:${Math.max(4, Math.round((x / top) * 100))}%"></i></span><b>${esc(fk(x))}</b></p>`).join('\n')}
</div>`;
}

/* ── 예약 문의 띠 ───────────────────────────────────────────── */
export function hailStrip(cfg, place, seedKey) {
  const h = hash(seedKey, 'hs');
  const lines = [
    `${place}${josa(place, '이면/면')} 번호 하나로 충분해요. 코스와 시각만 정해서 걸어 주세요.`,
    `${place}에 나갈 수 있는 시각은 통화하는 동안 바로 답해요.`,
    `${place}에서 필요한 건 주소 한 줄과 고르신 코스예요. 나머지는 받으면서 여쭐게요.`,
    `문의 창구를 지역별로 나누지 않았어요. ${place}도 같은 번호예요.`,
  ];
  return `<section class="el-hail" aria-label="${esc(place)} 예약 문의">
  <p class="el-hail-p">${esc(at(h, lines))}<span>${esc(at(h, SEC.askTail, 2).replace('@A', cfg.arrive).replace('@H', cfg.hours).replace('@P', cfg.pay))}</span></p>
  ${callBox(cfg, { size: 'l' })}
</section>`;
}

/* ── 코스 = 표 ────────────────────────────────────────────────
   ★안내문마다 아홉 가지를 통째로 되풀이하면 그 덩어리가 본문에서 가장 커진다.
     동·시군구에서는 시드로 고른 셋만 보이고 나머지는 코스 안내문으로 보낸다. */
export function courseRoll(courses, seedKey, place, num = '01', { full = true } = {}) {
  const h = hash(seedKey, 'cr');
  const show = full ? courses : shuffle(courses.slice(), h).slice(0, 3);
  const withText = new Set(shuffle(show.map((c) => c.slug), h).slice(0, full ? 2 : 1));
  const rows = show.map((c) => {
    const line = at(hash(seedKey, c.slug), c.lines);
    return `<tr>
      <th scope="row"><a href="/course/${c.slug}/">${esc(c.ko)}</a>${withText.has(c.slug) ? `<small>${esc(line)}</small>` : ''}</th>
      <td>${c.min}분</td><td>${esc(c.pressure)}</td><td>${c.oil ? '씀' : '안 씀'}</td><td class="el-t-w">${won(c.price)}원</td>
    </tr>`;
  }).join('\n');
  const short = [
    `${esc(place)}에서 통화로 자주 나오는 셋만 옮겼어요. 나머지는 <a href="/course/">코스 쪽</a>에, 값은 <a href="/price/">비용 쪽</a>에 있어요.`,
    `${esc(place)}${josa(place, '이라/라')}고 고를 수 있는 코스가 줄지 않아요. <a href="/course/">전부 보기</a>, <a href="/price/">값만 보기</a>.`,
    `길이나 세기가 안 맞으면 <a href="/course/">아홉 코스 전체</a>를 펼쳐 보세요. 값 표는 어디서나 <a href="/price/">한 장</a>이에요.`,
  ];
  const tail = full ? `${esc(at(h, SEC.courseTail, 2))} ${at(h, SEC.courseLink, 5)}` : at(h, short, 4);
  return frame('course', 'courses', full ? `${esc(place)}에 들고 가는 아홉 코스` : `${esc(place)}에서 먼저 보시는 코스 셋`,
    `<div class="el-tw"><table class="el-t">
    <thead><tr><th scope="col">코스</th><th scope="col">길이</th><th scope="col">세기</th><th scope="col">오일</th><th scope="col" class="el-t-w">값</th></tr></thead>
    <tbody>
${rows}
    </tbody></table></div>
    <p class="el-sec-x">${tail}</p>`,
    esc(at(h, SEC.courseSub, 1)), num);
}

/* ── 접수 흐름 = 세로 타임라인 ─────────────────────────────── */
export function stepSet(seedKey) {
  return at(hash(seedKey, 'st'), STEP_SETS);
}
export function stepCards(seedKey, num = '04') {
  const h = hash(seedKey, 'st');
  const steps = at(h, STEP_SETS);
  return frame('step', 'order', esc(at(h, SEC.stepTitle, 1)),
    `<ol class="el-tl">\n${steps.map((s) => `<li><b>${esc(s.t)}</b><span>${esc(s.d)}</span></li>`).join('\n')}\n</ol>`,
    esc(at(h, SEC.stepSub, 2)), num);
}

/* ── 이름 · 값 두 칸 — rows: [라벨, 값(HTML)] ───────────────── */
export function statTiles(rows) {
  return `<dl class="el-kv">\n${rows.map((r) => `<div><dt>${esc(r[0])}</dt><dd>${r[1]}</dd></div>`).join('\n')}\n</dl>`;
}

/* ── 자주 묻는 것 — 말풍선. 질문은 h3 ───────────────────────── */
export function faqBlock(seedKey, c, n = 5, num = '05') {
  const h = hash(seedKey, 'fq');
  const idx = shuffle(FAQ_POOL.map((_, i) => i), h).slice(0, n);
  const qa = idx.map((i) => {
    const item = FAQ_POOL[i];
    const av = item.a[parseInt(hash(seedKey, 'av', i).substr(0, 3), 16) % item.a.length];
    return { q: item.q(c), a: av(c) };
  });
  const html = frame('faq', 'asked', esc(at(h, SEC.faqTitle, 3)),
    `<div class="el-qa">\n${qa.map((x) => `<div class="el-qa-i"><h3>${esc(x.q)}</h3><p>${esc(x.a)}</p></div>`).join('\n')}\n</div>`,
    esc(at(h, SEC.faqSub, 4)), num);
  return { html, qa };
}

/* ── 안내/주의 ────────────────────────────────────────────────── */
export function noticeBlock(seedKey, num) {
  const h = hash(seedKey, 'nt');
  const items = shuffle(NOTICE, h).slice(0, 4);
  return frame('notice', 'mind', esc(at(h, SEC.noticeTitle, 5)),
    `<ul class="el-heed">\n${items.map((t) => `<li>${esc(t)}</li>`).join('\n')}\n</ul>`, null, num);
}

/* ── 롱테일 링크 ──────────────────────────────────────────────── */
export function longtail(pool, seedKey, n, label, heading, sub, num) {
  const h = hash(seedKey, 'lt');
  const picked = shuffle(pool, h).slice(0, n);
  const items = picked.map((p) => {
    const tpl = ANCHOR[parseInt(hash(seedKey, p.label).substr(0, 3), 16) % ANCHOR.length];
    return `<a href="${p.href}">${esc(tpl(p.label))}</a>`;
  }).join('');
  return frame('longtail', label, heading, `<p class="el-slash">${items}</p>`, sub || esc(at(h, SEC.ltSub, 6)), num);
}

/* ── 롱테일 주제 묶음 — 슬래시로 이은 한 줄씩 ─────────────────── */
export function topicLinks(groups, seedKey, num, heading, sub) {
  const h = hash(seedKey, 'tp');
  const body = groups.filter((g) => g.items && g.items.length).map((g, gi) => {
    const picked = (g.pick ? shuffle(g.items, hash(seedKey, 'tp', gi)) : g.items).slice(0, g.pick || g.items.length);
    const li = picked.map((p) => {
      const base = p.labels ? p.labels[parseInt(hash(seedKey, p.href).substr(0, 3), 16) % p.labels.length] : p.label;
      const tpl = g.anchor ? g.anchor[parseInt(hash(seedKey, g.label, base).substr(0, 3), 16) % g.anchor.length] : null;
      return `<a href="${p.href}">${esc(tpl ? tpl(base) : base)}</a>`;
    }).join('');
    return `<div class="el-route">
      <p class="el-route-h">${esc(g.label)}</p>
      <p class="el-slash">${li}</p>
    </div>`;
  }).join('\n');
  return frame('topic', 'ways in', heading, `<div class="el-routes">${body}</div>`,
    sub || esc(at(h, SEC.ltSub, 6)), num);
}

/* ── 풀 ──────────────────────────────────────────────────────── */
export function spotPool(regions, { sidoLabel = false, skipGu = '' } = {}) {
  const out = [];
  for (const r of regions) if (r.main) for (const g of r.gu) {
    if (skipGu && `${r.slug}/${g.slug}` === skipGu) continue;
    for (const s of g.spots) out.push({ href: `/${r.slug}/${g.slug}/${s.slug}/`, label: `${sidoLabel ? `${r.name} ` : ''}${g.name} ${s.name}`, u: s });
  }
  return out;
}
export function guPool(regions, { sidoLabel = false, skip = '' } = {}) {
  const out = [];
  for (const r of regions) for (const g of r.gu) {
    if (skip && `${r.slug}/${g.slug}` === skip) continue;
    out.push({ href: `/${r.slug}/${g.slug}/`, label: `${sidoLabel ? `${r.name} ` : ''}${g.name}`, u: g });
  }
  return out;
}

/* ── 결로 묶은 칸 ─────────────────────────────────────────────── */
const CLS_HEAD = {
  glide: '경계가 거의 곧은', ease: '굴곡이 순한', ripple: '잔물결이 깔린',
  wind: '굽이가 또렷한', coil: '경계가 감겨 드는', frill: '가장자리가 주름진',
};
function themeDefs(noun) {
  const defs = CLASS_KEYS().map((k) => ({
    k: `c${k}`, t: `${CLS_HEAD[k]} ${noun}`, f: (u) => u.cls === k,
    sort: (a, b) => b.a - a.a, m: (u) => `굽이 ${fa(u.a)}`,
  }));
  defs.push({ k: 'curvy', t: `굽이값이 가장 높은 ${noun}`, f: () => true, sort: (a, b) => b.a - a.a, m: (u) => `굽이 ${fa(u.a)}` });
  defs.push({ k: 'plain', t: `굽이값이 가장 낮은 ${noun}`, f: () => true, sort: (a, b) => a.a - b.a, m: (u) => `굽이 ${fa(u.a)}` });
  defs.push({ k: 'shrinkbig', t: `긴 자로 바꾸면 가장 많이 줄어드는 ${noun}`, f: () => true, sort: (a, b) => b.b - a.b, m: (u) => `줄어듦 ${fb(u.b)}%` });
  defs.push({ k: 'shrinksmall', t: `긴 자로 바꿔도 덜 줄어드는 ${noun}`, f: () => true, sort: (a, b) => a.b - b.b, m: (u) => `줄어듦 ${fb(u.b)}%` });
  defs.push({ k: 'long', t: `80m 자로 잰 둘레가 긴 ${noun}`, f: () => true, sort: (a, b) => b.v[0] - a.v[0], m: (u) => `둘레 ${fk(u.v[0])}` });
  defs.push({ k: 'short', t: `80m 자로 잰 둘레가 짧은 ${noun}`, f: () => true, sort: (a, b) => a.v[0] - b.v[0], m: (u) => `둘레 ${fk(u.v[0])}` });
  return defs;
}
function CLASS_KEYS() { return CLS_ORDER; }

export function themeCards({ pool, noun, seedKey, num, heading, sub, cards = 4, per = 4, prefer = [] }) {
  const defs = themeDefs(noun).map((d) => ({ ...d, c: pool.filter((x) => d.f(x.u)) })).filter((d) => d.c.length >= per);
  if (!defs.length) return { html: '', list: [] };
  const order = shuffle(defs, hash(seedKey, 'tc'));
  const first = prefer.map((k) => order.find((d) => d.k === k)).filter(Boolean);
  const chosen = [...first, ...order.filter((d) => !first.includes(d))].slice(0, cards);
  const list = [];
  const body = chosen.map((d) => {
    const win = d.c.slice().sort((a, b) => d.sort(a.u, b.u) || a.label.localeCompare(b.label, 'ko')).slice(0, per * 3);
    const pick = shuffle(win, hash(seedKey, 'tc', d.k)).slice(0, per).sort((a, b) => d.sort(a.u, b.u) || a.label.localeCompare(b.label, 'ko'));
    for (const x of pick) list.push({ name: x.label, href: x.href });
    return `<div class="el-tc"><h3>${esc(d.t)}</h3><ul>${pick.map((x) => `<li><a href="${x.href}">${esc(x.label)}</a><b>${esc(d.m(x.u))}</b></li>`).join('')}</ul></div>`;
  }).join('\n');
  return { html: frame('theme', 'by grain', heading, `<div class="el-tcs">${body}</div>`, sub, num), list };
}

/** 코스 묶음 — 시도별 코스 안내문으로 가는 롱테일. */
export function courseTopic(sd, courses) {
  return courses.map((c) => ({ label: `${sd.name} ${c.ko}`, href: `/${sd.slug}/course/${c.slug}/` }));
}

/* ── 같은 시군구 안에서 결이 닮은 구역 ─────────────────────────── */
export function shapeKin(sd, g, s, seedKey, num) {
  const pool = g.spots.filter((x) => x.slug !== s.slug);
  if (!pool.length) return '';
  const rank = (o) => (o.cls === s.cls ? 0 : 1);
  const sorted = pool.slice().sort((a, b) => rank(a) - rank(b) || Math.abs(a.a - s.a) - Math.abs(b.a - s.a) || a.name.localeCompare(b.name, 'ko'));
  const pick = sorted.slice(0, 8);
  return frame('kin', 'same grain', `${esc(g.name)}에서 ${esc(s.name)}${josa(s.name, '과/와')} 결이 닮은 구역`,
    `<ul class="el-tags">\n${pick.map((x) => `<li><a href="/${sd.slug}/${g.slug}/${x.slug}/">${esc(x.name)}<b>${fa(x.a)}</b></a></li>`).join('\n')}\n</ul>`,
    esc(at(hash(seedKey, 'lk'), SEC.kinSub)), num);
}

/* ── 시군구 안의 구역 목록 — 결별로 묶고 점선 잇는 줄 ──────────── */
export function spotIndex(sd, g, seedKey, currentSlug, num) {
  const groups = new Map();
  for (const s of g.spots) {
    if (!groups.has(s.cls)) groups.set(s.cls, []);
    groups.get(s.cls).push(s);
  }
  const body = CLS_ORDER.filter((k) => groups.has(k)).map((k) => {
    const list = groups.get(k).slice().sort((a, b) => b.a - a.a || a.name.localeCompare(b.name, 'ko'));
    return `<section class="el-grp"><h3>${esc(clsName(k))}<em>${list.length}</em></h3><ul class="el-dots">${list
      .map((s) => `<li><a href="/${sd.slug}/${g.slug}/${s.slug}/"${s.slug === currentSlug ? ' aria-current="page"' : ''}><span>${esc(s.name)}</span><i></i><b>${fa(s.a)}</b></a></li>`).join('')}</ul></section>`;
  }).join('\n');
  return frame('spotidx', 'places', `${esc(g.name)} 소속 동 ${g.spotCount}곳 바로가기`,
    `<div class="el-grps">${body}</div>`,
    esc(at(hash(seedKey, 'sx'), SEC.spotIdxSub)), num);
}

/* ── 시군구 안의 읍·면 목록 ────────────────────────────────────
   ★읍은 2026-10-13 지시로 안내문을 내지 않는다. 면과 함께 이름만 올린다. */
export function ruralList(g, seedKey, num) {
  if (!g.ruralCount) return '';
  const label = g.eupCount && g.myeonCount ? `읍 ${g.eupCount}·면 ${g.myeonCount}`
    : g.eupCount ? `읍 ${g.eupCount}` : `면 ${g.myeonCount}`;
  return frame('rural', 'rural', `${esc(g.name)} 소속 ${esc(label)} 이름 모음`,
    `<ul class="el-tags el-tags-n">\n${g.rural.map((m) => `<li><span>${esc(m.name)}</span></li>`).join('\n')}\n</ul>`,
    esc(at(hash(seedKey, 'ru'), SEC.ruralSub)), num);
}

/* ── 서브 지역 시군구 안의 동 이름 ──────────────────── */
export function dongNameList(g, seedKey, num) {
  if (!g.dongNames || !g.dongNames.length) return '';
  const names = shuffle(g.dongNames.slice(), hash(seedKey, 'dnl'));
  return frame('dongidx', 'dong', `${esc(g.name)}에 든 동 ${g.dongNames.length}구역`,
    `<ul class="el-tags el-tags-n">\n${names.map((d) => `<li><span>${esc(d)}</span></li>`).join('\n')}\n</ul>`,
    esc(at(hash(seedKey, 'dn'), SEC.dongSub)), num);
}

/* ── 시도 안의 시군구 목록 ──────────────────────────────────────
   ★깊이 들어온 쪽에서는 시드로 고른 일부만 걸고 나머지는 시도 안내문으로 보낸다. */
export function guIndex(sd, seedKey, currentSlug, num, { pick = 0 } = {}) {
  let list = sd.gu;
  if (pick && sd.gu.length > pick) {
    const keep = new Set(shuffle(sd.gu.map((g) => g.slug), hash(seedKey, 'gi')).slice(0, pick));
    if (currentSlug) keep.add(currentSlug);
    list = sd.gu.filter((g) => keep.has(g.slug));
  }
  list = list.slice().sort((a, b) => a.name.localeCompare(b.name, 'ko'));
  const items = list.map((g) => `<li><a href="/${sd.slug}/${g.slug}/"${g.slug === currentSlug ? ' aria-current="page"' : ''}>${esc(g.name)}<b>${fa(g.a)}</b></a></li>`).join('\n');
  const partial = list.length < sd.gu.length;
  return frame('guidx', 'districts', partial ? `${esc(sd.name)} 시군구 중 ${list.length}곳` : `${esc(sd.name)} 아래 시군구 ${sd.gu.length}곳`,
    `<ul class="el-tags">\n${items}\n</ul>${partial ? `\n<p class="el-sec-x">${esc(sd.name)}의 시군구를 세면 ${sd.gu.length}곳이에요. <a href="/${sd.slug}/">${esc(sd.name)} 안내문</a> 쪽에서 모두 볼 수 있어요.</p>` : ''}`,
    esc(at(hash(seedKey, 'gi'), SEC.guIdxSub)), num);
}

/* ── 결이 닮은 시군구 ────────────────────────────────────────── */
export function kinList(sd, g, seedKey, num) {
  if (!g.kinCount) return '';
  const items = g.kin.map((t) => `<li><a href="/${t.sidoSlug}/${t.slug}/">${esc(t.gu)}<b>${fa(t.a)}${t.same ? '' : ' · 시도 밖'}</b></a></li>`).join('\n');
  return frame('kin2', 'alike', `${esc(g.name)}${josa(g.name, '과/와')} 결이 닮은 시군구`,
    `<ul class="el-tags">\n${items}\n</ul>`,
    esc(at(hash(seedKey, 'kl'), SEC.nearSub)), num);
}

/* ── 아래쪽 안내 링크 ─────────────────────────────────────────── */
export function siteLinks(ctx, seedKey) {
  const { regions } = ctx;
  const h = hash(seedKey, 'sl');
  const all = [];
  for (const r of regions) for (const g of r.gu) for (const s of g.spots) all.push({ r, g, s });
  const spots = shuffle(all, h).slice(0, 12);
  return frame('also', 'more', '이어서 볼 곳',
    `<p class="el-slash">
      <a href="/area/">방문 지역 전부</a><a href="/guide/">시작하기 전에</a><a href="/price/">비용</a><a href="/course/">코스</a><a href="/magazine/">자 메모</a>
      ${shuffle(regions, hash(seedKey, 'sd')).map((r) => `<a href="/${r.slug}/">${esc(r.name)}</a>`).join('')}
      ${spots.map((x) => `<a href="/${x.r.slug}/${x.g.slug}/${x.s.slug}/">${esc(x.g.name)} ${esc(x.s.name)}</a>`).join('')}
    </p>`,
    '시도 아래는 시군구, 수도권과 부산만 거기서 동으로 한 단 더 내려가요. 나머지 지역의 동과 읍·면은 이름만 적었어요.');
}

/** 문서·글 안내문에 다는 주제 묶음 */
export function docTopics(ctx, seedKey, num, heading, sub) {
  const { regions, courses } = ctx;
  const courseAll = courses.map((c) => ({ label: c.ko, href: `/course/${c.slug}/` }));
  const sidoCourse = [];
  for (const r of regions) for (const c of courses) sidoCourse.push({ label: `${r.name} ${c.ko}`, href: `/${r.slug}/course/${c.slug}/` });
  const guList = [];
  for (const r of regions) for (const g of r.gu) guList.push({ label: `${r.name} ${g.name}`, href: `/${r.slug}/${g.slug}/` });
  const deep = [];
  for (const r of regions) if (r.main) for (const g of r.gu) for (const s of g.spots) deep.push({ label: `${g.name} ${s.name}`, href: `/${r.slug}/${g.slug}/${s.slug}/` });
  return topicLinks([
    { label: '코스 이름으로', items: courseAll, anchor: COURSE_ANCHOR },
    { label: '지역 + 코스로', items: sidoCourse, pick: 12, anchor: COURSE_ANCHOR },
    { label: '시군구로', items: guList, pick: 14, anchor: ANCHOR },
    { label: '동 이름으로 바로', items: deep, pick: 14, anchor: ANCHOR },
    { label: '먼저 읽을 것', items: DOC_LINKS },
  ], seedKey, num, heading, sub);
}
