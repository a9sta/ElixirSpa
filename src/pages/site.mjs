import { layout, frame, callBox } from '../lib/html.mjs';
import { esc, hash, won, josa } from '../lib/util.mjs';
import { title, desc, clampDesc } from '../lib/seo.mjs';
import * as S from '../lib/schema.mjs';
import {
  courseRoll, stepCards, stepSet, statTiles, faqBlock, noticeBlock,
  longtail, hailStrip, siteLinks, topicLinks, docTopics, themeCards, spotPool,
} from '../lib/blocks.mjs';
import { SEC, ANCHOR, COURSE_ANCHOR, DOC_LINKS, CLS_ORDER, clsName, fa, fb } from '../content/copy.mjs';
import { POSTS, METHOD_SLUG } from '../content/posts.mjs';

const at = (h, arr, slot = 0) => arr[parseInt(h.substr((slot * 3) % 29, 3), 16) % arr.length];
const baseCtx = (cfg, courses, place) => ({
  place, hours: cfg.hours, pay: cfg.pay, arrive: cfg.arrive,
  tel: cfg.tel, telLabel: cfg.telLabel,
  minPrice: `${won(Math.min(...courses.map((c) => c.price)))}원`,
});
const dt = (ctx, key) => docTopics(ctx, key, '11', esc(at(hash(key, 'dt'), SEC.topicHead, 8)), esc(at(hash(key, 'dt'), SEC.topicSub, 3)));
const notes = (list) => `<ul class="el-notes">${list.map((p) => `<li><a href="/magazine/${p.slug}/"><b>${esc(p.title)}</b><span>${esc(p.summary)}</span><time datetime="${p.date}">${p.date}</time></a></li>`).join('\n')}</ul>`;
const gaugePos = (a) => Math.max(0, Math.min(100, Math.round(((a - 1) / 0.6) * 100)));

/* ── 대문 ─────────────────────────────────────────────────────── */
export function homePage(ctx) {
  const { cfg, siteUrl, courses, regions, counts, latestPosts } = ctx;
  const seed = 'home';
  const h = hash(seed, 'hm');
  const main = regions.filter((r) => r.main);
  const sub = regions.filter((r) => !r.main);

  const hero = `<section class="el-door" aria-label="첫 안내">
  <p class="el-door-sl">${esc(cfg.brand.slogan)}</p>
  <p class="el-door-p">매장 문을 열어 두지 않아요. 걸려 온 전화의 주소로 관리사가 걸어가는 방식이에요. 서울·인천·경기·부산은 동 하나하나에 안내문을 달았고, 대전·대구·울산과 고른 시·군은 시군구 한 장으로 묶었어요.</p>
  ${callBox(cfg, { size: 'l' })}
  <dl class="el-door-f">
    <div><dt>접수</dt><dd>${esc(cfg.hours)}</dd></div>
    <div><dt>계산</dt><dd>${esc(cfg.pay)}</dd></div>
    <div><dt>도착</dt><dd>${esc(cfg.arrive)}</dd></div>
    <div><dt>안내문</dt><dd>동 ${counts.spot}구역 · 시군구 ${counts.gu}곳</dd></div>
  </dl>
</section>`;

  const row = (r) => {
    const a = r.main ? r.a : r.avgA;
    const meta = r.main ? `동 ${r.spotCount}구역` : `시군구 ${r.gu.length}곳`;
    return `<li class="${r.main ? 'main' : 'sub'}"><a href="/${r.slug}/"><b>${esc(r.name)}</b><small>${esc(meta)}</small><span class="el-g" aria-hidden="true"><i style="left:${gaugePos(a)}%"></i></span><em>${fa(a)}</em></a></li>`;
  };
  const areaBlock = frame('area', 'where', '어느 지역에서 부르나요',
    `<div class="el-gtop" aria-hidden="true"><span>1.00 곧음</span><span>1.30</span><span>1.60 굽이침</span></div>
     <ul class="el-gauge">${[...main, ...sub].map(row).join('\n')}</ul>
     <p class="el-key">줄마다 점이 하나씩 찍혀 있어요. 그 지역 경계를 80m 자와 720m 자로 각각 걸어 본 길이의 비를 굽이값으로 바꿔 눈금에 얹은 거예요. 점이 오른쪽일수록 경계가 잘게 구불거려요.
       굵은 줄은 동 단위까지 안내문이 있고 옅은 줄은 시군구에서 끝나요. 어느 쪽이든 번호는 하나예요.
       <a href="/area/">방문 지역 전체</a>는 한 화면에 따로 모았어요.</p>`,
    '안내문이 깊이 내려가느냐 마느냐일 뿐 가는 지역에는 차이가 없어요.', '01');

  const whyBlock = frame('why', 'method', '지역 안내문에 자 눈금을 적는 이유',
    `<div class="el-lead">
      <p>지역 안내문을 열면 맨 위에 막대 셋이 보여요. 같은 경계를 <strong>80m, 240m, 720m 자</strong>로 걸었을 때 나온 둘레이고, 자가 길수록 막대가 짧아져요. 막대 길이가 가장 크게 벌어진 곳은 ${esc(counts.bHiName)}이고 가장 조금 벌어진 곳은 ${esc(counts.bLoName)}이에요.</p>
      <p>막대가 많이 벌어지는 동네는 길이 골목마다 꺾이고 접혀서, 지도에서 한 번에 보이던 거리가 막상 걸어 보면 훨씬 길어요. 그런 곳은 <strong>번지를 끝까지 들어야 가는 길이 정해져요.</strong> 굽이값이 1에 붙은 동네는 반대로 큰길 이름 하나로도 닿아요. 굽이값이 가장 높은 곳은 ${esc(counts.hiName)}이고 가장 낮은 곳은 ${esc(counts.loName)}이에요.</p>
      <p>전국 행정동 ${counts.featAll}곳의 경계를 같은 순서로 걸었어요. 다시 돌려도 숫자는 똑같아요. 어떻게 걸었는지는 <a href="/magazine/${METHOD_SLUG}/">이 메모</a>에 풀어 놨어요.</p>
    </div>`, null, '02');

  const postBlock = frame('note', 'notes', '전화하기 전에 읽어 둘 글',
    `${notes(latestPosts)}
     <p class="el-sec-x"><a href="/magazine/">자 메모 전부</a></p>`,
    '써 본 사람의 소감은 아니에요. 읽고 나면 통화가 한 마디 짧아지는 것만 올렸어요.', '05');

  const { html: faqHtml, qa } = faqBlock(seed, baseCtx(cfg, courses, '지금 있는 곳'), 6, '06');

  const deep = [];
  for (const r of regions) if (r.main) for (const g of r.gu) for (const s of g.spots) deep.push({ label: `${g.name} ${s.name}`, href: `/${r.slug}/${g.slug}/${s.slug}/` });
  const guList = [];
  for (const r of regions) for (const g of r.gu) guList.push({ label: `${r.name} ${g.name}`, href: `/${r.slug}/${g.slug}/` });
  const courseAll = courses.map((c) => ({ label: c.ko, href: `/course/${c.slug}/` }));
  const sidoCourse = [];
  for (const r of regions) for (const c of courses) sidoCourse.push({ label: `${r.name} ${c.ko}`, href: `/${r.slug}/course/${c.slug}/` });
  const steps = stepSet(seed);
  const topics = topicLinks([
    { label: '코스 이름으로', items: courseAll, anchor: COURSE_ANCHOR },
    { label: '지역 + 코스로', items: sidoCourse, pick: 14, anchor: COURSE_ANCHOR },
    { label: '동 이름으로 바로', items: deep, pick: 18, anchor: ANCHOR },
    { label: '시군구로', items: guList, pick: 16, anchor: ANCHOR },
    { label: '먼저 읽을 것', items: DOC_LINKS },
  ], seed, '09', esc(at(h, SEC.topicHead, 8)), esc(at(h, SEC.topicSub, 3)));
  const theme = themeCards({
    pool: spotPool(regions, { sidoLabel: true }), noun: '동', seedKey: seed, num: '08',
    heading: esc(at(h, SEC.themeHead, 4)), sub: esc(at(h, SEC.themeSub, 5)), cards: 6, per: 3,
  });

  const body = [
    hero,
    areaBlock,
    whyBlock,
    courseRoll(courses, seed, '부르는 곳', '03'),
    stepCards(seed, '04'),
    postBlock,
    faqHtml,
    noticeBlock(seed, '07'),
    theme.html,
    topics,
    hailStrip(cfg, '지금 있는 곳', seed),
  ].join('\n');

  return {
    path: '/',
    html: layout(ctx, {
      path: '/',
      title: title.home(),
      desc: clampDesc(desc.home()),
      h1: `${esc(cfg.brand.ko)} 출장마사지 홈타이 <span class="el-h1-s">서울·인천·경기·부산 동 ${counts.spot}구역 · 시군구 ${counts.gu}곳 방문</span>`,
      body,
      pageKind: 'home',
      crumbs: [{ name: '처음', url: `${siteUrl}/` }],
      jsonld: [
        S.service({
          siteUrl, url: siteUrl + '/', cfg,
          name: `${cfg.brand.ko} 출장마사지 홈타이 방문`,
          desc: clampDesc(desc.home()),
          areaServed: { '@type': 'Country', name: '대한민국' },
          courses,
        }),
        S.itemList(`${siteUrl}/#sidolist`, '찾아가는 시도', regions.map((r) => ({ name: r.name, url: `${siteUrl}/${r.slug}/` }))),
        S.itemList(`${siteUrl}/#themes`, '결이 같은 동 모음', theme.list.map((x) => ({ name: x.name, url: `${siteUrl}${x.href}` }))),
        S.faqPage(`${siteUrl}/`, qa),
        S.howTo(`${siteUrl}/`, '전화 한 통으로 부르는 다섯 걸음', steps, cfg),
      ],
    }),
  };
}

/* ── 지역 허브 ────────────────────────────────────────────────── */
export function areaHub(ctx) {
  const { cfg, siteUrl, regions, counts, courses } = ctx;
  const seed = 'area';

  const open = `<div class="el-lead">
  <p>가는 곳을 한 화면에 펼쳤어요. 시군구 ${counts.gu}곳이 있고 그 안에 동 ${counts.spot}구역이 안내문과 함께 들어 있어요. 읍 ${counts.eup}구역과 면 ${counts.myeon}구역은 안내문 없이 이름만 올렸지만 찾아가는 건 똑같이 해요.</p>
  <p>수도권과 부산에서는 시군구를 누르면 동 목록이 나와요. 그 밖의 시도는 시군구 한 장 안에 동 이름을 적어 뒀어요. 깊이를 둘로 나눈 건 문의가 쏠리는 쪽만 한 겹 더 쟀기 때문이에요.</p>
</div>`;

  const blocks = regions.map((r, i) => frame(`sd-${r.slug}`, r.main ? 'to dong' : 'to district',
    `<a href="/${r.slug}/">${esc(r.name)}</a> ${r.main ? `동 ${r.spotCount}구역` : `시군구 ${r.gu.length}곳`}`,
    `<ul class="el-tags">${r.gu.map((g) => `<li><a href="/${r.slug}/${g.slug}/">${esc(g.name)}<b>${fa(g.a)}</b></a></li>`).join('\n')}</ul>`,
    r.main
      ? `${r.name}에서는 시군구를 먼저 눌러야 동 목록이 열려요. 이름 옆 숫자는 시군구 전체 경계의 굽이값이에요.`
      : `${r.name}${josa(r.name, '은/는')} 시군구까지만 내려가요. 행정동 ${r.dongCount}구역의 이름은 시군구마다 한 장씩 적어 뒀어요.`,
    String(i + 1).padStart(2, '0'))).join('\n');

  const { html: faqHtml, qa } = faqBlock(seed, baseCtx(cfg, courses, '있는 곳'), 4, '90');

  const body = [open, hailStrip(cfg, '있는 곳', seed), blocks, faqHtml, stepCards(seed, '91')].join('\n');

  return {
    path: '/area/',
    html: layout(ctx, {
      path: '/area/',
      title: title.areaHub(counts),
      desc: clampDesc(desc.areaHub(counts)),
      h1: `방문 지역 <span class="el-h1-s">시군구 ${counts.gu}곳과 동 ${counts.spot}구역을 한 줄로</span>`,
      body,
      pageKind: 'areahub',
      crumbs: [{ name: '처음', url: `${siteUrl}/` }, { name: '방문 지역', url: `${siteUrl}/area/` }],
      jsonld: [
        S.collectionPage({ url: `${siteUrl}/area/`, siteUrl, title: title.areaHub(counts), desc: clampDesc(desc.areaHub(counts)), listId: `${siteUrl}/area/#list` }),
        S.itemList(`${siteUrl}/area/#list`, '찾아가는 시도', regions.map((r) => ({ name: r.name, url: `${siteUrl}/${r.slug}/` }))),
        S.service({ siteUrl, url: `${siteUrl}/area/`, cfg, name: `${cfg.brand.ko} 찾아가는 지역`, desc: clampDesc(desc.areaHub(counts)), areaServed: { '@type': 'Country', name: '대한민국' }, courses }),
        S.faqPage(`${siteUrl}/area/`, qa),
        S.howTo(`${siteUrl}/area/`, '있는 곳에서 부르는 다섯 걸음', stepSet(seed), cfg),
      ],
    }),
  };
}

/* ── 코스 허브 ────────────────────────────────────────────────── */
export function courseHub(ctx) {
  const { cfg, siteUrl, courses, regions } = ctx;
  const seed = 'coursehub';
  const sorted = courses.slice().sort((a, b) => a.price - b.price);
  const shortest = courses.slice().sort((a, b) => a.min - b.min)[0];
  const longest = courses.slice().sort((a, b) => b.min - a.min)[0];

  const open = `<div class="el-lead">
  <p>코스는 아홉 개이고, 그중에서 정할 것은 길이와 세기 그리고 오일 쓸지 여부예요. 그 밖의 취향은 통화 중에 맞추면 돼요.</p>
  <p>제일 짧은 코스는 ${esc(shortest.ko)}로 ${shortest.min}분이고 제일 긴 코스는 ${esc(longest.ko)}로 ${longest.min}분이에요. 길다고 깊은 것도, 값이 높다고 더 잘 맞는 것도 아니에요.</p>
</div>`;

  const table = frame('all', 'table', '아홉 코스를 표 하나에',
    `<div class="el-tw"><table class="el-t"><thead><tr><th scope="col">코스</th><th scope="col">길이</th><th scope="col">세기</th><th scope="col">속도</th><th scope="col">오일</th><th scope="col" class="el-t-w">값</th></tr></thead>
     <tbody>${sorted.map((c) => `<tr><th scope="row"><a href="/course/${c.slug}/">${esc(c.ko)}</a></th><td>${c.min}분</td><td>${esc(c.pressure)}</td><td>${esc(c.tempo)}</td><td>${c.oil ? '씀' : '안 씀'}</td><td class="el-t-w">${won(c.price)}원</td></tr>`).join('\n')}</tbody></table></div>`,
    '값이 낮은 순서로 세웠어요. 지역이 바뀌어도 이 표를 그대로 써요.', '01');

  const pickBy = frame('bycase', 'choose', '이런 날엔 이걸 골라요',
    `<ul class="el-notes">${courses.map((c) => `<li><a href="/course/${c.slug}/"><b>${esc(c.ko)}</b><span>${esc(c.for)}</span></a></li>`).join('\n')}</ul>`,
    '고른 뒤에 바꿔도 괜찮아요. 값은 마지막으로 정한 코스를 기준으로 셈해요.', '02');

  const { html: faqHtml, qa } = faqBlock(seed, baseCtx(cfg, courses, '있는 곳'), 4, '03');

  const pool = [];
  for (const r of regions) for (const c of courses) pool.push({ label: `${r.name} ${c.ko}`, href: `/${r.slug}/course/${c.slug}/` });

  const body = [open, table, pickBy, hailStrip(cfg, '코스 상담', seed), faqHtml, longtail(pool, seed, 24, 'by region', '지역에서 코스 찾기', null, '04')].join('\n');
  const t = title.page(`코스 ${courses.length}가지 출장마사지 홈타이`);
  const d = clampDesc(`출장마사지 홈타이 코스 ${courses.length}가지를 길이·세기·오일 여부로 표 하나에 모았어요. ${won(sorted[0].price)}원부터이고 지역이 바뀌어도 값은 그대로예요.`);

  return {
    path: '/course/',
    html: layout(ctx, {
      path: '/course/',
      title: t,
      desc: d,
      h1: `코스 ${courses.length}가지 <span class="el-h1-s">길이 · 세기 · 오일 여부를 한 표에</span>`,
      body,
      pageKind: 'coursehub',
      crumbs: [{ name: '처음', url: `${siteUrl}/` }, { name: '코스', url: `${siteUrl}/course/` }],
      jsonld: [
        S.collectionPage({ url: `${siteUrl}/course/`, siteUrl, title: t, desc: d, listId: `${siteUrl}/course/#list` }),
        S.itemList(`${siteUrl}/course/#list`, '코스', courses.map((c) => ({ name: c.ko, url: `${siteUrl}/course/${c.slug}/` }))),
        S.aggregateOffer(`${siteUrl}/course/`, courses, cfg),
        S.service({ siteUrl, url: `${siteUrl}/course/`, cfg, name: `${cfg.brand.ko} 코스 ${courses.length}가지`, desc: d, areaServed: { '@type': 'Country', name: '대한민국' }, courses }),
        S.faqPage(`${siteUrl}/course/`, qa),
      ],
    }),
  };
}

/* ── 비용 ─────────────────────────────────────────────────────── */
export function pricePage(ctx) {
  const { cfg, siteUrl, courses } = ctx;
  const seed = 'price';
  const sorted = courses.slice().sort((a, b) => a.price - b.price);

  const open = `<div class="el-lead">
  <p>값은 아래 표에 적힌 것이 전부예요. 표에 없는 항목으로 돈을 더 받는 일은 없어요.</p>
  <p>도보 오 분 거리든 차로 한 시간 걸리는 마을이든 같은 코스는 같은 값이에요. 가는 길의 수고는 저희 몫이에요.</p>
</div>`;

  const table = frame('tbl', 'prices', '코스마다 기본 길이와 값',
    `<div class="el-tw"><table class="el-t"><thead><tr><th scope="col">코스</th><th scope="col">기본 길이</th><th scope="col" class="el-t-w">값</th><th scope="col" class="el-t-w">분당</th></tr></thead>
     <tbody>${sorted.map((c) => `<tr><th scope="row"><a href="/course/${c.slug}/">${esc(c.ko)}</a></th><td>${c.min}분</td><td class="el-t-w"><b>${won(c.price)}원</b></td><td class="el-t-w">${won(Math.round(c.price / c.min))}원</td></tr>`).join('\n')}</tbody></table></div>`,
    '분당 값은 코스끼리 견주려고 넣었어요. 시간을 잘라 파는 일은 없어요.', '01');

  const noExtra = frame('nox', 'never', '값에 얹지 않는 것',
    `<ul class="el-heed">
      <li>교통비 — 얼마나 멀든 셈에 넣지 않아요.</li>
      <li>밤 할증 — 새벽 두 시에 걸어도 같은 값이에요.</li>
      <li>명절과 휴일 가산 — 달력을 보고 값을 바꾸지 않아요.</li>
      <li>선입금 — 예약금과 보증금이라는 항목이 아예 없어요.</li>
      <li>취소 수수료 — 미루든 접든 청구하지 않아요.</li>
      <li>주차 비용 — 저희가 내요.</li>
    </ul>`,
    '먼저 돈부터 보내라는 문자나 전화가 오면 저희가 보낸 게 아니에요.', '02');

  const pay = frame('how', 'payment', '값은 이렇게 치러요',
    statTiles([
      ['치르는 때', '관리가 끝난 직후 그 자리에서'],
      ['수단', '현금과 카드 모두 받아요'],
      ['영수증', '요청하시면 건네 드려요'],
      ['더 받고 싶을 때', '접수 때 말씀해 두시면 늘어난 분량만큼만 더 셈해요'],
      ['두 분이 받을 때', '사람 수만큼 셈해요. 함께 받는다고 깎아 드리지는 않아요'],
    ]), null, '03');

  const { html: faqHtml, qa } = faqBlock(seed, baseCtx(cfg, courses, '있는 곳'), 4, '04');
  const d = clampDesc(`코스별 기본 길이와 값이에요. ${won(sorted[0].price)}원부터이고 교통비·밤 할증·예약금이 없어요. 마친 뒤 현금이나 카드로 치러요.`);

  const body = [open, table, noExtra, pay, hailStrip(cfg, '비용 확인', seed), faqHtml, dt(ctx, seed), siteLinks(ctx, seed)].join('\n');

  return {
    path: '/price/',
    html: layout(ctx, {
      path: '/price/',
      title: title.page(`비용 ${won(sorted[0].price)}원부터`),
      desc: d,
      h1: `비용 <span class="el-h1-s">${won(sorted[0].price)}원부터 · 표 밖의 돈은 받지 않아요</span>`,
      body,
      pageKind: 'price',
      crumbs: [{ name: '처음', url: `${siteUrl}/` }, { name: '비용', url: `${siteUrl}/price/` }],
      jsonld: [
        S.aggregateOffer(`${siteUrl}/price/`, courses, cfg),
        S.service({ siteUrl, url: `${siteUrl}/price/`, cfg, name: `${cfg.brand.ko} 코스별 비용`, desc: d, areaServed: { '@type': 'Country', name: '대한민국' }, courses }),
        S.faqPage(`${siteUrl}/price/`, qa),
      ],
    }),
  };
}

/* ── 시작 전에 ──────────────────────────────────────────────── */
export function guidePage(ctx) {
  const { cfg, siteUrl, courses } = ctx;
  const seed = 'guide';

  const open = `<div class="el-lead">
  <p>처음 전화하시는 분을 떠올리며 추렸어요. 전화 한 통이면 접수가 끝나니 오래 읽을 필요는 없어요.</p>
</div>`;

  const what = frame('need', 'ready', '미리 마련해 두실 것',
    `<ul class="el-heed">
      <li>누울 곳 — 침대든 바닥이든 상관없어요.</li>
      <li>수건 두 장 — 오일을 안 쓰는 코스라면 한 장도 괜찮아요.</li>
      <li>문이 닫히는 방 하나 — 식구가 집에 있어도 돼요.</li>
    </ul>
    <p class="el-sec-x">접이식 매트, 오일, 향초는 관리사가 가방에 담아 와요. 따로 사 두실 건 없어요.</p>`,
    null, '01');

  const timing = frame('when', 'hours', '몇 시에 걸어도 되나요',
    statTiles([
      ['접수', `${esc(cfg.hours)}<small>걸어 오는 시각은 가리지 않아요</small>`],
      ['현관 앞까지', `대개 ${esc(cfg.arrive)}<small>골목 안쪽이면 조금 더 걸려요</small>`],
      ['시각 옮기기', '언제든 가능하고 비용은 붙지 않아요'],
      ['취소', '관리사가 이미 현관에 있다면 그 사실만 알려 주세요'],
      ['붐비는 때', '금요일 밤과 토요일 밤'],
      ['여유로운 때', '평일 낮에는 거의 바로 나가요'],
    ]), null, '02');

  const refuse = frame('no', 'declined', '받지 못하는 경우',
    `<ul class="el-heed">
      <li>성적인 말이 오가는 통화 — 그 자리에서 끊어요.</li>
      <li>열이 있거나 상처가 부어오른 몸 — 날을 다시 잡아요.</li>
      <li>번지 끝자리를 알려 주지 않는 접수 — 누구를 어디로 보낼지 정할 수 없어요.</li>
      <li>관리사 개인 연락처를 묻는 요청.</li>
      <li>병원이 먼저일 듯한 증상.</li>
      <li>만 19세에 못 미치는 나이.</li>
    </ul>`,
    '받지 못한 건에는 비용을 매기지 않아요.', '03');

  const { html: faqHtml, qa } = faqBlock(seed, baseCtx(cfg, courses, '부르는 곳'), 6, '05');
  const d = clampDesc('처음 전화하는 분을 위해 준비물, 접수 가능한 시각, 받지 못하는 경우, 값 치르는 법을 차례대로 적었어요.');

  const body = [open, what, timing, stepCards(seed, '04'), refuse, hailStrip(cfg, '처음 이용', seed), faqHtml, noticeBlock(seed, '06'), dt(ctx, seed), siteLinks(ctx, seed)].join('\n');

  return {
    path: '/guide/',
    html: layout(ctx, {
      path: '/guide/',
      title: title.page('시작 전에 — 부르는 법과 치르는 법'),
      desc: d,
      h1: `시작 전에 <span class="el-h1-s">통화가 곧 접수예요</span>`,
      body,
      pageKind: 'guide',
      crumbs: [{ name: '처음', url: `${siteUrl}/` }, { name: '시작 전에', url: `${siteUrl}/guide/` }],
      jsonld: [
        S.howTo(`${siteUrl}/guide/`, '처음 부를 때 거치는 다섯 걸음', stepSet(seed), cfg),
        S.service({ siteUrl, url: `${siteUrl}/guide/`, cfg, name: `${cfg.brand.ko} 이용 안내`, desc: d, areaServed: { '@type': 'Country', name: '대한민국' }, courses }),
        S.faqPage(`${siteUrl}/guide/`, qa),
      ],
    }),
  };
}

/* ── 소개 ─────────────────────────────────────────────────────── */
export function companyPage(ctx) {
  const { cfg, siteUrl, counts, data } = ctx;
  const seed = 'company';
  const classLine = CLS_ORDER.map((k, i) => `${clsName(k)} ${counts.clsCount[i]}곳`).join(' · ');

  const open = `<div class="el-lead">
  <p>${esc(cfg.brand.ko)}(${esc(cfg.brand.en)})는 매장 없이 방문만 해요. 업소를 줄 세워 소개하는 곳이 아니라 저희가 전화를 받고 저희 사람이 찾아가요.</p>
  <p>엘릭서라는 낱말에서 이름을 따왔어요. 땅의 생김새도 한 번에 읽히지 않으니 지역마다 자를 바꿔 가며 재 보고 그 숫자를 안내문 맨 위에 적어요.</p>
</div>`;

  const line = frame('line', 'limits', '해 드리는 일과 안 하는 일',
    `<ul class="el-heed">
      <li>해요 — 굳은 근육을 손으로 풀어 드리는 일.</li>
      <li>안 해요 — 성적인 서비스. 어떤 모양으로도 하지 않아요.</li>
      <li>안 해요 — 병을 진단하거나 고치는 일. 그건 병원이 할 일이에요.</li>
      <li>받지 못해요 — 만 19세 미만인 분.</li>
      <li>안 올려요 — 후기와 별점. 진짜인지 가려낼 방법이 없어요.</li>
      <li>안 올려요 — 사람 사진. 사진 속 사람과 다른 사람이 가는 일이 생길 수 있어요.</li>
      <li>안 받아요 — 미리 내는 돈.</li>
    </ul>`, null, '01');

  const how = frame('data', 'sources', '경계는 어떻게 걸었나요',
    `<div class="el-lead">
      <p>공개된 행정동 경계 ${counts.featAll}곳을 시도마다 한 장의 평면 좌표로 옮겼어요. 그다음 경계선을 따라 <strong>80m, 240m, 720m 걸음</strong>으로 차례대로 걸으며 걸음 수를 세고, 곱해서 둘레를 얻었어요.</p>
      <p>짧은 자는 골목 수준의 잔굴곡까지 따라가서 둘레가 길게 나와요. 긴 자는 굴곡을 가로질러 건너뛰니 짧게 나와요. 두 값의 비가 클수록 경계가 복잡하다는 뜻이어서, 비를 로그로 바꿔 1에서 1.6 사이의 굽이값으로 적었어요. 긴 자로 바꿀 때 줄어든 비율은 줄어듦 %로 따로 적었어요.</p>
      <p>굽이값 문턱을 두어 결을 여섯 갈래로 나눴어요. ${esc(classLine)}. 줄어듦이 가장 큰 곳은 ${esc(counts.bHiName)}으로 ${fb(counts.bq.max)}%예요.</p>
      <p>이 숫자는 행정 경계의 생김새를 잰 것일 뿐 집이 어디에 몰려 있는지, 길이 얼마나 막히는지는 말해 주지 않아요. 그 점을 감안해서 읽어 주세요.</p>
    </div>
    ${statTiles([
      ['밑자료', esc(data.source)],
      ['경계 자료 판', esc(data.version)],
      ['구하는 값', esc(data.axis)],
      ['셈하는 절차', esc(data.method)],
      ['안내문을 내는 기준', esc(data.coverageFrom)],
      ['안내문이 있는 곳', `시도 ${counts.sido}곳, 시군구 ${counts.gu}곳, 동 ${counts.spot}곳`],
      ['안내문 없는 단위', `읍 ${counts.eup}구역 · 면 ${counts.myeon}구역<small>목록에 이름 한 줄로</small>`],
      ['굽이값이 가장 높은 구역', esc(counts.hiName)],
      ['굽이값이 가장 낮은 구역', esc(counts.loName)],
    ])}`, null, '02');

  const d = clampDesc(`${cfg.brand.ko}가 하는 일과 하지 않는 일, 그리고 지역 안내문의 둘레·굽이값을 어떤 자료와 절차로 얻었는지 적었어요.`);
  const body = [open, line, how, hailStrip(cfg, '문의', seed), dt(ctx, seed), siteLinks(ctx, seed)].join('\n');

  return {
    path: '/company/',
    html: layout(ctx, {
      path: '/company/',
      title: title.page(`${cfg.brand.ko} 소개`),
      desc: d,
      h1: `${esc(cfg.brand.ko)} 소개 <span class="el-h1-s">지키는 선과 재는 절차</span>`,
      body,
      pageKind: 'company',
      crumbs: [{ name: '처음', url: `${siteUrl}/` }, { name: '소개', url: `${siteUrl}/company/` }],
      jsonld: [S.aboutPage({ url: `${siteUrl}/company/`, siteUrl, title: title.page(`${cfg.brand.ko} 소개`), desc: d })],
    }),
  };
}

/* ── 이용약관 ─────────────────────────────────────────────────── */
const TERMS = [
  ['제1조 (목적)', '이 약관은 엘릭서스파(이하 "회사")가 이용자가 정한 장소로 관리사를 보내는 방문 관리를 제공할 때 지켜야 할 조건, 진행 절차, 회사와 이용자 각자의 책임을 밝히기 위해 만들었어요.'],
  ['제2조 (접수)', '접수는 화면에 적힌 전화번호로 거는 통화로만 받아요. 게시판, 채팅, 전자우편으로는 접수하지 않아요. 통화가 연결되어 코스와 주소와 시각이 정해지면 접수가 끝난 것으로 봐요.'],
  ['제3조 (관리의 내용)', '회사는 이용자가 정한 곳에서 관리사가 뭉친 근육을 손으로 푸는 관리를 해요. 병을 가려내거나 치료하는 행위와 성적인 행위는 하지 않아요.'],
  ['제4조 (연령)', '만 19세 이상만 이용할 수 있어요. 보호자가 동석하더라도 나이가 모자라면 접수를 받지 않아요.'],
  ['제5조 (자로 잰 숫자의 성격)', '화면의 둘레, 굽이값, 줄어듦, 결은 공개된 행정동 경계를 80m·240m·720m 걸음으로 걸어 계산한 값이에요. 실제 도로 사정이나 이동 시간을 약속하는 숫자가 아니고, 그 지역의 경계가 어떻게 생겼는지 살펴보라고 적은 참고 자료예요.'],
  ['제6조 (값과 셈)', '값은 비용표에 적힌 대로이고 지역에 따라 달리하지 않아요. 대금은 관리가 끝난 자리에서 현금이든 카드든 편한 쪽으로 치러요. 예약금과 보증금처럼 먼저 받는 돈은 이름을 바꿔도 받지 않아요.'],
  ['제7조 (일정 변경과 취소)', '관리사가 출발하기 전까지는 시각을 옮기거나 취소해도 위약금이 없어요. 이미 현관에 도착했다면 그 사실만 곧바로 알려 주세요.'],
  ['제8조 (거절과 중단)', '다음 사유가 있으면 접수를 거절하거나 진행 중인 관리를 멈출 수 있어요. 1. 성적인 행위를 요구할 때. 2. 관리사에게 폭언이나 폭력을 쓰거나 개인 연락처를 요구할 때. 3. 방문할 주소를 끝자리까지 알려 주지 않을 때. 4. 발열이나 아물지 않은 상처 때문에 관리가 맞지 않을 때.'],
  ['제9조 (이용자가 준비할 것)', '이용자는 관리를 받을 공간과 수건을 준비하고 진행에 영향을 줄 건강 상태를 통화에서 밝혀야 해요. 멍이 쉽게 드는 체질이라면 경락 코스를 정하기 전에 알려 주세요.'],
  ['제10조 (후기와 평점)', '회사는 후기와 평점을 받지도 게시하지도 않아요. 화면의 문장은 어느 이용자의 경험을 옮긴 것이 아니에요.'],
  ['제11조 (도중에 멈춘 경우의 값)', '이용자의 요청이나 몸 상태 때문에 멈추면 지나간 시간만큼만 셈해요. 시작한 지 10분이 안 됐다면 받지 않아요. 제8조 제1호에 따라 멈춘 때에도 그 시점까지의 시간은 값에 넣어요.'],
  ['제12조 (책임)', '관리 중 회사의 잘못으로 손해가 나면 회사가 배상해요. 이용자가 알리지 않은 건강 상태로 생긴 손해와 천재지변이나 통신 장애로 늦어진 일은 책임지지 않아요.'],
  ['제13조 (약관 개정)', '약관을 고치면 화면에 먼저 알리고 알린 날부터 적용해요. 개정 뒤에 접수하면 바뀐 내용에 동의한 것으로 봐요.'],
];

export function termsPage(ctx) {
  const { cfg, siteUrl } = ctx;
  const body = [
    `<div class="el-lead"><p>아래는 ${esc(cfg.brand.ko)} 이용약관 전문이에요. 접수 전화를 거신 순간부터 이 내용에 따르기로 한 것으로 봐요.</p></div>`,
    frame('terms', 'terms', '약관 전문', `<div class="el-doc">${TERMS.map(([t, d]) => `<section><h2>${esc(t)}</h2><p>${esc(d)}</p></section>`).join('')}</div>`, null, '01'),
    hailStrip(cfg, '약관 문의', 'terms'),
    dt(ctx, 'terms'),
    siteLinks(ctx, 'terms'),
  ].join('\n');
  return {
    path: '/terms/',
    html: layout(ctx, {
      path: '/terms/',
      title: title.page('이용약관'),
      desc: clampDesc(`${cfg.brand.ko} 출장 방문 관리 이용약관 전문이에요. 접수, 관리 내용, 값과 셈, 일정 변경과 취소를 ${TERMS.length}개 조문으로 적었어요.`),
      h1: `이용약관 <span class="el-h1-s">${TERMS.length}개 조문</span>`,
      body,
      pageKind: 'terms',
      crumbs: [{ name: '처음', url: `${siteUrl}/` }, { name: '이용약관', url: `${siteUrl}/terms/` }],
    }),
  };
}

/* ── 개인정보처리방침 ─────────────────────────────────────────── */
const PRIVACY = [
  ['1. 적는 항목', '접수 통화에서 적어 두는 것은 방문할 주소, 연락이 닿는 번호, 고른 코스, 원하는 시각 네 가지예요. 이름, 생년월일, 주민등록번호는 묻지 않아요.'],
  ['2. 쓰는 곳', '적어 둔 내용은 관리사를 배정하고 출발과 도착을 알리는 일에만 써요. 그 뒤에 광고 문자를 보내거나 먼저 전화하는 일은 없어요.'],
  ['3. 번호 관리', '접수 통화에서 알게 된 번호는 방문이 끝날 때까지 접수를 맡은 담당자와 배정된 관리사만 볼 수 있어요.'],
  ['4. 보관 기간', '방문이 문제없이 끝나면 그날 안에 지워요. 분쟁이 생긴 건만 정리될 때까지 따로 보관해요.'],
  ['5. 제3자 제공', '다른 업체에 넘기거나 처리를 맡기지 않아요. 법령에 따른 수사기관의 정당한 요청이 있을 때만 예외로 해요.'],
  ['6. 자동 수집', '이 사이트는 미리 만들어 둔 파일을 보여 주기만 해요. 로그인, 장바구니, 댓글이 없고 광고 추적이나 방문 분석 스크립트도 넣지 않았으며 쿠키도 쓰지 않아요.'],
  ['7. 이용자의 권리', '회사가 가진 내 정보를 보여 달라거나 지워 달라고 요청할 수 있어요. 화면의 번호로 전화하면 그 통화에서 바로 처리해요.'],
  ['8. 담당자', '운영자 표기가 정해지면 이 항목과 화면 맨 아래에 함께 올려요. 그전에는 화면의 번호가 문의 창구예요.'],
];

export function privacyPage(ctx) {
  const { cfg, siteUrl } = ctx;
  const body = [
    `<div class="el-lead"><p>짧아요. 받아 적는 항목이 네 개뿐이기 때문이에요.</p></div>`,
    frame('pp', 'privacy', '방침 전문', `<div class="el-doc">${PRIVACY.map(([t, d]) => `<section><h2>${esc(t)}</h2><p>${esc(d)}</p></section>`).join('')}</div>`, null, '01'),
    hailStrip(cfg, '개인정보 문의', 'privacy'),
    dt(ctx, 'privacy'),
    siteLinks(ctx, 'privacy'),
  ].join('\n');
  return {
    path: '/privacy/',
    html: layout(ctx, {
      path: '/privacy/',
      title: title.page('개인정보처리방침'),
      desc: clampDesc('접수 통화에서 적어 두는 항목과 쓰임, 보관 기간을 정리했어요. 쿠키와 추적 스크립트를 쓰지 않는 정적 사이트예요.'),
      h1: `개인정보처리방침 <span class="el-h1-s">적는 항목은 네 개예요</span>`,
      body,
      pageKind: 'privacy',
      crumbs: [{ name: '처음', url: `${siteUrl}/` }, { name: '개인정보처리방침', url: `${siteUrl}/privacy/` }],
    }),
  };
}

/* ── 메모 목록 ────────────────────────────────────────────────── */
export function magazineIndex(ctx) {
  const { cfg, siteUrl } = ctx;
  const list = POSTS.slice().sort((a, b) => b.date.localeCompare(a.date));
  const body = [
    `<div class="el-lead"><p>전화하기 전에 알아 두면 통화가 짧아지는 얘기만 적었어요. 소감과 별점은 올리지 않아요.</p></div>`,
    frame('list', 'notes', `자 메모 ${list.length}편`, notes(list), '새 글은 RSS로도 나가요.', '01'),
    hailStrip(cfg, '접수', 'magazine'),
    dt(ctx, 'magazine'),
    siteLinks(ctx, 'magazine'),
  ].join('\n');
  const d = clampDesc(`전화하기 전에 정해 두면 편한 것들을 ${list.length}편으로 적었어요. 후기와 체험담은 두지 않아요.`);
  return {
    path: '/magazine/',
    html: layout(ctx, {
      path: '/magazine/',
      title: title.page('자 메모'),
      desc: d,
      h1: `자 메모 <span class="el-h1-s">글 ${list.length}편</span>`,
      body,
      pageKind: 'magazine',
      crumbs: [{ name: '처음', url: `${siteUrl}/` }, { name: '자 메모', url: `${siteUrl}/magazine/` }],
      jsonld: [
        S.collectionPage({ url: `${siteUrl}/magazine/`, siteUrl, title: title.page('자 메모'), desc: d, listId: `${siteUrl}/magazine/#list` }),
        S.itemList(`${siteUrl}/magazine/#list`, '자 메모', list.map((p) => ({ name: p.title, url: `${siteUrl}/magazine/${p.slug}/` }))),
      ],
    }),
  };
}

export function postPage(ctx, p) {
  const { cfg, siteUrl } = ctx;
  const path = `/magazine/${p.slug}/`;
  const url = `${siteUrl}${path}`;
  const html = p.body.map((b) => {
    if (typeof b === 'string') return `<p>${b.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')}</p>`;
    if (b[0] === 'h3') return `<h2>${esc(b[1])}</h2>`;
    if (b[0] === 'ul') return `<ul>${b[1].map((x) => `<li>${esc(x)}</li>`).join('\n')}</ul>`;
    return '';
  }).join('\n');

  const others = POSTS.filter((x) => x.slug !== p.slug).slice(0, 4);
  const body = [
    `<p class="el-dated"><time datetime="${p.date}">${p.date}</time> · ${esc(cfg.brand.ko)} 자 메모</p>`,
    `<article class="el-piece">${html}</article>`,
    hailStrip(cfg, '접수', p.slug),
    frame('more', 'next', '이어서 읽을 글', notes(others), null, '01'),
    dt(ctx, p.slug),
    siteLinks(ctx, p.slug),
  ].join('\n');

  return {
    path,
    html: layout(ctx, {
      path,
      title: title.post(p),
      desc: clampDesc(desc.post(p)),
      h1: esc(p.title),
      body,
      pageKind: 'post',
      crumbs: [
        { name: '처음', url: `${siteUrl}/` },
        { name: '자 메모', url: `${siteUrl}/magazine/` },
        { name: p.title, url },
      ],
      jsonld: [S.article({ url, siteUrl, title: p.title, desc: p.summary, date: p.date, cfg })],
    }),
  };
}

/* ── 404 ──────────────────────────────────────────────────────── */
export function notFound(ctx) {
  const { cfg, regions } = ctx;
  const body = [
    `<div class="el-lead"><p>찾으시는 주소에 해당하는 안내문이 없어요. 주소가 바뀌었거나 처음부터 만든 적이 없는 곳이에요. 아래에서 다시 골라 주세요.</p></div>`,
    frame('back', 'back', '다시 고르기',
      `<p class="el-slash"><a href="/">처음</a><a href="/area/">방문 지역</a><a href="/course/">코스</a><a href="/price/">비용</a><a href="/guide/">시작 전에</a>${regions.map((r) => `<a href="/${r.slug}/">${esc(r.name)}</a>`).join('')}</p>`, null, '01'),
    hailStrip(cfg, '바로 접수', '404'),
  ].join('\n');
  return {
    path: '/404.html',
    html: layout(ctx, {
      path: '/404.html',
      title: title.page('없는 주소예요'),
      desc: '찾으시는 주소로 만든 안내문이 없어요. 아래에서 다시 골라 주세요.',
      h1: '없는 주소예요',
      body,
      noindex: true,
      pageKind: '404',
    }),
  };
}
