# Ad Delivery Troubleshooting Lab

A hands-on publisher-side AdTech troubleshooting project built to demonstrate how I approach diagnosing ad-delivery problems across the browser, page implementation, JavaScript, header bidding, auction behavior, ad-server targeting, and creative rendering.

The project is a **local educational simulation** of a publisher ad stack. It does not claim to be a production Prebid.js or Google Ad Manager implementation.

---

## Why I Built This

Publisher-side ad delivery can fail at many different points in the delivery chain.

An ad may fail because:

- The ad slot does not exist in the DOM
- The configured placement ID does not match the page
- CSS prevents the slot from being visible
- JavaScript fails before the auction starts
- A bidder responds too slowly
- The auction timeout is too aggressive
- A bidder request fails
- A valid bid is received but targeting is incorrect
- The ad server does not select an eligible line item
- The creative is returned but does not render correctly

Rather than treating these as isolated problems, this project models the **entire troubleshooting path** and documents how to isolate the failure point.

---

# Ad Delivery Flow

The simulated system follows this simplified publisher-side flow:

```text
                    PUBLISHER WEBPAGE
                           |
                           v
                    HTML / AD SLOTS
                           |
                           v
                  DOM + CSS VALIDATION
                           |
                           v
                  JAVASCRIPT INITIALIZATION
                           |
                           v
                  HEADER BIDDING AUCTION
                    /       |       \
                   /        |        \
                  v         v         v
             Bidder A   Bidder B   Bidder C
                  \        |        /
                   \       |       /
                    v      v      v
                    BID RESPONSES
                           |
                           v
                    AUCTION TIMEOUT
                           |
                           v
                     WINNING BID
                           |
                           v
              SIMULATED AD-SERVER TARGETING
                           |
                           v
                    AD RENDERING
                           |
                           v
                         USER

```
## What I Built

This project was developed in stages to simulate the main components of a publisher-side ad delivery system.

### 1. Publisher Webpage and Ad Slots

I created a simple publisher webpage containing multiple simulated advertising placements.

Each placement has a unique ID and an expected ad size.

For example:

* `ad-top` — 728 × 90
* `ad-content` — 300 × 250
* `ad-sidebar` — 300 × 250

The purpose of this stage was to establish the inventory that the simulated ad-delivery system would operate on.

### 2. DOM Validation

The JavaScript checks whether each configured ad slot actually exists in the webpage.

For example:

```javascript
document.getElementById(slot.code)
```

If the element exists, the system reports that the ad slot was found.

If it does not exist, the system reports an error.

This simulates a common publisher implementation problem where the JavaScript configuration and the HTML page do not match.

### 3. Simulated Header Bidding

I created a simplified header-bidding auction using JavaScript.

Three simulated bidders participate in the auction:

| Bidder | Response Time | CPM |
|---|---:|---:|
| Bidder A | 400 ms | €1.20 |
| Bidder B | 700 ms | €2.10 |
| Bidder C | 300 ms | €0.80 |

Each bidder responds asynchronously.

The auction collects the available bids and evaluates them based on CPM.

### 4. Winning Bid Selection

After receiving the bids, the JavaScript identifies the highest valid CPM and selects it as the winning bid.

This demonstrates the basic concept of competition between demand sources.

### 5. Auction Timeout

I introduced an auction timeout to simulate what happens when a bidder responds too slowly.

With a 500 ms timeout:

```text
Bidder C → 300 ms → participates
Bidder A → 400 ms → participates
Bidder B → 700 ms → too late
```

This demonstrates the trade-off between allowing more bidders to participate and maintaining page performance.

A longer timeout may allow additional bids to compete, but it can also increase latency.

### 6. Debugging and Failure Scenarios

The project also documents several intentionally broken scenarios:

* Hidden ad slot
* JavaScript runtime error
* Auction timeout
* Network failure

Each scenario includes:

1. The symptom
2. The investigation process
3. The likely root cause
4. The appropriate troubleshooting approach
5. The lesson for a Technical Account Manager

The goal is to demonstrate a structured approach to troubleshooting rather than simply changing configuration values until something works.

## Troubleshooting Methodology

The main objective of this project is to demonstrate a structured troubleshooting process.

When a publisher reports that an advertisement is not appearing, I would avoid immediately changing bidder or ad-server configuration.

Instead, I would work through the delivery chain from the browser outward.

### Step 1 — Reproduce the Issue

First, determine whether the problem can be reproduced.

Questions to ask:

* Does the issue occur consistently?
* Does it affect one page or multiple pages?
* Does it affect one ad placement or multiple placements?
* Does it affect desktop, mobile, or both?
* Does the problem affect all impressions or only some impressions?

The goal is to establish the scope of the problem before investigating individual components.

### Step 2 — Check the DOM

Verify that the expected ad slot actually exists on the page.

For example:

```javascript
document.getElementById("ad-sidebar")
```

If this returns `null`, the expected element does not exist in the DOM.

This immediately suggests a page implementation or configuration problem rather than a bidder or ad-server problem.

### Step 3 — Check CSS and Layout

If the ad slot exists, verify that the browser can actually display it.

Useful checks include:

```javascript
document.getElementById("ad-sidebar").offsetWidth
document.getElementById("ad-sidebar").offsetHeight
```
An element can exist in the DOM while having zero width or height.

I would also inspect the element in DevTools to check for:

* `display: none`
* `visibility: hidden`
* Zero dimensions
* Incorrect positioning
* Overflow problems
* Other elements covering the ad

### Step 4 — Check the JavaScript Console

Next, inspect the browser Console.

I would look for:

* JavaScript exceptions
* `ReferenceError`
* Configuration errors
* Failed initialization
* Unexpected warnings
* Errors occurring before the auction starts

A JavaScript runtime error can stop the ad-delivery process before any bidder requests are made.

### Step 5 — Check Network Requests

If the page and JavaScript appear healthy, inspect the Network tab.

I would look for:

* Bidder requests
* Bidder responses
* Failed requests
* HTTP errors
* Blocked requests
* Excessive response times
* Requests that never receive a response

This helps determine whether the problem occurs during communication between the browser and external services.

### Step 6 — Investigate the Auction

If bidder requests are being made, investigate the auction itself.

Questions include:

* Are the expected bidders configured?
* Are bidders returning responses?
* How quickly are they responding?
* Are bids being rejected?
* Is the auction timing out?
* Which bidders are participating?
* Which bid is winning?

This is where auction configuration and bidder latency become particularly important.

### Step 7 — Check Ad-Server Targeting

If the auction appears healthy, investigate the handoff to the ad server.

Questions include:

* Was the ad-server request made?
* Was the winning bid information passed correctly?
* Was the expected targeting generated?
* Was an eligible line item available?
* Did the ad server return a creative?

A winning header-bidding auction does not automatically guarantee that an advertisement will be displayed.

### Step 8 — Check Creative Rendering

Finally, verify that the creative actually rendered on the page.

If a valid winning bid exists but no advertisement is visible, investigate:

* Whether the creative was returned
* Whether the creative loaded correctly
* Whether the ad container has the correct dimensions
* Whether JavaScript errors prevent rendering
* Whether another page element is covering the creative

### Step 9 — Verify the Fix

After making a change, reproduce the original issue again.

The goal is to confirm that:

1. The original problem is resolved.
2. No new Console errors were introduced.
3. The auction still functions correctly.
4. The ad renders correctly.
5. The fix remains effective after a fresh page load.

### Core Principle

The troubleshooting process can be summarized as:

```text
Page
 ↓
DOM
 ↓
CSS
 ↓
JavaScript
 ↓
Network
 ↓
Auction
 ↓
Winning Bid
 ↓
Ad-Server Targeting
 ↓
Creative
 ↓
User Sees Ad
```

The key principle is:

> Identify the failure point before changing the configuration.

This makes troubleshooting more systematic, reduces unnecessary changes, and makes it easier to explain the root cause and resolution to both technical and non-technical stakeholders.
## Technical Concepts Demonstrated

This project was designed to demonstrate practical knowledge of the technologies and concepts involved in publisher-side ad delivery.

### HTML and the DOM

The project uses HTML to create the publisher webpage and define the locations where advertisements can appear.

I used JavaScript to interact with the DOM and verify that the expected ad containers exist.

Key concepts demonstrated:

- HTML elements
- Element IDs
- DOM structure
- `document.getElementById()`
- DOM validation
- Ad-slot identification

The important troubleshooting concept is that the ad configuration and the webpage implementation must agree on the placement identifiers.

### CSS and Layout

CSS controls how the simulated ad placements appear on the webpage.

The project uses CSS to define the dimensions and layout of the advertising containers.

Key concepts demonstrated:

- Width and height
- Layout
- Visibility
- Element dimensions
- CSS-related rendering problems
- Browser DevTools inspection

This is important because an ad can technically exist in the DOM while still being invisible or incorrectly displayed because of CSS.

### JavaScript

JavaScript is used to control the simulated ad-delivery process.

The project demonstrates:

- Variables
- Constants
- Arrays
- Objects
- Functions
- Loops
- Conditional logic
- Template literals
- `Promise`
- `Promise.all()`
- `setTimeout()`
- `reduce()`
- Console logging
- Error logging
- Performance measurement

JavaScript is particularly important in publisher-side AdTech because the browser is responsible for executing much of the client-side ad-delivery logic.

### Asynchronous JavaScript

The simulated bidders respond at different times.

This demonstrates asynchronous behavior in JavaScript.

For example:

```text
Bidder C → 300 ms
Bidder A → 400 ms
Bidder B → 700 ms

The browser does not simply wait for each bidder sequentially.
Instead, the simulated bidders can respond independently, allowing the auction to collect their responses.
This provides a simplified representation of how multiple demand sources can participate in a header-bidding auction.

### Promises

The auction uses JavaScript Promises to represent asynchronous bidder responses.
A simplified version of the concept is:

```javascript
new Promise(function(resolve) {
    // Wait for bidder response
    // Then resolve the Promise
});
```

`Promise.all()` can then be used to wait for multiple asynchronous operations to complete.
Understanding Promises is useful when troubleshooting JavaScript systems where multiple external requests are occurring at the same time.

### Performance Timing

The project uses:

```javascript
performance.now()
```

to measure how long the simulated auction takes.
This allows the implementation to compare:

```text
Auction start
      ↓
Bidder responses
      ↓
Auction completion
```

Measuring latency is important because slow bidder responses can affect both auction participation and webpage performance.

### Header Bidding

Header bidding allows multiple demand partners to compete for an advertising impression before the publisher's ad server makes the final decision.
In this project, the concept is simplified to:

```text
Ad Slot
   ↓
Bidder A ──┐
Bidder B ──┼──> Auction
Bidder C ──┘
   ↓
Winning Bid
```

The simulation demonstrates how bidders can return different CPM values and response times.

### CPM

CPM represents the cost per thousand impressions.
In the simulation, bidders return different CPM values:

* Bidder A → €1.20 CPM
* Bidder B → €2.10 CPM
* Bidder C → €0.80 CPM

The highest valid CPM becomes the simulated winning bid.
In a real publisher environment, however, auction mechanics and final ad-server selection are more complex than simply selecting the highest CPM.

### Auction Timeout

The auction timeout determines how long the system waits for bidder responses.
For example:

```text
500 ms timeout

Bidder C → 300 ms → participates
Bidder A → 400 ms → participates
Bidder B → 700 ms → too late
```

This demonstrates the relationship between:

* Bidder latency
* Auction participation
* Page performance
* Revenue opportunity

The goal is not simply to make the timeout as long as possible.
A Technical Account Manager needs to consider the trade-off between additional demand participation and the performance impact of waiting longer.

### Browser DevTools

The project is designed around browser-based troubleshooting using DevTools.
Important areas include:

#### Elements
Used to inspect:
* HTML
* DOM structure
* Ad-slot IDs
* CSS
* Element dimensions
* Visibility

#### Console
Used to inspect:
* JavaScript errors
* Warnings
* Auction logs
* Bid responses
* Debugging output

#### Network
Used to inspect:
* Requests
* Responses
* HTTP errors
* Request timing
* Failed or blocked requests

These tools provide evidence about where an ad-delivery problem is occurring.

### Publisher-Side AdTech Concepts

The project also demonstrates an understanding of the major stages involved in publisher-side programmatic advertising.

#### Publisher
The publisher owns the website and its advertising inventory.
Examples include:
* News websites
* Sports websites
* Entertainment websites
* Blogs
* Online magazines

The publisher's goal is generally to monetize available advertising inventory while maintaining a good user experience.

#### Ad Inventory
Ad inventory represents the available advertising opportunities on a webpage.
In this project, the inventory is represented by the simulated ad slots:

* `ad-top`
* `ad-content`
* `ad-sidebar`

#### Ad Slot
An ad slot is the location on the webpage where an advertisement can be displayed.
An ad slot typically has:
* A placement identifier
* Supported dimensions
* Position on the page
* Associated configuration

#### Demand Partner
A demand partner represents a source of advertiser demand competing for the publisher's inventory.
In this project, the demand partners are simulated as:
* Bidder A
* Bidder B
* Bidder C

Each bidder returns a simulated bid.

#### Winning Bid
The winning bid represents the demand source selected by the simulated auction.
The project selects the highest valid CPM among the bids that successfully participate in the auction.

#### Ad Server
An ad server is responsible for making the final decision about which eligible advertisement should be delivered to the publisher's page.
In real-world publisher environments, the ad server also interacts with concepts such as:
* Line items
* Targeting
* Creatives
* Campaigns
* Pricing
* Inventory

This project only simulates the conceptual handoff to the ad-server stage.

#### Creative
The creative is the actual advertisement that is displayed to the user.
Even when an auction succeeds, the troubleshooting process still needs to verify that the creative actually renders correctly.

### Why These Concepts Matter for a Technical Account Manager

A Technical Account Manager does not necessarily need to write an entire ad-tech platform from scratch.
The important skill is understanding how the components interact and being able to determine where something is failing.
For example:

```text
Publisher says:
"My ad isn't showing."
        ↓
Is the ad slot present?
        ↓
Is it visible?
        ↓
Did JavaScript initialize?
        ↓
Were bidder requests sent?
        ↓
Did bidders respond?
        ↓
Did they respond before the timeout?
        ↓
Was there a winning bid?
        ↓
Was targeting passed correctly?
        ↓
Did the ad server return a creative?
        ↓
Did the creative render?
```

This project was built to demonstrate that troubleshooting mindset.

## Connection to Prebid.js and Google Ad Manager

This project uses a local simulation rather than a production advertising stack.

However, the concepts are intentionally based on the workflow encountered when troubleshooting real publisher-side implementations using technologies such as Prebid.js and Google Ad Manager.

---

### Prebid.js

Prebid.js is an open-source header-bidding framework commonly used by publishers to allow multiple demand partners to compete for advertising inventory.

A simplified real-world flow looks like:

```text
Publisher Page
      |
      v
Prebid.js
      |
      +---- Bidder A
      |
      +---- Bidder B
      |
      +---- Bidder C
      |
      v
Bid Responses
      |
      v
Winning Bid
      |
      v
Ad Server
```
The project simulates this process with JavaScript rather than using the actual Prebid.js library.
The simulated bidders represent the concept of multiple demand partners competing for an impression.

### What Would Be Investigated in a Real Prebid.js Implementation?

If a publisher reported that Prebid was not working correctly, I would investigate the implementation systematically.

Useful areas to inspect include:

* Whether Prebid.js loaded correctly
* Whether the expected ad units exist
* Whether bidders are configured correctly
* Whether the auction starts
* Whether bidder requests are sent
* Whether bidders return responses
* Bidder response times
* Auction timeout
* Winning bids
* Ad-server targeting

For example, a real Prebid.js implementation exposes debugging information through the `pbjs` object.

Useful diagnostic commands can include:

* `pbjs.version` — to check the Prebid version.
* `pbjs.getConfig()` — to inspect configuration.
* `pbjs.adUnits` — to inspect configured ad units.
* `pbjs.getBidResponses()` — to inspect bidder responses.
* `pbjs.getAllWinningBids()` — to inspect winning bids.
* `pbjs.getAdserverTargeting()` — to inspect the targeting generated for the ad server.

These commands provide examples of the type of browser-side evidence that can be used to identify where an auction is failing.

### Google Ad Manager

Google Ad Manager (GAM) is commonly used by publishers as their ad server.

The simplified relationship between header bidding and GAM can be represented as:

```text
Prebid.js
    |
    v
Winning Bid
    |
    v
Ad-Server Targeting
    |
    v
Google Ad Manager
    |
    v
Eligible Line Item
    |
    v
Creative
    |
    v
User
```

The actual production process is more complex, but this model is useful when troubleshooting.

### What Would Be Investigated in GAM?

If Prebid appeared healthy but the advertisement was still not displaying, I would move the investigation downstream into the ad-server stage.

Questions would include:

* Was the ad-server request made?
* Was the expected targeting passed?
* Was the appropriate line item eligible?
* Was the price/targeting information correct?
* Did the ad server select a line item?
* Was a creative returned?
* Did the creative load correctly?
* Did the creative render correctly on the page?

This helps separate a header-bidding problem from an ad-server problem.

### Example Troubleshooting Scenario

Imagine a publisher reports:

> *"Bidder B used to generate revenue, but we stopped seeing bids from them."*

I would approach the issue systematically.

#### Step 1 — Confirm the Problem
Determine whether Bidder B is actually missing from the auction.

Questions:
* Is the issue reproducible?
* Does it affect all pages?
* Does it affect all placements?
* When did the problem begin?

#### Step 2 — Check the Console
Look for:
* JavaScript errors
* Prebid initialization errors
* Bidder configuration errors
* Auction-related warnings

#### Step 3 — Check Network Requests
Determine whether a request to Bidder B is being sent.

There are two very different situations:

```text
No request
    ↓
Likely configuration / initialization issue
```

*versus:*

```text
Request sent
    ↓
No response / failed response
    ↓
Likely network, endpoint, timeout, or bidder-side issue
```

#### Step 4 — Check Response Time
If Bidder B is responding, compare its response time against the auction timeout.

For example:
* Auction timeout: 500 ms
* Bidder B response: 700 ms

The bidder may be functioning correctly but consistently missing the auction deadline.

#### Step 5 — Check Bid Responses
If the request succeeds and the response arrives before the timeout, investigate whether the response contains a valid bid.

#### Step 6 — Compare With Other Bidders
If other bidders are returning normally, this provides additional evidence that the problem may be isolated to Bidder B rather than the entire auction.

#### Step 7 — Determine the Root Cause
Only after collecting this evidence would I recommend a configuration change or escalate the issue.

Possible conclusions could include:
* Configuration problem
* Network/request failure
* Bidder response problem
* Timeout problem
* Invalid bid response

This is the type of structured investigation I would apply when troubleshooting a publisher issue.

### Production vs. Simulation

It is important to distinguish what this project actually implements from what it is designed to teach.

| Concept | This Project | Production Example |
| :--- | :--- | :--- |
| Publisher webpage | Simulated | Real publisher website |
| Ad slots | Implemented | Publisher ad units |
| DOM validation | Implemented | Browser/DevTools |
| CSS validation | Demonstrated | Browser/DevTools |
| JavaScript auction | Simulated | Prebid.js |
| Bidders | Simulated | Real demand partners |
| Auction timeout | Simulated | Prebid configuration |
| Winning bid | Simulated | Prebid auction |
| Ad-server targeting | Simulated concept | GAM targeting |
| Ad server | Simulated concept | Google Ad Manager |
| Creative | Simulated | Real advertiser creative |
| Troubleshooting methodology | Demonstrated | Production workflow |

The purpose is not to claim production-level Prebid.js or GAM implementation experience.
The purpose is to demonstrate that I understand the architecture, terminology, debugging process, and relationships between the different components.

### Key Takeaway

The most important lesson from this project is that an ad-delivery problem should not automatically be treated as a demand problem.

A missing advertisement can originate at many different layers:

```text
HTML
 ↓
DOM
 ↓
CSS
 ↓
JavaScript
 ↓
Network
 ↓
Header Bidding
 ↓
Auction Timeout
 ↓
Winning Bid
 ↓
Ad-Server Targeting
 ↓
Ad Server
 ↓
Creative
 ↓
Rendering
```
## Conclusion

This project demonstrates a practical approach to understanding and troubleshooting publisher-side ad delivery. By building the system from the webpage and ad slots upward, I was able to explore how HTML, CSS, JavaScript, asynchronous auctions, bidder latency, timeouts, targeting, and rendering interact within an advertising workflow.

The main takeaway is that effective AdTech troubleshooting is about isolating the failure point rather than immediately changing configuration. This project reflects the approach I would bring to a Technical Account Manager role: reproduce the issue, gather evidence, identify the root cause, communicate the resolution clearly, and verify that the fix works without introducing new problems.
