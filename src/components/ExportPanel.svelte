<script lang="ts" module>
  import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';

  /** One way to take the result away as text. */
  export interface ExportFormat {
    /** "markdown" */
    id: string;
    /** "Markdown" */
    label: string;
    /** Its mark: faMarkdown, faWikipediaW, faFileCode… */
    icon?: IconDefinition;
    /** What it is for, in a line: "For a post on the Eurth forum: a summary and the budget as a table." */
    help?: string;
    /** The file's ending, without the dot: "md". */
    extension: string;
    /** The file's media type: "text/markdown". */
    type: string;
    /** Writes the text when asked. */
    make: () => string;
  }

  let made = 0;
</script>

<script lang="ts">
  /*
   * Export: the result as text, to paste elsewhere or to keep as a file, as Governmint does it.
   * A row of formats (Markdown first: the forum takes it), a line saying what the chosen one
   * is for, the text itself to read and select, and two buttons: Copy text and Download.
   *
   *   <ExportPanel name="orioni" formats={[
   *     { id: 'markdown', label: 'Markdown', icon: faMarkdown, extension: 'md', type: 'text/markdown',
   *       help: 'For a post on the Eurth forum.', make: () => toMarkdown(design, link) },
   *     { id: 'json', label: 'JSON', icon: faFileCode, extension: 'json', type: 'application/json',
   *       help: 'For other tools and spreadsheets.', make: () => toJson(design) },
   *   ]} />
   *
   * It goes in a card of its own, headed "Export", under the card headed "Save & share".
   */
  import { faCheck } from '@fortawesome/free-solid-svg-icons';
  import { download, fileSlug } from '../download.js';
  import { toast } from '../fun.js';
  import { lineClipboard, lineConfirm, lineDownloadOutline } from '../line.js';
  import { copyText } from '../share.js';
  import Icon from './Icon.svelte';
  import Line from './Line.svelte';

  let {
    formats,
    name,
    rows = 9,
    oncopy,
    ondownload,
  }: {
    /** The formats on offer, the first one chosen to begin with. */
    formats: ExportFormat[];
    /** The file's name without its ending; it is tidied into a safe file name. */
    name: string;
    /** How many lines of the text show before it scrolls. */
    rows?: number;
    /** Called after the text is copied: the place for a tool's signature touch. */
    oncopy?: (format: ExportFormat) => void;
    /** Called after the file is saved. */
    ondownload?: (format: ExportFormat) => void;
  } = $props();

  const own = `eu-export-${(made += 1)}`;
  let chosen = $state('');
  const format = $derived(formats.find((f) => f.id === chosen) ?? formats[0]!);
  const text = $derived(format.make());
  let copied = $state(false);

  async function copy() {
    if (!(await copyText(text))) {
      toast("That didn't copy. Select the text and copy it.");
      return;
    }
    copied = true;
    setTimeout(() => (copied = false), 2000);
    toast(`${format.label} copied.`);
    oncopy?.(format);
  }

  function save() {
    download(text, `${fileSlug(name)}.${format.extension}`, format.type);
    ondownload?.(format);
  }
</script>

<div class="eu-stack">
  <div class="eu-row" role="radiogroup" aria-label="Format">
    {#each formats as f (f.id)}
      <label class="eu-pill">
        <input type="radio" name={own} value={f.id} checked={f.id === format.id} onchange={() => (chosen = f.id)} />
        <span class="eu-check"><Icon icon={faCheck} /></span>
        {#if f.icon}<Icon icon={f.icon} />{/if}
        {f.label}
      </label>
    {/each}
  </div>
  {#if format.help}<p class="eu-help">{format.help}</p>{/if}
  <label class="eu-visually-hidden" for={own}>{format.label}</label>
  <textarea id={own} class="eu-textarea eu-input--data" readonly {rows} value={text}></textarea>
  <div class="eu-row">
    <button type="button" class="eu-btn" onclick={copy}>
      <Line icon={copied ? lineConfirm : lineClipboard} />
      {copied ? 'Copied' : 'Copy text'}
    </button>
    <button type="button" class="eu-btn" data-click="bounce" onclick={save}>
      <Line icon={lineDownloadOutline} /> Download<span class="eu-visually-hidden"> as {format.label}</span>
    </button>
  </div>
</div>
