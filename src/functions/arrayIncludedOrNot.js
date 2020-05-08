// Array a がArray　b　に完全に含まれているかどうかの判定

export function arrayIncludedOrNot(A, B) {
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
