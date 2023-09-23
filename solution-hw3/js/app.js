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
    // get value of selected glazing option
    const priceChange = element.value;
    
    let basePrice = 2.49
    let rollPrice = document.querySelector("#price");
    rollPrice.innerHTML = (basePrice + priceChange) * document.querySelector("#sizes").value;
  }  

// function updatePrice() {
//     let basePrice = 2.49
//     let rollPrice = document.querySelector("#price");
//     rollPrice.innerHTML = (basePrice + glazingPrice) * packPrice;
// }

window.addEventListener("load", function() {
    updateOptions();
});