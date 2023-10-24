export class AppException extends Error {
  private code: string;
  private solution: string;
  private statusCode: number = 500;

  constructor(params: {
    code: string;
    message: string;
    solution?: string;
    statusCode?: number;
  }) {
    super(params.message);
    this.code = params.code;
    this.solution = params.solution;
    this.statusCode = params.statusCode;
  }

  getOwnCode(): string {
    return this.code;
  }

  getOwnSolution(): string {
    return this.solution ? this.solution : '';
  }

  getStatus(): number {
    return this.statusCode ?? 500;
  }
}
