export default {
  methods: {
    setTagArray(value) {
      if (value.includes("g")) {
        // すでに配列内にある場合はその要素を外す
        if (this.tagGenreArray.includes(value)) {
          let idx = this.tagGenreArray.indexOf(value);
          this.tagGenreArray.splice(idx, 1);
        } else {
          this.tagGenreArray.push(value);
        }
      } else if (value.includes("time")) {
        if (this.tagTimeArray.includes(value)) {
          let idx = this.tagTimeArray.indexOf(value);
          this.tagTimeArray.splice(idx, 1);
        } else {
          this.tagTimeArray.push(value);
        }
      }
    },
    setMenuTag(value) {
      if (value.includes("menu")) {
        if (
          this.tagMenuArray.length == 1 &&
          !this.tagMenuArray.includes(value)
        ) {
          let menuIndex;
          for (let i in this.$refs.menuchip) {
            if (this.$refs.menuchip[i].id == this.tagMenuArray[0]) {
              menuIndex = i;
            }
          }
          this.tagMenuArray.splice(0, 1);
          this.tagMenuArray.push(value);
          this.$refs.menuchip[menuIndex].resetChip();
        } else if (
          this.tagMenuArray.length == 1 &&
          this.tagMenuArray.includes(value)
        ) {
          this.tagMenuArray.splice(0, 1);
        } else {
          this.tagMenuArray.push(value);
        }
      } else if (value.includes("time")) {
        if (this.tagMenuTimeArray.includes(value)) {
          let idx = this.tagMenuTimeArray.indexOf(value);
          this.tagMenuTimeArray.splice(idx, 1);
        } else {
          this.tagMenuTimeArray.push(value);
        }
      }
    },
    setMaterialTag(value) {
      if (value.includes("mat")) {
        if (this.tagMaterialArray.includes(value)) {
          let idx = this.tagMaterialArray.indexOf(value);
          this.tagMaterialArray.splice(idx, 1);
        } else {
          this.tagMaterialArray.push(value);
        }
      } else if (value.includes("time")) {
        if (this.tagMaterialTimeArray.includes(value)) {
          let idx = this.tagMaterialTimeArray.indexOf(value);
          this.tagMaterialTimeArray.splice(idx, 1);
        } else {
          this.tagMaterialTimeArray.push(value);
        }
      }
    }
  }
};
