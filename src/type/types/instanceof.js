import Error from 'smart-error';
import Base from './base/nullable';

export default class InstanceOf extends Base {

    _class = null;

    constructor(Class) {
        super();
        this._class = Class;
    }

    cast(value) {
        if (!(value instanceof this._class)) {
            throw new Error(`Value ${value} must be an instance of ${this._class.name}`, 'invalid_cast');
        }
        return value;
    }
}