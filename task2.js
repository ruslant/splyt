// initialize numbers, value save as internal variable in closure
function initNumber(value) {
  return function(arg) {
    if (typeof arg === 'object') {
      if (!arg.operator || !arg.rightOperand) {
        throw new Error('Operators and operands sequence execution sequence error');
      }

      switch(arg.operator) {
        case '+':
          return value + arg.rightOperand;
        case '*':
          return value * arg.rightOperand;
        case '-':
          return value - arg.rightOperand;
        case '/':
          return value / arg.rightOperand;
        default:
          return 0;
      }
    } else {
      return {
        operator: null,
        rightOperand: value
      };
    }
  };
}

// initialize operators, operator saved as internal variable in closure
function initOperator(operator) {
  return function(obj) {
    if (typeof obj === 'object') {
      if (!obj.rightOperand) {
        throw new Error('Right operand not specified prior to calling operator');
      }

      obj.operator = operator;

      return obj;
    } else {
      return {
        operator: operator,
        rightOperand: obj
      };
    }
  };
}

const one = initNumber(1);
const two = initNumber(2);
const three = initNumber(3);
const four = initNumber(4);
const five = initNumber(5);
const six = initNumber(6);
const seven = initNumber(7);
const eight = initNumber(8);
const nine = initNumber(9);

const plus = initOperator('+');
const times = initOperator('*');
const minus = initOperator('-');
const dividedBy = initOperator('/');


console.assert(seven(times(five())) === 35);
console.assert(four(plus(nine())) === 13);
console.assert(eight(minus(three())) === 5);
console.assert(six(dividedBy(two())) === 3);

console.assert(eight(plus(two(times(seven(times(five())))))) === 78);