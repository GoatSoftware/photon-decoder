import { init as initSender, send } from './sender';
import sniffer from './sniffer';
import decodePackage from './decoder';
import { knownPackages, translatePackage } from './translator';
import { map, filter, pluck, concatAll } from 'rxjs/operators';

export function startScavenge(user = 'unknown') {
  initSender(user)
    .then(connected => {
      if (connected) {
        sniffer()
          .pipe(
            map(decodePackage),
            pluck('commands'),
            concatAll(),
            filter(i => !!i),
            filter(knownPackages),
            map(translatePackage)
          )
          .subscribe(pkg => {
            send(pkg);
          });
      }
    });
}
