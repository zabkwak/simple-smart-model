import Error from 'smart-error';

import Base from '../base';

export default class DateType extends Base {

    cast(value) {
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