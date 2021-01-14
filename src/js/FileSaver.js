/* eslint-disable no-unused-vars */
import HostAddress from "./HostAddress.js";
import SubnetHostAddress from "./SubnetHostAddress.js";

export default class FileSaver {
  constructor(obj) {
    var fs = require("fs");
    let now = new Date();
    let fileName =
      "Kalkulator_IP_" +
      now.getFullYear() +
      "_" +
      (now.getMonth() + 1) +
      "_" +
      now.getDate() +
      "_" +
      now.getHours() +
      "_" +
      now.getMinutes() +
      "_" +
      now.getSeconds() +
      ".txt";
    var logger = fs.createWriteStream(fileName, {
      flags: "w"
    });
    logger.write(fileName + "\n");
    logger.write(
      "============================================================" + "\n\n"
    );
    if (obj.result === undefined || obj.result.length === 0) {
      logger.write("Adres IP:\n");
      logger.write(obj.ip.join(".") + "\n\n");

      logger.write("Maska:\n");
      logger.write(obj.netmask.join(".") + "\n\n");

      logger.write("Adres sieci:\n");
      logger.write(obj.network.join(".") + "\n\n");

      logger.write("Adres broadcast:\n");
      logger.write(obj.broadcast.join(".") + "\n\n");

      logger.write("Adres pierwszego hosta:\n");
      logger.write(obj.hostMinimum.join(".") + "\n\n");

      logger.write("Adres ostatniego hosta:\n");
      logger.write(obj.hostMaximum.join(".") + "\n\n");

      logger.write("Liczba hostów:\n");
      logger.write(obj.hostsTotal + "\n\n");
    } else {
      logger.write("Adres IP:\n");
      logger.write(obj.ip.join(".") + "\n\n");

      logger.write("Maska:\n");
      logger.write(obj.netmask.join(".") + "\n\n");
      for (let i = 0; i < obj.result.length; i++) {
        logger.write(
          `============================================================

`
        );
        logger.write(`\nPODSIEĆ ${i+1} | Liczba hostów: ${obj.subnets[i].number}, Liczba adresów zapasowych: ${obj.subnets[i].additional}\n`);
        logger.write("Adres podsieci:\n");
        logger.write(obj.result[i].network.join(".") + "\n\n");

        logger.write("Maska podsieci:\n");
        logger.write(obj.result[i].subnetMask.join(".") + "\n\n");

        logger.write("Adres broadcast:\n");
        logger.write(obj.result[i].broadcast.join(".") + "\n\n");

        logger.write("Adres pierwszego hosta:\n");
        logger.write(obj.result[i].hostMinimum.join(".") + "\n\n");

        logger.write("Adres ostatniego hosta:\n");
        logger.write(obj.result[i].hostMaximum.join(".") + "\n\n");

        logger.write("Maksymalna liczba hostów:\n");
        logger.write(obj.result[i].hostsTotal + "\n\n");

        logger.write("Dostępne adresy:\n");
        for (let j = 0; j < obj.result[i].availableHosts.length; j++) {
          logger.write(
            `${j + 1}.\t${obj.result[i].availableHosts[j].join(".")}`
          );
          if (j < obj.subnets[i].number) {
            logger.write(`\t| Adres hosta\n`);
          } else if (
            j >= obj.subnets[i].number &&
            j < +obj.subnets[i].number + obj.subnets[i].additional
          ) {
            logger.write(`\t| Adres hosta (zapasowy)\n`);
          } else {
            logger.write(`\t| Wolny adres\n`);
          }
        }
        logger.write("\n");
      }
    }

    logger.end();
  }
}
