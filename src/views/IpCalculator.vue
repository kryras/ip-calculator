<template>
  <div class="ip-calc">
    <h2>OBLICZANIE ADRESÓW IP</h2>
    <div class="data-container">
      <div class="input-window">
        <div class="user-input">
          <form>
            <h3 class="window-title">DANE WEJŚCIOWE</h3>
            <div class="window-main">
              <label for="ip-input">Adres IP</label>
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
              <label for="subnetmask-input">Maska</label>
              <select id="subnetmask-input" v-model="mask">
                <option
                  v-for="mask in subnetList"
                  v-bind:key="mask.key"
                  :value="mask.value"
                  >{{ mask.key }}</option
                >
              </select>
              <button class="button" type="button" @click="calculate">
                Oblicz
              </button>
            </div>
          </form>
        </div>
      </div>

      <div class="output-window">
        <h3 class="window-title">DANE WYJŚCIOWE</h3>
        <div class="window-main" v-if="this.hostsTotal != 0">
          <p class="label">Adres sieci</p>
          <div class="outputDecimal">{{ this.network | stringOutput }}</div>
          <div class="outputBinary">
            {{ this.showAsBinary(this.network) | stringOutput }}
          </div>

          <p class="label">Adres broadcast</p>
          <div class="outputDecimal">{{ this.broadcast | stringOutput }}</div>
          <div class="outputBinary">
            {{ this.showAsBinary(this.broadcast) | stringOutput }}
          </div>

          <p class="label">Adres pierwszego hosta</p>
          <div class="outputDecimal">{{ this.hostMinimum | stringOutput }}</div>
          <div class="outputBinary">
            {{ this.showAsBinary(this.hostMinimum) | stringOutput }}
          </div>

          <p class="label">Adres ostatniego hosta</p>
          <div class="outputDecimal">{{ this.hostMaximum | stringOutput }}</div>
          <div class="outputBinary">
            {{ this.showAsBinary(this.hostMaximum) | stringOutput }}
          </div>

          <p class="label">Liczba hostów</p>
          <div class="outputDecimal">{{ this.hostsTotal }}</div>

          <button class="button save" type="button" @click="saveFile">
            Zapisz wynik
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import HostAddress from "@/js/HostAddress.js";
import FileSaver from "@/js/FileSaver.js";
export default {
  name: "IpCalculator",
  data() {
    return {
      ip: [192, 168, 0, 0],
      mask: [255, 255, 255, 0],
      maskNew: [],
      network: [],
      broadcast: [],
      hostMinimum: [],
      hostMaximum: [],
      hostsTotal: 0,
      hs: null,
      subnetList: [
        { key: "255.255.0.0 /16", value: [255, 255, 0, 0] },
        { key: "255.255.128.0 /17", value: [255, 255, 128, 0] },
        { key: "255.255.192.0 /18", value: [255, 255, 192, 0] },
        { key: "255.255.224.0 /19", value: [255, 255, 224, 0] },
        { key: "255.255.240.0 /20", value: [255, 255, 240, 0] },
        { key: "255.255.248.0 /21", value: [255, 255, 248, 0] },
        { key: "255.255.252.0 /22", value: [255, 255, 252, 0] },
        { key: "255.255.254.0 /23", value: [255, 255, 254, 0] },
        { key: "255.255.255.0 /24", value: [255, 255, 255, 0] },
        { key: "255.255.255.128 /25", value: [255, 255, 255, 128] },
        { key: "255.255.255.192 /26", value: [255, 255, 255, 192] },
        { key: "255.255.255.224 /27", value: [255, 255, 255, 224] },
        { key: "255.255.255.240 /28", value: [255, 255, 255, 240] },
        { key: "255.255.255.248 /29", value: [255, 255, 255, 248] },
        { key: "255.255.255.252 /30", value: [255, 255, 255, 252] }
      ]
    };
  },
  methods: {
    calculate() {
      var hostAddress = new HostAddress(this.ip, this.mask);
      this.network = hostAddress.calculateNetworkAddress();
      this.broadcast = hostAddress.calculateBroadcastAddress();
      this.hostMinimum = hostAddress.calculateHostMin();
      this.hostMaximum = hostAddress.calculateHostMax();
      this.hostsTotal = hostAddress.calculateNumberOfHosts();
      this.ha = hostAddress;
    },
    saveFile() {
      // eslint-disable-next-line no-unused-vars
      var fileSaver = new FileSaver(this.ha);
    },
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
  height: 390px;
  margin: 30px 15px 0 0;
  background-color: #ffffff;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25);
}

.output-window {
  position: relative;
  width: 590px;
  height: 390px;
  margin: 30px 0 0 15px;
  background-color: #ffffff;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25);
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

select {
  font-family: "Montserrat", sans-serif;
  background-color: none;
  border: none;
  width: 186px;
  height: 22px;
  text-align: center;
  outline: 0;
  border-bottom: 1px solid #354052;
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
</style>
