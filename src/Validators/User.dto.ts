import { IsString, IsEmail, IsOptional, IsUUID, IsBoolean, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

export class UserDto {
  @IsUUID()
  @IsOptional()
  id?: string;

  @IsString()
  name!: string;

  @IsEmail()
  email!: string;

  @IsString()
  phoneNo!: string;

  @IsString()
  password!: string;

  @IsString()
  role!: string;

  @IsString()
  @IsOptional()
  line1?: string;

  @IsString()
  @IsOptional()
  line2?: string;

  @IsString()
  country!: string;

  @IsString()
  state!: string;

  @IsString()
  city!: string;

  @IsString()
  postalCode!: string;

  @IsArray()
  @IsString({ each: true })
  @Type(() => String)
  images!: string[];

  @IsBoolean()
  @IsOptional()
  isActive?: boolean = true;

  @IsBoolean()
  @IsOptional()
  isDeleted?: boolean = false;

  @IsOptional()
  @Type(() => Date)
  createdAt?: Date;

  @IsOptional()
  @Type(() => Date)
  updatedAt?: Date;
}
