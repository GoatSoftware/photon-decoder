import { PhotonPackage } from '../decoder/decoder.models';

export function knownPackages(pkg: PhotonPackage): boolean {
  if (pkg.commands.length > 0 && pkg.commands[0] && pkg.commands[0].intHash && pkg.commands[0].intHash[253] === 21) {
    return true;
  }
  false;
}

export function translatePackage(pkg: PhotonPackage): AoPackage {
  const codeMapper = {
    21: moveMapper
  };
  
  return codeMapper[pkg.commands[0].intHash[253] as number](pkg);
  // if (codeMapper[pkg.commands[0].intHash[253] as number]) {
  // }
}

export interface AoPackage {
  type: 'MOVE'
}

interface MoveAoPackage extends AoPackage {
  timestamp: number,
  coords: number[],
  heading: number,
  targetCoords: number[],
  speed: number,
  target: number
}

function moveMapper(pkg: PhotonPackage): MoveAoPackage {
  
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
  const intHash = pkg.commands[0].intHash;
  
  return {
    type: 'MOVE',
    timestamp: intHash[0] as number,
    coords: intHash[1] as number[],
    heading: intHash[2] as number,
    targetCoords: intHash[3] as number[],
    speed: intHash[4] as number,
    target: intHash[5] as number
  };
}