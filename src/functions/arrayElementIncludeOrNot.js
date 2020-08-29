export function arrayElementIncludeOrNot(A, B) {
  if (B) {
    return A.some(c => B.includes(c));
  } else {
    return false;
  }
}
