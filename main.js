const $ = (s, e = document) => [...e.querySelectorAll(s)];
const hdr = $(".hdr")[0],
  fill = $(".track i")[0],
  num = $(".gauge output")[0];
const IO = "IntersectionObserver" in window;
let last = 0;

// Header：向下捲超過自身高度就隱藏，向上捲或鍵盤聚焦時滑回
addEventListener(
  "scroll",
  () => {
    const y = scrollY,
      max = document.documentElement.scrollHeight - innerHeight,
      p = max > 0 ? Math.min(y / max, 1) : 0;
    if (y > last && y > hdr.offsetHeight) hdr.classList.add("hide");
    else if (y < last) hdr.classList.remove("hide");
    last = y;
    fill.style.transform = `scaleY(${p})`; // 高度計
    num.textContent = String(Math.round(p * 9999)).padStart(4, "0") + "m";
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

// 影片：點擊才載入 YouTube，首屏不背負 iframe
const play = $(".play")[0];
play.onclick = () => {
  play.parentNode.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${play.dataset.yt}?autoplay=1" title="AscenderFall 預告片" allow="autoplay; encrypted-media; fullscreen" allowfullscreen></iframe>`;
};
