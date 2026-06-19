import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { AddFavoriteDto, FavoriteDto } from './favorite.dto';
import { FavoritesService } from './favorites.service';

@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  list(): Promise<FavoriteDto[]> {
    return this.favoritesService.list();
  }

  @Post()
  add(@Body() body: AddFavoriteDto): Promise<FavoriteDto> {
    return this.favoritesService.add(body);
  }

  @Delete(':symbol')
  remove(@Param('symbol') symbol: string): Promise<void> {
    return this.favoritesService.remove(symbol);
  }
}
