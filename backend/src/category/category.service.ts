import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';

const DEFAULT_CATEGORIES = [
  { slug: 'art', name: 'هنر و خلاقیت' },
  { slug: 'food', name: 'غذا و آشپزی' },
  { slug: 'health', name: 'سلامت و فعالیت' },
  { slug: 'culture', name: 'فرهنگ و گالری‌ها' },
  { slug: 'celebration', name: 'جشن‌ها و مناسبت‌ها' },
  { slug: 'nature', name: 'طبیعت و سفر' },
];

@Injectable()
export class CategoryService implements OnModuleInit {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
  ) {}

  async onModuleInit() {
    const count = await this.categoryRepo.count();
    if (count === 0) {
      await this.categoryRepo.save(
        DEFAULT_CATEGORIES.map((c) => this.categoryRepo.create(c)),
      );
    }
  }

  findAll() {
    return this.categoryRepo.find({ order: { name: 'ASC' } });
  }
}
