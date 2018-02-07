export default class Property {

    constructor(name, type, required = false, defaultValue = null) {
        this.name = name;
        this.type = type;
        this.required = required;
        try {
            this.defaultValue = type.cast(defaultValue);
        } catch (e) {
            if (e.code === 'ERR_INVALID_CAST') {
                this.defaultValue = type.getDefaultValue();
                return;
            }
            throw e;
        }
    }

    cast(value) {
        return this.type.cast(value);
    }
}