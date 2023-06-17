import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InsertResult, Repository } from 'typeorm';
import { Users } from './users.repository';
import { CreateUserDto } from 'src/dto/users.dto';

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
            where: { id }
        });
    }

    async create(data: any): Promise<Users> {
        if (!data.version) {
            data.version = 1;
        }
        
        const user: Users = await this.usersRepository.save(data);

        return this.getById(user.id);
    }

    async updateUser(id: string, data: any) {
        if (!this.isUUID(id)) {
            throw new BadRequestException(`${id} is not UUID!`);
        }
    
        const user: any = await this.usersRepository.findOne({
            where: { id }
        });
        // console.log("USER: ", user);
        
        if (!user) {
            throw new NotFoundException(`User with id ${id} is not found!`);
        }
    
        if (user.password !== data.oldPassword) {
            throw new ForbiddenException(
                `Password ${data.oldPassword} does not matches with old one!`,
            );
        }
    
        user.password = data.newPassword;
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