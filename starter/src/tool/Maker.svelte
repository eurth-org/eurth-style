<script lang="ts">
  /*
   * The interactive tool: one Svelte component, hydrated on the start page. It shows how a tool
   * uses the suite's parts:
   *   - the state lives in the link (?d=…), read safely on arrival and kept in step after;
   *   - nothing is stored: "save" is a link, a picture or the nation's profile file;
   *   - every result has a written description;
   *   - the result leaves in two cards, as in Governmint: "Save & share" (the share row and the
   *     profile file) and "Export" (the result as text, Markdown first);
   *   - the share row, Random, toasts, "Nice." and click answers come from @eurth/style;
   *   - settings that belong together share a card, under a heading with an icon; where they
   *     are steps to take in order, a number comes first;
   *   - only tokens and eu- classes: no colour, font or spacing of its own.
   * The tool's own actions (Random, Start again) sit in its own toolbar, not in the header.
   */
  import { faMarkdown } from '@fortawesome/free-brands-svg-icons';
  import { faCheck, faFeatherPointed, faFileCode, faFileExport, faRotateLeft, faScaleBalanced, faShareNodes } from '@fortawesome/free-solid-svg-icons';
  import { createProfile, getSection, setNation, type EurthProfile } from '@eurth/profile';
  import ProfileButtons from '@eurth/profile/ProfileButtons.svelte';
  import { download, fileSlug, niceWatcher, playTones, stateFromLocation, stateLink, stateToLocation, svgToPicture, toast } from '@eurth/style';
  import ExportPanel, { type ExportFormat } from '@eurth/style/components/ExportPanel.svelte';
  import Icon from '@eurth/style/components/Icon.svelte';
  import Line from '@eurth/style/components/Line.svelte';
  import RandomButton from '@eurth/style/components/RandomButton.svelte';
  import ShareButtons from '@eurth/style/components/ShareButtons.svelte';
  import { lineDownloadOutline } from '@eurth/style/line';
  import { onMount } from 'svelte';
  import { STYLES, clean, compact, defaults, describe, json, markdown, plateSvg, random, type Plate } from './model';

  // Passed in by the page: browser code never imports eurth.config.mjs (see the note there).
  let { siteName, siteUrl }: { siteName: string; siteUrl: string } = $props();

  let plate = $state<Plate>({ ...defaults });
  let profile = $state<EurthProfile | null>(null);
  let ready = $state(false);
  let slider: HTMLInputElement | undefined = $state();

  const svg = $derived(plateSvg(plate));
  const picture = $derived(`data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`);
  const description = $derived(describe(plate));
  // Before the page has loaded there is no address to read: the site's own, then.
  const link = $derived(stateLink(compact(plate), { base: ready ? location.href : `${siteUrl}/` }));
  // The result as text, for the Export panel: Markdown first (the forum takes it), then JSON.
  const formats: ExportFormat[] = [
    { id: 'markdown', label: 'Markdown', icon: faMarkdown, extension: 'md', type: 'text/markdown', help: 'For a post on the Eurth forum or a wiki: the motto, and its weight as a table.', make: () => markdown(plate, link) },
    { id: 'json', label: 'JSON', icon: faFileCode, extension: 'json', type: 'application/json', help: 'For other tools and spreadsheets: the plate as data, with its link.', make: () => json(plate, link) },
  ];

  // Random only asks before it rolls when there is something to lose.
  const changed = $derived(Object.keys(compact(plate)).length > 0);
  const title = $derived(plate.nation ? `${plate.nation}: “${plate.motto}”` : `“${plate.motto}”`);

  onMount(() => {
    // A link is someone else's input: decodeState never throws, and clean() clamps every value.
    const arrived = stateFromLocation();
    if (arrived) plate = clean(arrived.value);
    ready = true;
  });

  // The address bar follows the design, so the link can be copied from there too.
  $effect(() => {
    const state = compact(plate);
    if (ready) stateToLocation(state);
  });

  // The suite's wink: "Nice." when a number settles on 69.
  const watch = niceWatcher();
  $effect(() => watch(plate.gravitas, () => slider));

  // This tool's own easter egg.
  $effect(() => {
    if (ready && plate.nation.trim().toLowerCase() === 'eurth') toast("That one's taken, but we admire the ambition.");
  });

  // The signature touch: a small chime when something is copied (silent until sound is switched on).
  const chime = () => playTones([[880, 0, 0.03], [1320, 0.06, 0.025]]);

  function startAgain() {
    plate = { ...defaults };
    toast('A clean plate.');
  }

  function loaded(next: EurthProfile) {
    profile = next;
    // Read what other tools wrote; never change their sections.
    const identity = getSection(next, 'identity');
    plate = { ...plate, nation: next.meta.nation, motto: typeof identity?.motto === 'string' && identity.motto ? clean({ m: identity.motto }).motto : plate.motto };
    toast(`${next.meta.nation || 'Your nation'} is loaded.`);
  }

  // What "Save profile" writes. This starter owns no section, so it only names the nation; a
  // real tool calls setSection(profile, '<its section>', { link, summary, … }) and leaves
  // every other section exactly as it was.
  const saved = $derived(plate.nation ? setNation(profile ?? createProfile(plate.nation), plate.nation) : profile);
</script>

<div class="maker">
  <form class="controls" onsubmit={(e) => e.preventDefault()}>
    <div class="eu-row">
      <RandomButton onrandom={() => (plate = random())} guard={changed} what="plate" />
      <button type="button" class={['eu-btn', changed && 'eu-btn--risky']} data-click="spin" data-tip={changed ? 'Clears your plate' : undefined} onclick={startAgain}>
        <Icon icon={faRotateLeft} /> Start again
      </button>
    </div>

    <section class="eu-card" aria-labelledby="words-title">
      <h2 class="eu-card-title" id="words-title"><span class="eu-step">1</span><Icon icon={faFeatherPointed} /> The words</h2>
      <label class="eu-field">
        <span class="eu-label">Nation</span>
        <input class="eu-input" bind:value={plate.nation} maxlength="60" autocomplete="off" placeholder="Your nation" />
      </label>

      <label class="eu-field">
        <span class="eu-label">Motto</span>
        <input class="eu-input" bind:value={plate.motto} maxlength="80" autocomplete="off" aria-describedby="motto-help" />
        <span class="eu-help" id="motto-help">Up to 80 characters. Short ones read best.</span>
      </label>
    </section>

    <section class="eu-card" aria-labelledby="weight-title">
      <h2 class="eu-card-title" id="weight-title"><span class="eu-step">2</span><Icon icon={faScaleBalanced} /> The weight</h2>
      <p class="eu-help">How solemnly the motto is meant, and how grandly it is framed.</p>

      <label class="eu-field">
        <span class="eu-label">Gravitas: <output class="eu-data">{plate.gravitas}</output> out of 100</span>
        <input bind:this={slider} class="eu-range" type="range" min="0" max="100" bind:value={plate.gravitas} style:--fill="{plate.gravitas}%" />
      </label>

      <fieldset class="options">
        <legend class="eu-label">Style</legend>
        <div class="eu-row">
          {#each STYLES as style (style.id)}
            <label class="eu-pill">
              <input type="radio" name="style" value={style.id} bind:group={plate.style} />
              <span class="eu-check"><Icon icon={faCheck} /></span>
              {style.name}
            </label>
          {/each}
        </div>
      </fieldset>
    </section>
  </form>

  <section class="result" aria-labelledby="result-title">
    <h2 id="result-title" class="eu-visually-hidden">Your plate</h2>
    <img class="plate" src={picture} alt={description} width="1200" height="630" />
    <p class="eu-muted" aria-hidden="true">{description}</p>

    <!-- The picture itself, to keep: beside the picture, as Governmint's charts have it. -->
    <div class="eu-row">
      <span class="eu-help">Download as</span>
      <button type="button" class="eu-btn" data-click="bounce" onclick={() => download(svg, `${fileSlug(plate.nation, 'plate')}-motto.svg`, 'image/svg+xml')}>
        <Line icon={lineDownloadOutline} /> SVG
      </button>
      <button type="button" class="eu-btn" data-click="bounce" onclick={async () => download(await svgToPicture(svg, { width: 1200, height: 630 }), `${fileSlug(plate.nation, 'plate')}-motto.png`)}>
        <Line icon={lineDownloadOutline} /> PNG
      </button>
    </div>

    <!-- Two cards, as in Governmint: "Save & share" keeps the result or passes it on; "Export"
         hands it over as text, in the formats other places take. -->
    <section class="eu-card" aria-labelledby="share-title">
      <h3 class="eu-card-title" id="share-title"><Icon icon={faShareNodes} /> Save &amp; share</h3>
      <ShareButtons
        url={link}
        {title}
        text={`${description} Made with ${siteName}.`}
        description={() => description}
        markdown={() => markdown(plate, link)}
        picture={() => svgToPicture(svg, { width: 1200, height: 630 })}
        heading={plate.nation ? `Share ${plate.nation}` : 'Share your plate'}
        said={{ link: 'Link copied: the plate is in it.' }}
        oncopy={chime}
      >
        <ProfileButtons profile={saved} onload={loaded} onerror={(errors) => toast(errors[0]?.message ?? "That file isn't a nation profile.")} />
      </ShareButtons>
      <p class="eu-help">
        The link holds the whole plate, so it brings this plate back exactly. The profile file carries your nation from one Eurth tool to the next. Nothing is kept in this browser.
      </p>
    </section>

    <section class="eu-card" aria-labelledby="export-title">
      <h3 class="eu-card-title" id="export-title"><Icon icon={faFileExport} /> Export</h3>
      <ExportPanel name={`${fileSlug(plate.nation, 'plate')}-motto`} {formats} oncopy={chime} />
    </section>
  </section>
</div>

<style>
  .maker {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1.4fr);
    gap: var(--space-6);
    align-items: start;
  }

  .controls {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
    min-width: 0;
  }

  .options {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
    margin: 0;
    padding: 0;
    border: 0;
  }

  .result {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
    min-width: 0;
  }

  .plate {
    display: block;
    width: 100%;
    height: auto;
    border-radius: var(--radius-md);
  }

  @media (max-width: 800px) {
    .maker {
      grid-template-columns: minmax(0, 1fr);
    }

    /* On a phone the result comes first: it is what the visitor came for. */
    .result {
      order: -1;
    }
  }
</style>
