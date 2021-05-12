"use strict";
const restaurant = {
    name: "Classico Italiano",
    location: "mirpu-14",
    categories: ["Italian", "Vegetarian", "Organic"],
    starterMenu: ["Focaccia", "Bruschetta", "Garlic Bread"],
    mainMenu: ["Pizza", "pasta", "Risotto"],
    order: function (i1, i2) {
        return [this.starterMenu[i1], this.mainMenu[i2]];
    },
    obj: {
        open: 11,
        close: 13,
    },
    orderDelivery: function (ind2, t, ind) {
        console.log(ind2);
        console.log( t);
        console.log( ind);
    },
};

restaurant.orderDelivery({
    ind1: "1.05",
    time: "22.00",
    ind2: 5,
},
    {
        ind1: "1.05",
        time: "22.00",
        ind2: 5,
    },
    {
        ind1: "1.05",
        time: "22.00",
        ind2: 5,
    });
