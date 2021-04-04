function myTime() {
    this.raw = new Date()
    this.hours = (this.raw.getHours() < 10 ? "0" : "")  + this.raw.getHours()
    this.minutes = (this.raw.getMinutes() < 10 ? "0" : "")  + this.raw.getMinutes()
    this.current = `${this.hours}:${this.minutes}`
}

function getHostIP() {
    // https://www.npmjs.com/package/local-devices
    const os = require('os');
    const ifaces = os.networkInterfaces();

    Object.keys(ifaces).forEach(function (ifname) {
        var alias = 0;

        ifaces[ifname].forEach(function (iface) {
            if ('IPv4' !== iface.family || iface.internal !== false) {
                // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
                return;
            }

            if (alias >= 1) {
                // this single interface has multiple ipv4 addresses
                console.log(ifname + ':' + alias, iface.address);
            } else {
                // this interface has only one ipv4 adress
                console.log(ifname, iface.address);
            }
            ++alias;
        });
    });
}
