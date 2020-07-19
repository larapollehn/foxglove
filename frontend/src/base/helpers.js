import localStorageManager from "../utils/LocalStorageManager";

export const prices = [
    {
        _id: 0,
        name: "Any",
        array: [0,100]
    },
    {
        _id: 1,
        name: "<5€",
        array: [0, 5]
    },
    {
        _id: 2,
        name: "5€ - 10€",
        array: [5, 10]
    },
    {
        _id: 3,
        name: "10€ - 20€",
        array: [10, 20]
    },
    {
        _id: 4,
        name: "20€ - 30€",
        array: [20, 30]
    },
    {
        _id: 5,
        name: "30€ - 40€",
        array: [30, 40]
    },
    {
        _id: 6,
        name: ">40€",
        array: [40,100]
    }
]

export const addItemToCart = (item, next) => {
    let cart = [];
    if(localStorageManager.getCart()){
        cart = localStorageManager.getCart();
    }
    cart.push({
        ...item, count: 1
    })

    //removes duplicate entries for the same product
    cart = Array.from(new Set(cart.map(product => product._id))).map(id => {
        return cart.find(product => product._id === id)
    })
    localStorageManager.saveCart(cart);
    next();
}
