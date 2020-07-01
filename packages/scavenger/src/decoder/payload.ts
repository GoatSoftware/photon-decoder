import typeDecoders from './decode';
import { PhotonPackagePayload, PhotonPackageReliableFragmentCommand } from './decoder.models';

let fragments: PhotonPackageReliableFragmentCommand[] = [];

export function parsePayload(msg: number[]): PhotonPackagePayload {
  const msgTypeMap: Record<number, (msg_type: number, msg: number[]) => PhotonPackagePayload> = {
    2: requestMessage,
    3: responseMessage,
    4: eventMessage
  };

  const unknown = msg.splice(0, 1);
  const msg_type = msg.splice(0, 1)[0];

  const msgFn = msgTypeMap[msg_type];

  if (msgFn) {
    return msgFn(msg_type, msg);
  } else {
    throw new Error(`Unkown message type ${msg_type}`);
  }
}

function requestMessage(msg_type: number, msg: number[]): PhotonPackagePayload {
  const code = msg.splice(0, 1)[0];
  const parameters = typeDecoders.decodeIntHashMap(msg);
  return {
    msg_type,
    code,
    parameters
  };
}

function responseMessage(msg_type: number, msg: number[]): PhotonPackagePayload {
  const code = msg.splice(0, 1)[0];
  const return_code = msg.splice(0, 2).join();
  const debug = msg.splice(0, 1)[0];
  const parameters = typeDecoders.decodeIntHashMap(msg);
  return {
    msg_type,
    code,
    return_code,
    debug,
    parameters
  };
}

function eventMessage(msg_type: number, msg: number[]): PhotonPackagePayload {
  const code = msg.splice(0, 1)[0];
  const parameters = typeDecoders.decodeIntHashMap(msg);
  return {
    msg_type,
    code,
    parameters
  };
}

export function handleFragment(pkg: PhotonPackageReliableFragmentCommand): PhotonPackagePayload | undefined {
  const matchingFragments = fragments.filter(i => i.origin_sequence_number === pkg.origin_sequence_number);
  if (matchingFragments.length + 1 === pkg.fragment_length) {
    fragments = fragments.filter(i => i.origin_sequence_number !== pkg.origin_sequence_number);
    matchingFragments.push(pkg);
    const concatedMsg = matchingFragments
      .sort((a, b) => a.fragment_index - b.fragment_index)
      .reduce((acc, i) => {
        return acc.concat(i.msg.slice(4));
      }, [] as number[]);
    return parsePayload(concatedMsg);
  } else {
    fragments.push(pkg);
  }
  return;
}
