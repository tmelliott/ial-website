import {
  dotFrame,
  flightReturn,
  flightTrigger,
  graticulePaths,
  gridFade,
  gridSpin,
  layerOpacity,
  stripExit,
  type HeroMotion,
} from "../../lib/heroMorph";

const WIDE_QUERY = "(min-width: 64rem)";
const FLIGHT_MS = 1000;

function mapChartPoint(
  chart: SVGSVGElement,
  x: number,
  y: number,
  chartMatrix: DOMMatrix,
  stageInverse: DOMMatrix,
): { x: number; y: number } {
  const point = chart.createSVGPoint();
  point.x = x;
  point.y = y;
  const local = point.matrixTransform(chartMatrix).matrixTransform(stageInverse);
  return { x: local.x, y: local.y };
}

export function mountHeroStage(stage: SVGSVGElement, flight: SVGSVGElement, chart: SVGSVGElement, hero: HTMLElement, motion: HeroMotion): () => void {
  const dotsGroup = flight.querySelector("#hero-dots");
  const grat = stage.querySelector("#hero-grat");
  const gratLabels = stage.querySelector("#hero-grat-labels");
  const gratMajor = stage.querySelector("#hero-grat-major");
  const gratTicks = stage.querySelector("#hero-grat-ticks");
  const legend = stage.querySelector("#hero-legend");
  const land = stage.querySelector("#hero-land");
  const strip = hero.querySelector("#hero-strip");
  const stripEl = strip instanceof HTMLElement ? strip : null;
  if (!dotsGroup || !grat || !gratLabels || !gratMajor || !gratTicks || !legend || !land) return () => {};

  const resetStrip = () => {
    if (!stripEl) return;
    stripEl.style.opacity = "";
    stripEl.style.transform = "";
    stripEl.style.pointerEvents = "";
    stripEl.removeAttribute("inert");
  };

  const placeStrip = (scrollY: number, heroHeight: number, travel: number) => {
    if (!stripEl) return;
    const { opacity, y } = stripExit(scrollY, heroHeight, travel);
    if (scrollY <= 0) {
      resetStrip();
      return;
    }
    stripEl.style.opacity = opacity.toFixed(3);
    stripEl.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0)`;
    stripEl.style.pointerEvents = "none";
    if (opacity <= 0.01) stripEl.setAttribute("inert", "");
    else stripEl.removeAttribute("inert");
  };

  const targets = [...chart.querySelectorAll<SVGCircleElement>("circle")].map((circle) => ({
    x: Number(circle.getAttribute("cx")),
    y: Number(circle.getAttribute("cy")),
  }));
  const reduceQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const wideQuery = window.matchMedia(WIDE_QUERY);
  const nodes = motion.dots.map((dot) => {
    const node = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    node.setAttribute("cx", String(dot[0]));
    node.setAttribute("cy", String(dot[1]));
    node.setAttribute("r", String(motion.r0));
    node.setAttribute("fill", dot[5]);
    node.setAttribute("opacity", "0");
    dotsGroup.appendChild(node);
    return node;
  });

  let progress = 0;
  let lastTime = 0;
  let lastSpin = -1;
  let frame = 0;
  let phase: "map" | "out" | "chart" | "back" = "map";
  let returnLine = 0;
  let lastScroll = -1;
  let returning = false;

  const showRest = () => {
    progress = 0;
    lastTime = 0;
    phase = "map";
    returnLine = 0;
    lastScroll = -1;
    returning = false;
    if (lastSpin !== 0) {
      const paths = graticulePaths(0);
      gratMajor.setAttribute("d", paths.major);
      gratTicks.setAttribute("d", paths.ticks);
      lastSpin = 0;
    }
    chart.classList.remove("is-flying");
    grat.setAttribute("opacity", "1");
    gratLabels.setAttribute("opacity", "1");
    legend.setAttribute("opacity", "1");
    land.setAttribute("opacity", "1");
    for (const node of nodes) node.setAttribute("opacity", "0");
    resetStrip();
  };

  const paint = (now: number) => {
    frame = 0;
    if (reduceQuery.matches || !wideQuery.matches) {
      showRest();
      return;
    }

    const heroHeight = hero.offsetHeight || 1;
    const stripTravel = stripEl?.offsetHeight ?? 0;
    const trigger = flightTrigger(heroHeight);
    const early = flightReturn(heroHeight);
    const scrollY = window.scrollY;
    const scrollingDown = lastScroll >= 0 && scrollY > lastScroll;
    const scrollingUp = lastScroll >= 0 && scrollY < lastScroll;

    if (phase === "chart" && scrollY >= early) returnLine = early;
    if (lastScroll < 0 && scrollY >= trigger) phase = "out";
    else if (phase === "map" && scrollingDown && scrollY >= trigger) phase = "out";
    else if (phase === "out" && scrollingUp && scrollY < trigger) phase = "back";
    else if (phase === "chart" && scrollingUp && scrollY < returnLine) phase = "back";
    else if (phase === "back" && scrollingDown && scrollY >= trigger) phase = "out";

    if (phase === "back") returning = true;
    if (phase === "out" || (phase === "map" && scrollingDown)) returning = false;

    if (!lastTime) lastTime = now;
    const dt = Math.min(100, now - lastTime);
    lastTime = now;
    if (phase === "out") progress = Math.min(1, progress + dt / FLIGHT_MS);
    else if (phase === "back") progress = Math.max(0, progress - dt / FLIGHT_MS);

    if (phase === "out" && progress >= 1) {
      phase = "chart";
      returnLine = Math.min(early, scrollY);
    } else if (phase === "back" && progress <= 0) {
      phase = "map";
    }

    const settled = phase === "chart";
    chart.classList.toggle("is-flying", !settled);

    const fade = gridFade(scrollY, heroHeight, returning);
    const spin = gridSpin(scrollY, heroHeight, returning);
    grat.setAttribute("opacity", fade.toFixed(3));
    gratLabels.setAttribute("opacity", fade.toFixed(3));
    if (fade > 0.001 && Math.abs(spin - lastSpin) > 0.05) {
      const paths = graticulePaths(spin);
      gratMajor.setAttribute("d", paths.major);
      gratTicks.setAttribute("d", paths.ticks);
      lastSpin = spin;
    }

    const layers = layerOpacity(progress, false);
    legend.setAttribute("opacity", String(layers.early));
    land.setAttribute("opacity", String(layers.land));

    const chartMatrix = chart.getScreenCTM();
    const stageMatrix = stage.getScreenCTM();
    if (chartMatrix && stageMatrix) {
      const stageInverse = stageMatrix.inverse();
      const radiusPoint = chart.createSVGPoint();
      radiusPoint.x = Number(chart.dataset.radius || 0);
      radiusPoint.y = 0;
      const origin = chart.createSVGPoint();
      const radiusScreen = radiusPoint.matrixTransform(chartMatrix);
      const originScreen = origin.matrixTransform(chartMatrix);
      const endRadius = Math.hypot(radiusScreen.x - originScreen.x, radiusScreen.y - originScreen.y) / stageMatrix.a;

      motion.dots.forEach((dot, index) => {
        const target = targets[index];
        const node = nodes[index];
        if (!target) {
          node.setAttribute("opacity", "0");
          return;
        }
        const endPoint = mapChartPoint(chart, target.x, target.y, chartMatrix, stageInverse);
        const framed = dotFrame(
          [dot[0], dot[1], endPoint.x, endPoint.y, dot[4], dot[5]],
          progress,
          { r0: motion.r0, r1: endRadius, dur: motion.dur },
          false,
        );
        node.setAttribute("cx", framed.cx.toFixed(1));
        node.setAttribute("cy", framed.cy.toFixed(1));
        node.setAttribute("r", framed.r.toFixed(2));
        node.setAttribute("fill", framed.fill);
        node.setAttribute("opacity", progress > 0 && !settled ? "1" : "0");
      });
    }

    placeStrip(scrollY, heroHeight, stripTravel);
    lastScroll = scrollY;
    const animating = phase === "out" || phase === "back";
    if (animating) schedule();
    else lastTime = 0;
  };

  const schedule = () => {
    if (!frame) frame = window.requestAnimationFrame(paint);
  };
  const onMedia = () => {
    lastTime = 0;
    lastSpin = -1;
    schedule();
  };

  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", onMedia);
  wideQuery.addEventListener("change", onMedia);
  reduceQuery.addEventListener("change", onMedia);
  schedule();

  return () => {
    window.removeEventListener("scroll", schedule);
    window.removeEventListener("resize", onMedia);
    wideQuery.removeEventListener("change", onMedia);
    reduceQuery.removeEventListener("change", onMedia);
    if (frame) window.cancelAnimationFrame(frame);
  };
}
