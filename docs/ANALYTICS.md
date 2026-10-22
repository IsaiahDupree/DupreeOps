# DupreeOps website analytics

## Current state

The site has no production GA4 measurement destination configured. The optional
integration is disabled until `NEXT_PUBLIC_GA_MEASUREMENT_ID` is supplied to the
deployment. This branch does not set that value, create a GA property, or deploy
the site. The existing `contact_submissions` row remains the source of truth for
leads; no database schema or Supabase project is changed here.

The production contact endpoint stores a lead before returning success. Analytics
fires only after that successful response and only when the visitor has granted
optional analytics consent. A notification email succeeding is not required for
the event because the durable lead row has already been accepted.

## Event contract

| Event | Trigger | Permitted fields |
| --- | --- | --- |
| `page_view` | Initial page and completed SPA route | `page_path`, `page_title` |
| `link_click` | Existing instrumented link | clean destination origin/path and static label |
| `product_click` | Existing instrumented product link | product name and clean destination origin/path |
| `email_click` | Existing email link | `contact_method=email`; recipient is discarded |
| `theme_toggle` | Theme choice | `theme` |
| `contact_form_submitted` | `/api/contact` accepted the form | `form_type=contact`, current path |

URL query strings and fragments are stripped. The form's name, email, message,
database row, and API response body are never passed to the analytics client.
The GA4 integration stores only the visitor's allow/deny choice in local storage.
Separate existing story/content attribution code may use session storage and send
the landing path plus validated campaign identifiers to its attribution service
when a valid signed campaign link is present; that flow is independent of GA4
consent and is not changed by this branch.

## Configure and verify

1. Choose the intended DupreeOps GA4 property and add its `G-...` measurement ID
   as the Vercel production environment variable `NEXT_PUBLIC_GA_MEASUREMENT_ID`.
2. Deploy through the normal reviewed release process. The code renders no
   consent prompt and loads no Google tag while this variable is absent.
3. In a clean browser profile, verify no `googletagmanager.com` request occurs
   before consent. Rejecting must keep it absent. Allowing should load the tag
   and produce `page_view` without query parameters.
4. Submit a real, authorized test lead only after the owner has chosen a test
   destination. Verify the lead row separately and confirm the GA4 event contains
   no submitted values. No test form was submitted for this implementation.
5. Mark `contact_form_submitted` as a key event in GA4 only after the property is
   configured and the real event is observed.

Do not use the unrelated DupreeOps production Supabase project as a substitute
for the owner-designated shared project, and do not add attribution columns until
that project discrepancy is resolved.
