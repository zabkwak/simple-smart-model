import Error from 'smart-error';

import Base from './base/nullable';

export default class DateType extends Base {

    cast(value) {
        if (value === null) {
            return null;
        }
        const v = new Date(value);
        /*if (isNaN(v)) {
            this._throwInvalidCast(value, 'date');
        }*/
        return v;
    }

    getDefaultValue() {
        return new Date();
    }
}