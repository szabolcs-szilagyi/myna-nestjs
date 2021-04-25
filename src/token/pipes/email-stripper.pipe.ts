import { Injectable, PipeTransform } from '@nestjs/common';
import { emailPurification } from '../../utils/email-purification';

@Injectable()
export class EmailStripperPipe implements PipeTransform {
  transform(value: string) {
    return emailPurification(value);
  }
}
