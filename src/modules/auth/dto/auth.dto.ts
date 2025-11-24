import { IsEmail, IsEmpty, IsString, Length } from "class-validator";

export class UserCreateDto {
  @IsString()
  @IsEmpty()
  @Length(6, 16)
  username!: string;

  @IsString()
  @IsEmpty()
  @Length(8)
  password!: string

  @IsEmail()
  email: string | undefined;
}

export class UserLogin {
  @IsString()
  @IsEmpty()
  @Length(6, 16)
  username!: string;

  @IsString()
  @IsEmpty()
  @Length(8)
  password!: string
}