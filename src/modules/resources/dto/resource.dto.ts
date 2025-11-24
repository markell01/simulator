import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class MiningDto {
  @IsNotEmpty()
  @IsString()
  userId!: string;

  @IsNotEmpty()
  @IsString()
  resource_name!: string
}

export class ResourceDto {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNotEmpty()
  @IsNumber()
  base_time_ms!: number;

  @IsNotEmpty()
  @IsString()
  base_yiled!: string;
}