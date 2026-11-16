<script lang="ts" module>
  // Asked once: after the first yes, every Random on the page rolls at once for the rest of
  // the page's life.
  let agreed = false;
  let made = 0;
  const told = new Set<() => void>();
</script>

<script lang="ts">
  /*
   * Random: the quickest way into a tool, in its toolbar. It also throws away what the visitor
   * has made, so pointing at it turns it red and says so, and the first click asks before it
   * rolls. After that first yes it never asks again: click away.
   *
   *   <RandomButton onrandom={() => (design = randomDesign())} guard={changed} what="flag" />
   *
   * `guard` is whether there is anything to lose. Leave it out and the first click always asks;
   * pass false while the design is still untouched and the button rolls straight away, without
   * the red.
   *
   * A keyboard shortcut, or a second control elsewhere on the page, goes through the same
   * question: bind the component and call its press().
   *
   *   <RandomButton bind:this={random} … />      random.press()
   */
  import { faDice } from '@fortawesome/free-solid-svg-icons';
  import { onMount } from 'svelte';
  import Icon from './Icon.svelte';

  let {
    onrandom,
    guard = true,
    what = 'design',
    label = 'Random',
    iconOnly = false,
    class: extra = '',
  }: {
    /** Called to roll: replace the design with a random one. */
    onrandom: () => void;
    /** Whether the visitor has made something a roll would replace. */
    guard?: boolean;
    /** What a roll replaces, in a word: "flag", "government". */
    what?: string;
    /** The button's word. */
    label?: string;
    /** Only the dice, with the word as its name for screen readers: for a Random beside a field. */
    iconOnly?: boolean;
    /** More classes for the button, for a tool that places it somewhere of its own. */
    class?: string;
  } = $props();

  let dialog: HTMLDialogElement | undefined = $state();
  let asking = $state(!agreed);
  const title = `eu-random-title-${(made += 1)}`;

  // One yes answers for every Random on the page.
  onMount(() => {
    const hear = () => (asking = false);
    told.add(hear);
    return () => void told.delete(hear);
  });

  /** Presses Random from elsewhere (a shortcut, a second control): it asks the first time, as a click does. */
  export function press() {
    if (guard && asking) dialog?.showModal();
    else onrandom();
  }

  function roll() {
    agreed = true;
    for (const hear of told) hear();
    dialog?.close();
    onrandom();
  }
</script>

<button
  type="button"
  class={['eu-btn', iconOnly && 'eu-btn--icon', guard && 'eu-btn--risky', extra]}
  data-click="tumble"
  aria-label={iconOnly ? label : undefined}
  data-tip={guard ? `Replaces your ${what}` : iconOnly ? label : undefined}
  onclick={press}
>
  <Icon icon={faDice} />
  {#if !iconOnly}{label}{/if}
</button>
<dialog bind:this={dialog} class="eu-dialog" aria-labelledby={title}>
  <div class="eu-stack">
    <h2 id={title}>Roll a random {what}?</h2>
    <p>It replaces the {what} you have now. Copy its link first if you'd like it back. This is the only time Random asks.</p>
    <div class="eu-row">
      <button type="button" class="eu-btn eu-btn--danger" data-click="tumble" onclick={roll}><Icon icon={faDice} /> Replace it</button>
      <button type="button" class="eu-btn" onclick={() => dialog?.close()}>Keep mine</button>
    </div>
  </div>
</dialog>
