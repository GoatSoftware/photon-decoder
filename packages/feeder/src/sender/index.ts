import { PhotonPackage } from '../decoder/decoder.models';

export default function send(pkg: PhotonPackage): void {
  if (pkg.commands.filter(i => !!i).length !== 0) {
    pkg.commands.filter(i => !!i).forEach(i => {
      if (Object.keys(i).length > 0) {
        console.log(i);
      }
    });
  }
}