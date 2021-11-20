<template>
  <router-view v-if="loaded" />
</template>

<script>
import axios from 'axios';
import storage from './storage';
import CardMessage from './proto/card.json';
import protobuf from 'protobufjs';

export default {
  data: () => ({
    cards: {},
    linkSkills: {},
    categories: {},
    loaded: false
  }),

  mounted() {
    axios.get(storage("link_skills.json")).then(res => {
      this.linkSkills = res.data;

      axios.get(storage("categories.json")).then(res => {
        this.categories = res.data;

        axios.get(storage("cards.data"), {responseType: 'arraybuffer'}).then(res => {
          var start = new Date().getTime();

          var root = protobuf.Root.fromJSON(CardMessage);
          var CardMap = root.lookupType('CardMap');
          var data = CardMap.toObject(CardMap.decode(new Uint8Array(res.data)), {arrays: true, enums: String});

          this.cards = data.data;
          this.loaded = true;
          console.log(new Date().getTime() - start);
        });
      });
    });
  },
}
</script>

<style lang="scss">
body {
  margin: 0;

  &.dark {
    background-color: #222222;
    color: #ebebeb;

    input[type=text] {
      background: none;
      color: white;

      &::placeholder {
        color: #d1d1d1;
      }
    }
  }
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
