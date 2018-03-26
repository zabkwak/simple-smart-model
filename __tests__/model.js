import { expect } from 'chai';

import { BaseModel as Base, Type } from '../src';

class BaseModel extends Base { }

// TODO remove done
// TODO chai throw function
const validateError = (error, code) => {
    code = `ERR_${code.toUpperCase()}`;
    expect(error).to.be.an('object');
    expect(error).to.be.an.instanceOf(Error);
    expect(error).to.have.all.keys(['message', 'code']);
    expect(error.code).to.be.equal(code);
}

BaseModel
    .addProperty('integer', Type.integer)
    .addProperty('float', Type.float)
    .addProperty('string', Type.string)
    .addProperty('boolean', Type.boolean)
    .addProperty('object', Type.object)
    .addProperty('instance', Type.instanceOf(Date))
    .addProperty('definedDefaultInteger', Type.integer, false, -1)
    .addProperty('definedDefaultFloat', Type.float, false, -0.99)
    .addProperty('definedDefaultString', Type.string, false, 'default string')
    .addProperty('definedDefaultBoolean', Type.boolean, false, true)
    .addProperty('definedDefaultObject', Type.object, false, {});

const fields = ['integer', 'float', 'string', 'boolean', 'object', 'instance', 'definedDefaultInteger', 'definedDefaultFloat', 'definedDefaultString', 'definedDefaultBoolean', 'definedDefaultObject'];

const json = '{"integer":0,"float":0,"string":null,"boolean":false,"object":null,"instance":null,"definedDefaultInteger":-1,"definedDefaultFloat":-0.99,"definedDefaultString":"default string","definedDefaultBoolean":true,"definedDefaultObject":{}}';

describe('Model properties', () => {

    it('checks if the instance of the model has all properties', (done) => {
        const instance = new BaseModel();
        expect(instance).to.be.an('object');
        expect(instance).to.be.an.instanceOf(BaseModel);
        expect(instance).to.have.all.keys(fields.concat(['_data', '_changed']));
        done();
    });
});

describe('Model default values', () => {

    const instance = new BaseModel();

    it('checks if the instance of the model has integer default values', (done) => {
        expect(instance.integer).to.be.equal(0);
        expect(instance.definedDefaultInteger).to.be.equal(-1);
        done();
    });

    it('checks if the instance of the model has float default values', (done) => {
        expect(instance.float).to.be.equal(0);
        expect(instance.definedDefaultFloat).to.be.equal(-0.99);
        done();
    });

    it('checks if the instance of the model has string default values', (done) => {
        expect(instance.string).to.be.null;
        expect(instance.definedDefaultString).to.be.equal('default string');
        done();
    });

    it('checks if the instance of the model has boolean default values', (done) => {
        expect(instance.boolean).to.be.false;
        expect(instance.definedDefaultBoolean).to.be.true;
        done();
    });

    it('checks if the instance of the model has object default values', (done) => {
        expect(instance.object).to.be.null;
        expect(JSON.stringify(instance.definedDefaultObject)).to.be.equal('{}');
        done();
    });

    it('checks if the instance of the model has instance default values', () => {
        expect(instance.instance).to.be.null;
    });
});

describe('Model setters', () => {

    const instance = new BaseModel();

    describe('integer', () => {

        it('sets the integer value', (done) => {
            instance.integer = 5;
            expect(instance.integer).to.be.equal(5);
            done();
        });

        it('sets the integer represented by string', (done) => {
            instance.integer = '5';
            expect(instance.integer).to.be.equal(5);
            done();
        });

        it('tries to set string value as an integer', (done) => {
            try {
                instance.integer = 'string';
            } catch (e) {
                validateError(e, 'invalid_cast');
                done();
            }
        });

        it('tries to set null as an integer', (done) => {
            try {
                instance.integer = null;
            } catch (e) {
                validateError(e, 'invalid_cast');
                done();
            }
        });

        it('tries to set undefined as an integer', (done) => {
            try {
                instance.integer = undefined;
            } catch (e) {
                validateError(e, 'invalid_cast');
                done();
            }
        });
    });

    describe('float', () => {

        it('sets the float value', (done) => {
            instance.float = 5.5;
            expect(instance.float).to.be.equal(5.5);
            done();
        });

        it('sets the float represented by string', (done) => {
            instance.float = '5.5';
            expect(instance.float).to.be.equal(5.5);
            done();
        });

        it('tries to set string value as a float', (done) => {
            try {
                instance.float = 'string';
            } catch (e) {
                validateError(e, 'invalid_cast');
                done();
            }
        });

        it('tries to set null as a float', (done) => {
            try {
                instance.float = null;
            } catch (e) {
                validateError(e, 'invalid_cast');
                done();
            }
        });

        it('tries to set undefined as a float', (done) => {
            try {
                instance.float = undefined;
            } catch (e) {
                validateError(e, 'invalid_cast');
                done();
            }
        });

    });

    describe('string', () => {

        it('sets the string value', (done) => {
            instance.string = 'string';
            expect(instance.string).to.be.equal('string');
            done();
        });

        it('sets the string value as null', (done) => {
            instance.string = null;
            expect(instance.string).to.be.null;
            done();
        });

        it('sets the string value as undefined', (done) => {
            instance.string = undefined;
            expect(instance.string).to.be.null;
            done();
        });

        it('sets the string value as empty string', (done) => {
            instance.string = '';
            expect(instance.string).to.be.null;
            done();
        });
    });

    describe('object', () => {

        it('sets the empty object to object field', () => {
            instance.object = {};
            expect(JSON.stringify(instance.object)).to.be.equal('{}');
        });

        it('sets the array to object field', () => {
            instance.object = [];
            expect(JSON.stringify(instance.object)).to.be.equal('[]');
        });

        it('tries to set integer value to object field', () => {
            try {
                instance.object = 5;
            } catch (e) {
                validateError(e, 'invalid_cast');
            }
        });

        it('tries to set integer value to object field', () => {
            try {
                instance.object = 5;
            } catch (e) {
                validateError(e, 'invalid_cast');
            }
        });

        it('tries to set string value to object field', () => {
            try {
                instance.object = 'string';
            } catch (e) {
                validateError(e, 'invalid_cast');
            }
        });

        it('tries to set boolean value to object field', () => {
            try {
                instance.object = true;
            } catch (e) {
                validateError(e, 'invalid_cast');
            }
        });
    });

    describe('instance', () => {

        it('sets the current date to the instance field', () => {
            instance.instance = new Date();
        });

        it('tries to set integer value to instance field', () => {
            try {
                instance.instance = 5;
            } catch (e) {
                validateError(e, 'invalid_cast');
            }
        });
    });
});

describe('toJSON', () => {

    const instance = new BaseModel();

    it('converts the instance to JSON without save', (done) => {
        const o = instance.toJSON();
        expect(o).to.have.all.keys(fields);
        expect(o.integer).to.be.equal(0);
        expect(o.float).to.be.equal(0);
        expect(o.string).to.be.null;
        expect(o.boolean).to.be.false;
        expect(o.instance).to.be.null;
        expect(o.definedDefaultInteger).to.be.equal(-1);
        expect(o.definedDefaultFloat).to.be.equal(-0.99);
        expect(o.definedDefaultString).to.be.equal('default string');
        expect(JSON.stringify(o.definedDefaultObject)).to.be.equal('{}');
        done();
    });

    it('converts the instance to JSON after save without changing any of values', (done) => {
        instance.save();
        const o = instance.toJSON();
        expect(o).to.have.all.keys(fields);
        expect(o.integer).to.be.equal(0);
        expect(o.float).to.be.equal(0);
        expect(o.string).to.be.null;
        expect(o.boolean).to.be.false;
        expect(o.instance).to.be.null;
        expect(o.definedDefaultInteger).to.be.equal(-1);
        expect(o.definedDefaultFloat).to.be.equal(-0.99);
        expect(o.definedDefaultString).to.be.equal('default string');
        expect(JSON.stringify(o.definedDefaultObject)).to.be.equal('{}');
        done();
    });

    it('converts the instance to JSON after save with change of the integer value', (done) => {
        instance.integer = 5;
        instance.save();
        const o = instance.toJSON();
        expect(o).to.have.all.keys(fields);
        expect(o.integer).to.be.equal(5);
        expect(o.float).to.be.equal(0);
        expect(o.string).to.be.null;
        expect(o.boolean).to.be.false;
        expect(o.instance).to.be.null;
        expect(o.definedDefaultInteger).to.be.equal(-1);
        expect(o.definedDefaultFloat).to.be.equal(-0.99);
        expect(o.definedDefaultString).to.be.equal('default string');
        expect(JSON.stringify(o.definedDefaultObject)).to.be.equal('{}');
        done();
    });

    it('converts the instance to JSON without save with specified field', (done) => {
        const o = instance.toJSON(['integer']);
        expect(o).to.have.all.keys(['integer']);
        expect(o.integer).to.be.equal(5);
        done();
    });

    it('converts the instance to JSON without save with string fields attribute', (done) => {
        const o = instance.toJSON('integer');
        expect(o).to.have.all.keys(fields);
        expect(o.integer).to.be.equal(5);
        expect(o.float).to.be.equal(0);
        expect(o.string).to.be.null;
        expect(o.boolean).to.be.false;
        expect(o.instance).to.be.null;
        expect(o.definedDefaultInteger).to.be.equal(-1);
        expect(o.definedDefaultFloat).to.be.equal(-0.99);
        expect(o.definedDefaultString).to.be.equal('default string');
        expect(JSON.stringify(o.definedDefaultObject)).to.be.equal('{}');
        done();
    });
});

describe('toString', () => {

    const instance = new BaseModel();

    it('converts the instance to string', (done) => {
        expect(instance.toString()).to.be.equal(json);
        done();
    });
});

describe('Inheritance', () => {

    class ChildModel extends BaseModel { }
    ChildModel.addProperty('child_property', Type.string);

    it('creates a sub-class with new property', (done) => {
        const parent = new BaseModel();
        const child = new ChildModel();
        expect(parent).to.be.an('object');
        expect(parent).to.be.an.instanceOf(BaseModel);
        expect(parent).to.have.all.keys(fields.concat(['_data', '_changed']));

        expect(child).to.be.an('object');
        expect(child).to.be.an.instanceOf(BaseModel);
        expect(child).to.be.an.instanceOf(ChildModel);
        expect(child).to.have.all.keys(fields.concat(['_data', '_changed', 'child_property']));

        done();
    });

    it('creates a sub-class of the sub-class', (done) => {
        const parent = new ChildModel();
        class ChildChildModel extends ChildModel { }
        ChildChildModel.addProperty('child_child_property', Type.string);
        const child = new ChildChildModel();
        expect(parent).to.be.an('object');
        expect(parent).to.be.an.instanceOf(BaseModel);
        expect(child).to.be.an.instanceOf(ChildModel);
        expect(parent).to.have.all.keys(fields.concat(['_data', '_changed', 'child_property']));

        expect(child).to.be.an('object');
        expect(child).to.be.an.instanceOf(BaseModel);
        expect(child).to.be.an.instanceOf(ChildModel);
        expect(child).to.be.an.instanceOf(ChildChildModel);
        expect(child).to.have.all.keys(fields.concat(['_data', '_changed', 'child_property', 'child_child_property']));

        done();
    });

    it('creates a sub-class of the base class with new property', (done) => {
        const parent = new BaseModel();
        class ChildChildModel extends BaseModel { }
        const child = new ChildChildModel();
        expect(parent).to.be.an('object');
        expect(parent).to.be.an.instanceOf(BaseModel);
        expect(parent).to.have.all.keys(fields.concat(['_data', '_changed']));

        expect(child).to.be.an('object');
        expect(child).to.be.an.instanceOf(BaseModel);
        expect(child).to.be.an.instanceOf(ChildChildModel);
        expect(child).to.have.all.keys(fields.concat(['_data', '_changed']));

        done();
    });
});