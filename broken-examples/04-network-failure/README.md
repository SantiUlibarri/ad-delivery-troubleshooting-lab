# Case 4 — Network Failure

## Symptom
A bidder is configured correctly but produces no bids.

## Investigation
Open DevTools → Network and inspect bidder requests. Look for failed requests, HTTP errors, blocked requests, or unexpected response times.

## Possible Causes
- Request failure
- Timeout
- Incorrect endpoint
- Browser/network blocking
- Invalid bidder configuration

## TAM Lesson
The Network tab helps determine whether the problem occurs before a bidder response is received.
