/**
 * 타이틀·디스크립션 정본.
 * 토막을 잇는 기호는 화살표(→)를 쓴다.
 *   엘릭서스파 `{동} 출장마사지 홈타이 → {구} {코스어} → {행동어} 엘릭서스파`
 * '마사지'는 제목에 한 번만 넣는다. '여성전용마사지'는 업소를 싣지 않아 쓰지 않는다.
 * 설명문은 100자 안쪽이고, 가운데 토막은 그 자리에서만 나오는 계산값(둘레·굽이값·줄어듦)으로 채운다.
 */
import { hash, km2, withJosa as J } from './util.mjs';
import { fk, fa, fb, clsName } from '../content/copy.mjs';

const at = (h, arr, slot = 0) => arr[parseInt(h.substr((slot * 3) % 29, 3), 16) % arr.length];

export const BRAND = '엘릭서스파';
const KEY = '출장마사지 홈타이';

const COURSE_WORD = ['스웨디시', '아로마', '딥티슈', '타이', '경락', '건식', '림프', '지압', '스포츠'];
const ACT = ['지금 부르기', '값 먼저 확인', '새벽에도 응대', '한 통으로 끝', '시각 정해 두기'];

/* ── 제목 ─────────────────────────────────────────────────────────── */
export const title = {
  home: (c) => `${BRAND} ${KEY} → 경계를 자로 걸어 쓴 지역 안내 → ${c ? `동 ${c.spot}곳` : '동 단위'} 후불 접수`,
  areaHub: (c) => `${KEY} 갈 수 있는 지역 → 동 ${c.spot}곳 시군구 ${c.gu}곳 → ${BRAND}`,
  sido: (sd) => `${sd.name} ${KEY} → ${sd.main ? `동 ${sd.spotCount}곳 굽이값 ${fa(sd.a)}` : `시군구 ${sd.gu.length}곳 굽이값 ${fa(sd.a)}`} → ${at(hash(sd.name, 'sdt'), ACT)} ${BRAND}`,
  gu: (sd, g) => {
    const h = hash(sd.name, g.name, 'gt');
    const unit = g.main && g.spotCount ? `동 ${g.spotCount}곳` : g.main ? `읍면 ${g.ruralCount}곳` : `행정동 ${g.dongCount}곳`;
    return `${g.name} ${KEY} → ${sd.name} ${unit} 굽이값 ${fa(g.a)} → ${at(h, ACT, 0)} ${BRAND}`;
  },
  spot: (sd, g, s) => {
    const h = hash(sd.name, g.name, s.name, 'st');
    return `${s.name} ${KEY} → ${g.name} ${at(h, COURSE_WORD, 0)} → ${at(h, ACT, 1)} ${BRAND}`;
  },
  course: (c) => `${c.ko} ${KEY} → ${c.min}분 ${c.price.toLocaleString('ko-KR')}원 → 압 ${c.pressure} ${BRAND}`,
  sidoCourse: (sd, c) => `${sd.name} ${c.ko} ${KEY} → ${sd.name} 방문 → ${at(hash(sd.name, c.slug), ACT)} ${BRAND}`,
  page: (t) => `${t} → ${BRAND} ${KEY}`,
  post: (p) => `${p.title} → ${BRAND} 자 메모`,
};

/* ── 디스크립션 ───────────────────────────────────────────────────── */
function spotMiddle(sd, g, s, h) {
  const [p0, p1, p2] = s.v;
  const frames = [
    () => `80m 자로 ${fk(p0)}, 720m 자로 ${fk(p2)}를 걷는 경계예요`,
    () => `굽이값 ${fa(s.a)}, ${J(clsName(s.cls), '으로/로')} 읽혀요`,
    () => `긴 자로 바꾸면 둘레가 ${fb(s.b)}% 줄어요`,
    () => `${g.name}에서 굽이값이 ${s.gRank}번째로 높아요`,
    () => `자를 늘이면 둘레가 ${fk(p0)}에서 ${fk(p1)}, ${fk(p2)}로 줄어요`,
    () => `땅 ${km2(s.area)}, 결은 ${clsName(s.cls)}이에요`,
  ];
  return frames[parseInt(h.substr(6, 3), 16) % frames.length]();
}
const TAIL = [
  '후불로 계산해요',
  '선입금은 없어요',
  '멀어도 값은 그대로예요',
  '밤에도 같은 값이에요',
  '계산은 마친 뒤 한 번이에요',
];
const tailOf = (h) => TAIL[parseInt(h.substr(9, 3), 16) % TAIL.length];

export const desc = {
  home: () =>
    '서울·인천·경기·부산은 동까지, 그 밖 지정 지역은 시군구까지 적은 출장마사지 홈타이 안내. 경계를 자 세 가지로 걸어 둘레를 쟀어요.',
  areaHub: (c) =>
    `출장마사지 홈타이가 가는 동 ${c.spot}곳과 시군구 ${c.gu}곳. 곳마다 자 길이별 둘레와 굽이값을 적었어요.`,
  sido: (sd) =>
    sd.main
      ? `${sd.name} ${KEY} 방문. 시군구 ${sd.gu.length}곳과 동 ${sd.spotCount}곳을 적었고 평균 굽이값은 ${fa(sd.avgA)}예요.`
      : `${sd.name} ${KEY} 방문. 시군구 ${sd.gu.length}곳까지 적었고 동 이름은 그 안에 있어요. 후불이고 밤에도 받아요.`,
  gu: (sd, g) => {
    const h = hash(sd.name, g.name, 'gd');
    const mid = g.main && g.spotCount
      ? [
        `동 ${g.spotCount}곳을 적었고 굽이값은 ${fa(g.a)}예요`,
        `굽이값이 가장 높은 곳은 ${g.hi}, 가장 낮은 곳은 ${g.lo}이에요`,
        `80m 자 ${fk(g.v[0])}, 720m 자 ${fk(g.v[2])}를 걷는 ${clsName(g.cls)} 땅이에요`,
        `줄어듦이 가장 큰 곳은 ${g.bHi}(${fb(g.bHiV)}%)예요`,
      ][parseInt(h.substr(3, 3), 16) % 4]
      : g.main
        ? [
          `행정동 ${g.dongCount}곳이 전부 읍·면이라 이 한 장에서 받아요`,
          `읍 ${g.eupCount}곳과 면 ${g.myeonCount}곳은 이름으로 올렸어요`,
          `땅 ${km2(g.area)}에 굽이값 ${fa(g.a)}, ${clsName(g.cls)}로 읽혀요`,
        ][parseInt(h.substr(3, 3), 16) % 3]
        : [
          `행정동 ${g.dongCount}곳이 들어 있고 결은 ${clsName(g.cls)}이에요`,
          `굽이값 ${fa(g.a)}, 넓이 ${km2(g.area)}짜리 땅이에요`,
          g.ruralCount ? `동과 읍·면 ${g.ruralCount}곳 모두 찾아가요` : `동 ${g.dongNames.length}곳 어디나 한 번호로 받아요`,
        ][parseInt(h.substr(3, 3), 16) % 3];
    return `${sd.name} ${g.name} ${KEY}. ${mid}. ${tailOf(h)}.`;
  },
  spot: (sd, g, s) => {
    const h = hash(sd.name, g.name, s.name, 'sd');
    return `${sd.name} ${g.name} ${s.name} ${KEY}. ${spotMiddle(sd, g, s, h)}. ${tailOf(h)}.`;
  },
  course: (c) =>
    `${c.ko} 출장 방문. ${c.focus}에 시간을 몰아 쓰고 압은 ${c.pressure}예요. ${c.min}분 ${c.price.toLocaleString('ko-KR')}원, 지역에 따라 달라지지 않아요.`,
  sidoCourse: (sd, c) =>
    `${sd.name} ${c.ko} ${KEY}. ${c.focus}${J(c.focus, '을/를').slice(c.focus.length)} 오래 다뤄요. ${sd.name} 어디서나 ${c.min}분 ${c.price.toLocaleString('ko-KR')}원.`,
  post: (p) => p.summary,
};

/** 설명이 예산을 넘으면 문장 단위로 자른다. */
export function clampDesc(s, limit = 100) {
  if (s.length <= limit) return s;
  const parts = s.split(/(?<=\.)\s+/);
  let out = '';
  for (const p of parts) {
    if ((out + p).length > limit) break;
    out += (out ? ' ' : '') + p;
  }
  return out || s.slice(0, limit - 1) + '…';
}
