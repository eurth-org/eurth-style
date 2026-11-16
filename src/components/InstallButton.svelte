<script lang="ts">
  /*
   * "Install app", shown only where it can do something: where the browser offers to install
   * (Chrome, Edge, Android), and on iPhones and iPads, where it explains Add to Home Screen.
   * The footer carries one; a tool may place another.
   */
  import { faArrowUpFromBracket } from '@fortawesome/free-solid-svg-icons';
  import { onMount } from 'svelte';
  import { toast } from '../fun.js';
  import { install, installWay, onInstallChange } from '../install.js';
  import { lineCellphoneArrowDown, lineClose } from '../line.js';
  import Icon from './Icon.svelte';
  import Line from './Line.svelte';

  let { name }: { name: string } = $props();

  let way = $state<'prompt' | 'ios' | null>(null);
  let dialog: HTMLDialogElement | undefined = $state();

  onMount(() => {
    way = installWay();
    return onInstallChange(() => (way = installWay()));
  });

  async function press() {
    if (way === 'ios') dialog?.showModal();
    else if (await install()) toast(`${name} is installed.`);
  }
</script>

{#if way}
  <button type="button" class="eu-btn" data-click="bounce" onclick={press}><Line icon={lineCellphoneArrowDown} /> Install app</button>
{/if}
{#if way === 'ios'}
  <dialog bind:this={dialog} class="eu-dialog" aria-labelledby="eu-install-title">
    <div class="eu-dialog-top">
      <h2 id="eu-install-title">Add {name} to your Home Screen</h2>
      <button type="button" class="eu-btn eu-btn--quiet eu-btn--icon" aria-label="Close" onclick={() => dialog?.close()}><Line icon={lineClose} /></button>
    </div>
    <ol class="steps">
      <li>Tap the Share button <Icon icon={faArrowUpFromBracket} label="(a square with an arrow pointing up)" /> in Safari's toolbar.</li>
      <li>Scroll down and tap <strong>Add to Home Screen</strong>.</li>
      <li>Tap <strong>Add</strong>. {name} now opens like an app, and works without signal.</li>
    </ol>
  </dialog>
{/if}

<style>
  .steps {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
    margin: var(--space-3) 0 0;
    padding-left: var(--space-6);
  }
</style>
