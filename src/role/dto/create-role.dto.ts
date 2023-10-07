import { IsNotEmpty, IsString, IsOptional, IsArray } from 'class-validator';

export class CreateRoleDto {
  @IsNotEmpty()
  @IsString()
  roleCode: string;

  @IsNotEmpty()
  @IsString()
  roleName: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsOptional()
  @IsArray()
  menu: string[];
}
