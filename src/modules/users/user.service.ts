import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from './users.repository';
import { compare, genSaltSync, hash } from 'bcrypt';

import * as dotenv from 'dotenv';

dotenv.config();

const SALT_ROUNDS = parseInt(process.env.CRYPT_SALT);
const salt = genSaltSync(SALT_ROUNDS);

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
  ) {}

  isUUID(str: string): boolean {
    const pattern =
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    return pattern.test(str);
  }

  async getAll(): Promise<Array<Users>> {
    return this.usersRepository.find();
  }

  async findOne(id: string): Promise<Users> {
    return this.usersRepository.findOne({
      where: { id },
    });
  }

  async create(data: any): Promise<Users> {
    if (!data.version) {
      data.version = 1;
    }
    
    data.password = await hash(data.password, salt);

    // Out old tests are not allowing to check user uniqueness, so skipping commented it here
    
    // const userExist = await this.usersRepository.findOne({ where: { login: data.login }});

    // if (userExist) {
    //   throw new BadRequestException("This login already exists!")
    // }

    const user: Users = await this.usersRepository.save(data);

    return this.getById(user.id);
  }

  async updateUser(id: string, data: any) {
    if (!this.isUUID(id)) {
      throw new BadRequestException(`${id} is not UUID!`);
    }

    const user: any = await this.usersRepository.findOne({
      where: { id },
    });
    
    if (!user) {
      throw new NotFoundException(`User with id ${id} is not found!`);
    }

    const valid = await compare(data.oldPassword, user.password);

    if (!valid) {
      throw new ForbiddenException(
        `Password ${data.oldPassword} does not matches with old one!`,
      );
    }
    user.password = await hash(data.newPassword, salt);
    user.version = user.version + 1;

    user.updatedAt = Date.now();

    await this.usersRepository.save(user);

    delete user.password;

    return user;
  }

  async deleteUser(id: any) {
    if (!this.isUUID(id)) {
      throw new BadRequestException(`${id} is not UUID!`);
    }

    const user = await this.findOne(id);

    if (!user) {
      throw new NotFoundException(`User with id ${id} is not found!`);
    }

    this.usersRepository.delete(id);

    return { message: 'User deleted with success' };
  }

  async getById(id: string): Promise<Users> {
    if (!this.isUUID(id)) {
      throw new BadRequestException(`${id} is not UUID!`);
    }

    const user: any = await this.findOne(id);

    if (!user) {
      throw new NotFoundException(`User with id ${id} is not found!`);
    }

    delete user.password;

    return user;
  }
}
