import Error from 'smart-error';

import BaseType from './type/base';
import Property from './property';

class BaseModel {

    _data = {};
    _changed = {};

    constructor() {
        this.constructor._properties.forEach((property) => {
            const key = property.name;
            Object.defineProperty(this, key, {
                set: (value) => this._changed[key] = property.cast(value),
                get: () => this._get(key),
                enumerable: true,
                configurable: false
            });
        });
    }

    toString() {
        return JSON.stringify(this);
    }

    /**
     * Gets the object of the fields of the model.
     * 
     * @param {string[]} [fields] list of field names
     */
    toJSON(fields = null) {
        const o = {};
        if (fields !== null && !(fields instanceof Array)) {
            fields = null;
        }
        this.constructor._properties.forEach((property) => {
            if (fields === null || fields.indexOf(property.name) >= 0) {
                o[property.name] = this._get(property.name, false);
            }
        });
        return o;
    }

    save(cb) {
        for (let key in this._changed) {
            this._data[key] = this._changed[key];
        }
        this._changed = {};
    }

    _get(key, useChanged = true) {
        if (useChanged && this._changed[key] !== undefined) {
            return this._changed[key];
        }
        if (this._data[key] !== undefined) {
            return this._data[key];
        }
        return this._getProperty(key).defaultValue;
    }

    /**
     * 
     * @param {string} key 
     * @returns {Property}
     */
    _getProperty(key) {
        for (let k in this.constructor._properties) {
            const property = this.constructor._properties[k];
            if (key === property.name) {
                return property;
            }
        }
        // This cannot happened
        throw new Error('Invalid property key', 'unsupported_operation');
    }
}

/**
 * @type {Property[]}
 */
BaseModel._properties = [];

/**
 * 
 * @param {string} name 
 * @param {BaseType} type 
 * @param {boolean} required 
 * @param {any} defaultValue 
 */
BaseModel.addProperty = function (name, type, required = false, defaultValue = null) {
    if (!(type instanceof BaseType)) {
        throw new Error('type is not instance of BaseType', 'unsupported_operation');
    }
    this._properties.push(new Property(name, type, required, defaultValue));
    return this;
}

export default BaseModel;