import { expect, assert } from 'chai';
import Error from 'smart-error';

import { RemoteModel, Type } from '../src';

const validateError = (error, code) => {
    code = `ERR_${code.toUpperCase()}`;
    expect(error).to.be.an('object');
    expect(error).to.be.an.instanceOf(Error);
    expect(error).to.have.all.keys(['message', 'code']);
    expect(error.code).to.be.equal(code);
}

function isError(e) {
    if (typeof e === 'string') {
        return Promise.reject(new Error(e));
    }
    return Promise.resolve(e);
}

describe('Not implemented methods', () => {

    class Child extends RemoteModel { }
    const instance = new Child();

    it('rejects the promise because the _create method is not implemented', async () => {
        // expect(instance.save.bind(instance)).to.throw(Error).that.has.property('code', 'ERR_NOT_IMPLEMENTED');

        instance.save().catch(isError).then((error) => {
            expect(error).to.be.an('object');
            expect(error).to.be.an.instanceOf(Error);
            expect(error).to.have.all.keys(['message', 'code', 'class', 'method']);
            expect(error.code).to.be.equal('ERR_NOT_IMPLEMENTED');
            expect(error.class).to.be.equal('Child');
            expect(error.method).to.be.equal('_create');
        });
    });
});

describe('CRUD', () => {

    class Child extends RemoteModel {
        static _db = {};
        async _create() {
            return new Promise((resolve) => {
                this.id = Object.keys(this.constructor._db).length + 1;
                this.constructor._db[this.id] = this.toJSON();
                resolve();
            });
        }
        async _load() {
            return new Promise((resolve, reject) => {
                resolve(this.constructor._db[this.id]);
            });
        }
        async _update() {
            return new Promise((resolve, reject) => {
                this.constructor._db[this.id] = this.toJSON();
                resolve();
            });
        }
        async _delete() {
            return new Promise((resolve) => {
                this.constructor._db[this.id] = null;
                resolve();
            });
        }
    }

    it('saves the model which does not exist', async () => {
        const instance = new Child();
        expect(instance).to.have.all.keys(['id', 'created_time', 'updated_time', 'active', '_changed', '_data', '_loaded']);
        expect(instance.id).to.be.null;
        expect(instance.created_time).to.be.null;
        expect(instance.updated_time).to.be.null;
        const result = await instance.save();

        expect(result).to.be.equal(instance);
        expect(instance).to.have.all.keys(['id', 'created_time', 'updated_time', 'active', '_changed', '_data', '_loaded']);
        expect(instance.id).to.be.equal(1);
        expect(instance.created_time).to.be.not.null;
        expect(instance.updated_time).to.be.null;
        expect(instance.active).to.be.true;
    });

    it('loads the model', async () => {
        const instance = new Child(1);
        expect(instance).to.have.all.keys(['id', 'created_time', 'updated_time', 'active', '_changed', '_data', '_loaded']);
        expect(instance.id).to.be.equal(1);
        expect(instance.created_time).to.be.null;
        expect(instance.updated_time).to.be.null;

        const result = await instance.load();

        expect(result).to.be.equal(instance);
        expect(instance).to.have.all.keys(['id', 'created_time', 'updated_time', 'active', '_changed', '_data', '_loaded']);
        expect(instance.id).to.be.equal(1);
        expect(instance.created_time).to.be.not.null;
        expect(instance.updated_time).to.be.null;
        expect(instance.active).to.be.true;
    });

    it('updates the model with defined id without load', async () => {
        const instance = new Child(1);
        expect(instance).to.have.all.keys(['id', 'created_time', 'updated_time', 'active', '_changed', '_data', '_loaded']);
        expect(instance.id).to.be.equal(1);
        expect(instance.created_time).to.be.null;
        expect(instance.updated_time).to.be.null;

        const result = await instance.save();

        expect(result).to.be.equal(instance);
        expect(instance.id).to.be.equal(1);
        expect(instance.created_time).to.be.not.null;
        expect(instance.updated_time).to.be.not.null;
        expect(instance.active).to.be.true;
    });

    it('deletes the model with defined id without load', async () => {
        const instance = new Child(1);
        expect(instance).to.have.all.keys(['id', 'created_time', 'updated_time', 'active', '_changed', '_data', '_loaded']);
        expect(instance.id).to.be.equal(1);
        expect(instance.created_time).to.be.null;
        expect(instance.updated_time).to.be.null;
        await instance.delete();

        const inst = new Child(1);
        inst.load().catch(isError).then((error) => {
            expect(error).to.be.an('object');
            expect(error).to.be.an.instanceOf(Error);
            expect(error).to.have.all.keys(['message', 'code', 'class', 'id']);
            expect(error.code).to.be.equal('ERR_OBJECT_NOT_FOUND');
            expect(error.class).to.be.equal('Child');
            expect(error.id).to.be.equal(1);
        });

    });
});