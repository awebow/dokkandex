<template>
  <div class="card-thumb" @mouseover="mouseOver" @mouseleave="mouseOut" @contextmenu="onContext">
    <router-link
      :to="`/cards/${card.id}`"
      :style="{ 'background-image': `url(${assets.thumbBase(card.element, card.rarity)}` }">

      <img class="thumb" :src="resources.cardThumb(card)" />
      <img class="element" :src="assets.elementIcon(card.element)" />
      <img class="rarity" :src="assets.rarityIcon(card.rarity)" />
      <img class="star" src="../assets/cha_evo_star5.png" />
    </router-link>

    <table class="tooltip" v-if="tooltipVisible">
      <thead>
        <tr>
          <th colspan="2">{{ card.name }}</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th>리더 스킬</th>
          <td v-if="card.leader_skill">{{ card.leader_skill.description }}</td>
          <td v-else>없음</td>
        </tr>
        <tr>
          <th>패시브 스킬</th>
          <td v-if="card.passive_skill">{{ card.passive_skill.description }}</td>
          <td v-else>없음</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import assets from '../assets';
import resources from '../resources';

export default {

  props: ['card'],

  data: () => ({
    tooltipTimeout: null,
    tooltipVisible: false
  }),

  setup: () => ({
    assets,
    resources
  }),

  unmounted() {
    if(this.tooltipTimeout)
      clearTimeout(this.tooltipTimeout);
  },

  methods: {
    mouseOver() {
      if(this.tooltipTimeout || this.tooltipVisible)
        return;
      
      this.tooltipTimeout = setTimeout(() => {
        this.tooltipVisible = true;
        this.tooltipTimeout = null;
        this.$nextTick(() => this.positionTooltip());
      }, 500);
    },

    mouseOut() {
      if(this.tooltipTimeout)
        clearTimeout(this.tooltipTimeout);

      this.tooltipTimeout = null;
      this.tooltipVisible = false;
    },

    positionTooltip() {
      var tooltip = this.$el.querySelector(".tooltip");
      var rect = tooltip.getBoundingClientRect();
      var transform = tooltip.style.transform;

      var prevX = 0;
      var prevY = 0;
      if(transform) {
        var s = transform.split("(")[1].split(")")[0].split(",");
        prevX = parseFloat(s[0].split("px")[0]);
        prevY = parseFloat(s[1].split("px")[0]);
      }

      var translateX = Math.max(rect.left - prevX < 0 ? prevX - rect.left : 0, rect.width / 2);
      var translateY = rect.top - prevY < 0 ? prevY - rect.top : 0;

      if(rect.right - prevX + translateX > document.documentElement.clientWidth)
        translateX = document.documentElement.clientWidth - rect.right + prevX;

      tooltip.style.transform = `translate(${translateX}px,${translateY}px)`;
    },

    onContext(e) {
      if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    }
  }

}
</script>

<style lang="scss">
  .card-thumb {
    position: relative;
    overflow: visible;

    a {
      width: 96px;
      display: block;
      position: relative;
      background-size: 77px;
      background-repeat: no-repeat;
      background-position: 50% 70%;

      .thumb {
        display: block;
        width: 96px;
      }

      .element {
        width: 36px;
        position: absolute;
        top: 0;
        right: 0;
      }

      .rarity {
        width: 58px;
        position: absolute;
        bottom: 0;
        left: -8px;
      }

      .star {
        width: 54px;
        position: absolute;
        bottom: 0;
        right: 0;
      }
    }

    .tooltip {
      position: absolute;
      bottom: 96px;
      right: 50%;
      border-radius: 8px;
      padding: 8px;
      width: 400px;
      z-index: 10;
      pointer-events: none;

      background-color: #000000a6;
      color: white;

      thead th {
        text-align: center;
      }

      tbody th {
        width: 84px;
        vertical-align: top;
      }

      td {
        white-space: normal;
        text-align: justify;
      }

      @media screen and (max-width: 480px) {
        width: 100vw;
      }
    }
  }

</style>