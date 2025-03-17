import { RoleModel } from '../Models/Role.model';
import { UserAttributes, UserCreatinAttributes, UserModel } from '../Models';

export class UserRepository {
	// Query to create user
	static async create(user: UserCreatinAttributes): Promise<UserAttributes> {
		return await UserModel.create(user);
	}

	// Query to get all the users with pagination
	static async getAllUsers({ page = 1, limit = 10 }) {
		const users = await UserModel.findAll({
			where: { isDeleted: false, isActive: true },
			offset: (page - 1) * limit,
			limit,
		});

		const totalUsers = await UserModel.count({
			where: { isDeleted: false, isActive: true },
		});
		return { users, count: totalUsers };
	}

	// Query to get user by email
	static async findUserByEmail(email: string) {
		return await UserModel.findOne({
			where: { email },
			include: [{ model: RoleModel, as: 'roleData' }],
		});
	}

	// Query to get user by primary key
	static async findUserByPK(id: string) {
		return await UserModel.findByPk(id);
	}

	// Query to remove user
	static async destroy(email: string) {
		return await UserModel.destroy({ where: { email } });
	}

	// Query for soft delete of user
	static async removeUser({ email, isActive, isDeleted }: { email: string; isActive: boolean; isDeleted: boolean }) {
		return await UserModel.update({ isActive, isDeleted }, { where: { email } });
	}

	// Query to update user by email
	static async update({ email, isActive, isDeleted }: { email: string; isActive: boolean; isDeleted: boolean }) {
		return await UserModel.update({ isActive, isDeleted }, { where: { email } });
	}
}
