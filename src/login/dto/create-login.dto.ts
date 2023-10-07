import { IsNotEmpty } from 'class-validator';

export class CreateLoginDto {
  @IsNotEmpty()
  account: string;

  @IsNotEmpty()
  password: string;
}
