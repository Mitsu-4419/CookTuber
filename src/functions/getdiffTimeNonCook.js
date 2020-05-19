export function getdiffTimeNonCook(time) {
  let startTime = Number(time.seconds) * 1000;
  let nowTime = new Date().getTime();
  let minutes = 1000 * 60;
  let diffTime = Math.floor((nowTime - startTime) / minutes);
  if (diffTime <= 59) {
    let res = diffTime + "分前";
    return res;
  } else if (60 <= diffTime && diffTime <= 119) {
    let res = "1時間前";
    return res;
  } else if (120 <= diffTime && diffTime <= 179) {
    let res = "2時間前";
    return res;
  } else if (180 <= diffTime && diffTime <= 239) {
    let res = "3時間前";
    return res;
  } else if (240 <= diffTime && diffTime <= 719) {
    let res = "4時間以上";
    return res;
  } else if (720 <= diffTime && diffTime < 1440) {
    let res = "12時間以上前";
    return res;
  } else if (1440 <= diffTime && diffTime < 2880) {
    let res = "1日前";
    return res;
  } else if (2880 <= diffTime && diffTime < 4320) {
    let res = "2日前";
    return res;
  } else if (4320 <= diffTime && diffTime < 5760) {
    let res = "3日前";
    return res;
  } else if (5760 <= diffTime && diffTime < 7200) {
    let res = "4日前";
    return res;
  } else if (7200 <= diffTime && diffTime < 8640) {
    let res = "5日前";
    return res;
  } else if (8640 <= diffTime && diffTime < 10080) {
    let res = "6日前";
    return res;
  } else {
    let res = "１週間以上前";
    return res;
  }
}
