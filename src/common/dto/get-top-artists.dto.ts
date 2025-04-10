import { IsDefined, IsMongoId, IsOptional } from 'class-validator';

export class GetTopArtistDto {
  @IsMongoId({
    message: 'Id is not a MongoDB Id valid.',
  })
  @IsDefined()
  readonly id: string;

  @IsOptional()
  readonly time_range: string;

  @IsOptional()
  readonly limit: number;

  @IsOptional()
  readonly offset: number;
}
