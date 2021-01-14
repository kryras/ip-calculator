/* eslint-disable no-unused-vars */
import HostAddress from "./HostAddress.js";

export default class SubnetHostAddress extends HostAddress {
  constructor(ip, netmask, subnets) {
    super(ip, netmask);
    this.subnets = subnets;
    this.subnets.sort((a, b) => {
      if (a.number + a.additional > b.number + b.additional) {
        return -1;
      }
      if (b > a) {
        return 1;
      }
      return 0;
    });
  }

  calculateNetmaskForNHosts() {
    this.result = [];
    let newMask = [...this.netmask];
    for (let i = 0; i < this.subnets.length; i++) {
      let subnetClass = {};
      for (var x = 1; x <= 32; x++) {
        if (Math.pow(2, x) > this.subnets[i].number + this.subnets[i].additional) break;
      }
      let subnetMask = this.netmask.map((x) => { return this.byteString(x) }).join(".");
      let numberOfBits = this.subnetList.find(mask => JSON.stringify(mask.value) === JSON.stringify(newMask)).bits;
      for (let bits = 0; bits < 32 - numberOfBits - x; bits++) {
        subnetMask = subnetMask.replace("0", "1");
      }
      let subnetMaskDecimal = subnetMask.split(".").map((x) => { return parseInt(x, 2) });
      subnetClass.subnetMask = subnetMaskDecimal;

      var ip;
      if (i > 0) {
        ip = [...this.result[i - 1].broadcast];
        if (ip[3] === 255 && ip[2] === 255 && ip[1] === 255) {
          ip[0] = ip[0] + 1;
          ip[1] = 0;
          ip[2] = 0;
          ip[3] = 0;
        } else if (ip[3] === 255 && ip[2] === 255) {
          ip[1] = ip[1] + 1;
          ip[2] = 0;
          ip[3] = 0;
        } else if (ip[3] === 255) {
          ip[2] = ip[2] + 1;
          ip[3] = 0;
        } else {
          ip[3] = ip[3] + 1;
        }
      } else {
        ip = [...this.ip];
      }
      subnetClass.network = [];
      subnetClass.network = this.caclulateNetworkAddress(
        ip,
        subnetClass.subnetMask
      );

      subnetClass.broadcast = [];
      subnetClass.broadcast = this.caclulateBroadcastAddress(
        ip,
        subnetClass.subnetMask
      );

      subnetClass.hostMinimum = this.calculateHostMin(subnetClass.network);

      subnetClass.hostMaximum = this.calculateHostMax(subnetClass.broadcast);

      subnetClass.hostsTotal = this.calculateNumberOfHosts(subnetMaskDecimal);

      var frstAdrs = "";
      var lstAdrs = "";
      var y = subnetClass.hostMinimum;
      var w = subnetClass.hostMaximum;
      for (let i = 0; i < 4; i++) {
        frstAdrs += this.byteString(y[i]);
      }
      for (let i = 0; i < 4; i++) {
        lstAdrs += this.byteString(w[i]);
      }
      frstAdrs = parseInt(frstAdrs, 2);
      lstAdrs = parseInt(lstAdrs, 2);
      let table = [];
      table.push(frstAdrs);
      while (frstAdrs < lstAdrs) {
        frstAdrs++;
        table.push(frstAdrs);
      }
      table = table.map(x => { return ("000000000000000000000000000000000000" + x.toString(2)).substr(-32).match(/.{1,8}/g).map(x => { return parseInt(x, 2) }) });
      subnetClass.availableHosts = table;
      this.result.push(subnetClass);
    }
    return this.result;
  }
}
