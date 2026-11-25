# Senngo guest-transfer MVP

- **Author** muhammad-ahsan678
- **Date** 2026-11-25
- **Status** Working draft for EGM clarification

## Overview

Anyone can create a transfer at launch and share several files through one temporary link. The sender and recipient use the site as guests. The MVP succeeds when that exchange works end to end and both people can tell what happened when it fails.

## Goals and scope

- The sender selects one or more files, optionally sets a password, and sees upload progress. When all files are ready, the site shows one copyable share link and a separate private link for managing the transfer.
- The recipient opens the share link, enters the password when required, and can download an individual file or bundle all available files into an uncompressed ZIP. Each file allows 20 completed downloads total. Repeat downloads by the same person count each time they complete.
- A transfer expires 24 hours after its upload completes. The sender can remove individual files sooner using the private link. New download requests honor expiry and deletion even while storage cleanup is pending.
- Later scope includes payments, accounts, shared pools, invites, and personal or group quotas.

## Analysis

Public uploads need limits on repeated uploads, total storage use, and download traffic. The server enforces the proposed launch caps below. Keep them configurable so they can be tuned from observed usage.

| Limit | Proposed launch cap |
| --- | --- |
| Transfer size | 250 MB total across up to 10 files |
| Storage in use or reserved | Stop accepting new uploads at 50 GB and warn the operator at 40 GB |
| Upload starts per IP | 5 per hour and 20 per 24 hours |
| File or ZIP download starts per IP | 30 per 10 minutes |
| Completed downloads per file | 20 across all recipients, including completed ZIP downloads |
| Failed password attempts per IP and transfer | 5 per 15 minutes |

With about 76 GB available, a 50 GB upload budget leaves about 26 GB of headroom and holds roughly 200 full-size transfers. Reserve space before accepting upload data so concurrent uploads cannot exceed the budget. Count partial files and files awaiting deletion until cleanup frees their space. If storage fills, reject new uploads and keep existing downloads available. If a request hits a rate limit, show when the user can retry.

Use one web service with persistent transfer records, private file storage, and periodic cleanup. The service records expiry and checks access on every download request. A failed upload stays private and its partial files are cleaned up. An interrupted upload can be retried from the start. Stream the ZIP on demand using the ZIP Store method. This bundles the available files into one download without compressing them or storing a second copy.

Reserve one slot per included file before streaming so simultaneous requests cannot exceed the cap. Increment each file's completed count only after the server finishes sending the full file or ZIP response. A completed ZIP counts once for each included file. On a stream error, disconnect, or timeout, release the reservations. Reclaim slots left by a server crash after the download deadline. When a file reaches 20 completed downloads, mark it as having reached its limit and omit it from future ZIPs. Other files stay available under their own limits.

The launch plan assumes the R3 object store has no egress charge. Downloads streamed through the web service still use the app host's bandwidth.

## Alternatives weighed

- A single link for both sharing and deletion gives every recipient delete access. A separate private link gives the guest sender control without accounts.
- Resumable uploads would help on unstable connections. Retrying from the start keeps the flow simpler at the proposed transfer size.

## Build order

1. Build the guest upload page and upload endpoint. Enforce file, storage, and upload rate limits. Show progress, save transfer records, and issue the two links after every file is ready.
2. Build the recipient page, optional password check, file downloads, and ZIP download. Apply the same access checks and per-file download cap to both download paths. Store password hashes and rate-limit downloads and password attempts.
3. Add the sender’s delete action and 24-hour expiry. Run cleanup for deleted, expired, and abandoned uploads. Retry failed cleanup on the next run.
4. Add user-facing errors and verify the flow from two separate browser sessions. Log operation failures with a request ID and keep passwords and private links out of logs.

## MVP acceptance checks

- A sender uploads several files and copies one share link. A recipient in a separate browser downloads an individual file and the full ZIP. The individual file and extracted ZIP files match the originals. Every ZIP entry uses the Store method.
- A wrong password leaves downloads locked. The right password makes the files available. The share link cannot authorize deletion.
- Completed repeat downloads from the same browser and completed ZIPs count toward each file's 20 downloads. An interrupted file or ZIP download releases its reserved slots and allows a retry. The service prevents a 21st completed download, even with simultaneous requests. Other files remain available individually and in the ZIP.
- An oversized or interrupted upload shows an actionable error. The sender can retry, and partial files are cleaned up.
- Requests above a rate limit tell the user when to retry. Concurrent uploads stay within the storage budget. When space runs out, existing downloads still work and new uploads resume after cleanup frees space.
- Deleting one file removes it from the recipient’s list, individual download, and next ZIP while other files stay available. After 24 hours, all new download requests are blocked, even before cleanup runs.
- When storage fails, the site shows a retryable error and the service records enough detail to diagnose it.

## Key decisions to confirm

Anyone can upload as a guest at launch, and each file has 20 completed downloads total. ZIPs bundle files using the Store method. The proposed upload, storage, and rate limits are working defaults for about 76 GB of available storage. Confirm the app host's outbound bandwidth allowance before setting a global traffic limit.
