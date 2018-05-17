import BaseType from 'runtime-type/dist/types/base';

export default class Property {

    /**
     * 
     * @param {string} name 
     * @param {BaseType} type 
     * @param {boolean} required 
     * @param {*} defaultValue 
     */
    constructor(name, type, required = false, defaultValue = null) {
        this.name = name;
        this.type = type;
        this.required = required;
        this.defaultValue = type.isValid(defaultValue) ? type.cast(defaultValue) : type.getDefaultValue();
    }

    cast(value) {
        return this.type.cast(value);
    }
}