import {
  IsNotEmpty,
  IsString,
  IsOptional,
  MinLength,
  MaxLength,
  IsEmail,
  IsArray,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  account: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(16)
  password: string;

  @IsNotEmpty()
  @IsString()
  username: string;

  // @IsEmail()
  @IsOptional()
  email: string;

  @IsOptional()
  phone: string;

  @IsArray()
  @IsOptional()
  role: string[];
}
