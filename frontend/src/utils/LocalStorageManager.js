import log from "./Logger";

class LocalStorageManager{
    constructor() {
        this.key = "jwt";
    }

    /**
     * saves the jwt token from the user as String to localStorage
     * Token is received after user login
     * @param data
     */
    saveUser(data){
        log.debug("User token saved as jwt in localstorage");
        localStorage.setItem(this.key, JSON.stringify(data));
    }

    /**
     * @returns JSON Object containing jwt token and user info
     */
    getUser(){
        log.debug("User token retrieved from localstorage");
        if(localStorage.getItem(this.key) !== null){
            return JSON.parse(localStorage.getItem(this.key));
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
        localStorage.removeItem(this.key);
    }
}

const localStorageManager = new LocalStorageManager();
export default localStorageManager;
