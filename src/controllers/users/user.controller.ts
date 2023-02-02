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


import { CreateUserDto, UpdatePasswordDto } from 'src/dto/users.dto';
import { User } from 'src/models/user.interface';
import { UserService } from './user.service';

@Controller('/user')
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) {}

  @Get()
  getUsers(): any {
    return this.userService.getUsers();
  }

  @Get('/:id')
  getUser(@Param('id') id: string): User {
    if (!this.userService.isUUID(id)) {
        throw new BadRequestException(`${id} is not UUID!`)
    }
    
    const user = this.userService.getUser(id);
    
    if (!user.data) {
        throw new NotFoundException(`User with id ${id} is not found!`)
    }

    return this.userService.getUser(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ transform: false }))
  insertUser(@Body() createUserDto: CreateUserDto): Promise<User> {    
    const user = this.userService.createUser(createUserDto);
    if (!user.success && user.error) {
        throw new BadRequestException(user.error)
    }
    
    return user.data;
  }

  @Put('/:id')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: false }))
  updateUser(@Param('id') id: string, @Body() updatePasswordDto: UpdatePasswordDto) {
    if (!this.userService.isUUID(id)) {
        throw new BadRequestException(`${id} is not UUID!`)
    }

    const dataUser = this.userService.getUser(id);
    
    if (!dataUser.data) {
        throw new NotFoundException(`User with id ${id} is not found!`)
    }

    const user = dataUser.data;
    console.log(user.password);
    
    if (user.password !== updatePasswordDto.oldPassword) {
        throw new ForbiddenException(`Password ${updatePasswordDto.oldPassword} does not matches with old one!`)
    }

    user.password = updatePasswordDto.newPassword

    return this.userService.updateUser(user) && user;

  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteUser(@Param('id') id: string) {
    if (!this.userService.isUUID(id)) {
        throw new BadRequestException(`${id} is not UUID!`)
    }

    const dataUser = this.userService.getUser(id);
    
    if (!dataUser.data) {
        throw new NotFoundException(`User with id ${id} is not found!`)
    }

    const user = dataUser.data;
    console.log(user.password);

    return this.userService.delete(user);
  }
}
