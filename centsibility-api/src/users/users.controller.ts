import { Body, Controller, ForbiddenException, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../common/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // POST /api/v1/users  (public - register)
  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  // GET /api/v1/users/:id  (owner only)
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: { userId: number }) {
    this.assertOwner(id, user.userId);
    return this.usersService.findOne(id);
  }

  // PATCH /api/v1/users/:id  (owner only)
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUserDto, @CurrentUser() user: { userId: number }) {
    this.assertOwner(id, user.userId);
    return this.usersService.update(id, dto);
  }

  private assertOwner(id: number, currentUserId: number) {
    if (id !== currentUserId) {
      throw new ForbiddenException({
        message: 'Access denied.',
        errors: ['You can only access your own account.'],
      });
    }
  }
}
