import * as constants from './../../constants';

export class InputDefinition {

  name;
  dataType;
  title;
  description;
  minOccurs;
  maxOccurs;
  defaultValue;
  allowedValues;

  constructor (
    name,
    dataType,
    title,
    description,
    minOccurs,
    maxOccurs,
    defaultValue,
    allowedValues
  ) {
    this.name = name || '';
    this.dataType = dataType || constants.STRING;
    this.title = title || '';
    this.description = description || '';
    this.minOccurs = minOccurs || 1;
    this.maxOccurs = maxOccurs || 1;
    this.defaultValue = defaultValue || '';
    this.allowedValues = allowedValues || [];
  }

  get selectable () {
    return this.allowedValues.length > 0;
  }

  get required () {
    return this.minOccurs > 0;
  }
}
