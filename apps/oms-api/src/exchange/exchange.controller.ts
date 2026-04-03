import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ExchangeService } from './exchange.service';
import { CreateOrderDto } from './dto/create-order.dto';

@ApiTags('Exchange (거래소 매매)')
@Controller('exchange')
export class ExchangeController {
  constructor(private readonly exchangeService: ExchangeService) {}

  @Get('balance')
  @ApiOperation({ summary: '바이낸스 지갑 잔고 조회' })
  @ApiResponse({ status: 200, description: '현재 보유 중인 코인 잔고 목록 반환' })
  async getBalance() {
    return this.exchangeService.getBalance();
  }

  @Post('order')
  @ApiOperation({ summary: '바이낸스 암호화폐 거래 주문 (매수/매도)' })
  @ApiResponse({ status: 201, description: '주문이 성공적으로 거래소로 전송됨' })
  @ApiResponse({ status: 500, description: 'API Key 오류 또는 체결 실패' })
  async createOrder(@Body() createOrderDto: CreateOrderDto) {
    // TODO: 운영 환경 반영 시 JWT 기반으로 AuthGuard 적용 필요
    return this.exchangeService.createOrder(createOrderDto);
  }
}
