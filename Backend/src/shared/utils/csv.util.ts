import { Logger, UnprocessableEntityException } from '@nestjs/common';
import * as csv from 'fast-csv';

const logger = new Logger('CsvUtil');

export const parseCsv = <T>(
  buffer: Buffer,
  options: csv.ParserOptionsArgs = {},
  validateRowFn: ((row: T) => Promise<boolean> | boolean) | null = null,
  transformRowFn: ((row: T) => T) | null = null,
): Promise<T[]> => {
  return new Promise((resolve, reject) => {
    const results: T[] = [];

    // Set default options and override with any provided options
    const csvOptions: csv.ParserOptionsArgs = {
      headers: true,
      discardUnmappedColumns: true,
      quote: null,
      ignoreEmpty: true,
      trim: true,
      ...options,
    };

    // Parse CSV data from buffer
    csv
      .parseString(buffer.toString('utf-8'), csvOptions)
      .transform((data: T, cb) =>
        transformRowFn
          ? setImmediate(() => cb(null, transformRowFn(data)))
          : cb(null, data),
      )
      .validate((data: T, cb) =>
        validateRowFn
          ? setImmediate(async () => {
              const isValid = await validateRowFn(data);
              cb(null, isValid);
            })
          : cb(null, true),
      )
      .on('data', (row: T) => results.push(row))
      .on('data-invalid', (row: T, rowNumber: number) =>
        logger.log(`Invalid [rowNumber=${rowNumber}]`),
      )
      .on('error', (err) => {
        logger.error('Error parsing CSV data:', err);
        reject(
          new UnprocessableEntityException('CSV data could not be parsed'),
        );
      })
      .on('end', () => {
        resolve(results);
      });
  });
};

export const isCsvFile = (file: Express.Multer.File): boolean => {
  return (
    file.mimetype === 'text/csv' ||
    file.mimetype === 'application/vnd.ms-excel' || // Some browsers use this mimetype
    file.originalname.endsWith('.csv')
  );
};
