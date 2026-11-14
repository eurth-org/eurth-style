/**
 * Small delights that live for a moment outside the page's layout: a toast, a paper plane,
 * "Nice.", tones, and buttons whose icons act out their click. A click's answer takes under
 * half a second; nothing here ever blocks input; anything that moves is skipped for reduced
 * motion; sound plays only once the visitor has switched it on (src/prefs.js).
 */
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { calm, soundOn } from './prefs.js';

/**
 * A short note that slides up from the bottom of the screen, read out by screen readers.
 * One at a time: a new toast replaces the last. Write it in the tool's own voice.
 * @param {string} text
 */
export function toast(text) {
  document.querySelector('.eu-toast')?.remove();
  const note = document.createElement('div');
  note.className = 'eu-toast';
  note.setAttribute('role', 'status');
  note.textContent = text;
  document.body.append(note);
  setTimeout(() => note.classList.add('eu-leaving'), 2400);
  setTimeout(() => note.remove(), 2900);
}

/** Whether a point is on screen: what happens out of sight should make no sound either. */
export function inView(x, y) {
  return x >= 0 && y >= 0 && x <= innerWidth && y <= innerHeight;
}

/**
 * A paper plane that flies off an element, up and to the right: the answer to "Copy link".
 * @param {Element} from
 */
export function paperPlane(from) {
  if (calm()) return;
  const box = from.getBoundingClientRect();
  const [w, h, , , d] = faPaperPlane.icon;
  const plane = document.createElement('span');
  plane.className = 'eu-plane';
  plane.innerHTML = `<svg viewBox="0 0 ${w} ${h}" aria-hidden="true"><path fill="currentColor" d="${d}"/></svg>`;
  plane.style.left = `${box.left + box.width / 2}px`;
  plane.style.top = `${box.top}px`;
  document.body.append(plane);
  plane
    .animate(
      [
        { transform: 'translate(-50%, 0) rotate(0deg)', opacity: 1 },
        { transform: 'translate(40px, -60px) rotate(-8deg)', opacity: 1, offset: 0.5 },
        { transform: 'translate(160px, -170px) rotate(-18deg) scale(0.6)', opacity: 0 },
      ],
      { duration: 1100, easing: 'cubic-bezier(.4,0,.6,1)' },
    )
    .finished.finally(() => plane.remove());
}

/**
 * "Nice." The visitor's number landed on 69 and stayed there. Shown above the element for a
 * moment; screen readers aren't told, since it's only a wink.
 * @param {Element} at
 */
export function nice(at) {
  const box = at.getBoundingClientRect();
  if (!inView(box.left + box.width / 2, box.top)) return;
  const note = document.createElement('span');
  note.className = 'eu-nice';
  note.setAttribute('aria-hidden', 'true');
  note.textContent = 'Nice.';
  note.style.left = `${box.left + box.width / 2}px`;
  note.style.top = `${box.top}px`;
  document.body.append(note);
  setTimeout(() => note.remove(), 1600);
}

/**
 * Watches a number and calls `nice` when it settles on 69: not while a slider is still moving
 * through it, and not for the value the page opened with. Returns a function to feed values to:
 *
 *   const watch = niceWatcher();
 *   $effect(() => watch(value, () => slider));
 *
 * @param {number} [wait] how long the value must rest, in milliseconds
 * @returns {(value: number, at: () => Element | null | undefined) => void}
 */
export function niceWatcher(wait = 800) {
  /** @type {ReturnType<typeof setTimeout> | undefined} */
  let timer;
  /** @type {number | undefined} */
  let last;
  return (value, at) => {
    if (value === last) return;
    const first = last === undefined;
    last = value;
    clearTimeout(timer);
    if (first || value !== 69) return;
    timer = setTimeout(() => {
      const el = at();
      if (el) nice(el);
    }, wait);
  };
}

/** @type {AudioContext | null} */
let audio = null;

/**
 * A few soft tones, made in the browser: the stuff of a tool's signature sound (Governmint's
 * coin clink is `playTones([[1319, 0, 0.035], [1976, 0.008, 0.016], [1397, 0.07, 0.02]])`).
 * Silent until the visitor switches sound on. Keep it quiet and under half a second.
 * @param {[frequency: number, delay: number, level: number][]} partials
 * @param {{ length?: number, cutoff?: number }} [options] seconds each tone lasts; the filter that takes the edge off
 */
export function playTones(partials, { length = 0.25, cutoff = 2400 } = {}) {
  if (!soundOn() || typeof AudioContext === 'undefined') return;
  audio ??= new AudioContext();
  const now = audio.currentTime;
  const soften = audio.createBiquadFilter();
  soften.type = 'lowpass';
  soften.frequency.value = cutoff;
  soften.connect(audio.destination);
  for (const [frequency, delay, level] of partials) {
    const tone = audio.createOscillator();
    const volume = audio.createGain();
    tone.type = 'sine';
    tone.frequency.value = frequency;
    volume.gain.setValueAtTime(0.0001, now + delay);
    volume.gain.exponentialRampToValueAtTime(Math.min(level, 0.2), now + delay + 0.012);
    volume.gain.exponentialRampToValueAtTime(0.0001, now + delay + length);
    tone.connect(volume).connect(soften);
    tone.start(now + delay);
    tone.stop(now + delay + length + 0.02);
  }
}

/**
 * Buttons answer a click with a small movement: they press in (the stylesheet), and their icon
 * does what the button says (data-click names it: pop, spin, tumble, bounce, swing-left,
 * swing-right). Also: Escape hides tooltips until the pointer moves again. The shell installs
 * this once for the whole page.
 */
export function clickDelights() {
  const root = document.documentElement;
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') root.classList.add('eu-tips-hidden');
  });
  document.addEventListener('pointermove', () => root.classList.remove('eu-tips-hidden'), { passive: true });

  document.addEventListener('click', (event) => {
    if (calm()) return;
    const button = /** @type {Element | null} */ (event.target)?.closest?.('.eu-btn, .eu-pill, .eu-join');
    if (!(button instanceof HTMLElement) || button.matches(':disabled')) return;
    button.classList.remove('eu-clicked');
    void button.offsetWidth;
    button.classList.add('eu-clicked');
    setTimeout(() => button.classList.remove('eu-clicked'), 500);
  });
}

/** Up, up, down, down, left, right, left, right, B, A. */
const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

/**
 * Calls back when the Konami code is typed. Keys typed into a field don't count.
 * @param {() => void} then
 * @returns {() => void} stops listening
 */
export function konami(then) {
  let at = 0;
  /** @param {KeyboardEvent} event */
  const listen = (event) => {
    if (event.target instanceof HTMLElement && event.target.matches('input, textarea, select, [contenteditable]')) return;
    const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
    at = key === KONAMI[at] ? at + 1 : key === KONAMI[0] ? 1 : 0;
    if (at === KONAMI.length) {
      at = 0;
      then();
    }
  };
  document.addEventListener('keydown', listen);
  return () => document.removeEventListener('keydown', listen);
}

// An emu, seen from the side. Drawn for this: not a logo, not anyone's mark.
const EMU =
  '<svg viewBox="0 0 64 64" aria-hidden="true"><g fill="currentColor"><ellipse cx="26" cy="34" rx="17" ry="11"/><path d="M36 30C42 26 44 18 45 9l4 0C49 20 47 30 41 36z"/><ellipse cx="48" cy="8" rx="5" ry="4"/><path d="M52 6.5l8 2-8 2z"/><path d="M11 30l-9 7 10 1z"/></g><g fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M23 44l-3 10-1 7m1-7 6 4"/><path d="M31 44l4 9-2 8m2-8 6 3"/></g></svg>';

/**
 * Sends an emu across the foot of an element (the footer). Eurth has history with emus.
 * Skipped for reduced motion, where a toast says what was missed.
 * @param {Element} across
 */
export function emu(across) {
  if (calm()) {
    toast('An emu would have run past, but you asked for calm.');
    return;
  }
  if (across.querySelector('.eu-emu')) return;
  const bird = document.createElement('span');
  bird.className = 'eu-emu';
  bird.innerHTML = EMU;
  across.append(bird);
  across.scrollIntoView({ block: 'end', behavior: 'smooth' });
  bird.addEventListener('animationend', (event) => {
    if (event.animationName === 'eu-emu-run') bird.remove();
  });
  setTimeout(() => bird.remove(), 5000);
}

/**
 * Beats the hearts inside an element a few times each time it comes into view.
 * @param {Element} element
 */
export function beatHearts(element) {
  if (typeof IntersectionObserver === 'undefined') return;
  new IntersectionObserver(([entry]) => element.classList.toggle('eu-beating', !!entry?.isIntersecting && !calm()), { threshold: 0.3 }).observe(element);
}

/**
 * Links to other sites open in a new tab, and say so to screen readers through one shared,
 * hidden note. A watcher catches links added later (dialogs, results), so none is missed.
 */
export function externalLinks() {
  const note = document.createElement('span');
  note.id = 'eu-new-tab';
  note.hidden = true;
  note.textContent = 'Opens in a new tab';
  document.body.append(note);

  /** @param {ParentNode} root */
  const mark = (root) => {
    for (const link of root.querySelectorAll('a[href^="http"]')) {
      if (!(link instanceof HTMLAnchorElement) || link.origin === location.origin || link.hasAttribute('aria-describedby') || link.dataset.sameTab !== undefined) continue;
      link.target = '_blank';
      link.rel = 'noopener';
      link.setAttribute('aria-describedby', 'eu-new-tab');
    }
  };
  mark(document);
  new MutationObserver(() => mark(document)).observe(document.body, { childList: true, subtree: true });
}

/** A click outside an open menu, or Escape, closes it (the Tools menu is a <details>). */
export function closingMenus() {
  /** @param {(menu: HTMLDetailsElement) => boolean} which */
  const close = (which) => {
    for (const menu of document.querySelectorAll('details.eu-menu[open]')) {
      if (menu instanceof HTMLDetailsElement && which(menu)) menu.open = false;
    }
  };
  document.addEventListener('click', (event) => close((menu) => !(event.target instanceof Node && menu.contains(event.target))));
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    close((menu) => {
      if (menu.contains(document.activeElement)) menu.querySelector('summary')?.focus();
      return true;
    });
  });
}
