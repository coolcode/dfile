import config from "./config";
import qs from "qs";

export default class util {
    static sleep(ms) {
        return new Promise((resolve, reject) => setTimeout(resolve, ms));
    }

    static qs(urlPath) {
        //console.log("urlPath:", urlPath);
        let ind = urlPath.indexOf("?");
        let reqParam = ind >= 0 ? urlPath.substr(ind + 1) : urlPath;
        //console.log("reqParam:", reqParam);
        return qs.parse(reqParam);
    }

    static fullUrl(urlPath) {
        return `${config.domain()}${urlPath}`;
    }


    static setItem(key, value) {
        if (window.localStorage) {
            try {
                window.localStorage.setItem(key, value);
            } catch (e) {
                // f.log('failed to set value for key "' + key + '" to localStorage.');
            }
        }
    }

    static getItem(key) {
        if (window.localStorage) {
            try {
                return window.localStorage.getItem(key);
            } catch (e) {
                // f.log('failed to get value for key "' + key + '" from localStorage.');
            }
        }
        return undefined;
    }

}