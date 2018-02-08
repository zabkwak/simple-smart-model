import Base from './base/numeric';

export default class Integer extends Base {

    _cast(value) {
        return parseInt(value);
    }
}