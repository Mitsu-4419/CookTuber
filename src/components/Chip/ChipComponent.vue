<template>
  <div>
    <q-chip
      id="chipSizeLarge"
      size="12px"
      icon="star"
      clickable
      @click="setActiveTag"
      :class="active?'selected':'nonSelected'"
    >{{tagName}}</q-chip>
    <q-chip
      id="chipSizeMedium"
      size="10.5px"
      icon="star"
      clickable
      @click="setActiveTag"
      :class="active?'selected':'nonSelected'"
    >{{tagName}}</q-chip>
    <q-chip
      id="chipSizeSmall"
      size="9.5px"
      icon="star"
      clickable
      @click="setActiveTag"
      :class="active?'selected':'nonSelected'"
    >{{tagName}}</q-chip>
  </div>
</template>

<script>
export default {
  props: ["tagName", "id", "TAGArray", "flag"],
  data() {
    return {
      active: false
    };
  },
  methods: {
    setActiveTag() {
      if (this.active) {
        this.active = false;
      } else {
        this.active = true;
      }
      this.$emit("setActivatedTag", this.id);
    }
  },
  created() {
    if (this.TAGArray && this.TAGArray.includes(this.id)) {
      this.active = true;
    }
  }
};
</script>

<style>
.selected {
  background-color: rgb(152, 149, 149);
}
.nonSelected {
  background-color: rgb(234, 237, 234);
}
@media screen and (min-width: 1001px) {
  #chipSizeMedium {
    display: none;
  }
  #chipSizeSmall {
    display: none;
  }
}
@media screen and (min-width: 910px) and (max-width: 1000px) {
  #chipSizeLarge {
    display: none;
  }
  #chipSizeSmall {
    display: none;
  }
}
@media screen and (min-width: 500px) and (max-width: 909px) {
  #chipSizeLarge {
    display: none;
  }
  #chipSizeMedium {
    display: none;
  }
}
</style>