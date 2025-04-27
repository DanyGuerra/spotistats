import { IsDefined, IsMongoId, IsOptional } from 'class-validator';
import { TopInfoLimit, TopTimeRange } from '../interfaces/IParamsTop';

export class GetTopTracksDto {
  @IsMongoId({
    message: 'Id is not a MongoDB Id valid.',
  })
  @IsDefined()
  readonly id: string;

  @IsOptional()
  readonly time_range: TopTimeRange;

  @IsOptional()
  readonly limit: TopInfoLimit;

  @IsOptional()
  readonly offset: number;
}
