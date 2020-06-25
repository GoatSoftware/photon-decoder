export interface PhotonPackage {
  header: PhotonPackageHeader;
  commands: PhotonPackagePayload[];
}

export interface PhotonPackageHeader {
  peer_id: number;
  crc_enabled: number;
  command_count: number;
  timestamp: number;
  challenge: number;
}

export interface PhotonPackagePayload {
  msg_type: number;
  code: number;
  return_code?: number;
  debug?: number;
  parameters?: Record<number, unknown>;
}

export interface PhotonPackageCommand {
  cmd_type_id: number;
  channel_id: number;
  flags: number;
  reserved_byte: number;
  msg_len: number;
  reliable_sequence_number: number;
}

export type PhotonPackageReliableCommand = PhotonPackageCommand;

export interface PhotonPackageUnreliableCommand extends PhotonPackageCommand {
  unknown: number;
}

export interface PhotonPackageReliableFragmentCommand extends PhotonPackageCommand {
  origin_sequence_number: number;
  fragment_length: number;
  fragment_index: number;
  operation_length: number;
  msg?: number[];
}
