import { SetMetadata } from '@nestjs/common';

export const IncludeData = (include: boolean) =>
  SetMetadata('includeData', include);
