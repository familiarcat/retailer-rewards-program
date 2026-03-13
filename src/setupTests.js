// Extends Jest's `expect` with DOM-specific matchers (toBeInTheDocument, etc.)
// See: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// ── Suppress known test-infrastructure noise ───────────────────────────────────
// These console.error messages are artefacts of @testing-library/react v13
// running against React 18, not real problems in production code.
//
//  1. ReactDOMTestUtils.act deprecation — RTL v13 uses the legacy API
//     internally; React 18 warns, but every test passes.
//  2. "not wrapped in act(...)" on TestComponent — fires when a synchronous
//     test (e.g. "starts in loading state") completes before the mock
//     Promise resolves, causing the subsequent setState to land outside act.
//  3. "Error calculating rewards" — the rewardsService catch block logs this
//     intentionally; it is triggered by the error-path test on purpose.
const originalError = console.error.bind(console);
console.error = (...args) => {
  // React passes some warnings as printf-style format strings; join all
  // string arguments so pattern checks work regardless of argument position.
  const full = args.map((a) => (typeof a === 'string' ? a : '')).join(' ');

  // 1. ReactDOMTestUtils.act deprecation — RTL v13 internal, not our code.
  if (full.includes('ReactDOMTestUtils.act') && full.includes('deprecated')) return;
  // 2. act() wrapping warning — fires when a sync test ends before the mock
  //    Promise resolves; args[0] is the %s format string, args[1] is the
  //    component name ("TestComponent").
  if (full.includes('not wrapped in act')) return;
  // 3. Intentional rewardsService error log triggered by the error-path test.
  if (full.includes('Error calculating rewards:')) return;

  originalError(...args);
};
