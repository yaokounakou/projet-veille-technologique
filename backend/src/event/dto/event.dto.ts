import { IsNotEmpty, IsString } from 'class-validator';

export class CreateEvent {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  location: string;
}

export class RoleHandling {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  eventId: string;
}

export class changeRole {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  eventId: string;

  @IsNotEmpty()
  @IsString()
  roleName: string;
}

export class id {
  @IsNotEmpty()
  @IsString()
  id: string;
}
