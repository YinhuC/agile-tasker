import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { Category } from '../../shared/interfaces/category.interface';
import { CategoryService } from '../services/category.service';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { AuthUser } from '../../user/decorators/user.decorator';
import { User } from '../../shared/interfaces/user.interface';
import { AuthenticatedGuard } from '../../auth/guards/auth.guard';
import { CategoryMemberGuard } from '../guards/category-member.guard';
import { GetCategoryDto } from '../dto/get-category.dto';

@UseGuards(AuthenticatedGuard)
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post('all')
  async getProjectCategories(
    @AuthUser() user: User,
    @Body() getCategoryDto: GetCategoryDto
  ): Promise<Category[]> {
    return await this.categoryService.getAllCategoriesByProjectId(
      user,
      getCategoryDto.projectId
    );
  }

  @Get(':id')
  @UseGuards(CategoryMemberGuard)
  async getCategoryById(@Param('id') id: number): Promise<Category> {
    return await this.categoryService.getCategoryById(id);
  }

  @Post()
  async createCategory(
    @AuthUser() user: User,
    @Body() createCategoryDto: CreateCategoryDto
  ): Promise<Category> {
    return await this.categoryService.createCategory(user, createCategoryDto);
  }

  @Put(':id')
  @UseGuards(CategoryMemberGuard)
  async updateCategory(
    @AuthUser() user: User,
    @Param('id') id: number,
    @Body() updateCategoryDto: UpdateCategoryDto
  ): Promise<Category> {
    return await this.categoryService.updateCategory(
      user,
      id,
      updateCategoryDto
    );
  }

  @Delete(':id')
  @UseGuards(CategoryMemberGuard)
  async deleteCategory(
    @AuthUser() user: User,
    @Param('id') id: number
  ): Promise<Category> {
    return await this.categoryService.deleteCategory(user, id);
  }
}
