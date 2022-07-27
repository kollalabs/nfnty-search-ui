type Connection = {
  meta: ConnectionMeta;
  results: ConnectionDetails[];
  [key: string]: any;
};

type ConnectionMeta = {
  logo: string;
  display_name: string;
  [key: string]: any;
};

type ConnectionDetails = {
  title: string;
  description: string;
  link: string;
  kvdata?: any[];
  [key: string]: any;
};

type Connector = {
  name: string;
  display_name: string;
  logo: string;
  logo_small: string;
  connected: boolean;
  install_url: string;
  marketplace_url: string
};

export type { Connector, Connection, ConnectionDetails, ConnectionMeta };
