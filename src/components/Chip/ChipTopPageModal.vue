<template>
  <div>
    <q-chip
      size="11px"
      icon="star"
      clickable
      @click="setActiveTag"
      :class="active?'selected':'nonSelected'"
    >{{tag.tagName}}</q-chip>
  </div>
</template>

<script>
export default {
  props: ["tag", "id"],
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
      this.$emit("setActivatedTag", this.tag);
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
</style>