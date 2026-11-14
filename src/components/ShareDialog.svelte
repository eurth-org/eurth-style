<script lang="ts">
  /*
   * The Share dialog: the link to copy, then the places people share most, the Eurth forum
   * first. Each is a plain link that opens that site's own share page in a new tab with the
   * link filled in; nothing is sent until the visitor posts it there. Where the device has a
   * share sheet, "More" opens it. ShareButtons opens this; a tool can also open it itself.
   *
   *   <ShareDialog bind:open url={link} title="Orioni: a kingdom" text="A kingdom by the sea. Made with Governmint." />
   */
  import { faBluesky, faFacebook, faLinkedin, faReddit, faTelegram, faTumblr, faWhatsapp, faXTwitter } from '@fortawesome/free-brands-svg-icons';
  import { faCopy, faEllipsis, faEnvelope, faShareNodes, faXmark, type IconDefinition } from '@fortawesome/free-solid-svg-icons';
  import yurt from '../assets/eurth-yurt-circle.svg?raw';
  import { paperPlane, toast } from '../fun.js';
  import { canShare, copyText, shareSheet, shareTargets } from '../share.js';
  import Icon from './Icon.svelte';

  let {
    open = $bindable(false),
    url,
    title,
    text,
    forumBody,
    heading = 'Share',
    oncopy,
  }: {
    open?: boolean;
    /** The link that brings the result back, whole. */
    url: string;
    /** Its name: "Orioni: constitutional monarchy". */
    title: string;
    /** One or two sentences about it, in the tool's voice. */
    text: string;
    /** Markdown for the forum topic; without it, the text and the link. */
    forumBody?: string;
    /** The dialog's heading: "Share Orioni". */
    heading?: string;
    /** Called after the link is copied: the place for a tool's signature touch. */
    oncopy?: () => void;
  } = $props();

  let dialog: HTMLDialogElement;
  const icons: Record<string, IconDefinition> = {
    reddit: faReddit,
    bluesky: faBluesky,
    x: faXTwitter,
    facebook: faFacebook,
    linkedin: faLinkedin,
    tumblr: faTumblr,
    whatsapp: faWhatsapp,
    telegram: faTelegram,
    email: faEnvelope,
  };
  const targets = $derived(shareTargets({ url, title, text, forumBody }));
  const sheet = canShare();

  $effect(() => {
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  });

  async function copy(button: HTMLElement) {
    if (await copyText(url)) {
      toast('Link copied.');
      paperPlane(button);
      oncopy?.();
    } else {
      toast('Select the link and copy it.');
    }
  }
</script>

<dialog bind:this={dialog} class="eu-dialog" onclose={() => (open = false)} aria-labelledby="eu-share-title">
  <div class="eu-dialog-top">
    <h2 id="eu-share-title"><Icon icon={faShareNodes} /> {heading}</h2>
    <button type="button" class="eu-btn eu-btn--quiet eu-btn--icon" aria-label="Close" onclick={() => dialog.close()}><Icon icon={faXmark} /></button>
  </div>
  <p class="preview">{text}</p>

  <div class="link">
    <label class="eu-visually-hidden" for="eu-share-link">Link</label>
    <input id="eu-share-link" class="eu-input eu-input--data" readonly value={url} onfocus={(e) => e.currentTarget.select()} />
    <button type="button" class="eu-btn eu-btn--primary" onclick={(e) => copy(e.currentTarget)}><Icon icon={faCopy} /> Copy</button>
  </div>

  <ul class="targets">
    {#each targets as target (target.id)}
      <li>
        <a class="eu-btn" href={target.href}>
          {#if icons[target.id]}
            <Icon icon={icons[target.id]!} />
          {:else}
            <span class="yurt" aria-hidden="true">{@html yurt}</span>
          {/if}
          {target.label}
        </a>
      </li>
    {/each}
    {#if sheet}
      <li>
        <button type="button" class="eu-btn" onclick={() => shareSheet({ url, title, text })}><Icon icon={faEllipsis} /> More</button>
      </li>
    {/if}
  </ul>
  <p class="eu-help">Plain links: each opens that site's own share page with the link filled in. Nothing is posted until you post it.</p>
</dialog>

<style>
  .preview {
    margin: var(--space-2) 0 var(--space-3);
    color: var(--ink-muted);
  }

  .link {
    display: flex;
    gap: var(--space-2);
  }

  .link input {
    flex: 1;
    min-width: 0;
  }

  .targets {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: var(--space-2);
    margin: var(--space-4) 0 var(--space-3);
    padding: 0;
    list-style: none;
  }

  .targets .eu-btn {
    justify-content: flex-start;
    width: 100%;
  }

  .yurt {
    display: inline-flex;
    width: var(--space-4);
    height: var(--space-4);
  }

  .yurt :global(svg) {
    width: 100%;
    height: 100%;
  }
</style>
