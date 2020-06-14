import typeDecoders from '../decode';

(function() {
  const result = typeDecoders.decodeTypeFloat([102, 68, 154, 81, 154, 0, 0, 0]);
  console.log(result);
})();

// 66 44 9A 51 9A 00 00 00
// 0110011001000100100110100101000110011010000000000000000000000000
//         01000100100110100101000110011010
