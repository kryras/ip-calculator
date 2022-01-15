<template>
  <div id="app">
    <nav>
      <div class="logo">
        <p class="logo-text">
          Kalkulator
          <span>IP</span>
        </p>
      </div>
      <div id="nav">
        <ul>
          <router-link :to="{ name: 'IP Calculator' }">
            <li>OBLICZANIE ADRESÓW IP</li>
          </router-link>
          <router-link :to="{ name: 'Subnet Calculator' }">
            <li>PODZIAŁ NA PODSIECI</li>
          </router-link>
        </ul>
      </div>
    </nav>
    <div class="main-content">
      <header>
        <div class="dropdown">
          <img class="settings" src="~@/assets/icons/cog-solid.svg" />
          <div class="dropdown-content">
            <input
              type="checkbox"
              class="checkbox"
              name=""
              value=""
              v-model="checked"
            />
            <p class="checkbox-label">Zachowaj adres</p>
          </div>
        </div>
      </header>

      <main>
        <router-view />
      </main>
      <footer>Projekt ISK - Krystian Rasławski - 2020</footer>
    </div>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      checked: false,
    };
  },
  watch: {
    checked: function () {
      this.$store.dispatch("changeState");
    },
  },
};
</script>

<style lang="scss">
@font-face {
  font-family: "Montserrat";
  src: url("~@/assets/fonts/Montserrat-Regular.ttf") format("truetype");
  font-weight: 400;
  font-style: normal;
}

@font-face {
  font-family: "Montserrat";
  src: url("~@/assets/fonts/Montserrat-Bold.ttf") format("truetype");
  font-weight: 700;
  font-style: normal;
}

@font-face {
  font-family: "Montserrat";
  src: url("~@/assets/fonts/Montserrat-Light.ttf") format("truetype");
  font-weight: 300;
  font-style: normal;
}

@font-face {
  font-family: "MontserratAlternates";
  src: url("~@/assets/fonts/MontserratAlternates-Bold.ttf") format("truetype");
  font-weight: 700;
  font-style: normal;
}
@font-face {
  font-family: "OverpassMono";
  src: url("~@/assets/fonts/OverpassMono.ttf") format("truetype");
  font-weight: 400;
  font-style: normal;
}

html {
  --scrollbarBG: #edf2f6;
  --thumbBG: #9fa6b0;
}
main::-webkit-scrollbar {
  width: 11px;
}
main {
  scrollbar-width: thin;
  scrollbar-color: var(--thumbBG) var(--scrollbarBG);
}
main::-webkit-scrollbar-track {
  background: var(--scrollbarBG);
}
main::-webkit-scrollbar-thumb {
  background-color: var(--thumbBG);
  border-radius: 6px;
  border: 3px solid var(--scrollbarBG);
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  font-size: 13px;
}

body {
  overflow: hidden;
}

#app {
  font-family: "Montserrat", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100vh;
  width: 100vw;
  display: grid;
  grid-template-columns: 210px 1fr;
}

header {
  display: flex;
  align-items: center;
  flex-direction: row-reverse;
  position: relative;
  background-color: #ffffff;
  color: #9fa6b0;
  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    height: 62px;
    width: 100%;
    z-index: 10;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.25);
  }

  .settings {
    width: 22px;
    height: 22px;
    margin-right: 20px;
  }
}

nav {
  background-color: #354052;
  ul {
    list-style-type: none;

    li {
      display: flex;
      align-items: center;
      height: 62px;
      padding-left: 14px;
      &:hover {
        background-color: #2b3443;
      }
    }
  }

  a {
    color: #9fa6b0;
    text-decoration: none;

    &.router-link-exact-active {
      color: #ffffff;
      position: relative;
      &::after {
        content: "";
        position: absolute;
        width: 6px;
        height: 62px;
        top: -62px;
        left: 0;
        background-color: #ff9900;
      }
      &::before {
        content: "";
        position: absolute;
        width: 210px;
        height: 62px;
        background-color: #2b3443;
      }
    }
  }

  .logo {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 62px;
    width: 210px;
    color: #9fa6b0;
    font-family: "MontserratAlternates", sans-serif;
    font-size: 28px;
    font-weight: bold;
    span {
      color: #ff9900;
    }
    &::after {
      content: "";
      position: absolute;
      z-index: 100;
      bottom: 0;
      left: 0;
      height: 62px;
      width: 100%;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.25);
    }
  }
}

.main-content {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 62px 1fr 55px;
  overflow: hidden;

  main {
    overflow-y: scroll;
    background-color: #edf2f6;
    padding: 30px;
  }
}

footer {
  display: flex;
  align-items: center;
  flex-direction: row-reverse;
  background-color: #354052;
  color: #9fa6b0;
  font-weight: 300;
  padding-right: 7px;
}

.dropdown {
  position: relative;
  display: inline-block;
  z-index: 20;
}

.dropdown-content {
  display: none;
  position: absolute;
  right: 0;
  background-color: #ffffff;
  min-width: 160px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.25);
  padding: 8px 2px 2px 5px;
  z-index: 100;
}

.dropdown:hover .dropdown-content {
  display: block;
}

.checkbox {
  -webkit-appearance: none;
  background-color: #fafafa;
  border: 1px solid #9fa6b0;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05),
    inset 0px -15px 10px -12px rgba(0, 0, 0, 0.05);
  padding: 9px;
  display: inline-block;
  position: relative;
  margin-right: 5px;
}

.checkbox:active,
.regular-checkbox:checked:active {
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05),
    inset 0px 1px 3px rgba(0, 0, 0, 0.1);
}

.checkbox:checked {
  background-color: #e9ecee;
  border: 1px solid #9fa6b0;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05),
    inset 0px -15px 10px -12px rgba(0, 0, 0, 0.05),
    inset 15px 10px -12px rgba(255, 255, 255, 0.1);
  color: #99a1a7;
}

.checkbox:checked:after {
  content: "\2714";
  font-size: 14px;
  position: absolute;
  top: 0px;
  left: 3px;
  color: #99a1a7;
}
.checkbox-label {
  display: inline-block;
  vertical-align: middle;
  line-height: normal;

  margin-bottom: 10px;
}
</style>
