import { Cap, decoders } from 'cap';
const PROTOCOL = decoders.PROTOCOL;
import typeDecoders from './decode';
import { hexToNumber } from './helpers';

const c = new Cap();
const device = Cap.findDevice();
const port = '5056';
const filter = `udp and dst port ${port}`;
const bufSize = 10 * 1024 * 1024;
const buffer = Buffer.alloc(65535);
let cursor = 0;

const debug = {
  packetSeparator: false,
  0: false,//parseReliable,
  1: false,//parseBigReliable,
  4: false,//parseLogout,
  5: false,//parseReliable,
  6: true,//parseReliable,
  7: false,//parseUnreliable,
  8: false,//parseReliableFragment,
};

const msgTypeMap = {
  2: requestMessage,
  3: responseMessage,
  4: eventMessage
};

const linkType = c.open(device, filter, bufSize, buffer);

c.setMinBytes && c.setMinBytes(0);

console.info(`Listening ${port} packages`);

if (linkType === 'ETHERNET') {
  c.on('packet', function (nbytes, trunc) {
    const eth = decoders.Ethernet(buffer);
    if (eth.info.type === PROTOCOL.ETHERNET.IPV4) {
      const ip4 = decoders.IPV4(buffer, eth.offset);
      if (ip4.info.protocol === PROTOCOL.IP.UDP) {
        cursor = 0;

        const udp = decoders.UDP(buffer, ip4.offset);

        const pkg = buffer
          .toString('hex', udp.offset, udp.offset + udp.info.length)
          .match(/[0-9abcdef]{2}/g)
          .map((i) => parseInt(i, 16));

        readPackage(pkg);
      }
    }
  });
}

function readPackage(pkg) {
  const header = {
    peer_id: readNext(pkg, 2),
    crc_enabled: readNext(pkg, 1),
    command_count: parseInt(readNext(pkg, 1).join('')),
    timestamp: readNext(pkg, 4),
    challenge: readNext(pkg, 4),
  };

  if (debug.packetSeparator) {
    console.log('---------------------------------------------------------');
  }
  
  for (let i = 0; i < header.command_count; i++) {
    const cmd_type_id = hexToNumber(readNext(pkg, 1));
    const commandTypeMap = {
      0: parseReliable,
      1: parseBigReliable,
      4: parseLogout,
      5: parseReliable,
      6: parseReliable,
      7: parseUnreliable,
      8: parseReliableFragment,
    };
    if (commandTypeMap[cmd_type_id]) {
      commandTypeMap[cmd_type_id](cmd_type_id, pkg);
    } else {
      console.log('Not parsed: ', cmd_type_id);
    }
  }
  
}

function readNext(pkg, bytes) {
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
  };
  const msg = readNext(pkg, aoPkg.msg_len - 12);
  console.log('Logout');
  console.table({
    ...aoPkg,
    msg: msg.toString()
  });
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
    reliable_sequence_number: hexToNumber(readNext(pkg, 4)),
  };
  if (debug[cmd_type_id]) {
    const unknown = readNext(pkg, 1);
    const msg_type = readNext(pkg, 1);
    if (msgTypeMap[msg_type]) {
      const msg = readNext(pkg, aoPkg.msg_len - 12);
      msgTypeMap[msg_type](msg);
    }
  }
}

function parseUnreliable(cmd_type_id, pkg) {
  const aoPkg = {
    cmd_type_id: cmd_type_id,
    channel_id: hexToNumber(readNext(pkg, 1)),
    flags: hexToNumber(readNext(pkg, 1)),
    reserved_byte: hexToNumber(readNext(pkg, 1)),
    msg_len: hexToNumber(readNext(pkg, 4)),
    reliable_sequence_number: hexToNumber(readNext(pkg, 4)),
  };
  const msg = readNext(pkg, aoPkg.msg_len - 12);
  console.log('Unreliable');
  console.table({
    ...aoPkg,
    msg: msg.toString()
  });
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

function requestMessage(msg) {
  // console.log('request');
  const code = msg.splice(0, 1);
  typeDecoders.decodeIntHashMap(msg);
  // const code = msg.splice(0, 1);
  // console.log(msg.toString());
}

function responseMessage(msg) {
  console.log('response');
  console.log(msg.toString());
}

function eventMessage(msg) {
  console.log('event');
  console.log(msg.toString());
}
