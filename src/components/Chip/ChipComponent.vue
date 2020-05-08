<template>
  <q-chip
    size="12px"
    icon="star"
    clickable
    @click="setActiveTag"
    :class="active?'selected':'nonSelected'"
  >{{tagName}}</q-chip>
</template>

<script>
export default {
  props: ["tagName", "id"],
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
  }
};
</script>

<style>
.selected {
  background-color: yellow;
}
.nonSelected {
  background-color: green;
}
</style>