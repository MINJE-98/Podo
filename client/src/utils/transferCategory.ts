import category from "./Category.json";

export default function transferCategory(data: number): string {
  if (data === 0) {
    return category[0];
  }
  if (data === 1) {
    return category[1];
  }
  if (data === 2) {
    return category[2];
  }
  if (data === 3) {
    return category[3];
  } else {
    return "알수없음";
  }
}
