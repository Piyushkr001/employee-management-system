export type ApiResponse<T = void> = {
  success: boolean;
  message: string;
  data?: T;
  error?: {
    code?: string;
    fieldErrors?: Record<string, string[]>;
  };
};
