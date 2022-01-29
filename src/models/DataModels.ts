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

export type { Connection, ConnectionDetails, ConnectionMeta };
