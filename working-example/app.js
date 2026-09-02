console.log("Publisher Ad Delivery Lab loaded");


const adSlots = [
    {
        code: "ad-top",
        sizes: [[728, 90]]
    },
    {
        code: "ad-content",
        sizes: [[300, 250]]
    },
    {
        code: "ad-sidebar",
        sizes: [[300, 250]]
    }
];


console.log("Configured ad slots:");
console.table(adSlots);console.log("Checking ad slot elements...");


adSlots.forEach(function(slot) {

    const element =
        document.getElementById(slot.code);

    if (element) {

        console.log(
            `Ad slot found: ${slot.code}`
        );

    } else {

        console.error(
            `Ad slot NOT found: ${slot.code}`
        );

    }

});

const bidders = [
    {
        name: "BidderA",
        responseTime: 400,
        cpm: 1.20
    },

    {
        name: "BidderB",
        responseTime: 700,
        cpm: 2.10
    },

    {
        name: "BidderC",
        responseTime: 300,
        cpm: 0.80
    }
];


console.log("Configured bidders:");
console.table(bidders);

function runAuction() {

    const AUCTION_TIMEOUT = 800;

    console.log("=================================");
    console.log("HEADER BIDDING AUCTION STARTED");
    console.log("=================================");

    const auctionStart = performance.now();

    const bidPromises = bidders.map(function(bidder) {

        return new Promise(function(resolve) {

            setTimeout(function() {

                const bid = {
                    bidder: bidder.name,
                    cpm: bidder.cpm,
                    responseTime: bidder.responseTime
                };

                console.log(
                    `${bidder.name} responded with €${bidder.cpm} CPM`
                );

                resolve(bid);

            }, bidder.responseTime);

        });

    });

    return Promise.all(
        bidPromises.map(function(promise, index) {

            return Promise.race([

                promise,

                new Promise(function(resolve) {

                    setTimeout(function() {

                        resolve(null);

                    }, AUCTION_TIMEOUT);

                })

            ]);

        })

    )
    .then(function(results) {

        const bids = results.filter(function(bid) {

            return bid !== null;

        });

        const auctionDuration =
            Math.round(
                performance.now() - auctionStart
            );

        console.log(
            `Auction completed in ${auctionDuration}ms`
        );

        console.log("Valid bids before timeout:");

        console.table(bids);

        return bids;
    });
}

runAuction()
    .then(function(bids) {

        console.log("Auction bids available:");
        console.table(bids);

        const winner = selectWinningBid(bids);

        console.log(
            "selected winner:",
            winner  
        );

        const targeting =
    buildAdServerTargeting(winner);
renderAd(winner);

console.log(
    "Final targeting:",
    targeting
);

    });

    function selectWinningBid(bids) {

    if (bids.length === 0) {

        console.warn(
            "No valid bids received."
        );

        return null;
    }


    const winningBid =
        bids.reduce(function(highest, current) {

            if (current.cpm > highest.cpm) {
                return current;
            }

            return highest;

        });


    console.log("=================================");
    console.log("WINNING BID");
    console.log("=================================");


    console.log(
        `Winner: ${winningBid.bidder}`
    );


    console.log(
        `Winning CPM: €${winningBid.cpm}`
    );


    return winningBid;
}

function buildAdServerTargeting(winningBid) {

    if (!winningBid) {

        console.warn("No winning bid. No ad-server targeting created.");

        return null;
    }

    const targeting = {
        hb_bidder: winningBid.bidder,
        hb_cpm: winningBid.cpm.toFixed(2),
        hb_adid: `${winningBid.bidder}-${Date.now()}`
    };

    console.log("Ad-server targeting generated:");
    console.table(targeting);

    return targeting;
}

function renderAd(winningBid) {

    if (!winningBid) {

        console.warn("No winning bid. Ad will not render.");

        return;
    }

    const adElement =
        document.getElementById("ad-top");

    if (!adElement) {

        console.error(
            "Ad rendering failed: ad-top element not found."
        );

        return;
    }

    adElement.innerHTML = `
        <div style="
            width:100%;
            height:90px;
            display:flex;
            align-items:center;
            justify-content:center;
            background:#ddd;
            border:1px solid #999;
            font-family:Arial,sans-serif;
        ">
            Simulated Ad — ${winningBid.bidder} — €${winningBid.cpm.toFixed(2)} CPM
        </div>
    `;

    console.log(
        `Ad rendered successfully using ${winningBid.bidder}`
    );
}