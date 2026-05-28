import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { EventService } from './event.service';
import { EventImageService } from './image/event-image.service';
import { EventImage } from './image/event-image.entity';
import { DiscoverEventsDto } from './dto/discover-events.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { UserRole } from '@/common/enums';
import { JwtPayload } from '@/auth/jwt-payload.interface';
import { OptionalJwtAuthGuard } from '@/common/guards/optional-jwt-auth.guard';

@Controller('events')
export class EventController {
  constructor(
    private readonly eventService: EventService,
    private readonly imageService: EventImageService,
  ) {}

  @Get()
  discover(@Query() query: DiscoverEventsDto) {
    return this.eventService.discover(query);
  }

  @Get('mine')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ORGANIZER, UserRole.ADMIN)
  findMine(@CurrentUser() user: JwtPayload) {
    return this.eventService.findMine(user.sub);
  }

  @Get(':id')
  @UseGuards(OptionalJwtAuthGuard)
  async getOne(@Param('id') id: string, @CurrentUser() user?: JwtPayload) {
    return this.eventService.findOne(Number(id), user);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ORGANIZER, UserRole.ADMIN)
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'images', maxCount: 3 }], {
      storage: diskStorage({
        destination: './uploads',
        filename: (_req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueSuffix + extname(file.originalname));
        },
      }),
    }),
  )
  async create(
    @CurrentUser() user: JwtPayload,
    @UploadedFiles() files: { images?: Express.Multer.File[] },
    @Body() body: Record<string, string>,
  ) {
    const event = await this.eventService.createFromBody(user.sub, {
      title: body.title,
      description: body.description,
      city: body.city,
      address: body.address,
      startDate: body.startDate as unknown as Date,
      endDate: body.endDate as unknown as Date,
      capacity: body.capacity ? Number(body.capacity) : undefined,
      categoryId: body.categoryId ? Number(body.categoryId) : undefined,
    });

    if (files?.images?.length) {
      const uploadedImages: EventImage[] = [];
      for (const file of files.images) {
        const url = `/uploads/${file.filename}`;
        const img = await this.imageService.create(url, event.id);
        uploadedImages.push(img);
      }
      event.images = uploadedImages;
    }

    return this.eventService.findOne(event.id, user);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ORGANIZER, UserRole.ADMIN)
  update(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
    @Body() body: Record<string, unknown>,
  ) {
    const isAdmin = user.role === UserRole.ADMIN;
    return this.eventService.update(Number(id), user.sub, body, isAdmin);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ORGANIZER, UserRole.ADMIN)
  remove(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    const isAdmin = user.role === UserRole.ADMIN;
    return this.eventService.delete(Number(id), user.sub, isAdmin);
  }
}
