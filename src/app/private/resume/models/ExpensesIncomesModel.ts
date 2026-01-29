export interface DataAgruped {
  id: number;
  account: string;
  account_name?: string;
  type?: string;
  account_id: number;
  categoryname?: string;
  color: string
  date_register: string;
  description?: string;
  type_income?: string;
  value: number;
  details?: DataAgruped[];
}
