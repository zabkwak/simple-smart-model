import Error from 'smart-error';

import Base from './base.nullable';

export default class String extends Base {

    cast(value) {
        if (value) {
            return value.toString();
        }
        return null;
    }
}