# Case 2 — JavaScript Runtime Error

## Symptom
The page loads, but the header-bidding auction never starts.

## Investigation
Open DevTools → Console and look for JavaScript exceptions.

## Root Cause
A runtime JavaScript error stops auction execution.

## Fix
Identify the source file and line number, correct the invalid reference, and reload the page.

## TAM Lesson
A JavaScript failure can interrupt the entire ad-delivery chain even when the HTML and CSS are working correctly.
