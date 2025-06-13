/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Controller, Get } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Controller('roles')
export class RolesController {
  @Get()
  async getRoles() {
    try {
      const roles = await prisma.role.findMany({
        select: { id: true, name: true },
        orderBy: { name: 'asc' },
      });
      return roles;
    } catch (error) {
      console.error('Error fetching roles:', error);
      throw new Error('Failed to fetch roles');
    }
  }
}
