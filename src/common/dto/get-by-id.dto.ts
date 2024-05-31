import { IsDefined, IsMongoId } from 'class-validator';

export class GetByIdDto {
  @IsMongoId({
    message: 'Id is not a MongoDB Id valid.',
  })
  @IsDefined()
  readonly id: string;
}
