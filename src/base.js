import Error from 'smart-error';
import uniqid from 'uniqid';

import BaseType from './type/base';
import Property from './property';

/**
 * @type {Object.<string, Property[]>}
 */
const _properties = {};

export default class BaseModel {

    _data = {};
    _changed = {};

    /**
     * Unique identificator of the class.
     * @type {string}
     */
    static get id() {
        if (this.hasOwnProperty('__id__')) {
            return this.__id__;
        }
        this.__id__ = uniqid();
        return this.__id__;
    }

    /**
     * Adds the property to the class.
     * 
     * @param {string} name 
     * @param {BaseType} type 
     * @param {boolean} required 
     * @param {any} defaultValue 
     */
    static addProperty(name, type, required = false, defaultValue = null) {
        if (!(type instanceof BaseType)) {
            throw new Error('type is not instance of BaseType', 'unsupported_operation');
        }
        if (!_properties[this.id]) {
            _properties[this.id] = [];
        }
        _properties[this.id].push(new Property(name, type, required, defaultValue));
        return this;
    }

    /**
     * Gets the list of the properties assigned to the model and its parent class.
     * 
     * @returns {Property[]}
     */
    static getProperties() {
        const parentProperties = this.__proto__.getProperties ? this.__proto__.getProperties() : [];
        const childProperties = _properties[this.id] || [];
        return parentProperties.concat(childProperties);
    }

    constructor() {
        this._getProperties().forEach((property) => {
            const key = property.name;
            Object.defineProperty(this, key, {
                set: (value) => this._changed[key] = property.cast(value),
                get: () => this._get(key),
                enumerable: true,
                configurable: false
            });
        });
    }

    /**
     * Converts the model to JSON string.
     * 
     * @returns {string}
     */
    toString() {
        return JSON.stringify(this);
    }

    /**
     * Gets the object of the fields of the model.
     * 
     * @param {string[]} [fields] list of field names
     * @returns {Object}
     */
    toJSON(fields = null) {
        const o = {};
        if (fields !== null && !(fields instanceof Array)) {
            fields = null;
        }
        this._getProperties().forEach((property) => {
            if (fields === null || fields.indexOf(property.name) >= 0) {
                o[property.name] = this._get(property.name, false);
            }
        });
        return o;
    }

    /**
     * Saves the model. 
     * @todo 
     */
    save() {
        for (let key in this._changed) {
            this._data[key] = this._changed[key];
        }
        this._changed = {};
    }

    /**
     * Gets the value of the key in the data of the model.
     * 
     * @param {string} key Name of the property
     * @param {boolean} useChanged If true the value is searched in the changed fields so the model hasn't to be saved.
     * @returns {*}
     */
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
        const properties = this._getProperties();
        for (let k in properties) {
            const property = properties[k];
            if (key === property.name) {
                return property;
            }
        }
        // This cannot happened
        throw new Error('Invalid property key', 'unsupported_operation');
    }

    /**
     * Gets the list of the properties assigned to the model and its parent class.
     * 
     * @returns {Property[]}
     */
    _getProperties() {
        return this.constructor.getProperties();
    }
}