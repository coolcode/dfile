export default class convert {
	static second2string(timer) {
		var hour = Math.floor(timer / 3600),
			minute = Math.floor(timer / 60) % 60,
			second = (timer % 60) + "",
			second = second.length > 1 ? second : "0" + second;

		let currentTime = minute + ":" + second;
		if (hour > 0) {
			if (minute < 10) {
				currentTime = "0" + currentTime;
			}
			currentTime = hour + ":" + currentTime;
		}
		return currentTime;
	}

	static toTimespan(v) {
		if (v < 60) {
			return v + " m";
		}

		if (v < 1440) {
			return Math.floor(v / 60) + " h " + (v % 60) + " m";
		}

		if (v == 1440) {
			return "1 day";
		}

		return (
			Math.floor(v / 1440) + " d " + Math.floor((v % 1440) / 60) + " h"
		);
	}

	/**
	 * Function to sort alphabetically an array of objects by some specific key.
	 *
	 * @param {String} property Key of the object to sort.
	 */
	static dynamicSort(property) {
		var sortOrder = 1;

		if (property[0] === "-") {
			sortOrder = -1;
			property = property.substr(1);
		}

		return function(a, b) {
			if (sortOrder == -1) {
				return b[property].localeCompare(a[property]);
			} else {
				return a[property].localeCompare(b[property]);
			}
		};
	}

	static array(v){
		return Object.values(v);
	}
}
