function listenPurchase() {
    document.addEventListener("click", () => {
        console.log("Main content script run");
        productName = document.getElementById("productTitle")?.innerHTML;
        currentpurchaseButton = document.getElementById('add-to-cart-button');
        console.log("productName", productName);

        if (currentpurchaseButton) {
            currentpurchaseButton.addEventListener('click', function () {
                chrome.runtime.sendMessage({ message: 'openNewTab', url: `https://near.org/embed/armsveshack.near/widget/MotemaWRLD?productName=${productName}` });
            });
            chrome.runtime.sendMessage({message: 'changeIcon', color: 'green'});
        }

    })

}

function sendRefreshRequiredRequest() {
    // noinspection JSUnresolvedFunction,JSUnresolvedVariable
    chrome.runtime.sendMessage({ msg: REFRESH_REQUIRED_REQUEST });
    console.log("MSG SENT");

}

listenPurchase();
