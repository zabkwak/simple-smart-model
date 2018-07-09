import Error from 'smart-error';
import uniqid from 'uniqid';
import Type from 'runtime-type';

import Property from './property';

export default class BaseModel {

    /** @type {Object.<string, any>} */
    _data = {};
    /** @type {Object.<string, any>} */
    _changed = {};

    /**
     * Unique identificator of the class.
     * 
     * @type {string}
     */
    static get id() {
        if (!this.hasOwnProperty('__id__')) {
            this.__id__ = uniqid();
        }
        return this.__id__;
    }

    /**
     * List of assigned properties.
     * 
     * @type {Property[]}
     */
    static get _properties() {
        if (!this.hasOwnProperty('__properties__')) {
            this.__properties__ = [...(this.__proto__._properties || [])];
        }
        return this.__properties__;
    }

    /**
     * Adds the property to the class.
     * 
     * @param {string} name 
     * @param {Type.Type} type 
     * @param {boolean} required 
     * @param {*} defaultValue 
     */
    static addProperty(name, type, required = false, defaultValue = null) {
        if (!(type instanceof Type.Type)) {
            throw new Error('type is not instance of BaseType', 'unsupported_operation');
        }
        this._properties.push(new Property(name, type, required, defaultValue));
        return this;
    }

    constructor() {
        this._setProperties();
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
     * @param {string[]} fields list of field names
     * @returns {Object}
     */
    toJSON(fields = null) {
        const o = {};
        if (fields !== null && !(fields instanceof Array)) {
            fields = null;
        }
        this._getProperties().forEach((property) => {
            if (fields === null || fields.includes(property.name)) {
                o[property.name] = this._get(property.name, false);
            }
        });
        return o;
    }

    /**
     * Saves the model. 
     * 
     * @todo required fields
     */
    save() {
        for (let key in this._changed) {
            this._data[key] = this._changed[key];
        }
        this._changed = {};
    }

    /**
     * Sets the default data.
     * 
     * @param {Object.<string, any>} data 
     * @protected
     */
    _setData(data) {
        this._getProperties().forEach((property) => {
            if (data[property.name] === undefined) {
                return;
            }
            this._data[property.name] = property.cast(data[property.name]);
        });
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
     * Gets the property from the assigned properties by its key.
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
     * Sets the assigned properties to the instance.
     */
    _setProperties() {
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
     * Gets the list of the properties assigned to the model and its parent class.
     * 
     * @returns {Property[]}
     */
    _getProperties() {
        return this.constructor._properties;
    }
}