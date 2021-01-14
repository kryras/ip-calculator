/* eslint-disable no-unused-vars */
export default class HostAddress {
  constructor(ip, netmask) {
    this.ip = ip;
    this.netmask = netmask;
    this.subnetList = [
      { key: "255.255.0.0 /16", value: [255, 255, 0, 0], bits: 16 },
      { key: "255.255.192.0 /18", value: [255, 255, 192, 0], bits: 17 },
      { key: "255.255.128.0 /17", value: [255, 255, 128, 0], bits: 18 },
      { key: "255.255.224.0 /19", value: [255, 255, 224, 0], bits: 19 },
      { key: "255.255.240.0 /20", value: [255, 255, 240, 0], bits: 20 },
      { key: "255.255.248.0 /21", value: [255, 255, 248, 0], bits: 21 },
      { key: "255.255.252.0 /22", value: [255, 255, 252, 0], bits: 22 },
      { key: "255.255.254.0 /23", value: [255, 255, 254, 0], bits: 23 },
      { key: "255.255.255.0 /24", value: [255, 255, 255, 0], bits: 24 },
      { key: "255.255.255.128 /25", value: [255, 255, 255, 128], bits: 25 },
      { key: "255.255.255.192 /26", value: [255, 255, 255, 192], bits: 26 },
      { key: "255.255.255.224 /27", value: [255, 255, 255, 224], bits: 27 },
      { key: "255.255.255.240 /28", value: [255, 255, 255, 240], bits: 28 },
      { key: "255.255.255.248 /29", value: [255, 255, 255, 248], bits: 29 },
      { key: "255.255.255.252 /30", value: [255, 255, 255, 252], bits: 30 }
    ];
  }

  caclulateNetworkAddress(ipAddress, netmaskAddress) {
    if (
      ipAddress === undefined ||
      netmaskAddress === undefined ||
      ipAddress.length === 0 ||
      netmaskAddress.length === 0 ||
      ipAddress === [] ||
      netmaskAddress === []
    ) {
      this.network = [];
      for (let i = 0; i < 4; i++) {
        this.network[i] = parseInt(
          this.byteString(this.ip[i] & this.netmask[i]),
          2
        );
      }
      return this.network;
    } else {
      {
        let network = [];
        for (let i = 0; i < 4; i++) {
          network[i] = parseInt(
            this.byteString(ipAddress[i] & netmaskAddress[i]),
            2
          );
        }
        return network;
      }
    }
  }

  caclulateBroadcastAddress(ipAddress, netmaskAddress) {
    var replaceChars = { "0": "1", "1": "0" };
    if (
      ipAddress === undefined ||
      netmaskAddress === undefined ||
      ipAddress.length === 0 ||
      netmaskAddress.length === 0 ||
      ipAddress === [] ||
      netmaskAddress === []
    ) {
      this.broadcast = [];
      for (let i = 0; i < 4; i++) {
        this.broadcast[i] =
          this.ip[i] |
          parseInt(
            this.byteString(this.netmask[i]).replace(/0|1/g, function(match) {
              return replaceChars[match];
            }),
            2
          );
      }
      return this.broadcast;
    } else {
      let broadcast = [];
      for (let i = 0; i < 4; i++) {
        broadcast[i] =
          ipAddress[i] |
          parseInt(
            this.byteString(netmaskAddress[i]).replace(/0|1/g, function(match) {
              return replaceChars[match];
            }),
            2
          );
      }
      return broadcast;
    }
  }

  calculateHostMin(networkAddress) {
    if (
      networkAddress === undefined ||
      networkAddress.length === 0 ||
      networkAddress === []
    ) {
      this.hostMinimum = [...this.network];
      this.hostMinimum[3] = this.hostMinimum[3] + 1;
      return this.hostMinimum;
    } else {
      let hostMinimum = [...networkAddress];
      hostMinimum[3] = hostMinimum[3] + 1;
      return hostMinimum;
    }
  }

  calculateHostMax(broadcastAddress) {
    if (
      broadcastAddress === undefined ||
      broadcastAddress.length === 0 ||
      broadcastAddress === []
    ) {
      this.hostMaximum = [...this.broadcast];
      this.hostMaximum[3] = this.hostMaximum[3] - 1;
      return this.hostMaximum;
    } else {
      let hostMaximum = [...broadcastAddress];
      hostMaximum[3] = hostMaximum[3] - 1;
      return hostMaximum;
    }
  }

  calculateNumberOfHosts(netmaskAddress) {
    if (
      netmaskAddress === undefined ||
      netmaskAddress.length === 0 ||
      netmaskAddress === []
    ) {
      this.hostsTotal =
        Math.pow(
          2,
          32 -
            this.netmask
              .map(a => {
                return a.toString(2).split("1").length - 1;
              })
              .reduce((x, y) => {
                return x + y;
              })
        ) - 2;
      return this.hostsTotal;
    } else {
      let hostsTotal = [];
      hostsTotal =
        Math.pow(
          2,
          32 -
            netmaskAddress
              .map(a => {
                return a.toString(2).split("1").length - 1;
              })
              .reduce((x, y) => {
                return x + y;
              })
        ) - 2;
      return hostsTotal;
    }
  }

  byteString(n) {
    return ("000000000" + n.toString(2)).substr(-8);
  }
}
