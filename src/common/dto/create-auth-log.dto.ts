import { IsOptional, IsString } from 'class-validator';

export class CreateAuthLogDto {
  @IsString()
  @IsOptional()
  readonly code?: string;

  @IsString()
  @IsOptional()
  readonly error?: string;

  @IsString()
  @IsOptional()
  readonly state?: string;

  @IsString()
  @IsOptional()
  readonly usernameId?: string;

  @IsString()
  @IsOptional()
  readonly displayName?: string;

  @IsString()
  @IsOptional()
  readonly accessToken?: string;

  @IsString()
  @IsOptional()
  readonly refreshToken?: string;
}
