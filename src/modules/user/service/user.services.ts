import { CreateUserDto } from "../dto/create-user.dto";
import { IUser } from "../model/user.model.interface";
import { IUserService } from "./user.services.interface";
import { HashBcrypt } from "../../../utils/bcrypt/hasher.bcrypt";
import { ErrorsResponse } from "../../../utils/errors/errors.response";
import { IUserRepository } from "../repository/user.repository.interface";

export class UserService implements IUserService {
   constructor(private repository: IUserRepository) {}

   async createUser(user: CreateUserDto, photo: string): Promise<IUser> {
      const userAlreadyExists = await this.repository.findByEmail(user.email);

      if (userAlreadyExists) {
         await ErrorsResponse.invalidCredentials();
      }

      const information: CreateUserDto = {
         ...user,
         password: await HashBcrypt.encrypt(user.password),
         photo,
      };

      const result = await this.repository.createUser(information);
      return result;
   }

   async getUserById(userId: string): Promise<IUser | null> {
      const user = await this.repository.getUserById(userId);

      if (!user) {
         await ErrorsResponse.userNotFound();
      }

      return user;
   }
}
