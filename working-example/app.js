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
