import Error from 'smart-error';

import Base from './';

export default class Nullable extends Base {

    getDefaultValue() {
        return null;
    }
}