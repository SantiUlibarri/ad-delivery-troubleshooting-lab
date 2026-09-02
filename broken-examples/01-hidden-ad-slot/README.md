# Case 1 — Hidden Ad Slot

## Symptom
The ad request may succeed, but the advertisement is not visible.

## Investigation
Inspect the ad container in DevTools and check its computed dimensions.

## Root Cause
CSS gives the ad container zero width and/or height.

## Fix
Restore the expected dimensions for the ad placement.

## TAM Lesson
Always verify the DOM and CSS before assuming the demand or ad server is responsible.
