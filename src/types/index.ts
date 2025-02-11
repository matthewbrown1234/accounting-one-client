export type AccountEntry = {
  id: number | "NEW";
  value: number;
  name: string
  entryDate?: string;
  accountId: number | "";
  accountName: string;
}

export type Account = {
  id: number | "NEW";
  accountId: string;
  accountName: string;
  accountType: string;
}

export type Pageable<T> = {
  content: Array<T>;
  page: {
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
  }
}

export type ApiUserValidationFieldError =  { fields: Record<string, string> }

export class ApiValidationError extends Error {
  constructor(public error: ApiUserValidationFieldError) {
    super("Validation Error");
  }
}
