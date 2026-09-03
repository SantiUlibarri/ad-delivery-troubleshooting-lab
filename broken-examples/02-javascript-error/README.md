# Case 2 — JavaScript Runtime Error

## Symptom

The publisher page loads, but the header-bidding auction does not start.

## Investigation

Open DevTools → Console and look for JavaScript errors.

Check:

- The error message
- The source file
- The line where the error occurred
- Whether the error happens before auction initialization

## Root Cause

A JavaScript runtime error interrupts execution before the auction can complete.

## Fix

Correct the JavaScript error and reload the page to confirm that the auction initializes successfully.

## TAM Lesson

A JavaScript error can prevent ad delivery before any bidder or ad-server request occurs.
