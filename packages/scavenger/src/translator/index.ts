import { PhotonPackagePayload } from '../decoder/decoder.models';

const requestMessageMap: Record<number, boolean> = {
  21: true
};

const responseMessageMap: Record<number, boolean> = {
  35: true
};

export function knownPackages(command: PhotonPackagePayload): boolean {
  const messagesMap: Record<number, (command: PhotonPackagePayload) => boolean> = {
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

  const messagesMap: Record<number, (command: PhotonPackagePayload) => AoPackage> = {
    2: mapRequests,
    3: mapResponses,
    4: mapEvents,
  };

  if (messagesMap[command.msg_type]) {
    return messagesMap[command.msg_type](command);
  }
}

function mapRequests(command: PhotonPackagePayload): AoPackage {
  const codeMapper: Record<number, (command: PhotonPackagePayload) => AoPackage> = {
    21: moveMapper
  };

  const mapFn = codeMapper[command.parameters && command.parameters[253] as number];

  if (mapFn) {
    return mapFn(command);
  }
}

function mapResponses(command: PhotonPackagePayload): AoPackage {
  const codeMapper: Record<number, (command: PhotonPackagePayload) => AoPackage> = {
    35: zoneChangeMapper
  };

  const mapFn = codeMapper[command.parameters && command.parameters[253] as number];

  if (mapFn) {
    return mapFn(command);
  }
}

function mapEvents(command: PhotonPackagePayload): AoPackage {
  const codeMapper: Record<number, (command: PhotonPackagePayload) => AoPackage> = {
  };

  const mapFn = codeMapper[command.parameters && command.parameters[253] as number];

  if (mapFn) {
    return mapFn(command);
  }
}

export interface AoPackage {
  type: 'MOVE' | 'ZONE_CHANGE';
}

interface MoveAoPackage extends AoPackage {
  /** Timestamp of the movement */
  timestamp: number;
  /** Where you are */
  coords: number[];
  /** Where you are looking at */
  heading: number;
  /** Where you clicked */
  targetCoords: number[];
  /** Current speed */
  speed: number;
  /** Target moving to */
  target: number;
}

function moveMapper(command: PhotonPackagePayload): MoveAoPackage {
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
