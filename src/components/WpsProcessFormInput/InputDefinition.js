import * as constants from './../../constants';

export class InputDefinition {
  name;
  dataType;
  title;
  description;
  required;
  defaultValue;
  maxOccurs;
  allowedValues;
  constructor (
    name,
    dataType,
    title,
    description,
    required,
    defaultValue,
    maxOccurs,
    allowedValues
  ) {
    this.name = name || '';
    this.dataType = dataType || constants.STRING;
    this.title = title || '';
    this.description = description || '';
    this.required = required || true;
    this.defaultValue = defaultValue || '';
    this.maxOccurs = maxOccurs || 1;
    this.allowedValues = allowedValues || [];
  }
}
