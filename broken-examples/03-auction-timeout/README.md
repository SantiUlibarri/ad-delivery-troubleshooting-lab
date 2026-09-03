# Case 3 — Auction Timeout

## Symptom

A bidder that previously participated in the auction is no longer contributing bids.

## Investigation

Compare the bidder's response time with the configured auction timeout.

Example:

```text
Auction timeout: 500 ms
Bidder response: 700 ms
```

Root Cause

The bidder responds after the auction timeout and therefore misses the completed auction.

Fix

Evaluate bidder latency and determine whether the timeout configuration should be adjusted.

TAM Lesson

Auction timeouts require balancing additional bidding opportunities against page performance and latency.
