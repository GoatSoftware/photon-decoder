import { hexToNumber } from './helpers';
import { PhotonPackageHeader } from './decoder.models';


/**
 *
 */
function decodeType(key_type_code: number, msg: number[]): unknown {
  const typeCodeParser: Record<number, (msg: number[]) => any> = {
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
function decodePhotonHeader(msg: number[]): PhotonPackageHeader {
  return {
    peer_id: hexToNumber(msg.splice(0, 2)),
    crc_enabled: hexToNumber(msg.splice(0, 1)),
    command_count: hexToNumber(msg.splice(0, 1)),
    timestamp: hexToNumber(msg.splice(0, 4)),
    challenge: hexToNumber(msg.splice(0, 4))
  };
}

/**
 *
 */
function decodeIntHashMap(msg: number[]): Record<number, unknown> {
  // console.log('decodeIntHashMap', JSON.stringify(msg));

  const size = decodeTypeShort(msg);
  const ret: Record<number, unknown> = {};
  for (let i = 0; i < size; i++) {
    const key = decodeTypeByte(msg);
    const key_type_code = decodeTypeByte(msg);
    ret[key] = decodeType(key_type_code, msg);
  }
  return ret;
}

/**
 *
 */
function decodeTypeNone(msg: number[]) {
  if (msg.length) {
    // console.warn('decodeTypeNone not implemented', JSON.stringify(msg));
  }
  return 'None';
}

/**
 *
 */
function decodeTypeNull(msg: number[]) {
  if (msg.length) {
    // console.warn('decodeTypeNull not implemented', JSON.stringify(msg));
  }
  return 'Null';
}

/**
 *
 */
function decodeTypeDictionary(msg: number[]) {
  const key_type_code = decodeTypeByte(msg);
  const value_type_code = decodeTypeByte(msg);
  const size = decodeTypeShort(msg);
  const ret: Record<string | number, unknown> = {};
  for (let i = 0; i < size; i++) {
    const key = decodeType(key_type_code, msg) as string | number;
    ret[key] = decodeType(value_type_code, msg);
  }
  return ret;
}

/**
 *
 */
function decodeTypeStringArray(msg: number[]) {
  const size = decodeTypeShort(msg);
  const value = [];
  for (let i = 0; i < size; i++) {
    value.push(decodeTypeString(msg));
  }
  return value;
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
  const float = msg.splice(0, 8);
  const buffer = new ArrayBuffer(8);
  const view = new DataView(buffer);

  float.forEach((i, index) => {
    view.setInt8(index, i);
  });

  return view.getFloat64(0);
}

/**
 *
 */
function decodeTypeEventData(msg: number[]) {
  const code = decodeTypeByte(msg);
  const parameters = decodeIntHashMap(msg);
  return {
    code,
    parameters
  };
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
  const size = decodeTypeShort(msg);
  const value = [];
  for (let i = 0; i < size; i++) {
    value.push(decodeTypeBoolean(msg));
  }
  return value;
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
  const code = decodeTypeByte(msg);
  const return_code = decodeTypeShort(msg);
  const maybe_debug_message_type_code = decodeTypeByte(msg);
  const maybe_debug_message = decodeType(maybe_debug_message_type_code, msg);
  const debug_message = maybe_debug_message ?? 'None';
  const parameters = decodeIntHashMap(msg);
  return {
    code,
    return_code,
    debug_message,
    parameters
  };
}

/**
 *
 */
function decodeTypeOperationRequest(msg: number[]) {
  const code = decodeTypeByte(msg);
  const parameters = decodeIntHashMap(msg);
  return {
    code,
    parameters
  };
}

/**
 *
 */
function decodeTypeString(msg: number[]): string {
  const size = decodeTypeShort(msg);
  const ret = [];
  for (let i = 0; i < size; i++) {
    ret.push(String.fromCharCode(msg.splice(0, 1)[0]));
  }
  return ret.join('');
}

/**
 *
 */
function decodeTypeByteArray(msg: number[]): number[] {
  const size = decodeTypeInteger(msg);
  if (size > msg.length) {
    throw new Error('Incorrect array size in decodeTypeByteArray');
  }
  const value: number[] = [];
  for (let i = 0; i < size; i++) {
    value.push(decodeTypeByte(msg));
  }
  return value;
}

/**
 *
 */
function decodeTypeArray(msg: number[]): unknown[] {
  const size = decodeTypeShort(msg);
  const key_type_code = decodeTypeByte(msg);
  const ret: unknown[] = [];
  for (let i = 0; i < size; i++) {
    ret.push(decodeType(key_type_code, msg));
  }
  return ret;
}

/**
 *
 */
function decodeTypeObjectArray(msg: number[]) {
  const size = decodeTypeShort(msg);
  const ret = [];
  for (let i = 0; i < size; i++) {
    const key_type_code = decodeTypeByte(msg);
    ret.push(decodeType(key_type_code, msg));
  }
  return ret;
}

export default {
  decodePhotonHeader,
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
