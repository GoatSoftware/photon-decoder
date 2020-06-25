import typeDecoders from './decode';
import { hexToNumber } from './helpers';
import { PhotonPackage, PhotonPackagePayload, PhotonPackageReliableCommand, PhotonPackageUnreliableCommand, PhotonPackageReliableFragmentCommand } from './decoder.models';
import { parsePayload, handleFragment } from './payload';

let cursor = 0;

export default function decodePackage(pkg: number[]): PhotonPackage {
  cursor = 0;

  const pack: PhotonPackage = {
    header: typeDecoders.decodePhotonHeader(pkg),
    commands: []
  };

  // TODO Review
  if (pack.header.challenge === 0) {
    return pack;
  }
  for (let i = 0; i < pack.header.command_count; i++) {
    const next = readNext(pkg, 1);

    const cmd_type_id = hexToNumber(next);
    const commandTypeMap = {
      4: parseLogout,
      7: parseUnreliable,
      8: parseReliableFragment
    };
    let parseFn = commandTypeMap[cmd_type_id];
    if (!parseFn) {
      parseFn = parseReliable;
    }
    const command = parseFn(cmd_type_id, pkg);
    if (command) {
      pack.commands.push(command);
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
  console.log('logout!', aoPkg);

  return aoPkg;
}

function parseReliable(cmd_type_id, pkg): PhotonPackagePayload {
  const aoPkg: PhotonPackageReliableCommand = {
    cmd_type_id: cmd_type_id,
    channel_id: hexToNumber(readNext(pkg, 1)),
    flags: hexToNumber(readNext(pkg, 1)),
    reserved_byte: hexToNumber(readNext(pkg, 1)),
    msg_len: hexToNumber(readNext(pkg, 4)),
    reliable_sequence_number: hexToNumber(readNext(pkg, 4))
  };
  const headerLength = 12;
  try {
    return parsePayload(readNext(pkg, aoPkg.msg_len - headerLength));
  } catch (e) {
    cursor += aoPkg.msg_len - 2;
  }
}

function parseUnreliable(cmd_type_id, pkg): PhotonPackagePayload {
  const aoPkg: PhotonPackageUnreliableCommand = {
    cmd_type_id: cmd_type_id,
    channel_id: hexToNumber(readNext(pkg, 1)),
    flags: hexToNumber(readNext(pkg, 1)),
    reserved_byte: hexToNumber(readNext(pkg, 1)),
    msg_len: hexToNumber(readNext(pkg, 4)),
    unknown: hexToNumber(readNext(pkg, 4)),
    reliable_sequence_number: hexToNumber(readNext(pkg, 4))
  };
  const headerLength = 16;
  try {
    return parsePayload(readNext(pkg, aoPkg.msg_len - headerLength));
  } catch (e) {
    cursor += aoPkg.msg_len - 2;
  }
}

function parseReliableFragment(cmd_type_id, pkg): PhotonPackagePayload | undefined {
  const aoPkg: PhotonPackageReliableFragmentCommand = {
    cmd_type_id: cmd_type_id,
    channel_id: hexToNumber(readNext(pkg, 1)),
    flags: hexToNumber(readNext(pkg, 1)),
    reserved_byte: hexToNumber(readNext(pkg, 1)),
    msg_len: hexToNumber(readNext(pkg, 4)),
    reliable_sequence_number: hexToNumber(readNext(pkg, 4)),
    origin_sequence_number: hexToNumber(readNext(pkg, 4)),
    fragment_length: hexToNumber(readNext(pkg, 4)),
    fragment_index: hexToNumber(readNext(pkg, 4)),
    operation_length: hexToNumber(readNext(pkg, 4)),
  };
  const msg = readNext(pkg, aoPkg.msg_len - 12);
  return handleFragment({
    ...aoPkg,
    msg
  });
}
