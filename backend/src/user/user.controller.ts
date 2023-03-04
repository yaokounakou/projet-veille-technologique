import { UserService } from './user.service';
import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Get,
  Param,
  Res,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { SignUpDto, UpdateProfilePicture } from './dto/auth.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  signup(@Body() dto: SignUpDto) {
    return this.userService.signup(dto);
  }

  @Get(':UserId')
  getUser(@Param('UserId') userId) {
    return this.userService.getUser(userId);
  }

  @Post('picture/:UserId')
  @UseInterceptors(FileInterceptor('image'))
  async storeImage(
    @Param('UserId') userId,
    @UploadedFile() file: UpdateProfilePicture,
  ) {
    return await this.userService.storeImage(userId, file);
  }

  @Get('picture/:UserId/:Numero')
  async getImage(@Param('UserId') userId, @Param('Numero') numero, @Res() Res) {
    return await this.userService.getImage(userId, numero, Res);
  }

  //get list of users
  @Get()
  async getUsers() {
    return await this.userService.getUsers();
  }
}
