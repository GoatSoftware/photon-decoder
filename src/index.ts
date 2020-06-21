import { map } from 'rxjs/operators';

import sniffer from './sniffer';
import decodePackage from './decoder';
import translatePackage from './translator';
import send from './sender';

sniffer()
  .pipe(
    map(decodePackage),
    map(translatePackage)
  )
  .subscribe(pkg => {
    send(pkg);
  });