export interface ContactQuery {
  name: string;
  phone: string;
  email: string;
  message: string;
}

export interface ContactRepository {
  send(query: ContactQuery): Promise<void>;
}
