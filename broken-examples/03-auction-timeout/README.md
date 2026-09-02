# Case 3 — Auction Timeout

## Symptom
A previously strong bidder stops contributing to auctions.

## Investigation
Compare bidder response times with the configured auction timeout.

## Root Cause
The bidder responds after the timeout and therefore does not participate in the completed auction.

## Fix
Evaluate bidder latency and determine whether the timeout should be adjusted.

## TAM Lesson
Timeout optimization requires balancing revenue opportunity against page performance and user experience.
