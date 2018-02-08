import Error from 'smart-error';

import Base from './base';

export default class BooleanType extends Base {

    cast(value) {
        if (typeof value === 'string') {
            if (['false', '0'].indexOf(value.trim()) >= 0) {
                return false;
            }
        }
        return Boolean(value);
    }

    getDefaultValue() {
        return false;
    }
}