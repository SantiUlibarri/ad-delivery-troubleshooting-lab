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

    console.log("=================================");
    console.log("HEADER BIDDING AUCTION STARTED");
    console.log("=================================");


    const auctionStart =
        performance.now();


    const bidPromises =
        bidders.map(function(bidder) {

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

    return Promise.all(bidPromises)
        .then(function(bids) {

            const auctionDuration =
                Math.round(
                    performance.now() - auctionStart
                );


            console.log(
                `Auction completed in ${auctionDuration}ms`
            );


            console.log("Received bids:");
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