<template>
  <div class="menu-and-search">
    <button type="button" class="dark-toggle" @click="toggleDarkMode"><ion-icon name="contrast"></ion-icon></button>
    <div class="search">
      <input type="text" placeholder="검색어" v-model="keyword" @keyup="e => {if(e.key == 'Enter') search();}" />
      <button type="button" @click="search()"><ion-icon name="search-outline"></ion-icon></button>
    </div>
  </div>

  <div class="filter">
    <div>속성</div>
    <div class="elements">
      <label>
        <input type="checkbox" v-model="filter.elements[0]" checked />
        <img src="../assets/cha_type_icon_00.png" :class="{checked: filter.elements[0]}" />
      </label>
      <label>
        <input type="checkbox" v-model="filter.elements[1]" checked />
        <img src="../assets/cha_type_icon_01.png" :class="{checked: filter.elements[1]}" />
      </label>
      <label>
        <input type="checkbox" v-model="filter.elements[2]" checked />
        <img src="../assets/cha_type_icon_02.png" :class="{checked: filter.elements[2]}" />
      </label>
      <label>
        <input type="checkbox" v-model="filter.elements[3]" checked />
        <img src="../assets/cha_type_icon_03.png" :class="{checked: filter.elements[3]}" />
      </label>
      <label>
        <input type="checkbox" v-model="filter.elements[4]" checked />
        <img src="../assets/cha_type_icon_04.png" :class="{checked: filter.elements[4]}" />
      </label>
    </div>

    <div>계열</div>
    <div>
      <input id="super" type="checkbox" v-model="filter.types[0]" checked /><label for="super">초</label>
      <input id="extreme" type="checkbox" v-model="filter.types[1]" checked /><label for="extreme">극</label>
    </div>

    <div>레어도</div>
    <div class="rarities">
      <label>
        <input type="checkbox" v-model="filter.rarities[5]" checked />
        <img src="../assets/cha_rare_lr.png" :class="{checked: filter.rarities[5]}" />
      </label>
      <label>
        <input type="checkbox" v-model="filter.rarities[4]" checked />
        <img src="../assets/cha_rare_ur.png" :class="{checked: filter.rarities[4]}" />
      </label>
      <label>
        <input type="checkbox" v-model="filter.rarities[3]" checked />
        <img src="../assets/cha_rare_ssr.png" :class="{checked: filter.rarities[3]}" />
      </label>
      <label>
        <input type="checkbox" v-model="filter.rarities[2]" checked />
        <img src="../assets/cha_rare_sr.png" :class="{checked: filter.rarities[2]}" />
      </label>
      <label>
        <input type="checkbox" v-model="filter.rarities[1]" checked />
        <img src="../assets/cha_rare_r.png" :class="{checked: filter.rarities[1]}" />
      </label>
      <label>
        <input type="checkbox" v-model="filter.rarities[0]" checked />
        <img src="../assets/cha_rare_n.png" :class="{checked: filter.rarities[0]}" />
      </label>
    </div>

    <div>카테고리</div>
    <div>
      <button type="button" class="btn" @click="showCategoryModal">선택</button>
    </div>
  </div>

  <ul class="card-list">
    <li v-for="c in displayCards">
      <CardThumb :card="c" />
    </li>
  </ul>

  <div class="modal-wrapper" v-if="categoryModal">
    <div class="category-modal">
      <input type="text" class="category-search" placeholder="카테고리 검색" @input="searchCategory" />

      <div class="bool-tabs">
        <div @click="() => this.modalCategories.or = false" :class="{selected: !modalCategories.or}">모두 포함</div>
        <div @click="() => this.modalCategories.or = true" :class="{selected: modalCategories.or}">일부 포함</div>
      </div>

      <ul>
        <li v-for="c in displayCategories">
          <button type="button" @click="toggleModalCategory(c.id)"
            :class="{selected: modalCategories.items.indexOf(c.id) != -1}">{{ c.name }}</button>
        </li>
      </ul>

      <div class="buttons">
        <button type="button" class="btn" @click="applyCategory">적용</button>
        <button type="button" class="btn" @click="categoryModal = false">취소</button>
      </div>
    </div>
  </div>
</template>

<script>
import CardThumb from '../components/CardThumb.vue';
import Cookies from 'js-cookie';

export default {

  data() {
    return {
      matchedCards: [],
      displayCards: [],
      keyword: '',
      filter: {
        elements: [true, true, true, true, true],
        types: [true, true],
        rarities: [true, true, true, true, true, true],
        categories: {
          or: false,
          items: []
        }
      },
      categoryModal: false,
      modalCategories: {
        or: false,
        items: []
      },
      displayCategories: []
    };
  },

  components: {
    CardThumb
  },

  mounted() {
    this.applyQuery();

    this.refresh();

    for(var i in this.$root.categories) {
      if(this.$root.categories.hasOwnProperty(i))
        this.displayCategories.push(this.$root.categories[i]);
    }

    window.addEventListener('scroll', this.handleScroll);
  },

  unmounted() {
    window.removeEventListener('scroll', this.handleScroll);
  },

  methods: {
    refresh() {
      this.matchedCards = [];
      this.displayCards = [];

      for(var id in this.$root.cards) {
        if(!this.$root.cards.hasOwnProperty(id) || !this.isDisplayable(id))
          continue;

          let card = this.$root.cards[id];
          if(this.keyword != '' && !this.matchKeyword(card))
            continue;
          
          if(this.matchFilter(card))
            this.matchedCards.push(this.$root.cards[id]);
      }

      this.matchedCards.sort(function(a, b) {
        if(a.id < 2000000 && b.id >= 2000000)
          return -1;
        else if(a.id >= 2000000 && b.id < 2000000)
          return 1;

        return b.id - a.id
      });

      this.fetch();
    },

    fetch() {
      this.displayCards.push(...this.matchedCards.slice(this.displayCards.length, this.displayCards.length + 500));
    },

    isDisplayable(id) {
      if(parseInt(id.substring(0, 1)) > 3)
        return false;

      if(id.substring(id.length - 1) == '1')
        return true;

      return !this.$root.cards.hasOwnProperty(id.substring(0, id.length - 1) + '1');
    },

    matchKeyword(card) {
      if(card.name.indexOf(this.keyword) != -1)
        return true;

      return false;
    },

    matchFilter(card) {
      if(!this.filter.elements[card.element % 10] || !this.filter.types[~~(card.element / 10) - 1])
        return false

      if(!this.filter.rarities[card.rarity])
        return false;

      if(!this.filter.categories.or) {
        for(var i of this.filter.categories.items) {
          if(card.categories.indexOf(i) == -1)
            return false;
        }
      }
      else {
        for(var i of this.filter.categories.items) {
          if(card.categories.indexOf(i) != -1)
            return true;
        }

        return false;
      }

      return true;
    },

    search() {
      this.$router.push({ query: {...this.$route.query, keyword: this.keyword} });
    },

    searchCategory(e) {
      this.displayCategories = [];
      for(var i in this.$root.categories) {
        if(!this.$root.categories.hasOwnProperty(i))
          continue;

        if(this.$root.categories[i].name.indexOf(e.target.value) != -1)
          this.displayCategories.push(this.$root.categories[i]);
      }
    },

    showCategoryModal(id) {
      this.modalCategories = {or: false, items: []};
      this.modalCategories.or = this.filter.categories.or;
      this.modalCategories.items.push(...this.filter.categories.items);
      this.displayCategories = Object.values(this.$root.categories);
      this.categoryModal = true;
    },

    toggleModalCategory(id) {
      var index = this.modalCategories.items.indexOf(id);
      if(index != -1)
        this.modalCategories.items.splice(index, 1);
      else
        this.modalCategories.items.push(id);
    },

    applyCategory() {
      this.filter.categories = this.modalCategories;
      this.categoryModal = false;
      this.refresh();
    },

    handleScroll(e) {
      if(window.scrollY >= document.body.offsetHeight - window.innerHeight * 2)
        this.fetch();
    },

    applyQuery() {
      if(this.$route.query.keyword)
        this.keyword = this.$route.query.keyword;

      for(let i in this.filter.elements)
        if(this.$route.query[`element_${i}`])
          this.filter.elements[i] = this.$route.query[`element_${i}`].toLowerCase() == "true";
        
      for(let i in this.filter.types)
        if(this.$route.query[`type_${i}`])
          this.filter.types[i] = this.$route.query[`type_${i}`].toLowerCase() == "true";

      for(let i in this.filter.rarities)
        if(this.$route.query[`rarity_${i}`])
          this.filter.rarities[i] = this.$route.query[`rarity_${i}`].toLowerCase() == "true";
      
      if(this.$route.query["category_or"])
        this.filter.categories.or == this.$route.query["category_or"].toLowerCase() == "true";

      if(this.$route.query["categories"])
        this.filter.categories.items = this.$route.query["categories"].split(",").map(e => parseInt(e));
    },
    
    toggleDarkMode() {
      if(document.body.classList.contains("dark")) {
        document.body.classList.remove("dark");
        Cookies.set("theme", "light", { expires: 365 });
      }
      else {
        document.body.classList.add("dark");
        Cookies.set("theme", "dark", { expires: 365 });
      }
    }
  },

  watch: {
    filter: {
      handler() {
        var query = {...this.$route.query};

        for(let i in this.filter.elements)
          query[`element_${i}`] = this.filter.elements[i];
        
        for(let i in this.filter.types)
          query[`type_${i}`] = this.filter.types[i];

        for(let i in this.filter.rarities)
          query[`rarity_${i}`] = this.filter.rarities[i];
        
        query["category_or"] = this.filter.categories.or;
        query["categories"] = this.filter.categories.items.join(",");

        this.$router.push({query: query});
      },
      deep: true
    },

    "$route.query": function() {
      this.applyQuery();
      this.refresh();
    }
  }

}
</script>

<style lang="scss">
  .menu-and-search {
    display: flex;
    justify-content: center;
    padding: 8px 8px 0 8px;
  }

  .dark-toggle {
    display: flex;
    align-items: center;
    background: none;
    outline: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
    padding: 0;
    margin-right: 8px;
    color: black;

    ion-icon {
      pointer-events: none;
    }

    .dark & {
      color: white;
    }
  }

  .search {
    display: flex;
    justify-content: center;

    input {
      display: block;
      box-sizing: border-box;
      width: 256px;
      height: 32px;
      border: 1px solid #aaaaaa;
      border-radius: 16px 0 0 16px;
      outline: none;
      padding: 0 8px;
    }

    @media screen and (max-width: 480px) {
      flex: 1;

      input {
        width: 0;
        flex: 1;
      }
    }

    button {
      display: flex;
      align-items: center;
      justify-content: center;
      box-sizing: border-box;
      width: 36px;
      height: 32px;
      padding: 0;
      border: none;
      outline: none;
      border-radius: 0 16px 16px 0;
      background-color: #ff6600;
      color: white;
      cursor: pointer;

      ion-icon {
        font-size: 16px;
      }
    }
  }

  .filter {
    display: grid;
    grid-template-columns: 64px 512px 64px 1fr;
    max-width: 896px;
    margin: 0 auto;
    text-align: left;
    justify-content: center;
    padding: 0 8px;

    @media screen and (max-width: 800px) {
      grid-template-columns: 64px fit-content(100%);

      div {
        flex-wrap: wrap;
      }
    }

    img {
      height: 32px;
    }

    div {
      display: flex;
      align-items: center;
    }

    label {
      display: flex;
      align-items: center;
      font-size: 16px;
      line-height: 16px;

      cursor: pointer;
    }

    .elements, .rarities {
      input[type=checkbox] {
        width: 0;
      }

      img {
        filter: grayscale(100%);

        &.checked {
          filter: none;
        }
      }
    }
    /*.elements {
      img {
        width: 32px;
      }
    }

    .rarities {

    }*/
  }

  .card-list {
    list-style: none;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(96px, 1fr));
    padding: 0 8px;
  }

  .btn {
    box-sizing: border-box;
    min-width: 48px;
    height: 32px;
    line-height: 32px;
    border: none;
    outline: none;
    background: none;
    background-color: #ff6600;
    color: white;
    border-radius: 8px;
    cursor: pointer;

    &:hover {
      background-color: #ff761b;
    }
  }

  .modal-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;

    display: flex;
    align-items: center;
    justify-content: center;

    background: #000000b4;
  }

  .category-modal {
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    width: min(600px, 100vw);
    height: 450px;
    background: white;
    align-items: center;

    border-radius: 16px;
    padding: 16px;

    .dark & {
      background-color: #414141;
    }

    .category-search {
      box-sizing: border-box;
      width: 384px;
      height: 32px;
      line-height: 32px;
      border: 1px solid #aaaaaa;
      outline: none;
      border-radius: 16px;
      padding: 0 8px;
    }

    .bool-tabs {
      display: flex;
      width: 256px;
      margin-top: 16px;

      div {
        flex: 1;
        box-sizing: border-box;
        height: 32px;
        line-height: 32px;
        border: 1px solid #aaaaaa;
        cursor: pointer;

        &.selected {
          border: none;
          background-color: #ff6600;
          color: white;
        }
      }

      div:first-child {
        border-radius: 16px 0 0 16px;
      }

      div:last-child {
        border-radius: 0 16px 16px 0;
        border-left: none;
      }
    }

    ul {
      list-style: none;
      flex: 1;
      overflow-y: auto;
      display: flex;
      flex-wrap: wrap;
      align-content: flex-start;
      gap: 8px;
      padding: 0 8px;

      &::-webkit-scrollbar {
        width: 4px;
      }

      &::-webkit-scrollbar-thumb {
        background: #aaaaaa;
        border-radius: 2px;
      }

      li {
        button {
          box-sizing: border-box;
          height: 24px;
          line-height: 24px;
          border-radius: 12px;
          padding: 0 8px;
          border: none;
          outline: none;
          background: #bebebe;
          color: white;
          cursor: pointer;

          &.selected {
            background: #ff6600;
          }
        }
      }
    }

    .buttons {
      text-align: right;
      align-self: flex-end;

      button {
        width: 72px;

        &:first-child {
          margin-right: 4px;
        }
      }
    }

    @media screen and (max-width: 480px) {
      width: 100%;
      height: 100%;
      border-radius: 0;

      .category-search {
        width: 100%;
      }
      
      .bool-tabs {
        width: 100%;
      }

      .buttons {
        display: flex;
        width: 100%;

        button {
          flex: 1;
        }
      }
    }
  }

  #super, #extreme {
    width: 0;
    height: 0;

    & + label::before {
      content: '';
      width: 24px;
      height: 24px;
      background-color: #bebebe;
      mask-image: url('../assets/checkbox.svg');
    }

    &:checked + label::before {
      background-color: #ff6600;
    }
  }
</style>