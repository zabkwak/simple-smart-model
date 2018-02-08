import Integer from './integer';
import Float from './float';
import String from './string';
import DateType from './date';
import BooleanType from './boolean';

export default {
    integer: new Integer(),
    float: new Float(),
    string: new String(),
    date: new DateType(),
    boolean: new BooleanType()
}