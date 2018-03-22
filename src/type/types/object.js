import Error from 'smart-error';

import Base from './base/nullable';

export default class ObjectType extends Base {

    cast(value) {
        if (typeof value !== 'object') {
            this._throwInvalidCast(value);
        }
        return value;
    }
}