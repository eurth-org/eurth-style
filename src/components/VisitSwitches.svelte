<script lang="ts">
  /*
   * This visit's switches, in the footer: install the tool as an app, sound, and motion. Sound
   * is off until switched on; motion follows the device until switched off (the pause WCAG
   * 2.2.2 asks for). None of it is remembered beyond the visit.
   */
  import { faPause, faPlay, faVolumeHigh, faVolumeXmark } from '@fortawesome/free-solid-svg-icons';
  import { onMount } from 'svelte';
  import { toast } from '../fun.js';
  import { getPrefs, onPrefs, setPrefs } from '../prefs.js';
  import Icon from './Icon.svelte';
  import InstallButton from './InstallButton.svelte';

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
    <Icon icon={prefs.sound ? faVolumeHigh : faVolumeXmark} />
    Sound: {prefs.sound ? 'on' : 'off'}
  </button>
{/if}
{#if !deviceCalm}
  <button type="button" class="eu-btn" aria-pressed={!prefs.motion} onclick={toggleMotion}>
    <Icon icon={prefs.motion ? faPause : faPlay} />
    {prefs.motion ? 'Stop motion' : 'Motion: off'}
  </button>
{/if}
