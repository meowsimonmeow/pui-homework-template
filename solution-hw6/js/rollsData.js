class Roll {
    constructor(rollType, rollGlazing, packSize, basePrice) {
        this.type = rollType;
        this.glazing =  rollGlazing;
        this.size = packSize;
        this.basePrice = basePrice;
    }
}

const rolls = {
    "Original": {
        "basePrice": 2.49,
        "imageFile": "original-cinnamon-roll.jpg"
    },
    "Apple": {
        "basePrice": 3.49,
        "imageFile": "apple-cinnamon-roll.jpg"
    },
    "Raisin": {
        "basePrice": 2.99,
        "imageFile": "raisin-cinnamon-roll.jpg"
    },
    "Walnut": {
        "basePrice": 3.49,
        "imageFile": "walnut-cinnamon-roll.jpg"
    },
    "Double-Chocolate": {
        "basePrice": 3.99,
        "imageFile": "double-chocolate-cinnamon-roll.jpg"
    },
    "Strawberry": {
        "basePrice": 3.99,
        "imageFile": "strawberry-cinnamon-roll.jpg"
    }    
};

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