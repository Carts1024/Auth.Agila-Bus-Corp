/* eslint-disable prettier/prettier */
import { IsString, IsNotEmpty,IsNumberString } from 'class-validator';

export class LoginDto {
  @IsNumberString()
  @IsNotEmpty()
  roleId: number;

  @IsString()
  @IsNotEmpty()
  employeeId: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}