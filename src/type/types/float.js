import Base from './base/numeric';

export default class Float extends Base {

    _cast(value) {
        return parseFloat(value);
    }
}