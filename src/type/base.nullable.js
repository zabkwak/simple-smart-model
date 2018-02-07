import Error from 'smart-error';

import Base from './base';

export default class Nullable extends Base {

    getDefaultValue() {
        return null;
    }
}