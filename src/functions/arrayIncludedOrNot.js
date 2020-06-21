// Array a がArray　b　に完全に含まれているかどうかの判定
// A,Bは配列出なくてはいけない

export function arrayIncludedOrNot(A, B) {
  // Tagが付いていないVideoを弾く
  if (B) {
    if (B.length == 0) {
      return false;
    } else {
      let TOrF = [];
      for (let a in A) {
        if (!B.includes(A[a])) {
          TOrF.push("hoge");
        }
      }
      if (TOrF.length > 0) {
        return false;
      } else if (TOrF.length == 0) {
        return true;
      }
    }
  }
}
