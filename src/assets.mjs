import fs from 'node:fs';
import path from 'node:path';

/**
 * 손으로 쓴 CSS·JS·SVG. 빌드 도구도, 바깥 글꼴도, 바깥 스크립트도 쓰지 않는다.
 * 이 사이트의 장치는 **자**다. 머리 위 눈금 띠, 칸 제목 밑 눈금 줄, 지역 고르기의 1.0~1.6 눈금선,
 * 둘레를 나타내는 가로 막대 셋이 같은 눈금 문법을 쓴다. 스크립트에 무작위는 없다.
 */
export const THEME = {
  paper: '#FCEFE6', card: '#FFF9F4', soft: '#F6DFD0',
  ink: '#2B1E24', dim: '#6E5A5F',
  acc: '#0E5A7A', accDk: '#0A445C', accSoft: '#D4E7EE',
  line: '#E3C5B0', onAcc: '#FFFFFF',
};

const CSS = (t) => `:root{
  --paper:${t.paper};--card:${t.card};--soft:${t.soft};--ink:${t.ink};--dim:${t.dim};
  --acc:${t.acc};--accDk:${t.accDk};--accSoft:${t.accSoft};--line:${t.line};--onAcc:${t.onAcc};
  --w:1000px;
  --sans:system-ui,-apple-system,"Apple SD Gothic Neo","Noto Sans KR","Malgun Gothic",sans-serif;
  --mono:ui-monospace,"SFMono-Regular",Menlo,Consolas,monospace;
  --ticks:repeating-linear-gradient(90deg,var(--ink) 0 1px,transparent 1px 8px);
}
*,*::before,*::after{box-sizing:border-box}
html{-webkit-text-size-adjust:100%;color-scheme:light}
body{margin:0;font-family:var(--sans);color:var(--ink);background:var(--paper);
  line-height:1.8;font-size:16.5px;letter-spacing:-.005em;padding-bottom:84px}
@media (min-width:900px){body{padding-bottom:0}}
img,svg{max-width:100%}
a{color:var(--acc);text-decoration:none}
a:hover{text-decoration:underline;text-underline-offset:3px}
:focus-visible{outline:2px solid var(--acc);outline-offset:3px}
strong{font-weight:800}
.hop{position:absolute;left:-9999px}
.hop:focus{position:fixed;left:12px;top:12px;z-index:70;background:var(--acc);color:var(--onAcc);padding:10px 16px}

/* ── 머리 = 눈금 띠 위에 얹은 한 줄 ─────────────────── */
.el-top{position:sticky;top:0;z-index:30;background:var(--card);border-bottom:1px solid var(--line)}
.el-tape{height:11px;background:
  repeating-linear-gradient(90deg,var(--ink) 0 1px,transparent 1px 40px),
  repeating-linear-gradient(90deg,var(--ink) 0 1px,transparent 1px 8px);
  background-size:100% 11px,100% 5px;background-repeat:no-repeat;background-position:0 0,0 0;
  background-color:var(--soft);opacity:.85}
.el-top-in{max-width:var(--w);margin:0 auto;padding:8px 20px;display:flex;align-items:center;gap:16px;flex-wrap:wrap}
.el-brand{display:inline-flex;align-items:center;gap:9px;color:var(--ink)}
.el-brand:hover{text-decoration:none}
.el-mk{width:30px;height:30px;flex:none}
.el-brand b{font-size:18px;font-weight:800;letter-spacing:-.03em}
.el-nav{margin:0;padding:0;list-style:none;display:flex;gap:16px;order:3;width:100%;overflow-x:auto}
@media (min-width:860px){.el-nav{order:0;width:auto;margin-left:auto}}
.el-nav a{display:block;padding:4px 0;font-size:14px;font-weight:700;color:var(--dim);white-space:nowrap;
  border-bottom:2px solid transparent}
.el-nav a:hover{text-decoration:none;color:var(--ink);border-bottom-color:var(--line)}
.el-nav a[aria-current]{color:var(--acc);border-bottom-color:var(--acc)}
.el-top .callbox{margin-left:auto}
@media (min-width:860px){.el-top .callbox{margin-left:0}}

/* ── 예약 문의 버튼 ────────────────────────────────── */
.callbox{display:inline-flex;align-items:center;gap:10px;background:var(--acc);color:var(--onAcc);
  padding:8px 16px 8px 12px;border-radius:2px;border:1px solid var(--accDk);line-height:1.15}
.callbox:hover{text-decoration:none;background:var(--accDk)}
.callbox-i{width:14px;height:14px;flex:none;border:2px solid var(--onAcc);border-radius:50% 50% 50% 0;transform:rotate(-45deg)}
.callbox-t{display:flex;flex-direction:column}
.callbox-k{font-size:10.5px;letter-spacing:.08em;opacity:.88}
.callbox-v{font-family:var(--mono);font-weight:800;font-size:15px;letter-spacing:.01em}
.callbox-s{padding:5px 12px 5px 9px}
.callbox-s .callbox-v{font-size:13px}
.callbox-s .callbox-k{display:none}
.callbox-l{padding:11px 22px 11px 16px}
.callbox-l .callbox-v{font-size:19px}

/* ── 지나온 길 ─────────────────────────────────────── */
.el-way{max-width:var(--w);margin:0 auto;padding:10px 20px 0}
.el-way ol{list-style:none;display:flex;flex-wrap:wrap;gap:4px 8px;margin:0;padding:0;font-size:12px;color:var(--dim)}
.el-way li+li::before{content:"→";margin-right:8px;color:var(--line)}
.el-way a{color:var(--dim)}

/* ── 본문 ──────────────────────────────────────────── */
main{max-width:var(--w);margin:0 auto;padding:18px 20px 64px}
.el-h1{margin:14px 0 18px;font-size:clamp(25px,4.6vw,38px);line-height:1.28;font-weight:800;letter-spacing:-.035em}
.el-h1-s{display:block;margin-top:8px;font-family:var(--mono);font-size:13px;font-weight:600;letter-spacing:0;color:var(--dim)}
.el-lead{max-width:46rem;margin:0 0 26px}
.el-lead p{margin:0 0 .9em}
.el-sec-x{margin:14px 0 0;font-size:14px;color:var(--dim)}

/* ── 칸 틀 = 번호 배지 + 눈금 밑줄 ─────────────────── */
.el-blk{margin:44px 0 0}
.el-blk-h{display:flex;align-items:center;gap:12px;padding-bottom:12px;position:relative}
.el-blk-h::after{content:"";position:absolute;left:0;right:0;bottom:0;height:7px;
  background:repeating-linear-gradient(90deg,var(--ink) 0 1px,transparent 1px 10px) left bottom/100% 4px no-repeat,
  linear-gradient(var(--ink),var(--ink)) left bottom/100% 1px no-repeat}
.el-no{flex:none;min-width:30px;height:24px;padding:0 6px;display:inline-flex;align-items:center;justify-content:center;
  background:var(--acc);color:var(--onAcc);font-family:var(--mono);font-size:12px;font-weight:800;letter-spacing:.04em}
.el-blk-h h2{margin:0;font-size:21px;font-weight:800;letter-spacing:-.03em;line-height:1.35}
.el-blk-s{margin:12px 0 0;font-size:14px;color:var(--dim)}
.el-blk-b{margin-top:18px}

/* ── 첫 화면 ───────────────────────────────────────── */
.el-door{background:var(--card);border:1px solid var(--line);border-left:6px solid var(--acc);padding:22px 22px 18px;margin:0 0 6px}
.el-door-sl{margin:0 0 10px;font-size:19px;font-weight:800;letter-spacing:-.025em;line-height:1.5;color:var(--accDk)}
.el-door-p{margin:0 0 16px;max-width:44rem;color:var(--dim);font-size:15.5px}
.el-door-f{margin:18px 0 0;display:grid;grid-template-columns:repeat(2,1fr);gap:0;border-top:1px solid var(--line)}
@media (min-width:720px){.el-door-f{grid-template-columns:repeat(4,1fr)}}
.el-door-f div{padding:10px 12px 4px 0}
.el-door-f dt{font-family:var(--mono);font-size:11px;letter-spacing:.1em;color:var(--dim)}
.el-door-f dd{margin:2px 0 0;font-weight:800;font-size:15px}

/* ── 지역 고르기 = 1.0~1.6 눈금선 위의 점 ─────────── */
.el-gtop{display:flex;justify-content:space-between;margin:0 0 6px;padding-left:0;font-family:var(--mono);font-size:11px;color:var(--dim)}
@media (min-width:720px){.el-gtop{margin-left:calc(11rem + 7rem + 20px);margin-right:calc(3.4rem + 10px)}}
@media (max-width:719px){.el-gtop{display:none}}
.el-gauge{list-style:none;margin:0;padding:0}
.el-gauge li{border-bottom:1px solid var(--line)}
.el-gauge li.main{background:var(--card)}
.el-gauge a{display:grid;grid-template-columns:1fr auto;grid-template-areas:"n v" "m m" "g g";gap:2px 10px;padding:10px 10px;color:var(--ink);align-items:center}
@media (min-width:720px){.el-gauge a{grid-template-columns:11rem 7rem 1fr 3.4rem;grid-template-areas:"n m g v";gap:0 10px}}
.el-gauge a:hover{text-decoration:none;background:var(--accSoft)}
.el-gauge b{grid-area:n;font-size:16.5px;font-weight:800}
.el-gauge small{grid-area:m;font-size:12.5px;color:var(--dim)}
.el-gauge em{grid-area:v;font-style:normal;font-family:var(--mono);font-weight:800;color:var(--acc);text-align:right}
.el-g{grid-area:g;position:relative;height:14px;display:block}
.el-g::before{content:"";position:absolute;left:0;right:0;top:6px;height:2px;background:var(--line)}
.el-g::after{content:"";position:absolute;left:0;right:0;top:3px;height:8px;
  background:repeating-linear-gradient(90deg,var(--dim) 0 1px,transparent 1px calc(16.6667% - 0.0px));opacity:.45}
.el-g i{position:absolute;top:1px;width:12px;height:12px;margin-left:-6px;background:var(--acc);border:2px solid var(--card);border-radius:50%;z-index:1}
.el-key{margin:16px 0 0;max-width:46rem;font-size:14px;color:var(--dim)}

/* ── 표 ────────────────────────────────────────────── */
.el-tw{overflow-x:auto;border:1px solid var(--line);background:var(--card)}
.el-t{width:100%;border-collapse:collapse;font-size:14.5px}
.el-t th,.el-t td{padding:10px 12px;border-bottom:1px solid var(--line);text-align:left;vertical-align:top}
.el-t thead th{background:var(--soft);font-size:12px;font-family:var(--mono);letter-spacing:.06em;color:var(--dim);font-weight:700;white-space:nowrap}
.el-t tbody th{font-weight:800}
.el-t small{display:block;margin-top:3px;font-size:12.5px;font-weight:400;color:var(--dim);line-height:1.6}
.el-t tr:last-child>*{border-bottom:0}
.el-t .el-t-w{text-align:right;white-space:nowrap}
.el-t tr.el-me>*{background:var(--accSoft)}

/* ── 정보 두 칸 ────────────────────────────────────── */
.el-kv{margin:0;display:grid;border:1px solid var(--line);background:var(--card)}
@media (min-width:720px){.el-kv{grid-template-columns:1fr 1fr}}
.el-kv div{display:grid;grid-template-columns:8.5rem 1fr;gap:10px;padding:11px 14px;border-bottom:1px solid var(--line)}
.el-kv dt{font-size:13px;font-weight:700;color:var(--dim)}
.el-kv dd{margin:0;font-weight:700}
.el-kv small{display:block;margin-top:2px;font-weight:400;font-size:12.5px;color:var(--dim)}
.el-kv dd a{font-weight:800}

/* ── 가로 막대 셋 = 자 세 개 ───────────────────────── */
.el-rb{border:1px solid var(--line);background:var(--card);padding:14px 16px;display:grid;gap:10px}
.el-rb-r{margin:0;display:grid;grid-template-columns:5.2rem 1fr 5.6rem;gap:10px;align-items:center;font-size:14px}
.el-rb-n{font-family:var(--mono);font-size:12px;color:var(--dim)}
.el-rb-t{display:block;height:14px;background:
  repeating-linear-gradient(90deg,var(--line) 0 1px,transparent 1px 10%);position:relative}
.el-rb-t>i{display:block;height:100%;background:var(--acc);opacity:.88}
.el-rb-r:nth-child(2) .el-rb-t>i{opacity:.62}
.el-rb-r:nth-child(3) .el-rb-t>i{opacity:.4}
.el-rb-r b{text-align:right;font-family:var(--mono)}

/* ── 접수 흐름 = 세로 타임라인 ─────────────────────── */
.el-tl{list-style:none;margin:0;padding:0 0 0 20px;position:relative;counter-reset:s}
.el-tl::before{content:"";position:absolute;left:5px;top:6px;bottom:6px;width:2px;background:var(--line)}
.el-tl li{position:relative;padding:0 0 18px 18px;counter-increment:s}
.el-tl li::before{content:"";position:absolute;left:-20px;top:6px;width:12px;height:12px;border-radius:50%;background:var(--card);border:3px solid var(--acc)}
.el-tl b{display:block;font-size:16px;font-weight:800}
.el-tl span{display:block;color:var(--dim);font-size:14.5px}
.el-tl li:last-child{padding-bottom:0}

/* ── 자주 묻는 것 = 말풍선 쌍 ──────────────────────── */
.el-qa{display:grid;gap:18px}
.el-qa-i{display:grid;gap:8px}
.el-qa-i h3{margin:0;justify-self:end;max-width:min(34rem,92%);background:var(--acc);color:var(--onAcc);
  padding:9px 14px;font-size:15px;font-weight:700;line-height:1.55;border-radius:14px 14px 2px 14px}
.el-qa-i p{margin:0;justify-self:start;max-width:min(38rem,94%);background:var(--card);border:1px solid var(--line);
  padding:10px 14px;font-size:15px;border-radius:14px 14px 14px 2px}

/* ── 알림·금지 목록 ────────────────────────────────── */
.el-heed{list-style:none;margin:0;padding:0;display:grid;gap:0;border:1px solid var(--line);background:var(--card)}
.el-heed li{padding:10px 14px 10px 36px;border-bottom:1px solid var(--line);position:relative;font-size:15px}
.el-heed li:last-child{border-bottom:0}
.el-heed li::before{content:"";position:absolute;left:14px;top:18px;width:9px;height:9px;background:var(--acc);transform:rotate(45deg)}

/* ── 슬래시로 이은 링크 ────────────────────────────── */
.el-slash{margin:0;line-height:2;font-size:14.5px}
.el-slash a{display:inline-block;white-space:nowrap}
.el-slash a+a::before{content:"/";display:inline-block;margin:0 9px;color:var(--line);font-weight:400}
.el-routes{display:grid;gap:20px}
@media (min-width:760px){.el-routes{grid-template-columns:1fr 1fr}}
.el-route{border-top:2px solid var(--ink);padding-top:8px}
.el-route-h{margin:0 0 4px;font-family:var(--mono);font-size:11.5px;letter-spacing:.1em;color:var(--dim)}

/* ── 이름표 줄 ─────────────────────────────────────── */
.el-tags{list-style:none;margin:0;padding:0;display:flex;flex-wrap:wrap;gap:8px}
.el-tags li a,.el-tags li span{display:inline-flex;align-items:stretch;border:1px solid var(--line);background:var(--card);color:var(--ink);font-size:14px;font-weight:700}
.el-tags li a{padding:0 0 0 11px}
.el-tags li a:hover{text-decoration:none;border-color:var(--acc)}
.el-tags li a>b{margin-left:10px;padding:3px 9px;background:var(--soft);font-family:var(--mono);font-size:12px;font-weight:700;color:var(--accDk);display:inline-flex;align-items:center}
.el-tags li a{line-height:2}
.el-tags-n li span{padding:2px 11px;font-weight:600;color:var(--dim)}

/* ── 결로 묶은 동 목록 ─────────────────────────────── */
.el-grps{display:grid;gap:22px}
.el-grp h3{margin:0 0 6px;font-size:16px;font-weight:800;display:flex;align-items:center;gap:8px}
.el-grp h3 em{font-style:normal;font-family:var(--mono);font-size:12px;padding:1px 8px;background:var(--accSoft);color:var(--accDk)}
.el-dots{list-style:none;margin:0;padding:0;display:grid;gap:0 28px}
@media (min-width:720px){.el-dots{grid-template-columns:1fr 1fr}}
.el-dots li{border-bottom:1px solid var(--line)}
.el-dots a{display:flex;align-items:baseline;gap:6px;padding:6px 2px;color:var(--ink);font-weight:700}
.el-dots a:hover{text-decoration:none;color:var(--acc)}
.el-dots a>span{white-space:nowrap}
.el-dots a>i{flex:1;border-bottom:2px dotted var(--line);transform:translateY(-4px);min-width:12px}
.el-dots a>b{font-family:var(--mono);font-size:12.5px;color:var(--dim);white-space:nowrap}

/* ── 결이 같은 동 카드 ─────────────────────────────── */
.el-tcs{display:grid;gap:14px}
@media (min-width:760px){.el-tcs{grid-template-columns:1fr 1fr}}
.el-tc{background:var(--card);border:1px solid var(--line);border-left:4px solid var(--acc);padding:12px 14px}
.el-tc h3{margin:0 0 6px;font-size:15px;font-weight:800;color:var(--accDk)}
.el-tc ul{list-style:none;margin:0;padding:0}
.el-tc li{display:flex;justify-content:space-between;gap:12px;padding:5px 0;border-top:1px solid var(--line);font-size:14.5px}
.el-tc li:first-child{border-top:0}
.el-tc li b{flex:none;font-family:var(--mono);font-size:12.5px;color:var(--dim);font-weight:600;text-align:right}

/* ── 글 목록·글 ────────────────────────────────────── */
.el-notes{list-style:none;margin:0;padding:0;border-top:2px solid var(--ink)}
.el-notes li{border-bottom:1px solid var(--line)}
.el-notes a{display:grid;gap:2px 16px;padding:12px 4px;color:var(--ink)}
@media (min-width:720px){.el-notes a{grid-template-columns:1fr auto}}
.el-notes a:hover{text-decoration:none;background:var(--card)}
.el-notes b{font-size:16px;font-weight:800}
.el-notes a:hover b{color:var(--acc)}
.el-notes span{grid-column:1;font-size:13.5px;color:var(--dim)}
.el-notes time{font-family:var(--mono);font-size:12px;color:var(--dim);grid-row:1;grid-column:2;align-self:start}
@media (max-width:719px){.el-notes time{grid-row:auto;grid-column:1}}
.el-piece{max-width:44rem;font-size:17px}
.el-piece h2{margin:30px 0 10px;font-size:19px;font-weight:800;padding-bottom:4px;border-bottom:2px solid var(--ink)}
.el-piece p{margin:0 0 1.05em}
.el-piece ul{margin:0 0 1.05em;padding-left:1.1em;color:var(--dim)}
.el-doc{max-width:44rem}
.el-doc h2{margin:22px 0 6px;font-size:16.5px;font-weight:800;color:var(--accDk)}
.el-doc p{margin:0;font-size:15px;color:var(--dim)}
.el-dated{margin:0 0 16px;font-size:12px;color:var(--dim);font-family:var(--mono)}

/* ── 예약 문의 띠 ──────────────────────────────────── */
.el-hail{margin:40px 0 0;border:1px solid var(--ink);background:var(--card);padding:16px 18px;
  display:flex;flex-wrap:wrap;gap:14px 24px;align-items:center;justify-content:space-between;position:relative}
.el-hail::before{content:"";position:absolute;left:0;right:0;top:0;height:6px;
  background:repeating-linear-gradient(90deg,var(--ink) 0 1px,transparent 1px 9px)}
.el-hail-p{margin:6px 0 0;max-width:34rem;font-weight:700;font-size:15.5px;line-height:1.7}
.el-hail-p span{display:block;margin-top:2px;font-weight:400;font-size:13px;color:var(--dim)}

/* ── 발 ────────────────────────────────────────────── */
.el-foot{margin-top:36px;background:var(--soft);color:var(--ink)}
.el-tape-f{transform:scaleY(-1)}
.el-foot-in{max-width:var(--w);margin:0 auto;padding:26px 20px 12px;display:grid;gap:26px}
@media (min-width:900px){.el-foot-in{grid-template-columns:1.1fr 1fr 1fr}}
.el-foot-nm{margin:0 0 6px;font-size:20px;font-weight:800;letter-spacing:-.03em}
.el-foot-say{margin:0 0 12px;font-size:14px;color:var(--dim)}
.el-foot-run{margin:10px 0 0;font-size:12px;color:var(--dim);font-family:var(--mono)}
.el-foot-h{margin:0 0 6px;font-family:var(--mono);font-size:11px;letter-spacing:.14em;font-weight:700;color:var(--dim)}
.el-foot-b .el-slash,.el-foot-c .el-slash{margin-bottom:14px;font-size:14px}
.el-foot-ul{list-style:none;margin:0 0 14px;padding:0;display:grid;gap:7px;font-size:14px}
.el-foot-ul time{display:block;font-family:var(--mono);font-size:11px;color:var(--dim)}
.el-foot-sm{margin:6px 0 0;font-size:12px;color:var(--dim)}
.el-foot-end{max-width:var(--w);margin:0 auto;padding:12px 20px 28px;border-top:1px solid var(--line)}
.el-biz{margin:0 0 8px;font-size:12px;color:var(--dim)}
.el-pale{opacity:.75}
.el-ai{margin:0 0 8px;font-size:12px;color:var(--dim);line-height:1.72}
.el-cr{margin:0;font-size:11.5px;color:var(--dim)}

/* ── 아래 붙은 줄 ──────────────────────────────────── */
.el-bar{position:fixed;left:0;right:0;bottom:0;z-index:40;background:var(--ink);color:var(--paper);
  padding:8px 14px calc(8px + env(safe-area-inset-bottom));display:flex;align-items:center;justify-content:space-between;gap:10px;
  transition:transform .2s}
.el-bar.down{transform:translateY(110%)}
.el-bar-s{font-family:var(--mono);font-size:11.5px;line-height:1.35;max-width:9rem}
.el-bar .callbox{background:var(--acc)}
@media (min-width:900px){.el-bar{display:none}}
@media print{.el-bar,.el-top,.el-hail{display:none}}
`;

const JS = `(function(){
  /* 발이 화면에 들어오면 아래 붙은 줄을 내린다. 그 밖의 일은 하지 않는다 —
     화면을 흔드는 무작위가 없어야 같은 주소에서 같은 화면이 나온다. */
  var bar=document.querySelector('.el-bar'),ft=document.querySelector('.el-foot');
  if(!bar||!ft||!('IntersectionObserver' in window))return;
  new IntersectionObserver(function(es){
    es.forEach(function(e){bar.classList.toggle('down',e.isIntersecting);});
  },{rootMargin:'0px 0px -40px 0px'}).observe(ft);
})();`;

/* 눈금자 — 대각선으로 놓은 자 하나 */
const RULER = (c, bg) => `<rect x="2" y="9" width="28" height="14" fill="${bg}" stroke="${c}" stroke-width="1.6"/>
<path d="M7 9v6M12 9v4M17 9v6M22 9v4M27 9v6" stroke="${c}" stroke-width="1.4" fill="none"/>`;
const FAVICON = (t) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="4" fill="${t.paper}"/>${RULER(t.acc, t.accSoft)}</svg>`;
const LOGO = (t, cfg) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 270 48"><rect width="270" height="48" fill="${t.paper}"/><g transform="translate(8,8)">${RULER(t.acc, t.accSoft)}</g><text x="50" y="26" font-family="system-ui,sans-serif" font-size="18" font-weight="800" fill="${t.ink}">${cfg.brand.ko}</text><text x="50" y="38" font-family="ui-monospace,monospace" font-size="9" letter-spacing="3" fill="${t.dim}">${cfg.brand.en.toUpperCase()}</text></svg>`;

const OG = (t, cfg) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630"><rect width="1200" height="630" fill="${t.paper}"/>
<rect x="0" y="0" width="1200" height="26" fill="${t.soft}"/>
<path d="${Array.from({ length: 76 }, (_, i) => `M${i * 16} 0v${i % 5 === 0 ? 26 : 12}`).join('')}" stroke="${t.ink}" stroke-width="1.5" fill="none"/>
<g transform="translate(120,150)"><rect width="${900}" height="22" fill="${t.acc}" fill-opacity=".9"/><rect y="44" width="${640}" height="22" fill="${t.acc}" fill-opacity=".62"/><rect y="88" width="${420}" height="22" fill="${t.acc}" fill-opacity=".4"/></g>
<text x="120" y="360" font-family="system-ui,sans-serif" font-size="52" font-weight="800" fill="${t.ink}">${cfg.brand.ko} 출장마사지 홈타이</text>
<text x="120" y="418" font-family="system-ui,sans-serif" font-size="26" fill="${t.dim}">${cfg.brand.slogan}</text>
<text x="120" y="468" font-family="ui-monospace,monospace" font-size="20" fill="${t.dim}">서울 · 인천 · 경기 · 부산 동까지 · ${cfg.hours} · ${cfg.pay}</text>
<rect x="120" y="500" width="440" height="80" fill="${t.acc}"/>
<text x="150" y="534" font-family="ui-monospace,monospace" font-size="14" letter-spacing="4" fill="${t.onAcc}">${cfg.telLabel}</text>
<text x="150" y="566" font-family="ui-monospace,monospace" font-size="28" font-weight="700" fill="${t.onAcc}">${cfg.tel}</text>
</svg>`;

export function writeAssets(dist, cfg) {
  const dir = path.join(dist, 'assets');
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'el.css'), CSS(THEME));
  fs.writeFileSync(path.join(dir, 'el.js'), JS);
  fs.writeFileSync(path.join(dir, 'favicon.svg'), FAVICON(THEME));
  fs.writeFileSync(path.join(dir, 'logo.svg'), LOGO(THEME, cfg));
  fs.writeFileSync(path.join(dir, 'og.svg'), OG(THEME, cfg));
}
export const RULERMARK = (t = THEME) => `<svg class="el-mk" viewBox="0 0 32 32" aria-hidden="true" focusable="false">${RULER(t.acc, t.accSoft)}</svg>`;
