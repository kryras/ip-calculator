<template>
  <div class="ip-calc">
    <h2>PODZIAŁ NA PODSIECI</h2>
    <div class="data-container">
      <div class="input-window">
        <div class="user-input">
          <form>
            <h3 class="window-title">DANE WEJŚCIOWE</h3>
            <div class="window-main">
              <label for="ip-input"> Adres IP</label>
              <div class="inputs" v-for="inputIdx in 4" :key="inputIdx">
                <input
                  v-model.number="ip[inputIdx - 1]"
                  class="address_input"
                  type="text"
                  id="ip-input"
                  maxlength="3"
                />
                <div class="dot" v-if="inputIdx != 4">.</div>
              </div>
              <label for="subnetmask-input"> Maska</label>
              <select id="subnetmask-input" v-model="mask">
                <option
                  v-for="mask in subnetList"
                  v-bind:key="mask.key"
                  :value="mask.value"
                >
                  {{ mask.key }}
                </option>
              </select>

              <label for="subnet-input">Podsieci</label>
              <div class="subnet-input-label" v-if="subnets.length > 0">
                <div class="subnet-input-label-number">Liczba hostów:</div>
                <div class="subnet-input-label-additional">
                  Liczba adresów zapasowych:
                </div>
              </div>
              <div
                class="inputs inputs-subnets"
                v-for="(subnet, index) in subnets"
                :key="index + 12345"
              >
                <div class="subnet-number">({{ index + 1 }})</div>
                <input
                  v-model.number="subnets[index].number"
                  class="address_input subnet"
                  type="text"
                  id="subnet-input"
                />
                <div class="subnet-number-additional"></div>
                <input
                  v-model.number="subnets[index].additional"
                  class="address_input subnet"
                  type="text"
                  id="subnet-input"
                />
                <button
                  class="button-remove"
                  type="button"
                  @click="removeSubnet(subnet)"
                >
                  <img
                    class="settings minus"
                    src="~@/assets/icons/minus-solid.svg"
                  />
                </button>
              </div>
              <button class="button-add" type="button" @click="addSubnet">
                <img class="settings" src="~@/assets/icons/plus-solid.svg" />
              </button>
              <button class="button" type="button" @click="calculateSubnets">
                Oblicz
              </button>
            </div>
          </form>
        </div>
      </div>

      <div class="output-window">
        <h3 class="window-title">DANE WYJŚCIOWE</h3>
        <div class="window-main">
          <div
            style="margin-bottom:30px;"
            v-for="(item, idx) in this.result"
            :key="idx"
          >
            <h4 style="margin-bottom:5px;">
              PODSIEĆ {{ idx + 1
              }}<span style="font-weight:400;margin-left:12px;"> |</span
              ><span style="font-weight:400;margin-left:12px;"
                >Liczba hostów: {{ subnets[idx].number }}, Liczba adresów
                zapasowych: {{ subnets[idx].additional }}</span
              >
            </h4>
            <p class="label">Adres podsieci</p>
            <div class="outputDecimal">{{ item.network | stringOutput }}</div>
            <div class="outputBinary">
              {{ showAsBinary(item.network) | stringOutput }}
            </div>

            <p class="label">Maska podsieci</p>
            <div class="outputDecimal">
              {{ item.subnetMask | stringOutput }}
            </div>
            <div class="outputBinary">
              {{ showAsBinary(item.subnetMask) | stringOutput }}
            </div>

            <p class="label">Adres broadcast</p>
            <div class="outputDecimal">{{ item.broadcast | stringOutput }}</div>
            <div class="outputBinary">
              {{ showAsBinary(item.broadcast) | stringOutput }}
            </div>

            <p class="label">Adres pierwszego hosta</p>
            <div class="outputDecimal">
              {{ item.hostMinimum | stringOutput }}
            </div>
            <div class="outputBinary">
              {{ showAsBinary(item.hostMinimum) | stringOutput }}
            </div>

            <p class="label">Adres ostatniego hosta</p>
            <div class="outputDecimal">
              {{ item.hostMaximum | stringOutput }}
            </div>
            <div class="outputBinary">
              {{ showAsBinary(item.hostMaximum) | stringOutput }}
            </div>

            <p class="label">Maksymalna liczba hostów</p>
            <div class="outputDecimal">{{ item.hostsTotal }}</div>
            <details>
              <summary class="label">Dostępne adresy</summary>
              <table>
                <tr v-for="(host, index) in item.availableHosts" :key="index">
                  <td style="font-weight:bold;">{{ index + 1 }}.</td>
                  <td>{{ host | stringOutput }}</td>
                  <td v-if="index < subnets[idx].number">Adres hosta</td>
                  <td
                    v-else-if="
                      index >= subnets[idx].number &&
                        index < +subnets[idx].number + subnets[idx].additional
                    "
                  >
                    Adres hosta (zapasowy)
                  </td>
                  <td v-else>Wolny adres</td>
                </tr>
              </table>
            </details>
            <button class="button save" type="button" @click="saveFile">
              Zapisz wynik
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import SubnetHostAddress from "@/js/SubnetHostAddress.js";
import FileSaver from "@/js/FileSaver.js";
export default {
  name: "SubnetCalculator",
  data() {
    return {
      ip: [192, 168, 0, 0],
      mask: [255, 255, 255, 0],
      subnets: [],
      maskNew: [],
      network: [],
      broadcast: [],
      hostMinimum: [],
      hostMaximum: [],
      hostsTotal: 0,
      result: [],
      sha: null,
      subnetList: [
        { key: "255.255.0.0 /16", value: [255, 255, 0, 0], bits: 16 },
        { key: "255.255.128.0 /17", value: [255, 255, 128, 0], bits: 17 },
        { key: "255.255.192.0 /18", value: [255, 255, 192, 0], bits: 18 },
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
      ]
    };
  },
  methods: {
    byteString(n) {
      return ("000000000" + n.toString(2)).substr(-8);
    },
    showAsBinary(x) {
      if (x === undefined || x === []) {
        return [];
      } else {
        return x.map(z => {
          return this.byteString(z);
        });
      }
    },
    addSubnet() {
      this.subnets.push({ number: 0, additional: 0 });
    },
    removeSubnet(sub) {
      const subIndex = this.subnets.indexOf(sub);
      this.subnets.splice(subIndex, 1);
    },
    calculateSubnets() {
      var subnetHostAddress = new SubnetHostAddress(
        this.ip,
        this.mask,
        this.subnets
      );
      this.result = subnetHostAddress.calculateNetmaskForNHosts();
      this.sha = subnetHostAddress;
    },
    saveFile() {
      // eslint-disable-next-line no-unused-vars
      var fileSaver = new FileSaver(this.sha);
    }
  },
  mounted() {
    if (this.$store.state.saveInput) {
      this.ip = this.$store.state.ip;
      this.mask = this.$store.state.mask;
    } else {
      this.$store.dispatch("remove");
    }
  },
  beforeDestroy() {
    if (this.$store.state.saveInput) {
      let ip = this.ip;
      let mask = this.mask;
      this.$store.dispatch("save", { ip, mask });
    } else {
      this.$store.dispatch("remove");
    }
  },
  filters: {
    stringOutput(value) {
      if (value === undefined || value === null) return "";
      return value.join(".").trim();
    }
  }
};
</script>

<style lang="scss" scoped>
* {
  color: #354052;
}

.address_input {
  width: 25px;
}

.address-separator {
  margin: 0 10px;
}

h2 {
  color: #5f708c;
}

.data-container {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
}

.window-main {
  padding: 15px;
}

.input-window {
  position: relative;
  width: 217px;
  min-height: 390px;
  margin: 30px 15px 0 0;
  background-color: #ffffff;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25);
  padding-bottom: 55px;
}

.output-window {
  position: relative;
  width: 590px;
  min-height: 390px;
  margin: 30px 0 0 15px;
  background-color: #ffffff;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25);
  padding-bottom: 55px;
}

label {
  display: block;
  margin-bottom: 7px;
}

.inputs {
  display: inline-block;
  margin-bottom: 15px;
}

.window-title {
  font-size: 13px;
  font-weight: 700;
  color: #ffffff;
  height: 40px;
  width: 100%;
  background-color: #5f708c;
  padding: 12px 0 12px 12px;
}

input[type="text"] {
  font-family: "Montserrat", sans-serif;
  background-color: none;
  border: none;
  width: 40px;
  height: 22px;
  text-align: center;
  outline: 0;
  border-bottom: 1px solid #354052;

  &:focus {
    border-bottom: 1px solid #edf2f6;
  }
}

input[type="text"].subnet {
  font-family: "Montserrat", sans-serif;
  background-color: none;
  border: none;
  width: 52px;
  height: 22px;
  text-align: center;
  outline: 0;
  border-bottom: 1px solid #354052;

  &:focus {
    border-bottom: 1px solid #edf2f6;
  }
}

select {
  font-family: "Montserrat", sans-serif;
  background-color: none;
  border: none;
  width: 186px;
  height: 22px;
  text-align: center;
  outline: 0;
  border-bottom: 1px solid #354052;
  margin-bottom: 15px;
}

.dot {
  text-align: center;
  outline: 0;
  margin: 0 3px;
  display: inline-block;
}

.button {
  display: block;
  margin: 15px 0;
  width: 186px;
  height: 40px;
  border: none;
  background-color: #5f708c;
  font-weight: bold;
  color: #ffffff;
  position: absolute;
  bottom: 0px;
  left: 15px;
}

.label {
  display: block;
  margin-bottom: 7px;
  font-weight: 700;
}

.outputDecimal,
.outputBinary {
  display: inline-block;
}

.outputDecimal {
  width: 30%;
  margin: 0 0 15px 0;
}

.outputBinary {
  font-family: "OverpassMono", Monaco, monospace;
  font-size: 13.5px;
}

.button-remove,
.button-add {
  background-color: transparent;
  border: none;
  outline: none;
}

.button-remove {
  margin-left: 24px;
}

.button-add {
  display: block;
}

img.settings {
  width: 16px;
  height: 16px;
  margin: auto 0;
  align-content: right;
}

.inputs-subnets {
  display: flex;
  align-content: center;
}

.subnet-number {
  width: 20px;
  padding-top: 2px;
}

.subnet-number-additional {
  padding-top: 2px;
  margin: 0px 15px 0 5px;
}

.subnet-input-label {
  display: flex;
  flex-direction: row;
  font-size: 10px;
}

.subnet-input-label-number {
  margin-left: 20px;
  margin-bottom: 2px;
}

.subnet-input-label-additional {
  margin-left: 23px;
  margin-bottom: 2px;
}

tr:nth-child(even) {
  background-color: #edf2f6;
}

tr:hover {
  background-color: #ff9900;
}

td,
th {
  border: 1px solid #ddd;
  padding: 4px;
}
</style>
