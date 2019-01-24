function convertBinaryStringToNumber(str) {
  let total = 0;

  // validate input
  const validationRegex = /^[01]+$/;
  if (!validationRegex.test(str)) {
    return total;
  }

  // split input string to bits reverse and loop
  str.split('').reverse().forEach((bit, index) => {
    if (bit === '0') {
      return;
    }

    // calculate sum of bits
    total += Math.pow(2, index);
  });

  return total;
}


function calculate() {
  // convert Arguments class to  arguments array
  const argsArr = Array.prototype.slice.call(arguments);

  // convert arguments and sum them all
  return argsArr.map(binStr => convertBinaryStringToNumber(binStr)).reduce((a, b) => a + b, 0);
}


console.assert(calculate('10', '10') === 4);
console.assert(calculate('10', '0') === 2);
console.assert(calculate('101', '10') === 7);
