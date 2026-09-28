const $ = (s, e = document) => [...e.querySelectorAll(s)];
const hdr = $(".hdr")[0];
const IO = "IntersectionObserver" in window;
let last = 0;

// Header：向下捲超過自身高度就隱藏，向上捲或鍵盤聚焦時滑回
addEventListener(
  "scroll",
  () => {
    const y = scrollY;
    if (y > last && y > hdr.offsetHeight) hdr.classList.add("hide");
    else if (y < last) hdr.classList.remove("hide");
    last = y;
    hdr.classList.toggle("scrolled", y > 0); // 離開頂部後背景更透明
  },
  { passive: true },
);
hdr.addEventListener("focusin", () => hdr.classList.remove("hide"));

// 捲動顯現：進入視窗 15% 觸發一次，同組子元素錯開 90ms；不支援時直接顯示
$(".reveal").forEach((el) =>
  el.style.setProperty(
    "--d",
    $(":scope>.reveal", el.parentNode).indexOf(el) * 90 + "ms",
  ),
);
const reveal =
  IO &&
  new IntersectionObserver(
    (es, o) =>
      es.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          o.unobserve(e.target);
        }
      }),
    { threshold: 0.15 },
  );
$(".reveal").forEach((el) =>
  reveal ? reveal.observe(el) : el.classList.add("in"),
);

// 導覽列目前區塊：aria-current="page"
const links = $(".nav a");
if (IO) {
  const nav = new IntersectionObserver(
    (es) =>
      es.forEach(
        (e) =>
          e.isIntersecting &&
          links.forEach((a) =>
            a.hash === "#" + e.target.id
              ? a.setAttribute("aria-current", "page")
              : a.removeAttribute("aria-current"),
          ),
      ),
    { rootMargin: "-45% 0px -45% 0px" },
  );
  $("section[id]").forEach((s) => nav.observe(s));
}

// 截圖燈箱：原生 <dialog>，←/→ 或按鈕切換，Esc 或點其他地方關閉；無 JS 時連結直接開原圖
const box = $(".lightbox")[0],
  big = box.appendChild(new Image()),
  shots = $(".shots a");
let cur = 0;
const show = (n) => {
  cur = (n + shots.length) % shots.length;
  big.src = shots[cur].href;
  big.alt = shots[cur].firstElementChild.alt;
};
shots.forEach(
  (a, n) =>
    (a.onclick = (e) => {
      e.preventDefault();
      show(n);
      box.showModal();
    }),
);
box.onclick = (e) => {
  const b = e.target.closest("button");
  b ? show(cur + +b.dataset.d) : box.close();
};
box.onkeydown = (e) => {
  const d = { ArrowLeft: -1, ArrowRight: 1 }[e.key];
  if (d) show(cur + d);
};

// 影片：點擊才載入 YouTube，首屏不背負 iframe
const play = $(".play")[0];
play.style.backgroundImage = `url(https://i.ytimg.com/vi/${play.dataset.yt}/maxresdefault.jpg)`; // 預覽圖
play.onclick = () => {
  play.parentNode.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${play.dataset.yt}?autoplay=1" title="AscenderFall 預告片" allow="autoplay; encrypted-media; fullscreen" allowfullscreen></iframe>`;
};
