export interface PhotonPackage {
  header: PhotonPackageHeader,
  commands: PhotonPackagePayload[]
}

export interface PhotonPackageHeader {
  peer_id: number,
  crc_enabled: number,
  command_count: number,
  timestamp: number,
  challenge: number
}

export interface PhotonPackagePayload {
  cmd_type_id: number;
}
