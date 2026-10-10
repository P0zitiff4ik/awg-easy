import { describe, expect, test, vi } from 'vitest';

import type { ClientType } from '#db/repositories/client/types';
import type { InterfaceType } from '#db/repositories/interface/types';
import type { UserConfigType } from '#db/repositories/userConfig/types';
import { encodeQRCode } from '#server/utils/qr';

vi.mock('#server/utils/config', () => ({
  WG_ENV: { WG_EXECUTABLE: 'awg' },
}));

import { wg } from '#server/utils/wgHelper';

describe('generateClientConfig', () => {
  test('generates a client config that can be encoded as a QR code', () => {
    const wgInterface = {
      privateKey: 'server-private-key',
      publicKey: 'server-public-key',
      mtu: 1420,
      s1: null,
      s2: null,
      s3: null,
      s4: null,
      headerProtectionKey: null,
      randomTrailers: null,
    } as InterfaceType;
    const userConfig = {
      defaultDns: [],
      defaultAllowedIps: ['0.0.0.0/0'],
      host: 'vpn.example.com',
      port: 51820,
    } as UserConfigType;
    const client = {
      privateKey: 'client-private-key',
      ipv4Address: '10.8.0.2',
      ipv6Address: 'fdcc:ad94:bacf:61a3::2',
      mtu: 1420,
      preSharedKey: 'client-preshared-key',
      allowedIps: null,
      persistentKeepalive: 25,
      dns: null,
      preUp: '',
      postUp: '',
      preDown: '',
      postDown: '',
      jC: 7,
      jMin: 10,
      jMax: 1000,
    } as ClientType;

    const config = wg.generateClientConfig(wgInterface, userConfig, client);

    expect(config).toContain('PrivateKey = client-private-key');
    expect(config).toContain(
      'Address = 10.8.0.2/32, fdcc:ad94:bacf:61a3::2/128'
    );
    expect(config).toContain('MTU = 1420');
    expect(config).toContain('Jc = 7');
    expect(encodeQRCode(config)).toContain('<svg');
  });
});
