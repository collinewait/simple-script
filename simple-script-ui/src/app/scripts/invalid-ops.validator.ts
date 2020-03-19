import { AbstractControl } from '@angular/forms';

const validOperations = {
  'DoThisThing(string)': 1,
  'DoThatThing(integer)': 2,
  'DoTheOtherThing(float)': 3,
};

export const InvalidOps = (control: AbstractControl) => {
  if (!control.value) {
    return null;
  }
  const operations = control.value.split(',');
  const invalid = operations.some(operation => !(operation.trim() in validOperations));
  return invalid ? { invalidOps: true } : null;
};
