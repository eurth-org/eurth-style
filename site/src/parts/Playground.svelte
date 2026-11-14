<script lang="ts">
  /*
   * The parts of the shell that only make sense when they do something: the share row, toasts,
   * "Nice.", and the emu. Everything here comes from the package, as a tool would use it.
   */
  import { faBell, faDice, faFeather, faRotateLeft } from '@fortawesome/free-solid-svg-icons';
  import Icon from '../../../src/components/Icon.svelte';
  import ShareButtons from '../../../src/components/ShareButtons.svelte';
  import { emu, niceWatcher, playTones, toast } from '../../../src/fun.js';

  let { url }: { url: string } = $props();

  let number = $state(50);
  let slider: HTMLInputElement | undefined = $state();
  const watch = niceWatcher();
  $effect(() => watch(number, () => slider));

  const voices = ['Freshly drawn, and copied.', 'Saved to your profile file.', 'A clean sheet.', 'That name is taken. Try a longer one.'];
  let said = 0;
</script>

<div class="eu-stack">
  <div class="eu-stack part">
    <h3>The share row</h3>
    <ShareButtons
      {url}
      title="Style, by Eurth"
      text="One look for every Eurth tool."
      description="The share row: Copy link, Copy description and Share."
      oncopy={() => playTones([[880, 0, 0.03], [1320, 0.06, 0.025]])}
    />
    <p class="eu-help">Copy link sends a paper plane. Copy picture appears where a tool makes a picture. With sound switched on in the footer, copying chimes.</p>
  </div>

  <div class="eu-stack part">
    <h3>Toasts and click answers</h3>
    <div class="eu-row">
      <button type="button" class="eu-btn" onclick={() => toast(voices[said++ % voices.length]!)}><Icon icon={faBell} /> Show a toast</button>
      <button type="button" class="eu-btn" data-click="tumble"><Icon icon={faDice} /> tumble</button>
      <button type="button" class="eu-btn" data-click="spin"><Icon icon={faRotateLeft} /> spin</button>
      <button type="button" class="eu-btn" data-click="bounce"><Icon icon={faFeather} /> bounce</button>
      <button type="button" class="eu-btn" data-click="swing-left"><Icon icon={faFeather} /> swing-left</button>
      <button type="button" class="eu-btn" data-click="swing-right"><Icon icon={faFeather} /> swing-right</button>
      <button type="button" class="eu-btn"><Icon icon={faFeather} /> pop</button>
    </div>
  </div>

  <div class="eu-stack part">
    <h3>Easter eggs</h3>
    <label class="eu-field">
      <span class="eu-label">A number: <output class="eu-data">{number}</output>. Rest it on 69.</span>
      <input bind:this={slider} class="eu-range" type="range" min="0" max="100" bind:value={number} style:--fill="{number}%" />
    </label>
    <div class="eu-row">
      <button type="button" class="eu-btn" onclick={() => emu(document.querySelector('.eu-footer')!)}>Send the emu</button>
      <span class="eu-help">Or type the Konami code: up, up, down, down, left, right, left, right, B, A.</span>
    </div>
  </div>
</div>

<style>
  .part {
    gap: var(--space-2);
  }
</style>
