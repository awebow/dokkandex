<template>
  <router-view v-if="loaded" />
  <div id="loading" v-else>
    <strong>{{ Math.floor(progress) }}%</strong>
    <div class="progress" :style="{'--bar-pos': `-${100-progress}%`}"></div>
  </div>
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
    loaded: false,
    progress: 0
  }),

  mounted() {
    this.fetchData();
  },

  methods: {
    async fetchData() {
      var fCard = storage("cards.data")
      var fLink = storage("link_skills.json");
      var fCat = storage("categories.json");

      var size = 0;
      var completed = 0;
      try {
        size += parseInt((await axios.head(fCard)).headers["content-length"]);
        size += parseInt((await axios.head(fLink)).headers["content-length"]);
        size += parseInt((await axios.head(fCat)).headers["content-length"]);

        var root = protobuf.Root.fromJSON(CardMessage);
        var CardMap = root.lookupType('CardMap');

        var res = await axios.get(fCard, {
          responseType: "arraybuffer",
          onDownloadProgress: e => this.progress = ((completed + e.loaded) / size * 100)
        });
        var data = CardMap.toObject(CardMap.decode(new Uint8Array(res.data)), {arrays: true, enums: String});
        this.cards = data.data;
        completed = parseInt(res.headers["content-length"]);

        res = (await axios.get(fLink, {
          onDownloadProgress: e => this.progress = ((completed + e.loaded) / size * 100)
        }));
        this.linkSkills = res.data;
        completed += parseInt(res.headers["content-length"]);

        res = (await axios.get(fCat, {
          onDownloadProgress: e => this.progress = ((completed + e.loaded) / size * 100)
        }));
        this.categories = res.data;
        this.loaded = true;
      }
      catch(err) {
        console.log(err);
      }
    }
  }
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

#loading {
  display: flex;
  height: 100vh;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .progress {
    width: 10rem;
    height: 0.5rem;
    border-radius: 0.25rem;
    overflow: hidden;
    margin-top: 0.25rem;

    &::before {
      content: "";
      display: block;
      height: 100%;
      background-color: #ff6600;
      border-radius: 0.25rem;
      transform: translateX(var(--bar-pos));
    }
  }
}
</style>
