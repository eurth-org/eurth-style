<script lang="ts">
  /*
   * Without signal, a note says the tool still works: it runs from the copy the service worker
   * keeps on the device. Back online, the note goes, with a word to say so. Page.astro places it.
   */
  import { faSignal } from '@fortawesome/free-solid-svg-icons';
  import { onMount } from 'svelte';
  import { toast } from '../fun.js';
  import Icon from './Icon.svelte';

  let { name }: { name: string } = $props();

  let online = $state(true);

  onMount(() => {
    online = navigator.onLine;
    const up = () => {
      online = true;
      toast('Back online.');
    };
    const down = () => (online = false);
    addEventListener('online', up);
    addEventListener('offline', down);
    return () => {
      removeEventListener('online', up);
      removeEventListener('offline', down);
    };
  });
</script>

{#if !online}
  <p class="eu-offline" role="status"><Icon icon={faSignal} /> No signal: {name} keeps working from the copy on this device.</p>
{/if}
