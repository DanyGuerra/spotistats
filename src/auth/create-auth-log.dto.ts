import { IsOptional, IsString } from 'class-validator';

export class CreateAuthLogDto {
  @IsString()
  @IsOptional()
  readonly code?: string;

  @IsString()
  @IsOptional()
  readonly state?: string;

  @IsString()
  @IsOptional()
  readonly usernameId?: string;

  @IsString()
  @IsOptional()
  readonly access_token?: string;

  @IsString()
  @IsOptional()
  readonly refresh_token?: string;
}
