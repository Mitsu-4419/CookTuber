<template>
  <q-card class="chooseTagModal">
    <q-card-section>
      <span class="chooseTagModal-title">料理の種類</span>
      <!-- <q-separator style="width:98%;margin-left:auto;margin-right:auto;height:3px;margin-top:3px;"></q-separator> -->
      <div class="chooseTagModal-TagWrapper row">
        <ChipComponent
          v-for="tag in Object.keys(sortedTag('countryLarge'))"
          :key="tag"
          :tagName="allTags[tag].tagName"
          :id="tag"
          @setActivatedTag="setTagArray"
          :TAGArray="TAGArray"
        />
      </div>
      <!-- </q-card-section>
      <q-card-section>-->
      <!-- <span class="chooseTagModal-title">材料</span>
      <q-separator style="width:98%;margin-left:auto;margin-right:auto;height:3px;margin-top:3px;"></q-separator>-->
      <span class="chooseTagModal-title">肉</span>
      <div class="chooseTagModal-TagWrapper row">
        <ChipComponent
          v-for="tag in Object.keys(sortedTag('meatSmall'))"
          :key="tag"
          :tagName="allTags[tag].tagName"
          :id="tag"
          @setActivatedTag="setTagArray"
          :TAGArray="TAGArray"
        />
      </div>
      <span class="chooseTagModal-title">魚</span>
      <div class="chooseTagModal-TagWrapper row">
        <ChipComponent
          v-for="tag in Object.keys(sortedTag('fishSmall'))"
          :key="tag"
          :tagName="allTags[tag].tagName"
          :id="tag"
          @setActivatedTag="setTagArray"
          :TAGArray="TAGArray"
        />
      </div>
      <span class="chooseTagModal-title">ご飯もの</span>
      <div class="chooseTagModal-TagWrapper row">
        <ChipComponent
          v-for="tag in Object.keys(sortedTag('riceSmall'))"
          :key="tag"
          :tagName="allTags[tag].tagName"
          :id="tag"
          @setActivatedTag="setTagArray"
          :TAGArray="TAGArray"
        />
      </div>
      <span class="chooseTagModal-title">やさい</span>
      <div class="chooseTagModal-TagWrapper row">
        <ChipComponent
          v-for="tag in Object.keys(sortedTag('vegetableSmall'))"
          :key="tag"
          :tagName="allTags[tag].tagName"
          :id="tag"
          @setActivatedTag="setTagArray"
          :TAGArray="TAGArray"
        />
      </div>
      <span class="chooseTagModal-title">めん類</span>
      <div class="chooseTagModal-TagWrapper row">
        <ChipComponent
          v-for="tag in Object.keys(sortedTag('noodleSmall'))"
          :key="tag"
          :tagName="allTags[tag].tagName"
          :id="tag"
          @setActivatedTag="setTagArray"
          :TAGArray="TAGArray"
        />
      </div>
      <!-- </q-card-section>
      <q-card-section>-->
      <span class="chooseTagModal-title">所用時間</span>
      <!-- <q-separator style="width:98%;margin-left:auto;margin-right:auto;height:3px;margin-top:3px;"></q-separator> -->
      <div class="chooseTagModal-TagWrapper row">
        <ChipComponent
          v-for="tag in Object.keys(sortedTag('time'))"
          :key="tag"
          :tagName="allTags[tag].tagName"
          :id="tag"
          @setActivatedTag="setTagArray"
          :TAGArray="TAGArray"
        />
      </div>
    </q-card-section>
    <q-card-actions align="right" class="q-mt-md">
      <q-btn label="OK" color="light-green-4" v-close-popup @click="$emit('closeModal')" />
    </q-card-actions>
  </q-card>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
export default {
  props: ["TAGArray", "tag"],
  data() {
    return {
      tagArray: [],
      cookVideoTagSort: {}
    };
  },
  computed: {
    ...mapState("tags", ["allTags"]),
    ...mapGetters("tags", ["sortedTag"]),
    ...mapGetters("videos", [
      "sortByTagOfCookVideosTop5",
      "sortByTagOfCookVideos"
    ])
  },
  methods: {
    setTagArray(value) {
      // すでに配列内にある場合はその要素を外す
      if (this.tagArray.includes(value)) {
        let idx = this.tagArray.indexOf(value);
        this.tagArray.splice(idx, 1);
        let payload = this.tagArray;
        this.$emit("setTagArray", payload);
        if (this.tag == "topPage") {
          this.$emit("setCookVideo", this.sortByTagOfCookVideosTop5(payload));
        } else if (this.tag == "videoPage") {
          this.$emit("setCookVideo", this.sortByTagOfCookVideos(payload));
        }
      } else {
        this.tagArray.push(value);
        let payload = this.tagArray;
        this.$emit("setTagArray", payload);
        if (this.tag == "topPage") {
          this.$emit("setCookVideo", this.sortByTagOfCookVideosTop5(payload));
        } else if (this.tag == "videoPage") {
          this.$emit("setCookVideo", this.sortByTagOfCookVideos(payload));
        }
      }
    }
  },
  components: {
    ChipComponent: require("components/Chip/ChipComponent.vue").default
  },
  created() {
    if (this.TAGArray.length > 0) {
      for (let k in this.TAGArray) {
        this.tagArray.push(this.TAGArray[k]);
      }
    }
  }
};
</script>

<style>
.chooseTagModal {
  min-width: 500px;
}
.chooseTagModal-title {
  font-size: 15px;
  font-weight: bold;
  margin-left: 8px;
}
.chooseTagModal-TagWrapper {
  min-height: 50px;
  padding: 5px;
}
</style>