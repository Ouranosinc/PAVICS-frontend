import { InputDefinition } from './InputDefinition';

export class WpsInput {

  inputDefinition;
  value;

  constructor (inputDefinition = new InputDefinition(), value = '') {
    this.inputDefinition = inputDefinition,
    this.value = value;
  }

  // TODO: Valid typeof value matches inputDefinition type/supportedValues/mimeType
  isValid() {

  }

  isEmpty() {
    // TODO: Support string
    // TODO: Support array
    // TODO: Support other types like booleans, etc.
  }
}
