const getIp = () => {
    // return "localhost";
    const ni = require("os").networkInterfaces();
    if (ni.hasOwnProperty("eth0")) {
        for (const i in ni.eth0) {
            if (ni.eth0[i].family === "IPv4") {
                return ni.eth0[i].address;
            }
        }
    } else if (ni.hasOwnProperty("wlan0")) {
        for (const i in ni.wlan0) {
            if (ni.wlan0[i].family === "IPv4") {
                return ni.wlan0[i].address;
            }
        }
    } else if (ni.hasOwnProperty("en1")) {
        for (const i in ni.en1) {
            if (ni.en1[i].family === "IPv4") {
                return ni.en1[i].address;
            }
        }
    } else if (ni.hasOwnProperty("en0")) {
        for (const i in ni.en0) {
            if (ni.en0[i].family === "IPv4") {
                return ni.en0[i].address;
            }
        }
    }
    return "localhost";
};

exports.WDS_HOST = process.env.WDS_HOST || getIp();
