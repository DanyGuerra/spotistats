import { SetMetadata } from '@nestjs/common';

export const MessageResponse = (message: string) =>
  SetMetadata('messageResponse', message);
