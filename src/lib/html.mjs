import { esc } from './util.mjs';
import * as S from './schema.mjs';
import { RULERMARK } from '../assets.mjs';

export const ASSET_V = '1';

/**
 * 공통 뼈대.
 *   머리 — 눈금자 띠 + 밑줄 글자 메뉴 + 네모 버튼
 *   발   — 출처·최신성·수집 경로 + AI 활용 고지
 * 전화번호는 callBox() 로만 찍는다. 라벨은 '예약 문의' 하나다.
 */
export function layout(ctx, opts) {
  const { cfg, siteUrl, latestPosts } = ctx;
  const {
    path, title, desc, h1, body, jsonld = [], geo, crumbs = [],
    noindex = false, pageKind = '', pageType = '', about = '', mainList = '',
  } = opts;
  const url = `${siteUrl}${path}`;
  const graph = S.graph([
    S.organization(cfg, siteUrl),
    S.website(cfg, siteUrl),
    crumbs.length ? S.breadcrumb(url, crumbs) : null,
    S.webpage({ url, siteUrl, title, desc, breadcrumbId: crumbs.length ? `${url}#crumb` : null, pageType, about, mainList }),
    ...jsonld,
  ]);

  return `<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
${cfg.naverVerification ? `<meta name="naver-site-verification" content="${esc(cfg.naverVerification)}"/>` : ''}
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${url}">
<meta name="robots" content="${noindex ? 'noindex,follow' : 'index,follow,max-image-preview:large,max-snippet:-1'}">
<meta name="format-detection" content="telephone=yes">
<meta name="author" content="${esc(cfg.brand.ko)}">
<meta name="theme-color" content="#FCEFE6">
${geo ? `<meta name="geo.region" content="${esc(geo.iso)}">
<meta name="geo.placename" content="${esc(geo.placename)}">
<meta name="geo.position" content="${geo.lat};${geo.lng}">
<meta name="ICBM" content="${geo.lat}, ${geo.lng}">` : '<meta name="geo.region" content="KR">'}
<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(cfg.brand.ko)} 출장마사지">
<meta property="og:locale" content="ko_KR">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${siteUrl}/assets/og.svg">
<meta name="twitter:card" content="summary">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(desc)}">
<link rel="sitemap" type="application/xml" href="/sitemap.xml">
<link rel="alternate" type="application/rss+xml" title="${esc(cfg.rssTitle)}" href="${siteUrl}/rss.xml">
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/assets/favicon.svg">
<link rel="manifest" href="/site.webmanifest">
<link rel="stylesheet" href="/assets/el.css?v=${ASSET_V}">
<script type="application/ld+json">${graph}</script>
</head>
<body data-kind="${pageKind}">
<a class="hop" href="#main">본문으로 가기</a>
${header(ctx, path)}
${crumbs.length > 1 ? wayHtml(crumbs) : ''}
<main id="main">
<h1 class="el-h1">${h1}</h1>
${body}
</main>
${footer(ctx, latestPosts)}
${floatBar(cfg)}
<script src="/assets/el.js?v=${ASSET_V}" defer></script>
</body>
</html>`;
}

/** 예약 문의 알약. size: s(머리) · m(본문) · l(아래 떠 있는 것) */
export function callBox(cfg, { size = 'm', bar = false } = {}) {
  return `<a class="callbox callbox-${size}${bar ? ' callbox-b' : ''}" href="tel:${cfg.telRaw}">
  <span class="callbox-i" aria-hidden="true"></span>
  <span class="callbox-t"><span class="callbox-k">${esc(cfg.telLabel)}</span><span class="callbox-v">${esc(cfg.tel)}</span></span>
</a>`;
}

function header(ctx, path) {
  const { cfg } = ctx;
  const on = (p) => (path === p || (p !== '/' && path.startsWith(p)) ? ' aria-current="page"' : '');
  const menu = [['/area/', '지역'], ['/course/', '코스'], ['/price/', '값'], ['/guide/', '시작 전에'], ['/magazine/', '자 메모']];
  return `<header class="el-top">
  <div class="el-tape" aria-hidden="true"></div>
  <div class="el-top-in">
    <a class="el-brand" href="/" aria-label="${esc(cfg.brand.ko)} 첫 화면">${RULERMARK()}<b>${esc(cfg.brand.ko)}</b></a>
    <nav aria-label="주요 메뉴"><ul class="el-nav">${menu.map(([h, t]) => `<li><a href="${h}"${on(h)}>${t}</a></li>`).join('')}</ul></nav>
    ${callBox(cfg, { size: 's' })}
  </div>
</header>`;
}

function wayHtml(crumbs) {
  return `<nav class="el-way" aria-label="여기까지 온 길"><ol>${crumbs
    .map((c, i) => (i === crumbs.length - 1
      ? `<li><span aria-current="page">${esc(c.name)}</span></li>`
      : `<li><a href="${c.url.replace(/^https?:\/\/[^/]+/, '')}">${esc(c.name)}</a></li>`))
    .join('')}</ol></nav>`;
}

/** 발 — 눈금 띠 위에 세 칸 + 맨 아래 고지 */
function footer(ctx, latestPosts = []) {
  const { cfg, regions, counts, data, updated } = ctx;
  const b = cfg.business || {};
  const biz = [
    b.name ? `상호 ${esc(b.name)}` : '',
    b.owner ? `대표 ${esc(b.owner)}` : '',
    b.regNo ? `사업자등록번호 ${esc(b.regNo)}` : '',
    b.address ? `주소 ${esc(b.address)}` : '',
    b.privacyOfficer ? `개인정보 담당자 ${esc(b.privacyOfficer)}` : '',
    b.email ? `문의 ${esc(b.email)}` : '',
  ].filter(Boolean).join(' · ');
  const byKo = (a, b) => (a.name < b.name ? -1 : 1);
  const main = regions.filter((r) => r.main).sort(byKo);
  const sub = regions.filter((r) => !r.main).sort(byKo);

  return `<footer class="el-foot">
  <div class="el-tape el-tape-f" aria-hidden="true"></div>
  <div class="el-foot-in">
    <section class="el-foot-a" aria-label="${esc(cfg.brand.ko)} 소개">
      <p class="el-foot-nm">${esc(cfg.brand.ko)}</p>
      <p class="el-foot-say">매장은 없고, 연락이 오면 관리사가 그 주소로 걸어가요. 시군구 ${counts.gu}곳과 동 ${counts.spot}구역 어디서든 접수는 번호 하나로 받아요.</p>
      ${callBox(cfg, { size: 'm' })}
      <p class="el-foot-run">${esc(cfg.hours)} / ${esc(cfg.pay)} / 선입금 없음</p>
    </section>
    <nav class="el-foot-b" aria-label="지역 바로가기">
      <h2 class="el-foot-h">동까지 적은 곳</h2>
      <p class="el-slash">${main.map((r) => `<a href="/${r.slug}/">${esc(r.name)}</a>`).join('')}</p>
      <h2 class="el-foot-h">시군구까지 적은 곳</h2>
      <p class="el-slash">${sub.map((r) => `<a href="/${r.slug}/">${esc(r.name)}</a>`).join('')}</p>
      <p class="el-foot-sm"><a href="/area/">지역 전체 목록</a>, 읍·면 ${counts.rural}곳은 이름만 적었어요</p>
    </nav>
    <div class="el-foot-c">
      <h2 class="el-foot-h">문서</h2>
      <p class="el-slash"><a href="/guide/">시작 전에</a><a href="/price/">값</a><a href="/course/">코스</a><a href="/company/">소개</a><a href="/terms/">이용약관</a><a href="/privacy/">개인정보처리방침</a></p>
      <h2 class="el-foot-h">최근 자 메모</h2>
      <ul class="el-foot-ul">${latestPosts.slice(0, 3).map((p) => `<li><a href="${p.path}">${esc(p.title)}</a><time datetime="${p.date}">${p.date}</time></li>`).join('')}</ul>
      <h2 class="el-foot-h">가져가기</h2>
      <p class="el-slash"><a href="/rss.xml">RSS</a><a href="/sitemap.xml">사이트맵</a><a href="/llms.txt">llms.txt</a></p>
      <p class="el-foot-sm">마지막 손질 <time datetime="@@LM@@">@@LM@@</time></p>
    </div>
  </div>
  <div class="el-foot-end">
    ${biz ? `<p class="el-biz">${biz}</p>` : '<p class="el-biz el-pale">운영자 표기는 확정되는 대로 이 줄에 적어요.</p>'}
    <p class="el-ai">지역별 둘레와 굽이값은 공개된 행정동 경계를 컴퓨터가 자 길이대로 걸어 얻은 숫자예요. 글은 <strong>AI 도구로 초안을 잡은 뒤</strong> 사람이 고쳐서 올렸어요. 후기·체험담·별점은 받지도 싣지도 않고, 인물 사진도 쓰지 않아요. 바탕 자료: ${esc(data.source)}</p>
    <p class="el-cr">© ${esc(updated.slice(0, 4))} ${esc(cfg.brand.ko)}. 치료를 하는 곳이 아니고 성적인 서비스는 하지 않아요.</p>
  </div>
</footer>`;
}

/** 화면 아래에 붙어 다니는 가로 띠 */
function floatBar(cfg) {
  return `<div class="el-bar">
  <span class="el-bar-s">현관까지 ${esc(cfg.arrive)}</span>
  ${callBox(cfg, { size: 'l' })}
</div>`;
}

/**
 * 칸 틀 — 번호 배지 + 왼쪽 정렬 제목 + 눈금 밑줄, 부제는 그 아래 한 줄.
 */
export function frame(id, label, h2, inner, sub, n) {
  return `<section class="el-blk" id="${id}" aria-labelledby="${id}-h">
  <header class="el-blk-h">
    ${n ? `<span class="el-no" aria-hidden="true">${esc(n)}</span>` : ''}
    <h2 id="${id}-h">${h2}</h2>
  </header>
  ${sub ? `<p class="el-blk-s">${sub}</p>` : ''}
  <div class="el-blk-b">${inner}</div>
</section>`;
}
