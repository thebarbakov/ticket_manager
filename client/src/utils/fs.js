export function fs(num, a, b, c) {
  if ((num / 10) % 10 != 1 && num % 10 == 1) return a;
  if ((num / 10) % 10 != 1 && num % 10 >= 2 && num % 10 <= 4) return b;
  return c;
}
