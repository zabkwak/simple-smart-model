import Integer from './types/integer';
import Float from './types/float';
import String from './types/string';
import DateType from './types/date';
import BooleanType from './types/boolean';
import ObjectType from './types/object';
import Enum from './types/enum';
import Any from './types/any';

export default {
    integer: new Integer(),
    float: new Float(),
    string: new String(),
    date: new DateType(),
    boolean: new BooleanType(),
    object: new ObjectType(),
    any: new Any(),
    /**
     * 
     * @param {string} defaultValue 
     * @param {string[]} values 
     */
    enum: (defaultValue, ...values) => new Enum(defaultValue, ...values)
}