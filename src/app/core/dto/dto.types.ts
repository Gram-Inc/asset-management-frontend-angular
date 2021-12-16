export interface IDTO {
  isError?: boolean;
  data: any;
  message?: string[];
  exception?: {
    errorCode?: string;
    statusCode?: number;
  };
  page?: number;
  totalPage?: number;
  limit?: number;
  totaldata?: number;
}
