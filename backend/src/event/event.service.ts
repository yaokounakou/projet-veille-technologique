import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EventService {
  constructor(private readonly prisma: PrismaService) {}

  async getEventUsers(eventid) {
    try {
      const event = await this.prisma.event.findUnique({
        where: {
          id: eventid,
        },
        select: {
          id: true,
          name: true,
          description: true,
          location: true,
        },
      });

      if (!event) {
        throw new ForbiddenException('Event not found');
      }

      const roles = await this.prisma.roles.findMany({
        where: {
          eventId: eventid,
        },
        select: {
          userId: true,
          name: true,
          user: {
            select: {
              id: true,
              username: true,
              roles: {
                select: {
                  name: true,
                },
              },
            },
          },
          eventId: true,
          event: {
            select: {
              id: true,
              name: true,
              description: true,
              location: true,
            }
          }
        },
      });

      return {id: event.id, name: event.name, description: event.description, location: event.location,
        users: roles.map((role) => {
        return {
          user: {
            id: role.userId,
            username: role.user.username,
            role: role.name,
          },
        };
      })};
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials taken');
        }
      }
      throw error;
    }
  }

  async getUserEvents(userId) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id: userId,
        },
      });

      if (!user) {
        throw new ForbiddenException('User not found');
      }

      const events = await this.prisma.event.findMany({
        where: {
          roles: {
            some: {
              userId: userId,
            },
          },
        },
        select: {
          id: true,
          name: true,
          description: true,
          location: true,
          roles: {
            where: {
              userId: userId,
            },
            select: {
              name: true,
            },
          },
        },
      });

      return events.map((event) => {
        return {
          event: {
            id: event.id,
            name: event.name,
            description: event.description,
            location: event.location,
            role: event.roles[0].name,
          },
        };
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials taken');
        }
      }
      throw error;
    }
  }


    async getEvents() {
        try {
            const events = await this.prisma.event.findMany({
                select: {
                    id: true,
                    name: true,
                    description: true,
                    location: true,
                },
            });
            return events;
        } catch (error) {
            console.log(error);
            throw new ForbiddenException('Error in console');

        }
    }

    async createEvent(name, description, location) {
        try {
            const event = await this.prisma.event.create({
                data: {
                    name: name,
                    description: description,
                    location: location,
                },
            });

      const role = await this.prisma.roles.create({
        data: {
          name: 'Organisateur',
          event: {
            connect: {
              id: event.id,
            },
          },
          user: {
            connect: {
              id: '63dd5c74f5b9340485eb89f3',
            },
          },
        },
      });

      return { Success: true, Event: event, Role: role };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials taken');
        }
      }
      throw error;
    }
  }

  async deleteEvent(eventId, userId) {
    try {
      const role = await this.prisma.roles.findFirst({
        where: {
          eventId: eventId,
          userId: userId,
        },
      });

      const event = await this.prisma.event.findUnique({
        where: {
          id: eventId,
        },
      });

      if (!event) throw new ForbiddenException('Event not found');

      if (!role) throw new ForbiddenException('You are not in this event');

      if (role.name === 'Organisateur') {
        await this.prisma.event.delete({
          where: {
            id: eventId,
          },
        });

        return { Success: true, Deleted: eventId };
      } else {
        return {
          Success: false,
          Message: 'You are not the organizer of this event',
        };
      }
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials taken');
        }
      }
      throw error;
    }
  }

  async addUserToEvent(eventId, userId) {
    try {
      const roleUser = await this.prisma.roles.findFirst({
        where: {
          eventId: eventId,
          userId: userId,
        },
      });
      if (roleUser) {
        throw new ForbiddenException('User already in event');
      }

      const role = await this.prisma.roles.create({
        data: {
          name: 'Participant',
          event: {
            connect: {
              id: eventId,
            },
          },
          user: {
            connect: {
              id: userId,
            },
          },
        },
      });

      return { Success: true, Role: role };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials taken');
        }
      }
      throw error;
    }
  }

  async changeRole(eventId, userId, role) {
    try {
      const roleUser = await this.prisma.roles.findFirst({
        where: {
          eventId: eventId,
          userId: userId,
        },
      });
      if (roleUser) {
        const changedRole = await this.prisma.roles.update({
          where: {
            id: roleUser.id,
          },
          data: {
            name: role,
          },
        });
        return { Success: true, Role: changedRole };
      } else {
        throw new ForbiddenException('User not found');
      }
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials taken');
        }
      }
      throw error;
    }
  }

  async removeUserFromEvent(eventId, userId) {
    try {
      const roleUser = await this.prisma.roles.findFirst({
        where: {
          eventId: eventId,
          userId: userId,
        },
      });
      if (roleUser) {
        await this.prisma.roles.delete({
          where: {
            id: roleUser.id,
          },
        });
        return { Success: true, Deleted: roleUser };
      } else {
        throw new ForbiddenException('User not found');
      }
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials taken');
        }
      }
      throw error;
    }
  }
}
