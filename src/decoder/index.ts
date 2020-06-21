import typeDecoders from './decode';
import { hexToNumber } from './helpers';
import { PhotonPackage } from './decoder.models';

const debug = {
  0: false,//parseReliable,
  1: false,//parseBigReliable,
  4: false,//parseLogout,
  5: false,//parseReliable,
  6: true,//parseReliable,
  7: false,//parseUnreliable,
  8: false,//parseReliableFragment,
};

let cursor = 0;

export default function decodePackage(pkg: number[]): PhotonPackage {
  cursor = 0;
  
  const pack: PhotonPackage = {
    header: typeDecoders.decodePhotonHeader(pkg),
    commands: []
  };
  
  if (pack.header.challenge === 0) {
    return pack;
  }
  for (let i = 0; i < pack.header.command_count; i++) {
    const next = readNext(pkg, 1);
    
    const cmd_type_id = hexToNumber(next);
    const commandTypeMap = {
      0: parseReliable,
      1: parseBigReliable,
      2: parseReliable,
      4: parseLogout,
      5: parseReliable, 
      6: parseReliable,
      7: parseUnreliable,
      8: parseReliableFragment
    };
    if (commandTypeMap[cmd_type_id]) {
      const command = commandTypeMap[cmd_type_id](cmd_type_id, pkg) || {};
      pack.commands.push(command);
    } else {
      if (!isNaN(cmd_type_id)) {
        console.log('Out of bounds. Default process', cmd_type_id);
        const command = parseReliable(cmd_type_id, pkg);
        pack.commands.push(command);
      } else {
        // console.log('Not parsed. Type NaN', JSON.stringify(pkg));
      }
    }
  }
  return pack;
}

function readNext(pkg: number[], bytes: number): number[] {
  const oldCursor = cursor;
  cursor += bytes;
  return pkg.slice(oldCursor, bytes ? cursor : undefined);
}

function parseLogout(cmd_type_id, pkg) {
  const aoPkg = {
    cmd_type_id: cmd_type_id,
    channel_id: hexToNumber(readNext(pkg, 1)),
    flags: hexToNumber(readNext(pkg, 1)),
    reserved_byte: hexToNumber(readNext(pkg, 1)),
    msg_len: hexToNumber(readNext(pkg, 4)),
    reliable_sequence_number: hexToNumber(readNext(pkg, 4)),
    msg: ''
  };
  aoPkg.msg = readNext(pkg, aoPkg.msg_len - 12).join(',');
  return aoPkg;
}

function parseBigReliable(cmd_type_id, pkg) {
  const aoPkg = {
    cmd_type_id: cmd_type_id,
    channel_id: hexToNumber(readNext(pkg, 1)),
    flags: hexToNumber(readNext(pkg, 1)),
    reserved_byte: hexToNumber(readNext(pkg, 1)),
    msg_len: hexToNumber(readNext(pkg, 4)),
    whatever: hexToNumber(readNext(pkg, 4)),
    reliable_sequence_number: hexToNumber(readNext(pkg, 4)),
  };
  const msg = readNext(pkg, aoPkg.msg_len - 16);
  if (debug[cmd_type_id]) {
    console.log('BigReliable');
    console.table({
      ...aoPkg,
      msg: msg.toString()
    });
  }
}

function parseReliable(cmd_type_id, pkg) {
  const aoPkg = {
    cmd_type_id: cmd_type_id,
    channel_id: hexToNumber(readNext(pkg, 1)),
    flags: hexToNumber(readNext(pkg, 1)),
    reserved_byte: hexToNumber(readNext(pkg, 1)),
    msg_len: hexToNumber(readNext(pkg, 4)),
    reliable_sequence_number: hexToNumber(readNext(pkg, 4))
  };
  const headerLength = 12;
  const unknown = readNext(pkg, 1);
  const msg_type = readNext(pkg, 1)[0];
  const message = parsePayload(msg_type, readNext(pkg, aoPkg.msg_len - headerLength));
  
  return message;
}

function parseUnreliable(cmd_type_id, pkg) {
  const aoPkg = {
    cmd_type_id: cmd_type_id,
    channel_id: hexToNumber(readNext(pkg, 1)),
    flags: hexToNumber(readNext(pkg, 1)),
    reserved_byte: hexToNumber(readNext(pkg, 1)),
    msg_len: hexToNumber(readNext(pkg, 4)),
    unknown: hexToNumber(readNext(pkg, 4)),
    reliable_sequence_number: hexToNumber(readNext(pkg, 4))
  };
  const headerLength = 16;
  const unknown = readNext(pkg, 1);
  const msg_type = readNext(pkg, 1)[0];
  const unknown2 = readNext(pkg, 1);
  const unknown3 = readNext(pkg, 1);
  const message = parsePayload(msg_type, readNext(pkg, aoPkg.msg_len - headerLength));
  // const msg = readNext(pkg, aoPkg.msg_len - 12);
  // console.log('Unreliable');
  // console.table({
  //   ...aoPkg,
  //   msg: msg.toString()
  // });
  return message;
}

function parseReliableFragment(cmd_type_id, pkg) {
  const aoPkg = {
    cmd_type_id: cmd_type_id,
    channel_id: hexToNumber(readNext(pkg, 1)),
    flags: hexToNumber(readNext(pkg, 1)),
    reserved_byte: hexToNumber(readNext(pkg, 1)),
    msg_len: hexToNumber(readNext(pkg, 4)),
    reliable_sequence_number: hexToNumber(readNext(pkg, 4)),
  };
  const msg = readNext(pkg, aoPkg.msg_len - 12);
  console.log('ReliableFragment');
  console.table({
    ...aoPkg,
    msg: msg.toString()
  });
}

function parsePayload(msg_type: number, msg: number[]) {
  const msgTypeMap = {
    2: requestMessage,
    3: responseMessage,
    4: eventMessage
  };

  if (msg_type && msg.length) {
    if (msgTypeMap[msg_type]) {
      return msgTypeMap[msg_type](msg);
    } else {
      console.warn('Not typed message', msg_type, JSON.stringify(msg));
    }
  }
}

function requestMessage(msg) {
  // console.log('request');
  const code = msg.splice(0, 1);
  const intHash = typeDecoders.decodeIntHashMap(msg);
  return {
    code,
    intHash
  };
}

function responseMessage(msg) {
  console.log('response');
  console.log(msg.toString());
}

function eventMessage(msg) {
  // console.log('event');
  // console.log(msg.toString());
}
