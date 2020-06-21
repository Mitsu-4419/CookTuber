export function arrayElementIncludeOrNot(A, B) {
  if (B) {
    if (B.length == 0) {
      return false;
    } else {
      let TOrF = [];
      for (let a in A) {
        if (B.includes(A[a])) {
          TOrF.push("hoge");
        }
      }
      if (TOrF.length > 0) {
        return true;
      } else if (TOrF.length == 0) {
        return false;
      }
    }
  }
}
