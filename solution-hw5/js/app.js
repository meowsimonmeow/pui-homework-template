let currentRollBasePrice = 2.49;
let rollType = "";
let cart = [];

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
    //found the way to get the glazeSelectorText here: https://stackoverflow.com/questions/14976495/get-selected-option-text-with-javascript
    let glazeSelector = document.querySelector("#glazes");
    let glazeSelectorText= glazeSelector.options[glazeSelector.selectedIndex].text;

    let sizeSelector = document.querySelector("#sizes");
    let sizeSelectorText= sizeSelector.options[sizeSelector.selectedIndex].text;

    let cartRoll = new Roll(rollType, glazeSelectorText, sizeSelectorText, currentRollBasePrice)
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