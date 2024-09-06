import { MappersRegistry } from '@@core/@core-services/registries/mappers.registry';
import { CoreUnification } from '@@core/@core-services/unification/core-unification.service';
import { OriginalSharedLinkOutput } from '@@core/utils/types/original/original.file-storage';
import { FileStorageObject } from '@filestorage/@lib/@types';
import { Utils } from '@filestorage/@lib/@utils';
import { IFileMapper } from '@filestorage/file/types';
import {
  UnifiedFilestorageFileInput,
  UnifiedFilestorageFileOutput,
} from '@filestorage/file/types/model.unified';
import { UnifiedFilestorageSharedlinkOutput } from '@filestorage/sharedlink/types/model.unified';
import { Injectable } from '@nestjs/common';
import { OnedriveFileInput, OnedriveFileOutput } from './types';

@Injectable()
export class OnedriveFileMapper implements IFileMapper {
  constructor(
    private mappersRegistry: MappersRegistry,
    private utils: Utils,
    private coreUnificationService: CoreUnification,
  ) {
    this.mappersRegistry.registerService(
      'filestorage',
      'file',
      'onedrive',
      this,
    );
  }

  async desunify(
    source: UnifiedFilestorageFileInput,
    customFieldMappings?: {
      slug: string;
      remote_id: string;
    }[],
  ): Promise<OnedriveFileInput> {
    // todo: do something with customFieldMappings
    return {
      name: source.name,
      file: {
        mimeType: source.mime_type,
      },
      size: parseInt(source.size),
      parentReference: {
        id: source.folder_id,
      },
    };
  }

  async unify(
    source: OnedriveFileOutput | OnedriveFileOutput[],
    connectionId: string,
    customFieldMappings?: {
      slug: string;
      remote_id: string;
    }[],
  ): Promise<UnifiedFilestorageFileOutput | UnifiedFilestorageFileOutput[]> {
    if (!Array.isArray(source)) {
      return await this.mapSingleFileToUnified(
        source,
        connectionId,
        customFieldMappings,
      );
    }
    // Handling array of OnedriveFileOutput
    return Promise.all(
      source.map((file) =>
        this.mapSingleFileToUnified(file, connectionId, customFieldMappings),
      ),
    );
  }

  private async mapSingleFileToUnified(
    file: OnedriveFileOutput,
    connectionId: string,
    customFieldMappings?: {
      slug: string;
      remote_id: string;
    }[],
  ): Promise<UnifiedFilestorageFileOutput> {
    const field_mappings: { [key: string]: any } = {};
    if (customFieldMappings) {
      for (const mapping of customFieldMappings) {
        field_mappings[mapping.slug] = file[mapping.remote_id];
      }
    }

    // todo: handle shared link
    // todo: handle permission
    // todo: handle folder

    return {
      remote_id: file.id,
      remote_data: file,
      name: file.name,
      file_url: file.webUrl,
      mime_type: file.file.mimeType,
      size: file.size.toString(),
      folder_id: null,
      permission: null,
      shared_link: null,
      field_mappings,
    };
  }
}
