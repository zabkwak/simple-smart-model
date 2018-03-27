import { expect } from 'chai';
import Error from 'smart-error';

import { RemoteModel, Type } from '../src';

const validateError = (error, code) => {
    code = `ERR_${code.toUpperCase()}`;
    expect(error).to.be.an('object');
    expect(error).to.be.an.instanceOf(Error);
    expect(error).to.have.all.keys(['message', 'code']);
    expect(error.code).to.be.equal(code);
}

describe('Not implemented methods', () => {

    class Child extends RemoteModel { }

    it('rejects the promise because the _create method is not implemented', async () => {
        const instance = new Child();
        //return expect(instance.save()).to.be.rejectedWith(Error).that.has.property('code', 'ERR_NOT_IMPLEMENTED');
        // return expect(Promise.reject(new Error())).should.be.rejectedWith(Error);
        //await expect(instance.save).to.throw(Error).that.has.property('code', 'ERR_NOT_IMPLEMENTED');
        try {
            await instance.save();
            throw new Error('The promise should reject', 'required_rejection');
        } catch (error) {
            if (error.code === 'ERR_REQUIRED_REJECTION') {
                throw error;
            }
            expect(error).to.be.an('object');
            expect(error).to.be.an.instanceOf(Error);
            expect(error).to.have.all.keys(['message', 'code', 'class', 'method']);
            expect(error.code).to.be.equal('ERR_NOT_IMPLEMENTED');
            expect(error.class).to.be.equal('Child');
            expect(error.method).to.be.equal('_create');
        }
    });

    it('rejects the promise because the _load method is not implemented', async () => {
        const instance = new Child(1);
        try {
            await instance.load();
            throw new Error('The promise should reject', 'required_rejection');
        } catch (error) {
            if (error.code === 'ERR_REQUIRED_REJECTION') {
                throw error;
            }
            expect(error).to.be.an('object');
            expect(error).to.be.an.instanceOf(Error);
            expect(error).to.have.all.keys(['message', 'code', 'class', 'method']);
            expect(error.code).to.be.equal('ERR_NOT_IMPLEMENTED');
            expect(error.class).to.be.equal('Child');
            expect(error.method).to.be.equal('_load');

        }
    });

    it('rejects the promise because the _update method is not implemented', async () => {
        const instance = new Child(1);
        instance._loaded = true; // If loaded is false _load method is called at first
        try {
            await instance.save();
            throw new Error('The promise should reject', 'required_rejection');
        } catch (error) {
            if (error.code === 'ERR_REQUIRED_REJECTION') {
                throw error;
            }
            expect(error).to.be.an('object');
            expect(error).to.be.an.instanceOf(Error);
            expect(error).to.have.all.keys(['message', 'code', 'class', 'method']);
            expect(error.code).to.be.equal('ERR_NOT_IMPLEMENTED');
            expect(error.class).to.be.equal('Child');
            expect(error.method).to.be.equal('_update');
        }
    });

    it('rejects the promise because the _delete method is not implemented', async () => {
        const instance = new Child(1);
        instance._loaded = true; // If loaded is false _load method is called at first
        try {
            await instance.delete(true);
            throw new Error('The promise should reject', 'required_rejection');
        } catch (error) {
            if (error.code === 'ERR_REQUIRED_REJECTION') {
                throw error;
            }
            expect(error).to.be.an('object');
            expect(error).to.be.an.instanceOf(Error);
            expect(error).to.have.all.keys(['message', 'code', 'class', 'method']);
            expect(error.code).to.be.equal('ERR_NOT_IMPLEMENTED');
            expect(error.class).to.be.equal('Child');
            expect(error.method).to.be.equal('_delete');
        }
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
        try {
            await new Child(1).load();
            throw new Error('The promise should reject', 'required_rejection');
        } catch (error) {
            if (error.code === 'ERR_REQUIRED_REJECTION') {
                throw error;
            }
            expect(error).to.be.an('object');
            expect(error).to.be.an.instanceOf(Error);
            expect(error).to.have.all.keys(['message', 'code', 'class', 'id']);
            expect(error.code).to.be.equal('ERR_OBJECT_NOT_FOUND');
            expect(error.class).to.be.equal('Child');
            expect(error.id).to.be.equal(1);
        }
        /*
        const inst = new Child(1);
        inst.load().then(() => Promise.reject('Expected method to reject.')).catch(isError).then((error) => {
            expect(error).to.be.an('object');
            expect(error).to.be.an.instanceOf(Error);
            expect(error).to.have.all.keys(['message', 'code', 'class', 'id']);
            expect(error.code).to.be.equal('ERR_OBJECT_NOT_FOUND');
            expect(error.class).to.be.equal('Child');
            expect(error.id).to.be.equal(1);
        });
        */
    });
});