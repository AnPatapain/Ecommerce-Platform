import {PRISMA_CLIENT} from "../../prisma";
import {User, UserRole} from "@app/shared-models/src/user.model";

export class UserRepository {
    private static instance: UserRepository | null = null;

    private constructor() {}

    public static getInstance(): UserRepository {
        if (!UserRepository.instance) {
            UserRepository.instance = new UserRepository();
        }
        return UserRepository.instance;
    }

    /**
     * Find a user by email.
     * @param email
     */
    public async findByEmail(email: string): Promise<User | null> {
        const user = await PRISMA_CLIENT.user.findUnique({
            where: {
                email: email,
            },
        });

        return user ? {
            ...user,
            role: user.role as UserRole,
        } : null;
    }

    /**
     * Retrieve all users.
     */
    public async findAll() : Promise<Array<User>> {
        const users = await PRISMA_CLIENT.user.findMany({});
        return users.map((user: any) => {
            return {
                ...user,
                role: user.role as UserRole
            };
        })
    }

    /**
     * Find a user by ID.
     * @param id
     */
    public async findOneById(id: number): Promise<User | null> {
        const user = await PRISMA_CLIENT.user.findUnique({
            where: {
                id: id
            },
            include:{
                cart: {
                    include: {
                        shopItems: true
                    }
                }
            }
        });

        return user ? {
            ...user,
            role: user.role as UserRole,
            cart: user.cart ? {...user.cart} : undefined
        } : null;
    }

    /**
     * Delete a user by ID.
     * @param id
     */
    public async deleteOneById(id: number) {
        return PRISMA_CLIENT.user.delete({
            where: {
                id: id
            }
        });
    }

    /**
     * !Unimplemented
     */
    public async deleteMany() {
        return PRISMA_CLIENT.user.deleteMany({});
    }

    /**
     * !Unimplemented
     */
    public async count(): Promise<number> {
        return PRISMA_CLIENT.user.count();
    }

    /**
     * Create a new user.
     * @param userCreationData
     */
    public async createOne(userCreationData: Omit<User, "id" | "role">): Promise<User> {
        const createdUser = await PRISMA_CLIENT.user.create({
            data: {
                email: userCreationData.email,
                name: userCreationData.name,
                password: userCreationData.password,
                role: 'user' as UserRole,
                verified: userCreationData.verified,
                cart: undefined,
            },
        });
        return {
            ...createdUser,
            role: createdUser.role as UserRole,
        }
    }

    /**
     * Update a user by ID.
     * @param id
     * @param userEditData
     */
    public async updateOne(id: number, userEditData: Partial<Omit<User, "id">>) {
        const updatedUser = await PRISMA_CLIENT.user.update({
            where: { id },
            data: {
                ...userEditData,
                cart: undefined
            },
            include: {
                cart: {
                    include: {
                        shopItems: true
                    }
                }
            }
        });
        return {
            ...updatedUser,
            role: updatedUser.role as UserRole,
        }
    }
}