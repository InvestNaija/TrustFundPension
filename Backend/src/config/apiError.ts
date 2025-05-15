export class AppError {
  constructor(
    public message: string,
    public line: number,
    public file: string,
    public options: {
      name: string;
      status: number;
      show: boolean;
    },
  ) {}
} 