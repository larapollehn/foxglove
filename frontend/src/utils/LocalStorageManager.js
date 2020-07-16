import log from "./Logger";

class LocalStorageManager{
    constructor() {
        this.key = "jwt";
    }

    saveUser(data){
        log.debug("User token saved as jwt in localstorage")
        localStorage.setItem(this.key, JSON.stringify(data));
    }

    getUser(){
        log.debug("User token retrieved from localstorage")
        return localStorage.getItem(this.key);
    }
}

const localStorageManager = new LocalStorageManager();
export default localStorageManager;
