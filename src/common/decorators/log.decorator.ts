import { Logger } from '@nestjs/common';

export function Log() {
  return function (_, method: string, descriptor: PropertyDescriptor) {
    const original = descriptor.value;
    descriptor.value = function (...args: any[]) {
      Logger.log(method);
      return original.call(this, ...args);
    };
  };
}
