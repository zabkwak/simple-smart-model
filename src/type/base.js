import Error from 'smart-error';

export default class Type {

    getDefaultValue() { throw new Error(`Method ${this.constructor.name}.getDefaultValue() not implemented`, 'not_implemented'); }

    cast(value) { throw new Error(`Method ${this.constructor.name}.cast(value) not implemented`, 'not_implemented'); }

    getName() {
        return this.constructor.name;
    }

    _throwInvalidCast(value) {
        throw new Error(`Value ${value} cannot be cast to ${this.getName().toLowerCase()}`, 'invalid_cast');
    }
}