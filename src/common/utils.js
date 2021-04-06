export function debounce(func, delay) {
  let timer = null;//闭包，timer不被销毁

  // ...args 意味着这里传参数可以不止传递一个
  return function (...args) {
    if (timer) clearInterval(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}