let cart = [];

function basePriceCalculation(rollType, rollGlazing){
    let basePrice = rolls[rollType]["basePrice"];
    let glazePrice = 0;
    for(let i = 0; i < allRolls.length; i++){
        if(allRolls[i]["type"] === rollGlazing){
            glazePrice = allRolls[i]["glazingPrice"];
        }
    }
    basePrice += glazePrice;
    return basePrice;
}

function cartCalculatedPrice(roll){
    let packSize = 0;
    for(let i = 0; i < allSizes.length; i++){
        if(allSizes[i]["size"] === roll.size){
            packSize = allSizes[i]["packPrice"];
        }
    }
    return ((roll.basePrice * packSize).toFixed(2))
}

//I got the skeleton of this code from https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_templates_and_slots
function displayCartRoll(roll, index){
    let template = document.querySelector("#cart-item-template");
    let templateContent = template.content.cloneNode(true);
    templateContent.querySelector(".shopping-cart-image").src = "../assets/products/" + rolls[roll.type]["imageFile"];
    templateContent.querySelector(".cart-name").innerText = roll.type + " Cinnamon Roll";
    templateContent.querySelector(".cart-glaze").innerText = roll.glazing;
    templateContent.querySelector(".cart-pack").innerText = "Pack size: " + roll.size;
    templateContent.querySelector(".cart-price").innerText = "$ " + cartCalculatedPrice(roll);
    console.log(cartCalculatedPrice(roll));
    templateContent.querySelector(".remove").addEventListener("click", function(){removeItem(index)})
    let cartHTML = document.querySelector(".carts");
    cartHTML.appendChild(templateContent);
}

function calculateTotalPrice(){
    let sum = 0;
    for(let i = 0; i < cart.length; i++){
        sum += parseFloat(cartCalculatedPrice(cart[i]));
    }
    return "$ " + sum.toFixed(2);
}

 function displayCart(){
    let cartHTML = document.querySelector(".carts");
    cartHTML.innerHTML = "";
    for(let i = 0; i < cart.length; i++){
        displayCartRoll(cart[i], i);
    }
    let horizontalRule = document.createElement("hr");
    horizontalRule.id = "bottom-line";
    cartHTML.appendChild(horizontalRule);
 }

 function removeItem(index){
    cart.splice(index, 1);
    let cartStore = JSON.stringify(cart);
    localStorage.setItem("cartStore", cartStore);
    document.querySelector("#price-number").innerText = calculateTotalPrice();
    displayCart();
 }

 window.addEventListener("load", function() {
    
    let cartGet = localStorage.getItem("cartStore");
    if(cartGet === null){
        cart = [];
    }
    else{
        let cartParse = JSON.parse(cartGet);
        cart = cartParse;
    }
    console.log(cart);

    displayCart();
    document.querySelector("#price-number").innerText = calculateTotalPrice();

});




