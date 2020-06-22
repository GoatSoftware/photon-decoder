import { map, filter } from 'rxjs/operators';

import sniffer from './sniffer';
import decodePackage from './decoder';
import { translatePackage, knownPackages } from './translator';
import { init as initSender, send } from './sender';

initSender()
  .then(connected => {
    if (connected) {
      sniffer()
        .pipe(
          map(decodePackage),
          filter(knownPackages),
          map(translatePackage)
        )
        .subscribe(pkg => {
          send(pkg);
        });
    }
  });