import { IsString, IsUUID, IsBoolean, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class RoleDto {
  @IsUUID()
  @IsOptional()
  id?: string;

  @IsString()
  role!: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean = true;

  @IsOptional()
  @Type(() => Date)
  createdAt?: Date;

  @IsOptional()
  @Type(() => Date)
  updatedAt?: Date;
}
