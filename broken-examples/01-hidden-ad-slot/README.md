# Case 1 — Hidden Ad Slot

## Symptom

The ad slot exists on the page, but the advertisement is not visible.

## Investigation

Open DevTools and inspect the ad container.

Check:

- Whether the element exists in the DOM
- Its computed width and height
- Whether CSS is hiding the element
- Whether another element is covering it

## Root Cause

The ad container has unusable dimensions, so the browser cannot display the advertisement correctly.

## Fix

Restore the expected dimensions for the ad placement and verify the result after reloading the page.

## TAM Lesson

An ad that is not visible is not necessarily a demand or ad-server problem. Always validate the page implementation first.
