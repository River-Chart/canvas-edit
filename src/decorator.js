import * as utils from "./utils";

export function debounce(delay) {
  return function (target, key, descriptor) {
    const oldValue = descriptor.value;
    descriptor.value = utils.debounce(oldValue, delay);
    return descriptor;
  };
}
