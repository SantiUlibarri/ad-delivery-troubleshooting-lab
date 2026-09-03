
---

### `broken-examples/04-network-failure/README.md`

```markdown
# Case 4 — Network Failure

## Symptom

A bidder is configured correctly but does not produce a usable bid.

## Investigation

Open DevTools → Network and inspect the bidder request.

Look for:

- Failed requests
- HTTP errors
- Blocked requests
- Missing responses
- Excessive response times

## Possible Root Causes

The problem could be caused by a failed request, incorrect endpoint, network/browser blocking, timeout, or invalid configuration.

## Fix

Identify where the request is failing, correct the relevant configuration or implementation issue, and verify that the bidder responds successfully.

## TAM Lesson

Network inspection helps determine whether the failure occurs between the browser sending the request and the bidder returning a response.
