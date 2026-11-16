// Built from tokens.json by build/build.mjs. Don't edit.

/** The browser's own colour around the page (the address bar on phones), per theme. */
export const THEME_COLOR = /** @type {const} */ ({ light: '#ffffff', dark: '#002b36' });

/** The script every page carries in its head. The same text everywhere, so one CSP hash covers it. */
export const HEAD_SCRIPT = "(function(){var d=document.documentElement,m=/^eurth:1:([ald]):([01]):([a0])$/.exec(window.name||''),t=m?m[1]:'a',k=t==='d'||(t==='a'&&matchMedia('(prefers-color-scheme: dark)').matches);d.dataset.theme=k?'dark':'light';if(m&&m[3]==='0')d.dataset.motion='still';var c=document.querySelectorAll('meta[name=\"theme-color\"]');for(var i=0;i<c.length;i++)c[i].setAttribute('content',k?'#002b36':'#ffffff');})();";

export const VERSION = '1.10.0';
