# Content redirect landing measurement

The application page-view hook now handles signed HookLite content redirects
as well as the existing Airtime Story flow. `lib/content-attribution.ts` sends
only recognized campaign/content/account/click IDs, the signed capability,
and the actual pathname to HookLite's real `content-landing` endpoint.

Complete, unambiguous URL context is required. HookLite authenticates the
signature and exact persisted click/link pair; browser query parameters alone
cannot establish verified attribution. An ordinary or unsigned visit sends no
content-landing request.

The capability is removed from browser history immediately and is never
stored, logged by analytics, or propagated to outbound links. Requests omit
cookies and referrers, and the site's HTTP Referrer-Policy is `no-referrer`.
Only a confirmed HookLite landing receipt sets the per-click session marker.
Concurrent invocations share one request, temporary failures retry the same
receipt, and server deduplication also protects refreshes and replays.

Pure parser tests cover privacy, ambiguity, malformed input, foreign Origins,
and server rendering. The companion app hub's real production canary loads
this site's deployed JavaScript and independently checks shared-Supabase rows,
QA exclusion, capability removal, invalid-proof rejection, and cleanup.

This measures arrival on the website. It does not identify unique people or
confirm activation, a purchase, or a conversion uplift.
