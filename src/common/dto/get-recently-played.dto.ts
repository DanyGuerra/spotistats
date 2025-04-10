import { IsDefined, IsMongoId, IsOptional } from 'class-validator';

export class GetRecentlyPlayedDto {
  @IsMongoId({
    message: 'Id is not a MongoDB Id valid.',
  })
  @IsDefined()
  readonly id: string;

  @IsOptional()
  readonly limit?: number;

  @IsOptional()
  readonly before?: number;

  @IsOptional()
  readonly after?: number;
}
