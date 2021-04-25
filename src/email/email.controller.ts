import { Body, Controller, Post } from '@nestjs/common';
import { PurchaseEmailDto } from './dto/purchase-email.dto';
import { EmailService } from './email.service';

@Controller('email')
export class EmailController {
  constructor(
    private readonly emailService: EmailService,
  ) {}

  @Post()
  sendPurchaseEmail(
    @Body() purchaseEmailDto: PurchaseEmailDto,
  ): Promise<void> {
    return this.emailService.sendPurchaseEmail(purchaseEmailDto);
  }
}
