<script lang="ts">
  /*
   * The share row under every result, as Governmint has it: Copy link (a paper plane flies
   * off), Share, which opens the dialog, then Copy picture, Copy description and Copy Markdown
   * where the tool gives them, and after those whatever the tool adds as children: the
   * profile's Load and Save. It goes in a card headed "Save & share".
   *
   *   <ShareButtons url={link} title={name} text={summary} description={() => describe(design)}
   *     markdown={() => asMarkdown(design)} picture={() => pngBlob()} />
   *
   * Every result has a written description (for screen readers and for sharing), so give
   * `description` wherever there is a result; and wherever the result has words in it, give
   * `markdown` too: the forum and most wikis take it. Toasts can be reworded in the tool's own
   * voice.
   */
  import type { Snippet } from 'svelte';
  import { faMarkdown } from '@fortawesome/free-brands-svg-icons';
  import { faShareNodes } from '@fortawesome/free-solid-svg-icons';
  import { paperPlane, toast } from '../fun.js';
  import { lineConfirm, lineImage, lineLink, lineTextBox } from '../line.js';
  import { copyPicture, copyText } from '../share.js';
  import Icon from './Icon.svelte';
  import Line from './Line.svelte';
  import ShareDialog from './ShareDialog.svelte';

  type What = 'link' | 'picture' | 'description' | 'markdown';

  let {
    url,
    title,
    text,
    forumBody,
    description,
    markdown,
    picture,
    heading = 'Share',
    said = {},
    oncopy,
    onshare,
    children,
  }: {
    /** The link that brings the result back, whole. */
    url: string;
    /** Its name: "Orioni: constitutional monarchy". */
    title: string;
    /** One or two sentences about it, in the tool's voice. */
    text: string;
    /** Markdown for the forum topic; without it, the text and the link. */
    forumBody?: string;
    /** The written description of the result, or a function that writes it when asked. */
    description?: string | (() => string);
    /** The result as Markdown (headings, lists, a table, its link), or a function that writes it when asked. */
    markdown?: string | (() => string);
    /** Makes the picture (a PNG) when asked. Leave out where the tool makes no picture. */
    picture?: () => Blob | Promise<Blob>;
    /** The dialog's heading: "Share Orioni". */
    heading?: string;
    /** The toasts, in the tool's own voice. */
    said?: Partial<Record<What | 'failed', string>>;
    /** Called after something is copied: the place for a tool's signature touch. */
    oncopy?: (what: What) => void;
    /** Called when the Share dialog is opened. */
    onshare?: () => void;
    /** More buttons for the same row: the profile's Load and Save (ProfileButtons) go here. */
    children?: Snippet;
  } = $props();

  let sharing = $state(false);
  let copied = $state<What | null>(null);

  const words = $derived({
    link: 'Link copied.',
    picture: 'Picture copied.',
    description: 'Description copied.',
    markdown: 'Markdown copied: paste it into the forum or a wiki.',
    failed: "That didn't copy. Your browser may not allow it here.",
    ...said,
  });

  function done(what: What, ok: boolean) {
    toast(ok ? words[what] : words.failed);
    if (!ok) return;
    copied = what;
    setTimeout(() => (copied = null), 2000);
    oncopy?.(what);
  }

  async function copyLink(button: HTMLElement) {
    const ok = await copyText(url);
    if (ok) paperPlane(button);
    done('link', ok);
  }

  async function copyThePicture() {
    // Handed over as a promise, within the click: Safari asks for that.
    done('picture', await copyPicture(Promise.resolve(picture!())));
  }

  async function copyDescription() {
    done('description', await copyText(typeof description === 'function' ? description() : (description ?? '')));
  }

  async function copyMarkdown() {
    done('markdown', await copyText(typeof markdown === 'function' ? markdown() : (markdown ?? '')));
  }
</script>

<div class="eu-row">
  <button type="button" class="eu-btn eu-btn--primary" onclick={(e) => copyLink(e.currentTarget)}>
    <Line icon={copied === 'link' ? lineConfirm : lineLink} />
    {copied === 'link' ? 'Copied' : 'Copy link'}
  </button>
  <button type="button" class="eu-btn" data-click="swing-right" onclick={() => ((sharing = true), onshare?.())}><Icon icon={faShareNodes} /> Share</button>
  {#if picture}
    <button type="button" class="eu-btn" onclick={copyThePicture}>
      <Line icon={copied === 'picture' ? lineConfirm : lineImage} />
      {copied === 'picture' ? 'Copied' : 'Copy picture'}
    </button>
  {/if}
  {#if description}
    <button type="button" class="eu-btn" onclick={copyDescription}>
      <Line icon={copied === 'description' ? lineConfirm : lineTextBox} />
      {copied === 'description' ? 'Copied' : 'Copy description'}
    </button>
  {/if}
  {#if markdown}
    <button type="button" class="eu-btn" onclick={copyMarkdown}>
      {#if copied === 'markdown'}<Line icon={lineConfirm} />{:else}<Icon icon={faMarkdown} />{/if}
      {copied === 'markdown' ? 'Copied' : 'Copy Markdown'}
    </button>
  {/if}
  {@render children?.()}
</div>
<ShareDialog bind:open={sharing} {url} {title} {text} {forumBody} {heading} oncopy={() => oncopy?.('link')} />
