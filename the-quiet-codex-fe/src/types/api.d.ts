export interface ApiError {
  status: number;
  data: {
    message: string;
    code?: string;
  };
}
