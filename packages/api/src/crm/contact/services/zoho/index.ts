import { Injectable } from '@nestjs/common';
import { ApiResponse } from '../../types';
import { ZohoContactInput, ZohoContactOutput } from 'src/crm/@types';

@Injectable()
export class ZohoService {
  async addContact(
    contactData: ZohoContactInput,
    linkedUserId: string,
  ): Promise<ApiResponse<ZohoContactOutput>> {
    return;
  }
}
