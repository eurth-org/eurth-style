<script lang="ts" module>
  // Asked once: after the first yes, Random rolls at once for the rest of the page's life.
  let agreed = false;
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
   * pass false while the design is still untouched and the button rolls straight away.
   */
  import { faDice } from '@fortawesome/free-solid-svg-icons';
  import Icon from './Icon.svelte';

  let {
    onrandom,
    guard = true,
    what = 'design',
    label = 'Random',
  }: {
    /** Called to roll: replace the design with a random one. */
    onrandom: () => void;
    /** Whether the visitor has made something a roll would replace. */
    guard?: boolean;
    /** What a roll replaces, in a word: "flag", "government". */
    what?: string;
    /** The button's word. */
    label?: string;
  } = $props();

  let dialog: HTMLDialogElement | undefined = $state();
  let asking = $state(!agreed);
  const warns = $derived(guard && asking);

  function press() {
    if (warns) dialog?.showModal();
    else onrandom();
  }

  function roll() {
    agreed = true;
    asking = false;
    dialog?.close();
    onrandom();
  }
</script>

<button type="button" class="eu-btn eu-btn--risky" data-click="tumble" data-tip={warns ? `Replaces your ${what}` : undefined} onclick={press}>
  <Icon icon={faDice} />
  {label}
</button>
<dialog bind:this={dialog} class="eu-dialog" aria-labelledby="eu-random-title">
  <div class="eu-stack">
    <h2 id="eu-random-title">Roll a random {what}?</h2>
    <p>It replaces the {what} you have now. Copy its link first if you'd like it back. This is the only time Random asks.</p>
    <div class="eu-row">
      <button type="button" class="eu-btn eu-btn--danger" data-click="tumble" onclick={roll}><Icon icon={faDice} /> Replace it</button>
      <button type="button" class="eu-btn" onclick={() => dialog?.close()}>Keep mine</button>
    </div>
  </div>
</dialog>
