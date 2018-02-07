import Error from 'smart-error';

import Base from './base';

export default class Numeric extends Base {

    cast(value) {
        if (value instanceof Array) {
            this._throwInvalidCast(value);
        }
        const v = this._cast(value);
        if (isNaN(v)) {
            this._throwInvalidCast(value);
        }
        return v;
    }

    getDefaultValue() {
        return 0;
    }

    _cast(value) {
        throw new Error(`Method ${this.constructor.name}._cast(value) not implemented`, 'not_implemented');
    }
}