import { Table, Column, DataType, ForeignKey, BelongsTo, HasMany, AllowNull, PrimaryKey, HasOne, Unique } from 'sequelize-typescript';
import { BaseModel } from './BaseModel';
import { Optional } from 'sequelize';

export interface RoleAttributes {
	id: string;	
	role: string;
	isActive?: boolean | true;
	createdAt?: Date;
	updatedAt?: Date;
}

export interface RoleCreatinAttributes extends Optional<RoleAttributes, 'id'> {}

@Table({
	tableName: 'users',
	timestamps: true,   
})
export class RoleModel extends BaseModel<RoleCreatinAttributes> {
    @PrimaryKey
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey: true,
    })
    id!: string;

    @Unique(true)
    @Column({
		type: DataType.STRING,
		allowNull: false,
	})
	role!: string;
}















