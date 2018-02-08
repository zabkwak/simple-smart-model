import { expect } from 'chai';
import Error from 'smart-error';
import { Type } from '../src';

const castError = (type, value) => {
    expect(type.cast.bind(type, value)).to.throw(Error).that.has.property('code', 'ERR_INVALID_CAST');
}

describe('Integer type', () => {

    it('casts integer value to integer', (done) => {
        expect(Type.integer.cast(5)).to.be.equal(5);
        done();
    });

    it('casts number as a string to integer', (done) => {
        expect(Type.integer.cast('5')).to.be.equal(5);
        done();
    });

    it('casts float value to integer', (done) => {
        expect(Type.integer.cast(5.5)).to.be.equal(5);
        done();
    });

    it('casts valid string value to integer', (done) => {
        expect(Type.integer.cast('5abc')).to.be.equal(5);
        done();
    });

    it('tries to cast null to integer', (done) => {
        castError(Type.integer, null);
        done();
    });

    it('tries to cast undefined to integer', (done) => {
        castError(Type.integer, undefined);
        done();
    });

    it('tries to cast invalid string to integer', (done) => {
        castError(Type.integer, 'abc5');
        done();
    });

    it('tries to cast Date instance to integer', (done) => {
        castError(Type.integer, new Date());
        done();
    });

    it('tries to cast object to integer', (done) => {
        castError(Type.integer, { a: 5 });
        done();
    });

    it('tries to cast array to integer', (done) => {
        castError(Type.integer, [5]);
        done();
    });

    it('tries to cast object with numeric key to integer', (done) => {
        castError(Type.integer, { 5: 5 });
        done();
    });
});

describe('Boolean type', () => {

    it('casts the number value to boolean', (done) => {
        expect(Type.boolean.cast(5)).to.be.true;
        done();
    });

    it('casts the number as string value to boolean', (done) => {
        expect(Type.boolean.cast('5')).to.be.true;
        done();
    });

    it('casts 0 to boolean', (done) => {
        expect(Type.boolean.cast(0)).to.be.false;
        done();
    });

    it('casts 0 as string value to boolean', (done) => {
        expect(Type.boolean.cast('0')).to.be.false;
        done();
    });

    it('casts string true to boolean', (done) => {
        expect(Type.boolean.cast('true')).to.be.true;
        done();
    });

    it('casts string false to boolean', (done) => {
        expect(Type.boolean.cast('false')).to.be.false;
        done();
    });
});