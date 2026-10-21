import { NotFoundException, applyDecorators } from '@nestjs/common';
import { IsInt, Max, Min } from 'class-validator';

const MAX_ROW_ID = 2147483647;

/** Parses a route id; anything but a positive integer column value is a 404. */
export function parseRowId(id: string): number {
  const rowId = /^\d+$/.test(id) ? Number(id) : 0;
  if (rowId < 1 || rowId > MAX_ROW_ID) {
    throw new NotFoundException();
  }
  return rowId;
}

/** Validates a body field that names a row by its integer id. */
export const IsRowId = () => applyDecorators(IsInt(), Min(1), Max(MAX_ROW_ID));
