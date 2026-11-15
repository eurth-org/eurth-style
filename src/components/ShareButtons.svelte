<script lang="ts">
  /*
   * The share row under every result: Copy link (a paper plane flies off), Copy picture and
   * Copy description where the tool gives them, and Share, which opens the dialog.
   *
   *   <ShareButtons url={link} title={name} text={summary} description={() => describe(design)} picture={() => pngBlob()} />
   *
   * Every result has a written description (for screen readers and for sharing), so give
   * `description` wherever there is a result. Toasts can be reworded in the tool's own voice.
   */
  import { faCheck, faImage, faLink, faQuoteLeft, faShareNodes } from '@fortawesome/free-solid-svg-icons';
  import { paperPlane, toast } from '../fun.js';
  import { copyPicture, copyText } from '../share.js';
  import Icon from './Icon.svelte';
  import ShareDialog from './ShareDialog.svelte';

  type What = 'link' | 'picture' | 'description';

  let {
    url,
    title,
    text,
    forumBody,
    description,
    picture,
    heading = 'Share',
    said = {},
    oncopy,
    onshare,
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
  } = $props();

  let sharing = $state(false);
  let copied = $state<What | null>(null);

  const words = $derived({
    link: 'Link copied.',
    picture: 'Picture copied.',
    description: 'Description copied.',
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
</script>

<div class="eu-row">
  <button type="button" class="eu-btn eu-btn--primary" onclick={(e) => copyLink(e.currentTarget)}>
    <Icon icon={copied === 'link' ? faCheck : faLink} />
    {copied === 'link' ? 'Copied' : 'Copy link'}
  </button>
  {#if picture}
    <button type="button" class="eu-btn" onclick={copyThePicture}>
      <Icon icon={copied === 'picture' ? faCheck : faImage} />
      {copied === 'picture' ? 'Copied' : 'Copy picture'}
    </button>
  {/if}
  {#if description}
    <button type="button" class="eu-btn" onclick={copyDescription}>
      <Icon icon={copied === 'description' ? faCheck : faQuoteLeft} />
      {copied === 'description' ? 'Copied' : 'Copy description'}
    </button>
  {/if}
  <button type="button" class="eu-btn" data-click="swing-right" onclick={() => ((sharing = true), onshare?.())}><Icon icon={faShareNodes} /> Share</button>
</div>
<ShareDialog bind:open={sharing} {url} {title} {text} {forumBody} {heading} oncopy={() => oncopy?.('link')} />
