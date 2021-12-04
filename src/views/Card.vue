<template>
  <div class="card-view">
    <div class="main-wrapper">
      <div class="image-wrapper">
        <img class="image" :src="resources.cardImage($root.cards[$route.params.id])" />
        <img class="rarity" :src="assets.rarityIcon($root.cards[$route.params.id].rarity)" />
        <img class="element" :src="assets.elementIcon($root.cards[$route.params.id].element)" />

        <div class="potential" v-if="$root.cards[$route.params.id].rarity >= 4">
          잠재능력

          <div class="grid">
            <label :class="{ checked: potential[0] }"><input type="checkbox" id="potential0" v-model="potential[0]" /></label>
            <label :class="{ checked: potential[1] }"><input type="checkbox" id="potential1" v-model="potential[1]" /></label>
            <label :class="{ checked: potential[2] }"><input type="checkbox" id="potential2" v-model="potential[2]" /></label>
            <label :class="{ checked: potential[3] }"><input type="checkbox" id="potential3" v-model="potential[3]" /></label>
          </div>
        </div>

        
        <div class="name-and-title">
          <div class="title">{{ $root.cards[$route.params.id].leader_skill.name }}</div>
          <h1 :class="{overflow}">{{ $root.cards[$route.params.id].name }}</h1>
        </div>

        <div class="status-wrapper">
          <div class="status">
            <div class="value">{{ hp }}</div>
            <div class="label">HP</div>
          </div>

          <div class="status">
            <div class="value">{{ atk }}</div>
            <div class="label">ATK</div>
          </div>

          <div class="status">
            <div class="value">{{ def }}</div>
            <div class="label">DEF</div>
          </div>
        </div>
      </div>
      <div class="descriptions-wrapper">
        <div v-if="$root.cards[$route.params.id].extreme" class="tabs">
          <router-link :to="{query: {}}" :class="{ selected: !$route.query.extreme }">
            기본
          </router-link>
          <router-link :to="{query: {extreme: true}}" :class="{ selected: $route.query.extreme }">
            극한 Z 각성
          </router-link>
        </div>
        <table class="card-info">
          <tbody>
            <tr>
              <th>리더 스킬</th>
              <td v-if="$root.cards[$route.params.id].leader_skill == null">없음</td>
              <td v-else-if="$route.query.extreme == 'true'">{{ $root.cards[$route.params.id].extreme.leader_skill.description }}</td>
              <td v-else>{{ $root.cards[$route.params.id].leader_skill.description }}</td>
            </tr>

            <tr>
              <th rowspan="2">패시브 스킬</th>
              <td class="passive-name" v-if="$root.cards[$route.params.id].passive_skill == null">
                없음
              </td>
              <td class="passive-name" v-else-if="$route.query.extreme == 'true'">
                {{ $root.cards[$route.params.id].extreme.passive_skill.name }}
              </td>
              <td class="passive-name" v-else>
                {{ $root.cards[$route.params.id].passive_skill.name }}
              </td>
            </tr>
            <tr>
              <td v-if="$route.query.extreme == 'true'">{{ $root.cards[$route.params.id].extreme.passive_skill.description }}</td>
              <td v-else>{{ $root.cards[$route.params.id].passive_skill.description }}</td>
            </tr>

            <tr>
              <th>필살기</th>
              <td>
                <ul>
                  <li v-for="s in (
                    $route.query.extreme == 'true'
                    ? $root.cards[$route.params.id].extreme.specials
                    : $root.cards[$route.params.id].specials
                  )">
                    <span class="special-name">{{ s.name }}</span><!--
                    -->(<strong v-if="s.style=='Hyper'">초필살기, </strong><!--
                    --><strong v-else-if="s.style=='Condition'">유닛 필살기, </strong><!--
                    --><template v-if="s.lv_start && s.lv_start != 0">필살기 Lv.{{ s.lv_start }}~, </template><!--
                    -->기력 {{ s.eball_num_start }}~):
                    <template v-if="s.causality">{{ s.causality }}. </template>
                    {{ s.description }}
                  </li>
                </ul>
              </td>
            </tr>

            <tr v-if="$root.cards[$route.params.id].active_skills.length > 0">
              <th>액티브 스킬</th>
              <td>
                <ul>
                  <li v-for="a in $root.cards[$route.params.id].active_skills">
                    <div class="active-name">{{ a.name }}</div>
                    <div>{{ a.condition }}</div>
                    <div>{{ a.effect }}</div>
                  </li>
                </ul>
              </td>
            </tr>

            <tr class="transformations" v-if="transformations.length > 0">
              <th>변신</th>
              <td>
                <ul>
                  <li v-for="t in transformations">
                    <CardThumb :card="$root.cards[t.card_id]" :extreme="$route.query.extreme == 'true'" />
                    <div>{{ t.description }}</div>
                  </li>
                </ul>
              </td>
            </tr>

            <tr>
              <th :rowspan="Math.max($root.cards[$route.params.id].link_skills.length, 1)">링크 스킬</th>
              <td v-if="$root.cards[$route.params.id].link_skills.length != 0">
                <strong>{{ $root.linkSkills[$root.cards[$route.params.id].link_skills[0]].name }}</strong>:
                {{ $root.linkSkills[$root.cards[$route.params.id].link_skills[0]].description }}
              </td>
              <td v-else></td>
            </tr>
            <template v-for="l in $root.cards[$route.params.id].link_skills.slice(1)">
              <tr>
                <td>
                  <strong>{{ $root.linkSkills[l].name }}</strong>:
                  {{ $root.linkSkills[l].description }}
                </td>
              </tr>
            </template>

            <tr>
              <th>카테고리</th>
              <td>
                <ul class="categories">
                  <template v-for="c in $root.cards[$route.params.id].categories">
                    <li v-if="$root.categories[c] != null">
                      <div>{{ $root.categories[c].name }}</div>
                    </li>
                  </template>
                </ul>
              </td>
            </tr>

            <tr class="dokkanRoutes" v-if="dokkanRoutes.length > 0">
              <th>각성 루트</th>
              <td>
                <ul>
                  <li v-for="c in dokkanRoutes"><CardThumb :card="c" /></li>
                </ul>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import assets from '../assets';
import resources from '../resources';
import CardThumb from '../components/CardThumb.vue';

export default {

  data: () => ({
    overflow: false,
    potential: [false, false, false, false],
    resizeObserver: null
  }),

  setup: () => ({
    assets,
    resources
  }),

  mounted() {
    this.checkOverflow();

    this.resizeObserver = new ResizeObserver(this.checkOverflow);
    this.resizeObserver.observe(this.$el.querySelector(".name-and-title"));
    this.resizeObserver.observe(this.$el.querySelector("h1"));
  },

  unmounted() {
    this.resizeObserver.unobserve(this.$el.querySelector(".name-and-title"));
    this.resizeObserver.unobserve(this.$el.querySelector("h1"));
  },

  components: {
    CardThumb
  },

  methods: {
    checkOverflow() {
      var parent = this.$el.querySelector(".name-and-title").getBoundingClientRect();
      var child = this.$el.querySelector("h1").getBoundingClientRect();

      this.overflow = child.height > parent.height;
    }
  },

  computed: {
    hp() {
      var card = this.$root.cards[this.$route.params.id];
      
      var pot = 0;
      for(var i = 0; i < 4; i++) {
        if(this.potential[i] && card.potentials.length == 4)
          pot += card.potentials[i].hp;
      }

      if(card.rarity == 4 && this.$route.query.extreme == "true")
        return Math.floor(card.hp + (card.hp - card.hp_init) * 0.4839) + pot;
      
      return card.hp + pot;
    },

    atk() {
      var card = this.$root.cards[this.$route.params.id];

      var pot = 0;
      for(var i = 0; i < 4; i++) {
        if(this.potential[i] && card.potentials.length == 4)
          pot += card.potentials[i].atk;
      }

      if(card.rarity == 4 && this.$route.query.extreme == "true")
        return Math.floor(card.atk + (card.atk - card.atk_init) * 0.4839) + pot;
      
      return card.atk + pot;
    },

    def() {
      var card = this.$root.cards[this.$route.params.id];

      var pot = 0;
      for(var i = 0; i < 4; i++) {
        if(this.potential[i] && card.potentials.length == 4)
          pot += card.potentials[i].def;
      }

      if(card.rarity == 4 && this.$route.query.extreme == "true")
        return Math.floor(card.def + (card.def - card.def_init) * 0.4839) + pot;
      
      return card.def + pot;
    },

    transformations() {
      var root = this.$root.cards[this.$route.params.id];
      while(root.transformed_from.length > 0)
        root = this.$root.cards[root.transformed_from[root.transformed_from.length - 1]];

      var result = [{card_id: root.id, description: ''}];
      for(let i = 0; i < result.length; i++) {
        if(this.$route.query.extreme == "true" && this.$root.cards[result[i].card_id].extreme.transformations)
          result.push(...this.$root.cards[result[i].card_id].extreme.transformations);
        else
          result.push(...this.$root.cards[result[i].card_id].transformations);
      }

      if(result.length == 1)
        return [];
      
      return result;
    },

    dokkanRoutes() {
      var card = this.$root.cards[this.$route.params.id];
      while(card.dokkan_from) 
        card = this.$root.cards[card.dokkan_from];

      var result = [card];
      while(card.dokkan_into) {
        card = this.$root.cards[card.dokkan_into];
        result.push(card);
      }

      if(result.length == 1)
        return [];

      return result;
    }
  },

  watch: {
    "$route.params.id": function() {
      this.potential = [false, false, false, false];
    }
  }

}
</script>

<style lang="scss">
  .card-view {
    padding-top: 16px;

    .image-wrapper {
      flex: 0 0 300px;

      position: relative;

      .image {
        width: 100%;
      }

      .rarity {
        width: 128px;

        position: absolute;
        top: 8px;
        left: -10px;
      }

      .element {
        width: 52px;

        position: absolute;
        top: 76px;
        left: 20px;
      }

      .potential {
        position: absolute;
        top: 4px;
        right: 4px;

        background-color: #41414162;
        backdrop-filter: blur(4px);
        font-size: 14px;
        color: white;
        font-weight: bold;

        border-radius: 8px;
        padding: 8px;

        .grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          align-items: center;
          justify-items: center;
          margin-top: 8px;
          gap: 8px;
        }

        input {
          width: 0;
          height: 0;
          font-size: 0;
        }

        label {
          display: block;
          width: 12px;
          height: 12px;
          border-radius: 6px;

          background-color: #dfdfdf;

          &.checked {
            background-color: #ff7627;
          }
        }
      }

      .status-wrapper {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        padding: 0 8px;

        display: flex;
      }

      .status {
        flex: 1;
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
        padding: 16px 0;

        &:nth-child(1) {
          background-image: url("../assets/cha_detail_st_base_hp.png");
        }

        &:nth-child(2) {
          background-image: url("../assets/cha_detail_st_base_atk.png");
        }

        &:nth-child(3) {
          background-image: url("../assets/cha_detail_st_base_def.png");
        }

        .value {
          font-weight: bold;
          font-size: 20px;
          line-height: 22px;
          color: white;
        }

        .label {
          font-size: 14px;
          line-height: 100%;
          font-weight: bold;
          color: #ff7627;
          text-shadow: #000000 0 0 8px;
        }
      }
    }

    .name-and-title {
      position: absolute;
      top: 64px;
      right: 4px;
      width: 80%;
      z-index: 3;
      direction: rtl;

      color: white;
      text-shadow: #000000 0 0 8px;
      transform-origin: center right;
      //transform: translateX(50%) rotate(-90deg) translate(-50%, -50%);
      transform: rotate(-90deg) translateY(-50%);
      overflow: hidden;
      padding-bottom: 36px;

      h1 {
        position: absolute;
        margin: 0;
        font-size: 24px;
        line-height: 36px;
        text-align: right;
        white-space: nowrap;
        //animation: slide 8s linear infinite;

        &.overflow {
          animation: slide 8s linear infinite
        }

        @keyframes slide {
          from {
            right: 0%;
            transform: translateX(100%);
          }

          to {
            right: 100%;
            transform: translateX(0%);
          }
        }
      }

      .title {
        font-weight: bold;
        font-size: 16px;
        text-align: right;
      }

      
    }

    .main-wrapper {
      display: flex;
      justify-content: center;
      align-items: flex-start;
    }

    .tabs {
      text-align: left;

      a {
        display: inline-flex;
        background: none;
        outline: none;
        border: none;
        border-radius: 2px;
        align-items: center;
        justify-content: center;

        width: 96px;
        height: 48px;
        font-size: 15px;
        color: black;
        text-decoration: none;

        &:hover {
          background: #eeeeee;
        }

        &.selected {
          border-bottom: 3px solid #ff7627;
        }

        .dark & {
          color: white;
        }
      }
    }

    .descriptions-wrapper {
      margin-left: 24px;
      max-width: 800px;
    }

    .card-info {
      text-align: left;

      .passive-name, .special-name, .active-name {
        font-weight: bold;
      }

      > tbody > tr > th, > tbody > tr > td {
        vertical-align: top;
      }

      > tbody > tr > th {
        min-width: 84px;
        width: 84px;
      }

      ul {
        list-style: none;
        margin: 0;
        padding: 0;
      }

      .transformations {
        li {
          display: flex;
          align-items: center;
        }
      }

      .categories {
        display: flex;
        flex-wrap: wrap;
        font-weight: bold;
        gap: 8px;

        li div {
          height: 24px;
          border-radius: 12px;
          line-height: 24px;
          padding: 0 8px;
          background-color: #fd5f04;
          color: white;
          font-size: 14px;
        }
      }

      .dokkanRoutes {
        ul {
          display: flex;
          flex-wrap: wrap;

          li {
            display: flex;
            align-items: center;

            &::before {
              display: block;
              content: '>>';
              font-weight: bold;
              color: #e46c26;
            }

            &:first-child::before {
              content: none
            }
          }
        }
      }
    }

    @media screen and (max-width: 940px) {
      padding-top: 0;

      .main-wrapper {
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;

        .image-wrapper {
          max-width: 480px;
          flex: 0 0;
        }
      }

      .descriptions-wrapper {
        margin: 0;
        padding: 0 8px;
      }
    }
  }
</style>