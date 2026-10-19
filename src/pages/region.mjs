import { layout, frame } from '../lib/html.mjs';
import { esc, hash, km2, won, josa } from '../lib/util.mjs';
import { title, desc, clampDesc } from '../lib/seo.mjs';
import * as S from '../lib/schema.mjs';
import {
  courseRoll, stepCards, stepSet, statTiles, faqBlock, noticeBlock, rulerBars,
  shapeKin, spotIndex, ruralList, dongNameList, guIndex, kinList, hailStrip,
  topicLinks, courseTopic, themeCards, spotPool, guPool,
} from '../lib/blocks.mjs';
import {
  SPOT_LEAD_A, SPOT_LEAD_B, SPOT_LEAD_C,
  GU_LEAD, SIDO_LEAD_MAIN, SIDO_LEAD_SUB, SEC,
  clsName, clsTalk, curveWord, shrinkWord, cmpWord, fk, fa, fb,
  ANCHOR, COURSE_ANCHOR, NEAR_ANCHOR, DOC_LINKS,
} from '../content/copy.mjs';

const at = (h, arr, slot = 0) => arr[parseInt(h.substr((slot * 3) % 29, 3), 16) % arr.length];

/** 리드·FAQ 틀에 넘기는 값 꾸러미. 전부 자를 바꿔 가며 경계를 걸어 얻은 숫자다. */
function spotCtx(ctx, sd, g, s) {
  const { cfg, courses, counts } = ctx;
  return {
    sd, g, s,
    nm: s.name, gu: g.name, sido: sd.name, area: km2(s.area),
    p0: fk(s.v[0]), p1: fk(s.v[1]), p2: fk(s.v[2]),
    a: fa(s.a), b: fb(s.b), clsN: clsName(s.cls), clsT: clsTalk(s.cls),
    curve: curveWord(s.a), shrink: shrinkWord(s.b),
    rank: s.rank, gRank: s.gRank, bRank: s.bRank,
    allSpots: counts.spot, guN: g.spotCount,
    hi: g.hi, hiV: fa(g.hiV), lo: g.lo, loV: fa(g.loV),
    bHi: g.bHi, bHiV: fb(g.bHiV), bLo: g.bLo, bLoV: fb(g.bLoV),
    guA: fa(g.a), cmpGu: cmpWord(s.a, g.a),
    clsSame: g.clsCount[s.cls] || 1,
    gP0: fk(g.v[0]), gP2: fk(g.v[2]), gcls: clsName(g.cls),
    place: `${g.name} ${s.name}`,
    hours: cfg.hours, pay: cfg.pay, arrive: cfg.arrive,
    tel: cfg.tel, telLabel: cfg.telLabel,
    minPrice: `${won(Math.min(...courses.map((c) => c.price)))}원`,
  };
}

/* ── 동 안내문 — 메인 네 시도에서만 낸다 ─────────────────────── */
export function spotPage(ctx, sd, g, s) {
  const { cfg, siteUrl, courses, regions } = ctx;
  const path = `/${sd.slug}/${g.slug}/${s.slug}/`;
  const url = `${siteUrl}${path}`;
  const seed = `${sd.name}/${g.name}/${s.name}`;
  const h = hash(seed, 'spot');
  const c = spotCtx(ctx, sd, g, s);

  const open = `<div class="el-lead">
  <p>${at(h, SPOT_LEAD_A, 0)(c)}</p>
  <p>${at(h, SPOT_LEAD_B, 1)(c)}</p>
  <p>${at(h, SPOT_LEAD_C, 2)(c)}</p>
</div>`;

  const facts = frame('fact', 'measured', `${esc(s.name)} 경계를 세 자로 걸으면`,
    rulerBars(s.v) + statTiles([
      ['위치', `<a href="/${sd.slug}/">${esc(sd.full)}</a> / <a href="/${sd.slug}/${g.slug}/">${esc(g.name)}</a>`],
      ['굽이값', `${c.a}<small>${esc(c.curve)}</small>`],
      ['줄어듦', `${c.b}%<small>${esc(c.shrink)}</small>`],
      ['읽은 결', `${esc(c.clsN)}<small>${esc(c.clsT)}</small>`],
      ['땅 넓이', km2(s.area)],
      ['굽이 순위', `${esc(g.name)} 안 ${s.gRank}번째<small>안내문 ${ctx.counts.spot}구역 중 ${s.rank}번째</small>`],
      ['줄어듦 순위', `${ctx.counts.spot}구역 중 ${s.bRank}번째`],
    ]),
    esc(at(h, SEC.factSub, 7)), '01');

  const { html: faqHtml, qa } = faqBlock(seed, c, 5, '05');

  const far = [];
  for (const r of regions) {
    if (r.slug === sd.slug) continue;
    if (r.main) for (const x of r.gu) for (const y of x.spots) far.push({ label: `${x.name} ${y.name}`, href: `/${r.slug}/${x.slug}/${y.slug}/` });
    else for (const x of r.gu) far.push({ label: `${r.name} ${x.name}`, href: `/${r.slug}/${x.slug}/` });
  }
  const sameSido = [];
  for (const x of sd.gu) {
    if (x.slug === g.slug) continue;
    for (const y of x.spots) sameSido.push({ label: `${x.name} ${y.name}`, href: `/${sd.slug}/${x.slug}/${y.slug}/` });
  }
  const steps = stepSet(seed);
  const topics = topicLinks([
    { label: '코스 이름으로', items: courseTopic(sd, courses), anchor: COURSE_ANCHOR },
    { label: `${sd.name} 안 다른 구역`, items: sameSido, pick: 18, anchor: ANCHOR },
    { label: '결이 닮은 시군구', items: g.kin.map((t) => ({ label: t.gu, href: `/${t.sidoSlug}/${t.slug}/` })), anchor: NEAR_ANCHOR },
    { label: '다른 시도', items: far, pick: 18, anchor: ANCHOR },
    { label: '먼저 읽을 것', items: DOC_LINKS },
  ], seed, '10', esc(at(h, SEC.topicHead, 8)), esc(at(h, SEC.topicSub, 3)));
  const theme = themeCards({
    pool: spotPool(regions, { sidoLabel: true, skipGu: `${sd.slug}/${g.slug}` }), noun: '동', seedKey: seed, num: '09',
    heading: esc(at(h, SEC.themeHead, 4)), sub: esc(at(h, SEC.themeSub, 5)), cards: 3, per: 4, prefer: [`c${s.cls}`],
  });

  const body = [
    open,
    facts,
    shapeKin(sd, g, s, seed, '02'),
    courseRoll(courses, seed, s.name, '03', { full: false }),
    stepCards(seed, '04'),
    hailStrip(cfg, `${g.name} ${s.name}`, seed),
    faqHtml,
    spotIndex(sd, g, seed, s.slug, '06'),
    guIndex(sd, seed, g.slug, '07', { pick: 12 }),
    noticeBlock(seed, '08'),
    theme.html,
    topics,
  ].join('\n');

  return {
    path,
    html: layout(ctx, {
      path,
      title: title.spot(sd, g, s),
      desc: clampDesc(desc.spot(sd, g, s)),
      h1: `${esc(g.name)} ${esc(s.name)} <span class="el-h1-s">출장마사지 홈타이 · 80m 자 ${esc(c.p0)} → 720m 자 ${esc(c.p2)}</span>`,
      body,
      pageKind: 'spot',
      about: `${url}#place`,
      geo: { iso: sd.iso, placename: `${sd.full} ${g.name} ${s.name}`, lat: s.lat, lng: s.lng },
      crumbs: [
        { name: '처음', url: `${siteUrl}/` },
        { name: '방문 지역', url: `${siteUrl}/area/` },
        { name: sd.name, url: `${siteUrl}/${sd.slug}/` },
        { name: g.name, url: `${siteUrl}/${sd.slug}/${g.slug}/` },
        { name: s.name, url },
      ],
      jsonld: [
        S.place(`${url}#place`, `${sd.full} ${g.name} ${s.name}`, { lat: s.lat, lng: s.lng },
          { area: s.area, containedIn: { '@type': 'AdministrativeArea', name: `${sd.full} ${g.name}` } }),
        S.service({
          siteUrl, url, cfg,
          name: `${g.name} ${s.name} 방문 관리 — 출장마사지 홈타이`,
          desc: clampDesc(desc.spot(sd, g, s)),
          areaServed: { '@id': `${url}#place` },
          courses,
        }),
        S.itemList(`${url}#themes`, `${s.name}${josa(s.name, '과/와')} 결이 같은 곳`, theme.list.map((x) => ({ name: x.name, url: `${siteUrl}${x.href}` }))),
        S.faqPage(url, qa),
        S.howTo(url, `${g.name} ${s.name}에서 부르는 다섯 걸음`, steps, cfg),
      ],
    }),
  };
}

/* ── 시군구 안내문 ────────────────────────────────────────────── */
export function guPage(ctx, sd, g) {
  const { cfg, siteUrl, courses, regions } = ctx;
  const path = `/${sd.slug}/${g.slug}/`;
  const url = `${siteUrl}${path}`;
  const seed = `${sd.name}/${g.name}`;
  const h = hash(seed, 'gu');

  /* ★읍을 뺀 뒤로 '행정동이 전부 읍·면인 군'이 생겼다. 안내문을 낼 구역이 0이므로 갈래를 나눈다. */
  const mode = g.main ? (g.spotCount ? 'spot' : 'rural') : 'list';
  const c = {
    sido: sd.name, name: g.name, gu: g.name, mainSite: g.main, mode,
    unitN: mode === 'spot' ? g.spotCount : mode === 'rural' ? g.ruralCount : g.dongNames.length,
    spotCount: g.spotCount, dongCount: g.dongCount,
    ruralCount: g.ruralCount, eupCount: g.eupCount, myeonCount: g.myeonCount,
    area: km2(g.area),
    p0: fk(g.v[0]), p1: fk(g.v[1]), p2: fk(g.v[2]),
    a: fa(g.a), b: fb(g.b), clsN: clsName(g.cls), clsT: clsTalk(g.cls),
    hi: g.hi || '', hiV: g.hiV ? fa(g.hiV) : '', lo: g.lo || '', loV: g.loV ? fa(g.loV) : '',
    bHi: g.bHi || '', bHiV: g.bHiV ? fb(g.bHiV) : '',
    kinCount: g.kinCount,
    place: `${sd.name} ${g.name}`,
    hours: cfg.hours, pay: cfg.pay, arrive: cfg.arrive,
    tel: cfg.tel, telLabel: cfg.telLabel,
    minPrice: `${won(Math.min(...courses.map((x) => x.price)))}원`,
  };

  const i0 = parseInt(h.substr(0, 3), 16) % GU_LEAD.length;
  const i1 = (i0 + 1 + (parseInt(h.substr(9, 3), 16) % (GU_LEAD.length - 1))) % GU_LEAD.length;
  const open = `<div class="el-lead">
  <p>${GU_LEAD[i0](c)}</p>
  <p>${GU_LEAD[i1](c)}</p>
</div>`;

  const rows = [
    ['위치', `<a href="/${sd.slug}/">${esc(sd.full)}</a>`],
    ['행정동 합', `${g.dongCount}구역`],
    mode === 'spot' ? ['안내문을 낸 동', `${g.spotCount}구역`]
      : mode === 'rural' ? ['동 쪽', '해당 없음<small>이 군은 읍·면으로만 나뉘어요</small>']
        : ['쪽을 끊은 겹', '시군구<small>동 이름은 아래 목록에 있어요</small>'],
    ['읍·면', g.ruralCount ? `${g.ruralCount}곳<small>목록 이름만 · 읍 ${g.eupCount}, 면 ${g.myeonCount}</small>` : '없음'],
    ['굽이값', `${c.a}<small>${esc(curveWord(g.a))}</small>`],
    ['줄어듦', `${c.b}%<small>${esc(shrinkWord(g.b))}</small>`],
    ['읽은 결', `${esc(c.clsN)}<small>${esc(c.clsT)}</small>`],
    ['결이 닮은 시군구', g.kin.length > 1 ? `${esc(g.kin[0].gu)} · ${esc(g.kin[1].gu)}<small>외 ${g.kinCount - 2}곳</small>` : g.kin.length ? esc(g.kin[0].gu) : '없음'],
    ['땅 넓이', km2(g.area)],
  ];
  if (mode === 'spot' && g.hi) {
    rows.splice(7, 0,
      ['굽이값이 가장 높은 구역', `<a href="/${sd.slug}/${g.slug}/${g.hiSlug}/">${esc(g.hi)}</a><small>굽이값 ${fa(g.hiV)}</small>`],
      ['굽이값이 가장 낮은 구역', `<a href="/${sd.slug}/${g.slug}/${g.loSlug}/">${esc(g.lo)}</a><small>굽이값 ${fa(g.loV)}</small>`],
      ['줄어듦이 가장 큰 구역', `<a href="/${sd.slug}/${g.slug}/${g.bHiSlug}/">${esc(g.bHi)}</a><small>${fb(g.bHiV)}%</small>`]);
  }
  const facts = frame('fact', 'measured', `${esc(g.name)} 경계를 세 자로 걸으면`, rulerBars(g.v) + statTiles(rows), esc(at(h, SEC.factSub, 7)), '01');

  const { html: faqHtml, qa } = faqBlock(seed, c, 5, '06');

  const far = [];
  for (const r of regions) for (const x of r.gu) {
    if (r.slug === sd.slug && x.slug === g.slug) continue;
    far.push({ label: `${r.name} ${x.name}`, href: `/${r.slug}/${x.slug}/` });
  }
  const steps = stepSet(seed);
  const sidoDeep = [];
  for (const x of sd.gu) for (const y of x.spots) if (x.slug !== g.slug) sidoDeep.push({ label: `${x.name} ${y.name}`, href: `/${sd.slug}/${x.slug}/${y.slug}/` });
  const topics = topicLinks([
    { label: '코스 이름으로', items: courseTopic(sd, courses), anchor: COURSE_ANCHOR },
    { label: '결이 닮은 시군구', items: g.kin.map((t) => ({ label: t.gu, href: `/${t.sidoSlug}/${t.slug}/` })), anchor: NEAR_ANCHOR },
    ...(sidoDeep.length ? [{ label: `${sd.name} 동으로 바로`, items: sidoDeep, pick: 16, anchor: ANCHOR }] : []),
    { label: '다른 시군구', items: far, pick: 18, anchor: ANCHOR },
    { label: '먼저 읽을 것', items: DOC_LINKS },
  ], seed, '11', esc(at(h, SEC.topicHead, 8)), esc(at(h, SEC.topicSub, 3)));
  const theme = themeCards({
    pool: mode === 'spot'
      ? spotPool(regions.filter((r) => r.slug === sd.slug), { skipGu: `${sd.slug}/${g.slug}` })
      : guPool(regions, { sidoLabel: true, skip: `${sd.slug}/${g.slug}` }),
    noun: mode === 'spot' ? '동' : '시군구', seedKey: seed, num: '10',
    heading: esc(at(h, SEC.themeHead, 4)), sub: esc(at(h, SEC.themeSub, 5)), cards: 3, per: 4, prefer: [`c${g.cls}`],
  });

  const body = [
    open,
    facts,
    mode === 'spot' ? spotIndex(sd, g, seed, null, '02') : mode === 'list' ? dongNameList(g, seed, '02') : '',
    ruralList(g, seed, '03'),
    courseRoll(courses, seed, g.name, '04', { full: false }),
    hailStrip(cfg, `${sd.name} ${g.name}`, seed),
    kinList(sd, g, seed, '05'),
    stepCards(seed, '06'),
    faqHtml,
    noticeBlock(seed, '08'),
    guIndex(sd, seed, g.slug, '09', { pick: 20 }),
    theme.html,
    topics,
  ].join('\n');

  return {
    path,
    html: layout(ctx, {
      path,
      title: title.gu(sd, g),
      desc: clampDesc(desc.gu(sd, g)),
      h1: `${esc(sd.name)} ${esc(g.name)} <span class="el-h1-s">출장마사지 홈타이 · ${mode === 'spot' ? `동 ${g.spotCount}구역을 자로 쟀어요` : mode === 'rural' ? `읍·면 ${g.ruralCount}구역도 찾아가요` : `행정동 ${g.dongCount}구역 전부 방문해요`}</span>`,
      body,
      pageKind: 'gu',
      pageType: 'CollectionPage',
      about: `${url}#place`,
      mainList: g.spots.length ? `${url}#spotlist` : `${url}#sidogu`,
      geo: { iso: sd.iso, placename: `${sd.full} ${g.name}`, lat: g.lat, lng: g.lng },
      crumbs: [
        { name: '처음', url: `${siteUrl}/` },
        { name: '방문 지역', url: `${siteUrl}/area/` },
        { name: sd.name, url: `${siteUrl}/${sd.slug}/` },
        { name: g.name, url },
      ],
      jsonld: [
        S.place(`${url}#place`, `${sd.full} ${g.name}`, { lat: g.lat, lng: g.lng },
          { area: g.area, containedIn: { '@type': 'AdministrativeArea', name: sd.full } }),
        S.service({
          siteUrl, url, cfg,
          name: `${sd.name} ${g.name} 방문 관리 — 출장마사지 홈타이`,
          desc: clampDesc(desc.gu(sd, g)),
          areaServed: { '@id': `${url}#place` },
          courses,
        }),
        g.spots.length
          ? S.itemList(`${url}#spotlist`, `${g.name} 동`, g.spots.map((s) => ({ name: s.name, url: `${siteUrl}/${sd.slug}/${g.slug}/${s.slug}/` })))
          : S.itemList(`${url}#sidogu`, `${sd.name}의 시군구`, sd.gu.map((x) => ({ name: x.name, url: `${siteUrl}/${sd.slug}/${x.slug}/` }))),
        S.itemList(`${url}#themes`, `${g.name}${josa(g.name, '과/와')} 결이 같은 곳`, theme.list.map((x) => ({ name: x.name, url: `${siteUrl}${x.href}` }))),
        S.faqPage(url, qa),
        S.howTo(url, `${sd.name} ${g.name}에서 부르는 다섯 걸음`, steps, cfg),
      ].filter(Boolean),
    }),
  };
}

/* ── 시도 안내문 ──────────────────────────────────────────────── */
export function sidoPage(ctx, sd) {
  const { cfg, siteUrl, courses, regions } = ctx;
  const path = `/${sd.slug}/`;
  const url = `${siteUrl}${path}`;
  const seed = sd.name;
  const h = hash(seed, 'sd');
  const byB = sd.gu.slice().sort((a, b) => b.b - a.b || a.name.localeCompare(b.name, 'ko'));

  const c = {
    name: sd.name, full: sd.full, guCount: sd.gu.length,
    spotCount: sd.spotCount, dongCount: sd.dongCount, ruralCount: sd.ruralCount,
    p0: fk(sd.v[0]), p1: fk(sd.v[1]), p2: fk(sd.v[2]),
    avgA: fa(sd.avgA), hiName: sd.hiName, loName: sd.loName,
    place: sd.name,
    hours: cfg.hours, pay: cfg.pay, arrive: cfg.arrive,
    tel: cfg.tel, telLabel: cfg.telLabel,
    minPrice: `${won(Math.min(...courses.map((x) => x.price)))}원`,
  };

  const open = `<div class="el-lead"><p>${at(h, sd.main ? SIDO_LEAD_MAIN : SIDO_LEAD_SUB, 0)(c)}</p></div>`;

  const link = (nm, slug) => (sd.main ? esc(nm) : `<a href="/${sd.slug}/${slug}/">${esc(nm)}</a>`);
  const facts = frame('fact', 'measured', `${esc(sd.name)} 경계를 세 자로 걸으면`,
    rulerBars(sd.v) + statTiles([
      ['행정 명칭', esc(sd.full)],
      ['쪽을 낸 단계', sd.main ? '시군구에서 동까지 두 겹' : '시군구 한 겹'],
      ['시군구', `${sd.gu.length}곳`],
      ['행정동 합', `${sd.dongCount}구역`],
      sd.main ? ['안내문을 낸 동', `${sd.spotCount}구역`] : ['동 이름', '시군구 쪽을 열면 나와요'],
      ['읍·면', sd.ruralCount ? `${sd.ruralCount}곳<small>시군구 쪽 목록에서 이름으로 확인</small>` : '없음'],
      ['굽이값', `${fa(sd.a)}<small>${esc(curveWord(sd.a))}</small>`],
      ['줄어듦', `${fb(sd.b)}%<small>${esc(shrinkWord(sd.b))}</small>`],
      ['읽은 결', `${esc(clsName(sd.cls))}<small>${esc(clsTalk(sd.cls))}</small>`],
      [sd.main ? '동 평균 굽이값' : '시군구 평균 굽이값', fa(sd.avgA)],
      [sd.main ? '굽이값이 가장 높은 동' : '굽이값이 가장 높은 시군구', `${link(sd.hiName, sd.hiSlug)}<small>${fa(sd.hiV)}</small>`],
      [sd.main ? '굽이값이 가장 낮은 동' : '굽이값이 가장 낮은 시군구', `${link(sd.loName, sd.loSlug)}<small>${fa(sd.loV)}</small>`],
    ]), esc(at(h, SEC.factSub, 7)), '01');

  const { html: faqHtml, qa } = faqBlock(seed, c, 4, '06');

  const csLinks = frame('sidocourse', 'courses', `${esc(sd.name)}에서 고르는 코스`,
    `<p class="el-slash">${courses.map((x) => `<a href="/${sd.slug}/course/${x.slug}/">${esc(sd.name)} ${esc(x.ko)}</a>`).join('')}</p>`,
    `고르는 코스에 따라 손이 오래 쉬는 곳이 바뀌어요. ${esc(sd.name)} 어디서나 값표는 한 장을 쓰고 있어요.`, '04');

  let pickBlock = '';
  if (sd.main) {
    const all = [];
    for (const g of sd.gu) for (const s of g.spots) all.push({ g, s });
    all.sort((a, b) => b.s.b - a.s.b || a.s.name.localeCompare(b.s.name, 'ko'));
    pickBlock = frame('shrunk', 'steepest', `${esc(sd.name)}에서 긴 자로 바꾸면 가장 많이 줄어드는 동`,
      `<ul class="el-tags">\n${all.slice(0, 18).map((x) => `<li><a href="/${sd.slug}/${x.g.slug}/${x.s.slug}/">${esc(x.g.name)} ${esc(x.s.name)}<b>${fb(x.s.b)}%</b></a></li>`).join('\n')}\n</ul>`,
      '짧은 자로는 잔굴곡이 한가득 잡히다가 긴 자를 대면 한꺼번에 사라지는 구역이에요. 그래서 번지까지 듣고 나서야 가는 길이 정해져요. 목록에 안 보이는 구역은 시군구 쪽에서 찾아 들어오세요.', '03');
  } else {
    pickBlock = frame('shrunk', 'steepest', `${esc(sd.name)}에서 긴 자로 바꾸면 가장 많이 줄어드는 시군구`,
      `<ul class="el-tags">\n${byB.slice(0, 12).map((g) => `<li><a href="/${sd.slug}/${g.slug}/">${esc(g.name)}<b>${fb(g.b)}%</b></a></li>`).join('\n')}\n</ul>`,
      '줄어듦이 클수록 짧은 자로 잡히던 굴곡이 많았던 시군구예요.', '03');
  }

  const far = [];
  for (const r of regions) {
    if (r.slug === sd.slug) continue;
    for (const x of r.gu) far.push({ label: `${r.name} ${x.name}`, href: `/${r.slug}/${x.slug}/` });
  }
  const deep = [];
  for (const g of sd.gu) for (const x of g.spots) deep.push({ label: `${g.name} ${x.name}`, href: `/${sd.slug}/${g.slug}/${x.slug}/` });
  const steps = stepSet(seed);
  const topics = topicLinks([
    { label: `${sd.name} + 코스로`, items: courseTopic(sd, courses), anchor: COURSE_ANCHOR },
    { label: '코스 한 장씩', items: courses.map((x) => ({ label: x.ko, href: `/course/${x.slug}/` })), anchor: COURSE_ANCHOR },
    ...(deep.length ? [{ label: `${sd.name} 동으로 바로`, items: deep, pick: 16, anchor: ANCHOR }] : []),
    { label: '다른 시도', items: far, pick: 16, anchor: ANCHOR },
    { label: '먼저 읽을 것', items: DOC_LINKS },
  ], seed, '08', esc(at(h, SEC.topicHead, 8)), esc(at(h, SEC.topicSub, 3)));
  const theme = themeCards({
    pool: sd.main ? spotPool([sd]) : guPool(regions.filter((r) => r.slug !== sd.slug), { sidoLabel: true }),
    noun: sd.main ? '동' : '시군구', seedKey: seed, num: '07',
    heading: esc(at(h, SEC.themeHead, 4)), sub: esc(at(h, SEC.themeSub, 5)), cards: sd.main ? 6 : 5, per: 4,
  });

  const body = [
    open,
    facts,
    guIndex(sd, seed, null, '02'),
    pickBlock,
    csLinks,
    hailStrip(cfg, sd.name, seed),
    courseRoll(courses, seed, sd.name, '05', { full: false }),
    stepCards(seed, '06'),
    faqHtml,
    theme.html,
    topics,
  ].join('\n');

  return {
    path,
    html: layout(ctx, {
      path,
      title: title.sido(sd),
      desc: clampDesc(desc.sido(sd)),
      h1: `${esc(sd.name)} <span class="el-h1-s">출장마사지 홈타이 · ${sd.main ? `동 ${sd.spotCount}구역 · 굽이값 ${fa(sd.a)}` : `시군구 ${sd.gu.length}곳 · 평균 굽이값 ${fa(sd.avgA)}`}</span>`,
      body,
      pageKind: 'sido',
      pageType: 'CollectionPage',
      about: `${url}#place`,
      mainList: `${url}#gulist`,
      geo: { iso: sd.iso, placename: sd.full, lat: sd.lat, lng: sd.lng },
      crumbs: [
        { name: '처음', url: `${siteUrl}/` },
        { name: '방문 지역', url: `${siteUrl}/area/` },
        { name: sd.name, url },
      ],
      jsonld: [
        S.place(`${url}#place`, sd.full, { lat: sd.lat, lng: sd.lng }, { area: sd.area, alternateName: sd.alias }),
        S.service({
          siteUrl, url, cfg,
          name: `${sd.name} 방문 관리 — 출장마사지 홈타이`,
          desc: clampDesc(desc.sido(sd)),
          areaServed: { '@id': `${url}#place` },
          courses,
        }),
        S.itemList(`${url}#gulist`, `${sd.name} 시군구`, sd.gu.map((g) => ({ name: g.name, url: `${siteUrl}/${sd.slug}/${g.slug}/` }))),
        S.itemList(`${url}#courselist`, `${sd.name} 코스`, courses.map((cc) => ({ name: `${sd.name} ${cc.ko}`, url: `${siteUrl}/${sd.slug}/course/${cc.slug}/` }))),
        S.itemList(`${url}#themes`, `${sd.name}에서 결이 같은 곳`, theme.list.map((x) => ({ name: x.name, url: `${siteUrl}${x.href}` }))),
        S.faqPage(url, qa),
        S.howTo(url, `${sd.name}에서 부르는 다섯 걸음`, steps, cfg),
      ],
    }),
  };
}
