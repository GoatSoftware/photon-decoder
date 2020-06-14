import { hexToNumber } from './helpers';

const typeCodeParser = {
  0: decodeTypeNone,//'None', // 0x00
  42: decodeTypeNull,//'Null = ,', // 0x2A
  68: decodeTypeDictionary,//'Dictionary = ,', // 0x44
  97: decodeTypeStringArray,//'StringArray = ,', // 0x61
  98: decodeTypeByte,//'Byte = ,', // 0x62
  100: decodeTypeDouble,//'Double = ,', // 0x64
  101: decodeTypeEventData,//'EventData = ,', // 0x65
  102: decodeTypeFloat,//'Float = ,', // 0x66
  105: decodeTypeInteger,//'Integer = ,', // 0x69
  107: decodeTypeShort,//'Short = ,', // 0x6B
  108: decodeTypeLong,//'Long = ,', // 0x6C
  110: decodeTypeBooleanArray,//'BooleanArray = ,', // 0x6E
  111: decodeTypeBoolean,//'Boolean = ,', // 0x6F
  112: decodeTypeOperationResponse,//'OperationResponse = ,', // 0x70
  113: decodeTypeOperationRequest,//'OperationRequest = ,', // 0x71
  115: decodeTypeString,//'String = ,', // 0x73
  120: decodeTypeByteArray,//'ByteArray = ,', // 0x78
  121: decodeTypeArray,//'Array = ,', // 0x79
  122: decodeTypeObjectArray//'ObjectArray = ,' // 0x7A
};

function decodeIntHashMap(msg) {
  const size = hexToNumber(msg.splice(0, 2));
  const ret = {};
  for (let i = 0; i < size; i++) {
    const key = hexToNumber(msg.splice(0, 1));
    const key_type_code = hexToNumber(msg.splice(0, 1));
    if (typeCodeParser[key_type_code]) {
      ret[key] = typeCodeParser[key_type_code](msg);
    }
  }
  
  return ret;
}

function decodeTypeNone(msg) {
  console.warn('decodeTypeNone not implemented');
}

function decodeTypeNull(msg) {
  console.warn('decodeTypeNull not implemented');
}

function decodeTypeDictionary(msg) {
  console.warn('decodeTypeDictionary not implemented');
}

function decodeTypeStringArray(msg) {
  console.warn('decodeTypeStringArray not implemented');
}

function decodeTypeByte(msg) {
  console.warn('decodeTypeByte not implemented');
}

function decodeTypeDouble(msg) {
  console.warn('decodeTypeDouble not implemented');
}

function decodeTypeEventData(msg) {
  console.warn('decodeTypeEventData not implemented');
}

function decodeTypeFloat(msg) {
  return hexToNumber(msg.splice(0, 8));
}

function decodeTypeInteger(msg) {
  return hexToNumber(msg.splice(0, 4));
}

function decodeTypeShort(msg) {
  return hexToNumber(msg.splice(0, 2));
}

function decodeTypeLong(msg) {
  console.warn('decodeTypeLong not implemented');
}

function decodeTypeBooleanArray(msg) {
  console.warn('decodeTypeBooleanArray not implemented');
}

function decodeTypeBoolean(msg) {
  return msg.splice(0, 1)[0] === 1;
}

function decodeTypeOperationResponse(msg) {
  console.warn('decodeTypeOperationResponse not implemented');
}

function decodeTypeOperationRequest(msg) {
  console.warn('decodeTypeOperationRequest not implemented');
}

function decodeTypeString(msg) {
  console.warn('decodeTypeString not implemented');
}

function decodeTypeByteArray(msg) {
  console.warn('decodeTypeByteArray not implemented');
}

function decodeTypeArray(msg) {
  const size = hexToNumber(msg.splice(0, 2));
  const type = hexToNumber(msg.splice(0, 1));
  const ret = [];
  for (let i = 0; i < size; i++) {
    ret.push(typeCodeParser[type](msg));
  }
  console.log(ret[0] + ',' + ret[1]);
  return ret;
}

function decodeTypeObjectArray(msg) {
  console.warn('decodeTypeObjectArray not implemented');
}

export default {
  decodeIntHashMap,
  decodeTypeNone,
  decodeTypeNull,
  decodeTypeDictionary,
  decodeTypeStringArray,
  decodeTypeByte,
  decodeTypeDouble,
  decodeTypeEventData,
  decodeTypeFloat,
  decodeTypeInteger,
  decodeTypeShort,
  decodeTypeLong,
  decodeTypeBooleanArray,
  decodeTypeBoolean,
  decodeTypeOperationResponse,
  decodeTypeOperationRequest,
  decodeTypeString,
  decodeTypeByteArray,
  decodeTypeArray,
  decodeTypeObjectArray
};