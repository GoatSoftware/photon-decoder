import { PhotonPackagePayload } from '../decoder/decoder.models';

const requestMessageMap = {
  21: true
};

const responseMessageMap = {
  35: true
};

export function knownPackages(command: PhotonPackagePayload): boolean {
  const messagesMap = {
    2: knownRequests,
    3: knownResponses,
    4: knownEvents,
  };

  if (messagesMap[command.msg_type]) {
    return messagesMap[command.msg_type](command);
  }
  return false;
}

function knownRequests(command: PhotonPackagePayload) {
  return requestMessageMap[command.parameters[253] as number];
}

function knownResponses(command: PhotonPackagePayload) {
  return responseMessageMap[command.parameters[253] as number];
}

function knownEvents(command: PhotonPackagePayload) {
  return command.code !== 2;
  // return command.code !== 2 && command.code !== 1;
  // return false;
}

export function translatePackage(command: PhotonPackagePayload): AoPackage {

  const messagesMap = {
    2: mapRequests,
    3: mapResponses,
    4: mapEvents,
  };

  if (messagesMap[command.msg_type]) {
    return messagesMap[command.msg_type](command);
  }
}

function mapRequests(command: PhotonPackagePayload) {
  const codeMapper = {
    21: moveMapper
  };

  const mapFn = codeMapper[command.parameters && command.parameters[253] as number];

  if (mapFn) {
    return mapFn(command);
  }
}

function mapResponses(command: PhotonPackagePayload) {
  const codeMapper = {
    35: zoneChangeMapper
  };

  const mapFn = codeMapper[command.parameters && command.parameters[253] as number];

  if (mapFn) {
    return mapFn(command);
  }
}

function mapEvents(command: PhotonPackagePayload) {
  const codeMapper = {
    // 21: moveMapper
  };

  // console.log(command.parameters);

  // const mapFn = codeMapper[command.parameters && command.parameters[253] as number];

  // if (mapFn) {
  //   return mapFn(command);
  // }
}

export interface AoPackage {
  type: 'MOVE' | 'ZONE_CHANGE';
}

interface MoveAoPackage extends AoPackage {
  timestamp: number;
  coords: number[];
  heading: number;
  targetCoords: number[];
  speed: number;
  target: number;
}

function moveMapper(command: PhotonPackagePayload): MoveAoPackage {

  /**
   * pkg type request
   * 253 === 21 -> Move
   * 0 timestamp?
   * 1 actual Coords (Where you are)
   * 2 Heading (Where are you looking at)
   * 3 click Coords (Where you clicked)
   * 4 speed
   * 5 Target moving to (enemy or item)
   * 253 code
   */
  const parameters = command.parameters;

  return {
    type: 'MOVE',
    timestamp: parameters[0] as number,
    coords: parameters[1] as number[],
    heading: parameters[2] as number,
    targetCoords: parameters[3] as number[],
    speed: parameters[4] as number,
    target: parameters[5] as number
  };
}

interface ZoneChangeAoPackage extends AoPackage {
  zone: string;
  zoneType?: string;
  owner?: string;
  zoneChangeCount: number;
}

function zoneChangeMapper(command: PhotonPackagePayload): ZoneChangeAoPackage {
  const parameters = command.parameters;
  return {
    type: 'ZONE_CHANGE',
    zone: parameters[0] as string,
    zoneType: parameters[1] as string,
    owner: parameters[2] as string,
    zoneChangeCount: parameters[255] as number
  };
}
