let currentRollBasePrice = 2.49;
let rollType = "";
let cart = [];

class Roll {
    constructor(rollType, rollGlazing, packSize, basePrice) {
        this.type = rollType;
        this.glazing =  rollGlazing;
        this.size = packSize;
        this.basePrice = basePrice;
    }
}

let allRolls = [
    {
        type: "Keep original",
        glazingPrice: 0
    },
    {
        type: "Sugar milk",
        glazingPrice: 0
    },
    {
        type: "Vanilla milk",
        glazingPrice: .5
    },
    {
        type: "Double chocolate",
        glazingPrice: 1.5
    }
];

let allSizes = [
    {
        size: 1,
        packPrice: 1
    },
    {
        size: 3,
        packPrice: 3
    },
    {
        size: 6,
        packPrice: 5
    },
    {
        size: 12,
        packPrice: 10
    }
];

function updateOptions(){
    let glazeOptions = document.querySelector("#glazes");
    let sizeOptions = document.querySelector("#sizes");


    for (i = 0; i < 4; i++){
        glazeOptions.innerHTML += `<option value = ${allRolls[i].glazingPrice}>${allRolls[i].type}</option>`;
        sizeOptions.innerHTML += `<option value = ${allSizes[i].packPrice}>${allSizes[i].size}</option>`;
    }
}

//this is modified from the provided skeleton code
function glazingChange(element) {

    const priceChange = parseFloat(element.value);
    
    let rollPrice = document.querySelector("#price");
    rollPrice.innerHTML = "$" + (Math.round(((currentRollBasePrice + priceChange) * document.querySelector("#sizes").value) * 100)/100).toFixed(2);
  }  

function sizeChange(element) {

    const sizeMultiplier = parseFloat(element.value);
    
    let rollPrice = document.querySelector("#price");
    rollPrice.innerHTML = "$" + (Math.round(((currentRollBasePrice + parseFloat(document.querySelector("#glazes").value)) * sizeMultiplier) * 100)/100).toFixed(2);
  }  

function addToCart(){
    let cartRoll = new Roll(rollType, document.querySelector("#glazes"), document.querySelector("#sizes").value, currentRollBasePrice)
    cart.push(cartRoll);
    console.log(cart);
}

window.addEventListener("load", function() {

    //this is from the provided HW4 code
    const queryString = window.location.search;
    const params = new URLSearchParams(queryString);
    rollType = params.get('roll');
    let currentRollData = rolls[rollType];
    document.querySelector("#handmade-title").innerText = rollType + " Cinnamon Roll";
    document.querySelector(".product-detail-image").src = "../assets/products/" + currentRollData["imageFile"];
    document.querySelector("#price").innerText = "$" + currentRollData["basePrice"];
    currentRollBasePrice = currentRollData["basePrice"];
    updateOptions();
    document.querySelector("#add-to-cart").addEventListener("click", addToCart);
});