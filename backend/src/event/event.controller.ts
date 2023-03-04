import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { EventService } from './event.service';

import { changeRole, CreateEvent, RoleHandling, id } from './dto';

@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Get('/getUsers/:id')
  getEventUsers(@Param() dto: id) {
    return this.eventService.getEventUsers(dto.id);
  }

  @Get('/getEvents/:id')
  getUserEvents(@Param() dto: id) {
    return this.eventService.getUserEvents(dto.id);
  }

    @Get()
    getEvents() {
        return this.eventService.getEvents();
    }

    @Post()
    createEvent(@Body() dto: CreateEvent) {
        return this.eventService.createEvent(dto.name, dto.description, dto.location);
    }

  @Delete()
  deleteEvent(@Body() dto: RoleHandling) {
    return this.eventService.deleteEvent(dto.eventId, dto.userId);
  }

  @Post('addUserToEvent')
  addUserToEvent(@Body() dto: RoleHandling) {
    return this.eventService.addUserToEvent(dto.eventId, dto.userId);
  }

  @Put('changeRole')
  changeRole(@Body() dto: changeRole) {
    return this.eventService.changeRole(dto.eventId, dto.userId, dto.roleName);
  }

  @Delete('removeUserFromEvent')
  removeUserFromEvent(@Body() dto: RoleHandling) {
    return this.eventService.removeUserFromEvent(dto.eventId, dto.userId);
  }
}
