// Lighthouse, as the tools' CI runs it on main (see .github/workflows/tool-ci.yml):
//   npx @lhci/cli autorun --config=node_modules/@eurth/style/lighthouserc.cjs
// Accessibility, best practices and SEO must score 100. Performance must too on an ordinary run;
// CI machines are noisy, so here it guards against a real regression (95) and holds the three
// Core Web Vitals to "good".
module.exports = {
  ci: {
    collect: {
      staticDistDir: './dist',
      // The 404 page keeps itself out of search engines on purpose, so it isn't scored.
      autodiscoverUrlBlocklist: ['/404.html'],
      numberOfRuns: 3,
      settings: { preset: 'desktop' },
    },
    assert: {
      assertions: {
        'categories:accessibility': ['error', { minScore: 1 }],
        'categories:best-practices': ['error', { minScore: 1 }],
        'categories:seo': ['error', { minScore: 1 }],
        'categories:performance': ['error', { minScore: 0.95, aggregationMethod: 'median' }],
        'largest-contentful-paint': ['error', { maxNumericValue: 2500, aggregationMethod: 'median' }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1, aggregationMethod: 'median' }],
        'total-blocking-time': ['error', { maxNumericValue: 200, aggregationMethod: 'median' }],
      },
    },
    upload: { target: 'filesystem', outputDir: './.lighthouseci' },
  },
};
