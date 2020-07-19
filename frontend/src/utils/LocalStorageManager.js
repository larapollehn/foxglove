import log from "./Logger";

class LocalStorageManager{
    constructor() {
        this.jwtKey = "jwt";
        this.cartKey = "cart";
    }

    /**
     * saves the jwt token from the user as String to localStorage
     * Token is received after user login
     * @param data
     */
    saveUser(data){
        log.debug("User token saved as jwt in localstorage");
        localStorage.setItem(this.jwtKey, JSON.stringify(data));
    }

    /**
     * @returns Object containing jwt token and user info
     */
    getUser(){
        if(localStorage.getItem(this.jwtKey) !== null){
            return JSON.parse(localStorage.getItem(this.jwtKey));
        } else {
            return false;
        }

    }

    /**
     * removes users jwt token from localStorage
     * after logout from user
     */
    removeUser(){
        log.debug("User token was removed from localstorage");
        localStorage.removeItem(this.jwtKey);
    }

    /**
     * @returns Object containing cart of user and products in it
     */
    getCart(){
        if(localStorage.getItem(this.cartKey) !== null){
            return JSON.parse(localStorage.getItem(this.cartKey));
        } else {
            return false;
        }
    }

    /**
     * saves the cart from the user as String to localStorage
     * @param data
     */
    saveCart(data){
        log.debug("User cart saved in localstorage");
        localStorage.setItem(this.cartKey, JSON.stringify(data));
    }


}

const localStorageManager = new LocalStorageManager();
export default localStorageManager;
