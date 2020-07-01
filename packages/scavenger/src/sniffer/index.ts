// @ts-ignore
import { Cap, decoders } from 'cap';
import { Subject, Observable } from 'rxjs';


const PROTOCOL = decoders.PROTOCOL;

const c = new Cap();
const device = Cap.findDevice();
const port = '5056';
const filter = `udp and src port ${port} or dst port ${port}`;
const bufSize = 10 * 1024 * 1024;
const buffer = Buffer.alloc(65535);

interface DebugOptions {
  packages?: boolean;
}

export default function sniffer(debugOptions?: DebugOptions): Observable<number[]> {
  const obs: Subject<number[]> = new Subject();
  debugOptions;
  const linkType = c.open(device, filter, bufSize, buffer);
  
  c.setMinBytes && c.setMinBytes(0);
  
  console.info(`Listening ${port} packages`);
  
  if (linkType === 'ETHERNET') {
    c.on('packet', function (nbytes: any, trunc: any) {
      const eth = decoders.Ethernet(buffer);
      if (eth.info.type === PROTOCOL.ETHERNET.IPV4) {
        const ip4 = decoders.IPV4(buffer, eth.offset);
        if (ip4.info.protocol === PROTOCOL.IP.UDP) {
  
          const udp = decoders.UDP(buffer, ip4.offset);
  
          const pkg = buffer
            .toString('hex', udp.offset, udp.offset + udp.info.length)
            .match(/[0-9abcdef]{2}/g)
            .map((i) => parseInt(i, 16));

          obs.next(pkg);
        }
      }
    });
  }
  return obs.asObservable();
}
