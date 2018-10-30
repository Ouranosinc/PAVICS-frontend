import * as constants from '../constants';

export class InputDefinition {

  id;
  dataType;
  title;
  abstract;
  minOccurs;
  maxOccurs;
  defaultValue;
  allowedValues;
  supportedValues;

  constructor (
    id = '',
    dataType = constants.WPS_TYPE_STRING,
    title = '',
    abstract = '',
    minOccurs = 1,
    maxOccurs = 1,
    defaultValue = '',
    allowedValues = [],
    supportedValues = []
  ) {
    this.id = id;
    this.dataType = dataType;
    this.title = title;
    this.abstract = abstract;
    this.minOccurs = minOccurs;
    this.maxOccurs = maxOccurs;
    this.defaultValue = defaultValue;
    this.allowedValues = allowedValues;
    this.supportedValues = supportedValues;
  }

  get selectable () {
    return this.allowedValues.length > 0;
  }

  get required () {
    return this.minOccurs > 0;
  }
}
