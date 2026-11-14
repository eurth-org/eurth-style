<script lang="ts">
  /*
   * A toast, the declarative way: it shows whenever `message` changes to something. Most code
   * calls toast('…') from '@eurth/style' instead; this is for templates.
   *
   *   <Toast message={saved ? 'Saved to your profile file.' : ''} />
   */
  import { toast } from '../fun.js';

  let { message = '' }: { message?: string } = $props();

  $effect(() => {
    if (message) toast(message);
  });
</script>
