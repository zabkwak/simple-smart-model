import Integer from './integer';
import Float from './float';
import String from './string';
import DateType from './date';
import BooleanType from './boolean';
import Enum from './enum';

export default {
    integer: new Integer(),
    float: new Float(),
    string: new String(),
    date: new DateType(),
    boolean: new BooleanType(),
    /**
     * 
     * @param {string} defaultValue 
     * @param {string[]} values 
     */
    enum: (defaultValue, ...values) => new Enum(defaultValue, ...values)
}