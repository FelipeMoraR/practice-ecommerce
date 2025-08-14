export interface IApi {
    status: number;
    message: string;
}

export interface IErrorApi {
  status: number;
  error: string;
}

export class ErrorApi implements IErrorApi {
  status: number;
  error: string;

  constructor(status: number, error: string) {
    this.status = status;
    this.error = error;
  }
}

