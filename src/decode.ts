import { hexToNumber } from './helpers';


/**
 * 
 */
function decodeType(key_type_code: number, msg: number[]): unknown {
  const typeCodeParser = {
    0: decodeTypeNone,                  // 0x00
    42: decodeTypeNull,                 // 0x2A
    68: decodeTypeDictionary,           // 0x44
    97: decodeTypeStringArray,          // 0x61
    98: decodeTypeByte,                 // 0x62
    100: decodeTypeDouble,              // 0x64
    101: decodeTypeEventData,           // 0x65
    102: decodeTypeFloat,               // 0x66
    105: decodeTypeInteger,             // 0x69
    107: decodeTypeShort,               // 0x6B
    108: decodeTypeLong,                // 0x6C
    110: decodeTypeBooleanArray,        // 0x6E
    111: decodeTypeBoolean,             // 0x6F
    112: decodeTypeOperationResponse,   // 0x70
    113: decodeTypeOperationRequest,    // 0x71
    115: decodeTypeString,              // 0x73
    120: decodeTypeByteArray,           // 0x78
    121: decodeTypeArray,               // 0x79
    122: decodeTypeObjectArray          // 0x7A
  };

  if (typeCodeParser[key_type_code]) {
    return typeCodeParser[key_type_code](msg);
  }
  return;
}

/**
 * 
 */
function decodeIntHashMap(msg: number[]): Record<number, unknown> {
  const size = hexToNumber(msg.splice(0, 2));
  const ret = {};
  for (let i = 0; i < size; i++) {
    const key = hexToNumber(msg.splice(0, 1));
    const key_type_code = hexToNumber(msg.splice(0, 1));
    ret[key] = decodeType(key_type_code, msg);
  }
  return ret;
}

/**
 * 
 */
function decodeTypeNone(msg: number[]) {
  console.warn('decodeTypeNone not implemented');
}

/**
 * 
 */
function decodeTypeNull(msg: number[]) {
  console.warn('decodeTypeNull not implemented');
}

/**
 * 
 */
function decodeTypeDictionary(msg: number[]) {
  console.warn('decodeTypeDictionary not implemented');
}

/**
 * 
 */
function decodeTypeStringArray(msg: number[]) {
  console.warn('decodeTypeStringArray not implemented');
}

/**
 * 
 */
function decodeTypeByte(msg: number[]): number {
  return hexToNumber(msg.splice(0, 1));
}

/**
 * 
 */
function decodeTypeDouble(msg: number[]): number {
  return hexToNumber(msg.splice(0, 8));
}

/**
 * 
 */
function decodeTypeEventData(msg: number[]) {
  let code: u8 = self.decode()?;
  let parameters: HashMap<u8, Value> = self.decode()?;
  Ok(EventData { code, parameters })
  console.warn('decodeTypeEventData not implemented');
}

/**
 * 
 */
function decodeTypeFloat(msg: number[]): number {
  const float = msg.splice(0, 4);
  const buffer = new ArrayBuffer(4);
  const view = new DataView(buffer);

  float.forEach((i, index) => {
    view.setInt8(index, i);
  });
  
  return view.getFloat32(0);
}

/**
 * 
 */
function decodeTypeInteger(msg: number[]): number {
  return hexToNumber(msg.splice(0, 4));
}

/**
 * 
 */
function decodeTypeShort(msg: number[]): number {
  return hexToNumber(msg.splice(0, 2));
}

/**
 * 
 */
function decodeTypeLong(msg: number[]): number {
  return hexToNumber(msg.splice(0, 10));
}

/**
 * 
 */
function decodeTypeBooleanArray(msg: number[]) {
  console.warn('decodeTypeBooleanArray not implemented');
}

/**
 * 
 */
function decodeTypeBoolean(msg: number[]): boolean {
  return msg.splice(0, 1)[0] === 1;
}

/**
 * 
 */
function decodeTypeOperationResponse(msg: number[]) {
  console.warn('decodeTypeOperationResponse not implemented');
}

/**
 * 
 */
function decodeTypeOperationRequest(msg: number[]) {
  console.warn('decodeTypeOperationRequest not implemented');
}

/**
 * 
 */
function decodeTypeString(msg: number[]): string {
  const size = hexToNumber(msg.splice(0, 2));
  const ret = [];
  for (let i = 0; i < size; i++) {
    ret.push(String.fromCharCode(msg.splice(0, 1)[0]));
  }
  return ret.join('');
}

/**
 * 
 */
function decodeTypeByteArray(msg: number[]) {
  console.warn('decodeTypeByteArray not implemented');
}

/**
 * 
 */
function decodeTypeArray(msg: number[]): number[] {
  const size = hexToNumber(msg.splice(0, 2));
  const key_type_code = hexToNumber(msg.splice(0, 1));
  const ret = [];
  for (let i = 0; i < size; i++) {
    ret.push(decodeType(key_type_code, msg));
  }
  return ret;
}

/**
 * 
 */
function decodeTypeObjectArray(msg: number[]) {
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