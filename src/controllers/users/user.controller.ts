import {
  Controller,
  Get,
  Post,
  Body,
  HttpStatus,
  HttpCode,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
  Param,
  UsePipes,
  ValidationPipe,
  Put,
  Delete,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DatabaseService } from 'src/database/database.service';
import { CustomOrm } from 'src/database/zorm.service';

import { CreateUserDto, UpdatePasswordDto } from 'src/dto/users.dto';
import { User } from 'src/models/user.interface';

@ApiTags('User')
@Controller('/user')
export class UserController {
  orm: CustomOrm;
  constructor(private readonly databaseService: DatabaseService) {
    this.orm = new CustomOrm(this.databaseService, 'users');
  }

  @Get()
  getUsers(): any {
    const users: any = this.orm.getAll();

    const usersList = users.map((user) => {
      const userL = { ...user };
      delete userL.password;
      return userL;
    });

    return usersList;
  }

  @Get('/:id')
  getUser(@Param('id') id: string): User {
    if (!this.orm.isUUID(id)) {
      throw new BadRequestException(`${id} is not UUID!`);
    }

    const user: any = this.orm.getById(id);

    if (!user) {
      throw new NotFoundException(`User with id ${id} is not found!`);
    }

    delete user.password;

    return user;
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ transform: false }))
  insertUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    const user = this.orm.createUser(createUserDto);
    if (!user.success && user.error) {
      throw new BadRequestException(user.error);
    }

    delete user.data.password;
    return user.data;
  }

  @Put('/:id')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: false }))
  updateUser(
    @Param('id') id: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    if (!this.orm.isUUID(id)) {
      throw new BadRequestException(`${id} is not UUID!`);
    }

    const user: any = this.orm.getById(id);

    if (!user) {
      throw new NotFoundException(`User with id ${id} is not found!`);
    }

    if (user.password !== updatePasswordDto.oldPassword) {
      throw new ForbiddenException(
        `Password ${updatePasswordDto.oldPassword} does not matches with old one!`,
      );
    }

    user.password = updatePasswordDto.newPassword;
    this.orm.updateUser(user);

    delete user.password;

    return user;
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteUser(@Param('id') id: string) {
    if (!this.orm.isUUID(id)) {
      throw new BadRequestException(`${id} is not UUID!`);
    }

    const user = this.orm.getById(id);

    if (!user) {
      throw new NotFoundException(`User with id ${id} is not found!`);
    }

    this.orm.deleteOne(id);

    return { message: 'User deleted with success' };
  }
}
