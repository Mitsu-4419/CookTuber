export function setTagArray(value, tagArray, ref) {
  // if (value.includes("g")) {
  //   ref = "genrechip";
  // } else if (value.includes("menu")) {
  //   ref = "menuchip";
  // } else if (value.includes("mat")) {
  //   ref = "materialchip";
  // } else if (value.includes("time")) {
  //   if (tagArray.includes(value)) {
  //     const idx = tagArray.indexOf(value);
  //     tagArray.slice(idx, 1);
  //   } else {
  //     tagArray.push(value);
  //   }
  // }
  if (tagArray.length == 1 && !tagArray.includes(value)) {
    let index;
    for (let i in this.$refs[ref]) {
      if (this.$refs[ref][i].id == tagArray[0]) {
        index = i;
      }
    }
    tagArray.splice(0, 1, value);
    this.$refs[ref][index].resetChip();
  } else if (tagArray.length == 1 && tagArray.includes(value)) {
    tagArray.slice(0, 1);
  } else {
    tagArray.push(value);
  }
}
