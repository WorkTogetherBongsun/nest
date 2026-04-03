import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as ccxt from 'ccxt';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class ExchangeService {
  private readonly logger = new Logger(ExchangeService.name);
  private binance: ccxt.binance;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('BINANCE_API_KEY');
    const secretKey = this.configService.get<string>('BINANCE_SECRET_KEY');

    this.binance = new ccxt.binance({
      apiKey,
      secret: secretKey,
      enableRateLimit: true, // API 속도 제한 방어
      options: {
        defaultType: 'spot', // 기본 거래 시장: 현물(spot)
      },
    });

    // TESTNET 환경 활성화 (개발 환경에 한하여 테스트넷 활용 권장)
    if (this.configService.get('NODE_ENV') === 'development') {
      this.binance.setSandboxMode(true);
      this.logger.log('Binance Exchange initialized in [SANDBOX / TESTNET] mode.');
    } else {
      this.logger.log('Binance Exchange initialized in [PRODUCTION] mode.');
    }
  }

  /**
   * 바이낸스 현재 보유 잔고 조회
   */
  async getBalance() {
    try {
      this.logger.log('Fetching Binance account balance...');
      const balance = await this.binance.fetchBalance();
      // 유효 잔고(free)가 존재하는 자산만 필터링하여 응답
      const nonZeroBalances = Object.fromEntries(
        Object.entries(balance.total).filter(([_, amount]) => Number(amount) > 0),
      );
      return nonZeroBalances;
    } catch (error) {
      this.logger.error(`Failed to fetch balance: ${error.message}`);
      throw new InternalServerErrorException('바이낸스 API 통신 또는 키 검증에 실패했습니다.');
    }
  }

  /**
   * 바이낸스 암호화폐 체결(Order) 요청
   */
  async createOrder(createOrderDto: CreateOrderDto) {
    const { symbol, type, side, amount, price } = createOrderDto;

    try {
      this.logger.log(`Executing ${type} ${side} order for ${amount} ${symbol} at price ${price || 'market'}...`);
      
      const order = await this.binance.createOrder(
        symbol,
        type,
        side,
        amount,
        price,
      );
      
      this.logger.log(`Order successfully placed: [ID: ${order.id}]`);
      return {
        success: true,
        orderId: order.id,
        status: order.status,
        details: order,
      };
    } catch (error) {
      this.logger.error(`Order execution failed: ${error.message}`);
      throw new InternalServerErrorException(`주문 체결에 실패했습니다: ${error.message}`);
    }
  }
}
