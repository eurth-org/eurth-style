<script lang="ts" module>
  let count = 0;
</script>

<script lang="ts">
  /*
   * A line-md icon in a Svelte component: it draws itself each time it appears, so swapping one
   * icon for another (a link for a tick, once copied) plays the new one. With reduced motion,
   * or motion switched off in the footer, the finished drawing shows instead.
   *
   *   import { lineConfirm } from '@eurth/style/line';
   *   <Line icon={lineConfirm} />
   */
  import { lineSvg, type LineIcon } from '../line.js';

  let { icon, label = '' }: { icon: LineIcon; label?: string } = $props();
  // One number per icon on the page, so ids inside two copies never meet.
  const key = `s${(count += 1)}`;
</script>

{#key icon.name}
  <span class="eu-line" role={label ? 'img' : undefined} aria-label={label || undefined} aria-hidden={label ? undefined : 'true'}>{@html lineSvg(icon, key)}</span>
{/key}
