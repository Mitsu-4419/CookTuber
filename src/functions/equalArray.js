export function equalArray(A, B) {
  if (A.length !== B.length) {
    return false;
  } else {
    let tfarray = [];
    for (let i in A) {
      if (A[i] == B[i]) {
        tfarray.push(true);
      }
    }
    if (tfarray.includes(false)) {
      return false;
    } else {
      return true;
    }
  }
}
