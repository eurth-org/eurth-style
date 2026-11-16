<script lang="ts">
  /*
   * This visit's switches, in the footer: install the tool as an app, sound, and motion. Sound
   * is off until switched on; motion follows the device until switched off (the pause WCAG
   * 2.2.2 asks for). None of it is remembered beyond the visit.
   */
  import { onMount } from 'svelte';
  import { toast } from '../fun.js';
  import { getPrefs, onPrefs, setPrefs } from '../prefs.js';
  import { linePause, linePlay, lineVolumeHigh, lineVolumeHighOff } from '../line.js';
  import InstallButton from './InstallButton.svelte';
  import Line from './Line.svelte';

  let { name, sound = false }: { name: string; sound?: boolean } = $props();

  let prefs = $state(getPrefs());
  // A device that asks for reduced motion already has it: no switch to show.
  let deviceCalm = $state(false);

  onMount(() => {
    deviceCalm = matchMedia('(prefers-reduced-motion: reduce)').matches;
    return onPrefs((next) => (prefs = next));
  });

  function toggleSound() {
    setPrefs({ sound: !prefs.sound });
    toast(prefs.sound ? 'Sound on, for this visit.' : 'Sound off.');
  }

  function toggleMotion() {
    setPrefs({ motion: !prefs.motion });
    toast(prefs.motion ? 'Motion on.' : 'Motion off, for this visit.');
  }
</script>

<InstallButton {name} />
{#if sound}
  <button type="button" class="eu-btn" aria-pressed={prefs.sound} onclick={toggleSound}>
    <Line icon={prefs.sound ? lineVolumeHigh : lineVolumeHighOff} />
    Sound: {prefs.sound ? 'on' : 'off'}
  </button>
{/if}
{#if !deviceCalm}
  <button type="button" class="eu-btn" aria-pressed={!prefs.motion} onclick={toggleMotion}>
    <Line icon={prefs.motion ? linePause : linePlay} />
    {prefs.motion ? 'Stop motion' : 'Motion: off'}
  </button>
{/if}
