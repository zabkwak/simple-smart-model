import Error from 'smart-error';
import Type from 'runtime-type';

import Base from './base';

/**
 * Class for handling base models in the databases or remote apis. 
 * 
 * @todo cache
 * @todo do not load again
 */
export default class RemoteModel extends Base {

    /** @type {number} identificator of the instance */
    id = null;
    /** @type {Date} created time of the instance */
    created_time = null;
    /** @type {Date} updated time of the instance */
    updated_time = null;
    /** @type {boolean} */
    active = false;
    /** @private @type {boolean} */
    _loaded = false;

    constructor(id = null) {
        super();
        this.id = id;
    }

    toJSON(fields = null) {
        return {
            id: this.id,
            ...super.toJSON(fields),
            created_time: this.created_time,
            updated_time: this.updated_time,
            active: this.active
        }
    }

    /**
     * @returns {Promise.<RemoteModel>}
     */
    async save() {
        if (this.id && this._loaded) {
            super.save();
            this.updated_time = new Date();
            await this._update();
            return new Promise((resolve) => resolve(this));
        }
        if (this.id && !this._loaded) {
            await this.load();
            super.save();
            this.updated_time = new Date();
            await this._update();
            return new Promise((resolve) => resolve(this));
        }
        super.save();
        this.created_time = new Date();
        this.active = true;
        await this._create();
        return new Promise((resolve) => resolve(this));
    }

    /**
     * @returns {Promise.<RemoteModel>}
     */
    async load() {
        if (!this.id) {
            return new Promise((resolve, reject) => reject(new Error('Id not defined', 'unsupported_operation')));
        }
        const result = await this._load();
        return new Promise((resolve, reject) => {
            if (!result) {
                reject(new Error(`Instance of ${this.constructor.name} with id ${this.id} not found`, 'object_not_found', { class: this.constructor.name, id: this.id }));
                return;
            }
            const active = Type.boolean.cast(result.active);
            if (!active) {
                reject(new Error(`Instance of ${this.constructor.name} with id ${this.id} not found`, 'object_not_found', { class: this.constructor.name, id: this.id }));
                return;
            }
            this._setData(result);
            this._loaded = true;
            this.created_time = Type.date.cast(result.created_time);
            this.updated_time = Type.date.cast(result.updated_time);
            this.active = active;
            resolve(this);
        });
    }

    async delete(permanent = false) {
        if (!this.id) {
            return new Promise((resolve, reject) => reject(new Error('Id not defined', 'unsupported_operation')));
        }
        if (!permanent) {
            if (!this._loaded) {
                await this.load();
            }
            this.active = false;
            await this.save();
            return new Promise((resolve) => resolve());
        }
        return await this._delete();
    }

    async _create() {
        return new Promise((resolve, reject) => reject(new Error('Method _create not implemented', 'not_implemented', { class: this.constructor.name, method: '_create' })));
    }

    async _load() {
        return new Promise((resolve, reject) => reject(new Error('Method _load not implemented', 'not_implemented', { class: this.constructor.name, method: '_load' })));
    }

    async _update() {
        return new Promise((resolve, reject) => reject(new Error('Method _update not implemented', 'not_implemented', { class: this.constructor.name, method: '_update' })));
    }

    async _delete() {
        return new Promise((resolve, reject) => reject(new Error('Method _delete not implemented', 'not_implemented', { class: this.constructor.name, method: '_delete' })));
    }

}