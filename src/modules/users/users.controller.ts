import {
  Controller,
  Get,
  Post,
  Body,
  HttpStatus,
  HttpCode,
  Param,
  UsePipes,
  ValidationPipe,
  Put,
  Delete,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { UsersService } from './user.service';
import { CreateUserDto, UpdatePasswordDto } from 'src/dto/users.dto';
import { Users } from './users.repository';

@ApiTags('User')
@Controller('/user')
export class UserController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getUsers(): Promise<any> {
    const users: any = await this.usersService.getAll();

    const usersList = users.map((user) => {
      const userL = { ...user };
      delete userL.password;
      return userL;
    });

    return usersList;
  }

  @Get('/:id')
  async getUser(@Param('id') id: string): Promise<Users> {
    return await this.usersService.getById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ transform: false }))
  async insertUser(@Body() createUserDto: CreateUserDto): Promise<Users> {
    const user = await this.usersService.create(createUserDto);

    delete user.password;
    return user;
  }

  @Put('/:id')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: false }))
  updateUser(
    @Param('id') id: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    return this.usersService.updateUser(id, updatePasswordDto);
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUser(@Param('id') id: string) {
    await this.usersService.deleteUser(id);

    return { message: 'User deleted with success' };
  }
}
