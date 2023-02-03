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
    Injectable,
    NestMiddleware
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';


import { CreateUserDto, UpdatePasswordDto } from 'src/dto/users.dto';
import { User } from 'src/models/user.interface';
import { UserService } from './user.service';

@ApiTags('User')
@Controller('/user')
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) {}

  @Get()
  getUsers(): any {
    const users = this.userService.getUsers();
    console.log(users);

    const usersList = users.map(user => {
      const userL = { ...user }
      delete userL.password;
      return userL;
    })

    return usersList;
  }

  @Get('/:id')
  getUser(@Param('id') id: string): User {
    if (!this.userService.isUUID(id)) {
        throw new BadRequestException(`${id} is not UUID!`)
    }
    
    const user = this.userService.getUser(id);
    
    if (!user) {
        throw new NotFoundException(`User with id ${id} is not found!`)
    }

    delete user.password;
    
    return user;
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ transform: false }))
  insertUser(@Body() createUserDto: CreateUserDto): Promise<User> {    
    const user = this.userService.createUser(createUserDto);
    if (!user.success && user.error) {
        throw new BadRequestException(user.error)
    }
    
    delete user.data.password;
    return user.data;
  }

  @Put('/:id')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: false }))
  updateUser(@Param('id') id: string, @Body() updatePasswordDto: UpdatePasswordDto) {
    console.log(id, this.userService.getUser(id), updatePasswordDto);
    
    if (!this.userService.isUUID(id)) {
        throw new BadRequestException(`${id} is not UUID!`)
    }

    const user = this.userService.getUser(id);
    
    if (!user) {
        throw new NotFoundException(`User with id ${id} is not found!`)
    }

    if (user.password !== updatePasswordDto.oldPassword) {
        throw new ForbiddenException(`Password ${updatePasswordDto.oldPassword} does not matches with old one!`)
    }

    user.password = updatePasswordDto.newPassword
    this.userService.updateUser(user)

    delete user.password;

    return user;

  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteUser(@Param('id') id: string) {
    if (!this.userService.isUUID(id)) {
        throw new BadRequestException(`${id} is not UUID!`)
    }

    const user = this.userService.getUser(id);
    
    if (!user) {
        throw new NotFoundException(`User with id ${id} is not found!`)
    }

    return this.userService.delete(user);
  }
}
