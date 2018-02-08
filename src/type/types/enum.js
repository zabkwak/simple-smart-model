import SmartError from 'smart-error';

import Base from '../base';

export default class Enum extends Base {

    /**
     * 
     * @param {string} defaultValue 
     * @param {string[]} values 
     */
    constructor(defaultValue, ...values) {
        super();
        if (values.indexOf(defaultValue) < 0) {
            throw new Error('Default value of the enum is not in defined values', 'unsupported_operation');
        }
        this.defaultValue = defaultValue;
        this.values = values;
    }

    cast(value) {
        if (!value || this.values.indexOf(value.toString().trim()) < 0) {
            this._throwInvalidCast(value);
        }
        return value;
    }

    getDefaultValue() {
        return this.defaultValue;
    }
}