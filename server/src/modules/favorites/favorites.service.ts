import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AddFavoriteDto, FavoriteDto } from './favorite.dto';

@Injectable()
export class FavoritesService {
  constructor(private readonly prisma: PrismaService) {}

  async list(): Promise<FavoriteDto[]> {
    const favorites = await this.prisma.favorite.findMany({
      orderBy: { addedAt: 'desc' },
    });

    return favorites.map((favorite) => this.toDto(favorite));
  }

  async add({ symbol }: AddFavoriteDto): Promise<FavoriteDto> {
    const normalizedSymbol = symbol.trim().toUpperCase();

    if (!normalizedSymbol) {
      throw new ConflictException('Symbol is required');
    }

    try {
      const favorite = await this.prisma.favorite.create({
        data: { symbol: normalizedSymbol },
      });

      return this.toDto(favorite);
    } catch {
      throw new ConflictException(
        `${normalizedSymbol} is already in favorites`,
      );
    }
  }

  async remove(symbol: string): Promise<void> {
    const normalizedSymbol = symbol.trim().toUpperCase();

    try {
      await this.prisma.favorite.delete({
        where: { symbol: normalizedSymbol },
      });
    } catch {
      throw new NotFoundException(`${normalizedSymbol} is not in favorites`);
    }
  }

  private toDto(favorite: {
    id: number;
    symbol: string;
    addedAt: Date;
  }): FavoriteDto {
    return {
      id: favorite.id,
      symbol: favorite.symbol,
      addedAt: favorite.addedAt.toISOString(),
    };
  }
}
