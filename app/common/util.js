
export default class util {

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