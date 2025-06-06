/* eslint-disable prettier/prettier */
import { IsString, IsNotEmpty,IsNumberString } from 'class-validator';

export class LoginDto {

  @IsString()
  @IsNotEmpty()
  employeeId: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}