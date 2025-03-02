export interface DataAgruped {
  id: number;
  account: string;
  accountname?: string;
  type?: string;
  accountid: number;
  categoryname?: string;
  date_register: string;
  description?: string;
  typeincome?: string;
  value: number;
  details?: DataAgruped[];
}
