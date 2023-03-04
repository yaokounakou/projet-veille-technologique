import { IsNotEmpty, IsString } from 'class-validator';

export class SignUpDto {
  @IsString()
  @IsNotEmpty()
  username: string;
}

export class UpdateProfilePicture {
  @IsNotEmpty()
  image: any;
}
