import { Table, Column, DataType, ForeignKey, BelongsTo, HasMany, AllowNull, PrimaryKey, HasOne } from 'sequelize-typescript';
import { BaseModel } from './BaseModel';
import { Optional } from 'sequelize';
import { RoleModel } from './index';

export interface UserAttributes {
	id: string;	
	name: string;
	email: string;
	phoneNo: string;
	password: string;
	role: string;
	line1?: string;
	line2?: string;
	country: string;
	state: string;
	city: string;
	images: string[] | [];
	postalCode: string;
	isActive?: boolean | true;
	createdAt?: Date;
	updatedAt?: Date;
	isDeleted?: boolean | false;
}

export interface UserCreatinAttributes extends Optional<UserAttributes, 'id'> {}

@Table({
	tableName: 'users',
	timestamps: true,   
})
export class UserModel extends BaseModel<UserCreatinAttributes> {
	@PrimaryKey
	@Column({
		type: DataType.UUID,
		defaultValue: DataType.UUIDV4,
		primaryKey: true,
	})
	id!: string;

	@Column({
		type: DataType.STRING,
		allowNull: false,
	})
	name!: string;

	@Column({
		type: DataType.STRING,
		allowNull: false,
		unique: true,
	})
	email!: string;

	@AllowNull(false)
	@Column({
		type: DataType.STRING,
		allowNull: false,
	})
	phoneNo!: string;

	@Column({
		type: DataType.STRING,
		allowNull: false,
	})
	password!: string;

	@ForeignKey(() => RoleModel)
	@Column({
		type: DataType.UUID,
		allowNull: false,
	})
	role!: string;

	@AllowNull(true)
	@Column({ type: DataType.STRING })
	line1?: string;

	@AllowNull(true)
	@Column({ type: DataType.STRING })
	line2?: string;

	@AllowNull(false)
	@Column({ type: DataType.STRING })
	country!: string;

	@AllowNull(false)
	@Column({ type: DataType.STRING })
	state!: string;

	@AllowNull(false)
	@Column({ type: DataType.STRING })
	city!: string;

	@AllowNull(false)
	@Column({ type: DataType.STRING })
	postalCode!: string;

	@AllowNull(false)
	@Column({
		type: DataType.ARRAY(DataType.STRING),
		defaultValue: [],
	})
	images!: string[];

	@BelongsTo(() => RoleModel, { foreignKey: 'role', targetKey: 'id' })
	roleData!: RoleModel;

}
