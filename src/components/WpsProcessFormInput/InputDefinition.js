import * as constants from './../../constants';

export class InputDefinition {

  id;
  dataType;
  title;
  abstract;
  minOccurs;
  maxOccurs;
  defaultValue;
  allowedValues;

  constructor (
    id,
    dataType,
    title,
    abstract,
    minOccurs,
    maxOccurs,
    defaultValue,
    allowedValues
  ) {
    this.id = id || '';
    this.dataType = dataType || constants.STRING;
    this.title = title || '';
    this.abstract = abstract || '';
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
