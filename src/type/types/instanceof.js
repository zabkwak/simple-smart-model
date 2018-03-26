import Base from './base/nullable';

export default class ObjectType extends Base {

    _class = null;

    constructor(Class) {
        super();
        this._class = Class;
    }

    cast(value) {
        if (!(value instanceof this._class)) {
            this._throwInvalidCast(value);
        }
        return value;
    }
}