function add(a, b) {
  return a + b;
};

// get function arguments names
function getFunctionArgNames(func) {
  const regex = /function.*?\(([^)]*)\)/;
  const argsString = func.toString().match(regex)[1];

  return argsString.split(',').map(x => x.trim());
}

function defaultArguments(func, argObj) {
  const originalFuncArgNames = func.originalFuncArgNames || getFunctionArgNames(func);

  let augmentedFunction = function() {
    let execArgs = Array.prototype.slice.call(arguments);

    let callArgs = [];
    originalFuncArgNames.forEach((arg, index) => {
      if (index < execArgs.length && execArgs[index]) {
        callArgs.push(execArgs[index]);
      } else if (argObj[arg]) {
        callArgs.push(argObj[arg]);
      }
    });

    return func.apply(null, callArgs);
  };

  augmentedFunction.originalFuncArgNames = originalFuncArgNames;

  return augmentedFunction;
}


const add2 = defaultArguments(add, { b: 9 });
console.assert(add2(10) === 19);
console.assert(add2(10, 7) === 17);
console.assert(isNaN(add2()));

const add3 = defaultArguments(add2, { b: 3, a: 2 });
console.assert(add3(10) === 13);
console.assert(add3() === 5);
console.assert(add3(undefined, 10) === 12);

const add4 = defaultArguments(add, { c: 3 }); // doesn't do anything, since c isn't
console.assert(isNaN(add4(10)));
console.assert(add4(10, 10) === 20);