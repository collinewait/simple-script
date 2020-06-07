import { AbstractControl } from '@angular/forms';

const validOperations = {
  'DoThisThing(string)': 1,
  'DoThatThing(integer)': 2,
  'DoTheOtherThing(float)': 3
};

export const InvalidOps = (control: AbstractControl) => {
  if (!control.value) {
    return null;
  }
  const operations = control.value.split(',');
  const invalid = operations.some((operation: string) => !validOperations.hasOwnProperty(operation.trim()));
  return invalid ? { invalidOps: true } : null;
};

export const InvalidScript = (control: AbstractControl) => {
  if (!control.value) {
    return null;
  }
  const operations = control.value.split('\\n');
  const invalid = operations.some((operation: string) => !validOperations.hasOwnProperty(operation.trim()));
  return invalid ? { invalidScript: true } : null;
};
