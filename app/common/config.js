import Config from "../config/config.json";

export default class config {

    static version() {
        return Config.version;
    }

    static GACode() {
        return Config["gacode"];
    }

    static domain() {
        return Config["domain"];
    }

}
