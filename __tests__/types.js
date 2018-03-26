import { expect } from 'chai';
import Error from 'smart-error';
import { Type } from '../src';
import BaseType from '../src/type/types/base';

const castError = (type, value) => {
    expect(type.cast.bind(type, value)).to.throw(Error).that.has.property('code', 'ERR_INVALID_CAST');
}

describe('Any type', () => {

    const values = [5, '5', 5.5, 'abc', null, undefined, new Date(), { a: 5 }, [5], { 5: 5 }];

    it('checks the validators', () => {
        values.forEach(value => expect(Type.any.isValid(value)).to.be.true);
    });

    it('casts the values to the any', () => {
        values.forEach(value => expect(Type.any.cast(value)).to.be.equal(value));
    });
});

describe('Integer type', () => {

    const valid = [5, '5', 5.5, '5abc'];
    const invalid = [null, undefined, 'abc5', new Date(), { a: 5 }, [5], { 5: 5 }];

    it('checks the validators', () => {
        valid.forEach(value => expect(Type.integer.isValid(value)).to.be.true);
        invalid.forEach(value => expect(Type.integer.isValid(value)).to.be.false);
    });

    it('casts the values to the integer', () => {
        valid.forEach(value => expect(Type.integer.cast(value)).to.be.equal(5));
        invalid.forEach(value => expect(castError(Type.integer, value)));
    });
});

describe('Boolean type', () => {

    const t = [5, '5', 'true'];
    const f = [0, '0', 'false'];

    it('checks the validators', () => {
        t.forEach(value => expect(Type.boolean.isValid(value)).to.be.true);
        f.forEach(value => expect(Type.boolean.isValid(value)).to.be.true);
    });

    it('casts the values to the boolean', () => {
        t.forEach(value => expect(Type.boolean.cast(value)).to.be.true);
        f.forEach(value => expect(Type.boolean.cast(value)).to.be.false);
    });
});

describe('Object type', () => {

    class Test { }

    const valid = [null, {}, { a: 5 }, [], [5], new Date(), new Test(), new Error()];
    const invalid = [undefined, true, false, 5, 5.5];

    it('checks the validators', () => {
        valid.forEach(value => expect(Type.object.isValid(value)).to.be.true);
        invalid.forEach(value => expect(Type.object.isValid(value)).to.be.false);
    });

    /*it('casts the values to the boolean', () => {
        t.forEach(value => expect(Type.boolean.cast(value)).to.be.true);
        f.forEach(value => expect(Type.boolean.cast(value)).to.be.false);
    });*/
});

describe('Enum type', () => {

    const en = Type.enum('test', 'test', 'baf');

    it('checks if enum has all values', (done) => {
        expect(en).to.be.an.instanceOf(BaseType);
        expect(en.defaultValue).to.be.equal('test');
        expect(en.values).to.have.all.members(['test', 'baf']);
        done();
    });

    // TODO better describe
    it('casts the value to the enum', (done) => {
        expect(en.cast('test')).to.be.equal('test');
        done();
    });

    // TODO better describe
    it('tries to cast invalid value of the enum', (done) => {
        castError(en, 'lek');
        done();
    });
});