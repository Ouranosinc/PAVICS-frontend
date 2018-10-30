import { InputDefinition } from './InputDefinition';
import { WPS_TYPE_COMPLEXDATA } from './../constants';

export class WpsInput {

  inputDefinition;
  value;

  constructor (inputDefinition = new InputDefinition()) {
    this.inputDefinition = inputDefinition;
    if (inputDefinition.selectable) {
      this.value = inputDefinition.defaultValue ? [inputDefinition.defaultValue] : [];
    } else if (inputDefinition.dataType === WPS_TYPE_COMPLEXDATA) {
      this.value = '';
    } else {
      this.value = inputDefinition.defaultValue || '';
    }
  }

  cleaned() {
    let results;
    if (Array.isArray(this.value)) {
      results = this.value.map(val => {
        return {
          id: this.inputDefinition.id,
          value: val,
          type: this.inputDefinition.dataType
        };
      });
    }else {
      results = [{
        id: this.inputDefinition.id,
        value: this.value,
        type: this.inputDefinition.dataType
      }];
    }
    return results;
  }

  isValid() {
    return this.isTypeValid() && this.isValueDefined();
  }

  isTypeValid() {
    // TODO: Valid typeof value matches inputDefinition type/supportedValues/mimeType
    return true;
  }

  isValueDefined() {
    // TODO: Support string
    // TODO: Support array
    // TODO: Support other types like booleans, etc.
    if (this.inputDefinition.required) {
      return this.value !== ''
    } else {
      return true;
    }
  }
}
