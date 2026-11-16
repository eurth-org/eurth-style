/**
 * The moment this build counts as "now". The launch workflow sets EURTH_BUILD_TIME to the
 * door's time, builds ahead of it and deploys when it arrives; every other build uses the clock
 * of the machine that builds.
 */
export function buildTime(): Date;
/** Every tool, launched or not. For the hub's locked doors and for tests; never print names from it. @returns {Tool[]} */
export function everyTool(): Tool[];
/** @param {string} id @returns {Tool | undefined} */
export function findTool(id: string): Tool | undefined;
/** @param {Tool} tool @param {Date} [at] */
export function hasLaunched(tool: Tool, at?: Date): boolean;
/** The tools and sites whose launch date has passed, in tools.json's order. @param {Date} [at] */
export function launchedTools(at?: Date): Tool[];
/** Not launched yet: what no page may mention. @param {Date} [at] */
export function unlaunchedTools(at?: Date): Tool[];
/** Whether pages may link to GitHub yet. @param {Date} [at] */
export function githubLinksAllowed(at?: Date): boolean;
/**
 * A tool's own facts, checked once so mistakes show at build time.
 * @param {Site} site
 * @returns {Site & { host: string }}
 */
export function defineSite(site: Site): Site & {
    host: string;
};
/**
 * A page's <title>: the start page carries the site's own; every other page its name, then the site's.
 * @param {Site} site @param {string} path @param {string} [title]
 */
export function pageTitle(site: Site, path: string, title?: string): string;
/** Eurth itself: the publisher of every tool. */
export function organization(): {
    '@context': string;
    '@type': string;
    '@id': string;
    name: string;
    url: string;
    description: string;
    foundingDate: string;
};
/** The site, on every page. @param {Site} site */
export function webSite(site: Site): {
    '@context': string;
    '@type': string;
    '@id': string;
    name: string;
    url: string;
    description: string;
    inLanguage: string;
    publisher: {
        '@id': string;
    };
};
/**
 * The maker: a free application that runs in the browser.
 * @param {Site} site
 * @param {{ featureList?: string[], screenshot?: string }} [more]
 */
export function webApplication(site: Site, more?: {
    featureList?: string[];
    screenshot?: string;
}): {
    featureList?: string[];
    screenshot?: string;
    '@context': string;
    '@type': string;
    '@id': string;
    name: string;
    url: string;
    description: string;
    applicationCategory: string;
    operatingSystem: string;
    browserRequirements: string;
    isAccessibleForFree: boolean;
    offers: {
        '@type': string;
        price: string;
        priceCurrency: string;
    };
    inLanguage: string;
    publisher: {
        '@id': string;
    };
};
/**
 * The trail from the start page to this one.
 * @param {Site} site
 * @param {{ name: string, path: string }[]} trail below the start page, in order
 */
export function breadcrumbs(site: Site, trail: {
    name: string;
    path: string;
}[]): {
    '@context': string;
    '@type': string;
    itemListElement: {
        '@type': string;
        position: number;
        name: string;
        item: string;
    }[];
};
/**
 * A glossary. Each term's anchor is its id on the page.
 * @param {Site} site
 * @param {{ name: string, path: string, terms: { id: string, term: string, definition: string }[] }} glossary
 */
export function definedTermSet(site: Site, { name, path, terms }: {
    name: string;
    path: string;
    terms: {
        id: string;
        term: string;
        definition: string;
    }[];
}): {
    '@context': string;
    '@type': string;
    '@id': string;
    name: string;
    url: string;
    inLanguage: string;
    hasDefinedTerm: {
        '@type': string;
        '@id': string;
        name: string;
        description: string;
        url: string;
        inDefinedTermSet: string;
    }[];
};
/**
 * Questions and answers shown on the page.
 * @param {{ q: string, a: string }[]} faq
 */
export function faqPage(faq: {
    q: string;
    a: string;
}[]): {
    '@context': string;
    '@type': string;
    mainEntity: {
        '@type': string;
        name: string;
        acceptedAnswer: {
            '@type': string;
            text: string;
        };
    }[];
};
/**
 * A written page (a guide), with the day it was last brought up to date.
 * @param {Site} site
 * @param {{ headline: string, path: string, description: string, updated: string }} article updated: YYYY-MM-DD
 */
export function article(site: Site, { headline, path, description, updated }: {
    headline: string;
    path: string;
    description: string;
    updated: string;
}): {
    '@context': string;
    '@type': string;
    headline: string;
    description: string;
    url: string;
    dateModified: string;
    inLanguage: string;
    author: {
        '@id': string;
    };
    publisher: {
        '@id': string;
    };
};
/**
 * @typedef {object} Tool
 * @property {string} id       Its subdomain, and its key everywhere: 'flag' for flag.eurth.org.
 * @property {'tool' | 'hub' | 'site'} kind
 * @property {string} name
 * @property {string} url
 * @property {string} pitch    One line, no full stop.
 * @property {string} launch   ISO time with offset.
 * @property {number} [door]   Its door in the advent calendar.
 */
/**
 * @typedef {object} Site
 * @property {string} id           The tool's id in tools.json ('flag'); for a site that isn't a tool, its subdomain.
 * @property {string} name         Title Case: "Flagwright".
 * @property {string} url          "https://flag.eurth.org", no slash at the end.
 * @property {string} title        The start page's title: "<Name>: free online <thing> maker for worldbuilders".
 * @property {string} description  The start page's description, and the default for pages without their own.
 * @property {string} tagline      A few words: "Flags made to fly".
 * @property {{ href: string, label: string, icon?: import('@fortawesome/free-solid-svg-icons').IconDefinition | import('./line-md.js').LineIcon }[]} pages
 *   The tool's own pages for the header, start page first. The usual ones (/, /guide/, /glossary/, /templates/, /examples/) have an icon already; give any other page one.
 * @property {string} repo         "https://github.com/eurth-org/eurth-flag".
 * @property {string} ogAlt        What the sharing image shows, in a sentence.
 * @property {string} [category]   schema.org applicationCategory (default "DesignApplication").
 * @property {boolean} [sound]     The tool makes a sound somewhere: the footer then offers the sound switch.
 * @property {string} [llms]       Extra lines for llms.txt, as Markdown.
 */
/** From this moment pages may link to GitHub; before it, none does. */
export const GITHUB_FROM: "2026-12-25T00:00:00+01:00";
export namespace EURTH {
    let home: "https://eurth.org";
    let join: "https://eurth.org/signup";
    let forums: "https://eurth.org";
    let map: "https://map.eurth.org";
    let news: "https://news.eurth.org";
    let status: "https://status.eurth.org";
    let orioni: "https://eurth.org/u/orioni";
}
export type Tool = {
    /**
     * Its subdomain, and its key everywhere: 'flag' for flag.eurth.org.
     */
    id: string;
    kind: "tool" | "hub" | "site";
    name: string;
    url: string;
    /**
     * One line, no full stop.
     */
    pitch: string;
    /**
     * ISO time with offset.
     */
    launch: string;
    /**
     * Its door in the advent calendar.
     */
    door?: number | undefined;
};
export type Site = {
    /**
     * The tool's id in tools.json ('flag'); for a site that isn't a tool, its subdomain.
     */
    id: string;
    /**
     * Title Case: "Flagwright".
     */
    name: string;
    /**
     * "https://flag.eurth.org", no slash at the end.
     */
    url: string;
    /**
     * The start page's title: "<Name>: free online <thing> maker for worldbuilders".
     */
    title: string;
    /**
     * The start page's description, and the default for pages without their own.
     */
    description: string;
    /**
     * A few words: "Flags made to fly".
     */
    tagline: string;
    /**
     *   The tool's own pages for the header, start page first. The usual ones (/, /guide/, /glossary/, /templates/, /examples/) have an icon already; give any other page one.
     */
    pages: {
        href: string;
        label: string;
        icon?: import("@fortawesome/free-solid-svg-icons").IconDefinition | import("./line-md.js").LineIcon;
    }[];
    /**
     * "https://github.com/eurth-org/eurth-flag".
     */
    repo: string;
    /**
     * What the sharing image shows, in a sentence.
     */
    ogAlt: string;
    /**
     * schema.org applicationCategory (default "DesignApplication").
     */
    category?: string | undefined;
    /**
     * The tool makes a sound somewhere: the footer then offers the sound switch.
     */
    sound?: boolean | undefined;
    /**
     * Extra lines for llms.txt, as Markdown.
     */
    llms?: string | undefined;
};
export { ref, wikipedia } from "./ref.js";
