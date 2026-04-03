import { IsString, IsNumber, IsIn, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateOrderDto {
  @ApiProperty({
    description: '거래할 심볼 (예: BTC/USDT)',
    example: 'BTC/USDT',
  })
  @IsString()
  symbol: string;

  @ApiProperty({
    description: '주문 종류 (market: 시장가, limit: 지정가)',
    enum: ['market', 'limit'],
    example: 'limit',
  })
  @IsIn(['market', 'limit'])
  type: 'market' | 'limit';

  @ApiProperty({
    description: '매매 방향 (buy: 매수, sell: 매도)',
    enum: ['buy', 'sell'],
    example: 'buy',
  })
  @IsIn(['buy', 'sell'])
  side: 'buy' | 'sell';

  @ApiProperty({
    description: '주문 수량 (코인 기준)',
    example: 0.05,
  })
  @IsNumber()
  amount: number;

  @ApiPropertyOptional({
    description: '주문 지정가 (시장가 주문일 경우 무시됨)',
    example: 65000,
  })
  @IsOptional()
  @IsNumber()
  price?: number;
}
