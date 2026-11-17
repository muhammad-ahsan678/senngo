# Product Requirements Document

Status: Discovery draft — incomplete; updated as the concept is discussed.
Last updated: 2026-11-17
Product name: To be decided.

## 1. Product concept

A website for temporary file sharing through links and small shared groups called pools. Users upload files, optionally set a password, and copy a link to share. Files expire automatically. Cloudflare R2 will store the files.

The business combines a free tier supported by advertising, a monthly paid tier, and a one-time purchase for a larger file with longer expiry.

Target users, primary use cases, launch market, and reasons to choose this over existing tools are still to be defined.

## 2. Proposed plans

These are the founder's initial proposals. The product will enforce separate limits for cumulative monthly uploads and current storage. Exact storage caps, detailed accounting, and expiry rules need clarification before implementation.

| Offering | Price | Monthly allowance | Maximum file size | File expiry | Pool member limit when creating a pool |
| --- | --- | --- | --- | --- | --- |
| Free | $0 | 700 MB | 40 MB | 1 day | 3 people; whether creator counts is undecided |
| Paid | $5/month | 10 GB | 1 GB | 7 days | 7 people; whether creator counts is undecided |
| One-time large file | $2/file | Relationship to monthly allowance undecided | 3 GB | 30 days | No separate pool benefit specified |

Prices are in USD. MB and GB are recorded as provided; exact byte definitions are undecided.

### Confirmed allowance model

- Track cumulative monthly uploads and current storage separately. Both limits apply.
- Deleting or expiring a file releases its current storage usage but does not restore its consumed monthly upload allowance.
- The proposed 700 MB free and 10 GB paid allowances remain monthly upload allowances. Current storage caps for each tier are undecided.
- Monthly reset timing, treatment of failed or partial uploads, and interactions with pools, one-time purchases, and ad rewards remain undecided.

## 3. File sharing

- Users can upload a file and obtain a shareable link.
- A password is optional.
- Upload progress is visible.
- Each file has an expiry based on its offering; the starting point and whether users can choose a shorter expiry are undecided.
- For a share containing multiple files, the website creates a ZIP for download instead of offering individual downloads.
- Every download automatically shows an ad, including single-file and ZIP downloads, for all users regardless of plan. The ad lasts up to 60 seconds, with a visible, functional Skip/Close button available immediately from the first second. Users can dismiss it without watching the full ad and continue the download.
- Account requirements for uploading and downloading are undecided.
- Link access rules, download limits, manual deletion, and link revocation are undecided.
- ZIP generation location, maximum combined size, temporary storage, and quota treatment are undecided.

## 4. Pools

A user creates a pool and invites others to share files. Pool members can access the shared files.

The proposed pool capacity combines the allowances of its members, according to their tiers, less their consumed allowances.

Founder example: one paid member and two free members contribute 10 GB + 700 MB + 700 MB before deducting consumed allowances.

The creator's tier determines the proposed member limit: 3 for a free creator and 7 for a paid creator.

Open rules:

- Whether any member can use all remaining pool capacity or only their own contribution.
- Whether consumption includes personal uploads, uploads in this pool, and uploads in other pools.
- Whether a user can join multiple pools and how to prevent the same allowance being counted more than once.
- Which tier controls a pool file's maximum size and expiry: uploader, creator, or another rule.
- Who can invite, remove members, delete files, or share a pool file externally.
- What happens to capacity and files when someone leaves, is removed, or changes plan.
- Whether a pool itself expires and whether the creator can transfer ownership.

## 5. Advertising proposal

The founder intends to use Google publisher advertising. The specific product and eligible formats are undecided.

| Placement | Initial proposal | Status |
| --- | --- | --- |
| Banners | Four banners on the website | Proposed; layout, density, and page placement undecided |
| Upload | Upload progress in a popup beneath an ad popup; a mandatory 60-second video before the user can skip and copy the link | Requires redesign or format validation |
| All downloads | Automatically show an ad whenever a user downloads any file or ZIP, regardless of plan; up to 60 seconds total, with Skip/Close available immediately from the first second | Product behavior confirmed; supported provider format and whether the download starts behind the ad or after dismissal remain undecided |
| Large-file reward | A free user watches a 60-second ad to receive paid-tier privileges for that file | Optional reward design and provider eligibility need validation |

The reward's exact file limit, expiry, quota treatment, and frequency are undecided. Download ads apply to everyone, including paid users and recipients of one-time purchased files. Whether paid users and one-time purchases remove upload ads or banners is undecided.

Google's rewarded-ad rules require voluntary participation and a way to dismiss; declining must preserve normal use. AdSense also restricts popup placement and implementations that obstruct content or navigation. The proposed mandatory upload gate cannot be treated as an approved Google integration. A voluntary larger-file reward is a possibility to investigate, not a confirmed supported use case. Fixed video durations and ad availability are not established.

Sources: [Google rewarded-ad policies](https://support.google.com/admanager/answer/7496282?hl=en), [AdSense placement policies](https://support.google.com/adsense/answer/1346295?hl=en), [Rewarded ads for web](https://support.google.com/admanager/answer/9116812?hl=en).

## 6. Initial infrastructure and cost assumptions

Founder proposal: initially budget $3/month for paid R2 Standard storage. At the pricing below, this covers 200 GB-month of paid storage, plus the 10 GB-month free allowance, for 210 GB-month total per month, while staying within free Class A and Class B operation allowances.

Verified against [Cloudflare R2 pricing](https://developers.cloudflare.com/r2/pricing/):

- Standard storage includes 10 GB-month/month free; additional storage is $0.015/GB-month.
- The $3/month paid storage budget covers **200 GB-month** ($3 / $0.015), before any applicable billing rounding or other charges.
- Free monthly operations: 1 million Class A and 10 million Class B. Further operations are billed.
- Direct R2 egress is free. App hosting, database, ZIP processing, payment fees, and other services require separate estimates.
- GB-month measures storage over time. It does not mean a monthly upload allowance or a purchased hard capacity limit.

Open decisions: whether to enforce a 210 GB live storage cap based on this budget; what happens when the platform reaches its chosen limit; and whether the budget scales with paying users. Monthly user upload allowances remain a separate decision.

Advertising revenue, ad availability, conversion, and total operating cost have not been validated. No profitability claim is established.

## 7. Candidate additions within scope

Suggestions only; not approved requirements:

- A dashboard showing files, remaining allowance, and expiry countdowns.
- Manual deletion and link revocation.
- A copyable pool invitation link.
- Download counts and upload failure/retry feedback.

## 8. Discovery questions

Resolve first:

1. Who is the primary user, and what file-sharing problem do they face today?
2. What current storage cap applies to each tier alongside its cumulative monthly upload allowance?
3. Can a pool member use another member's unused allowance? For example, can a free member upload more than 700 MB in a pool with a paid member?

Resolve next:

- Are accounts required for upload, pool membership, and download?
- Do pool limits include the creator? How are invitations accepted?
- Who sees upload ads and banners? What happens when no download ad is available, and does the download start while the ad is visible or after it is dismissed or ends? Immediate dismissal must allow the download to continue without a mandatory viewing period.
- How do subscriptions, one-time purchases, and ad rewards interact with quotas?
- What happens at monthly resets, subscription cancellation, failed payments, and plan downgrade?
- Which file types are supported? How are abuse reports and prohibited uploads handled?
- Which countries and payment methods are targeted?
- What launches first, what is deferred, and what measures success?

## 9. Completion criteria for this PRD

The PRD remains a draft until target users, quota accounting, pool permissions, expiry behavior, monetization flows, and launch scope are agreed. Final requirements, edge cases, acceptance criteria, and success metrics will be added as those decisions are made.
