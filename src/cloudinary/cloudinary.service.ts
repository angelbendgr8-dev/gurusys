import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import cloudinary, {
  UploadApiErrorResponse,
  UploadApiResponse,
  v2,
} from 'cloudinary';
import * as toStream from 'buffer-to-stream';

@Injectable()
export class CloudinaryService {
  constructor(private configService: ConfigService) {}

  async uploadImage(
    file: any,
    folder: string,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    const options = {
      use_filename: true,
      unique_filename: true,
      folder: folder,
    };
    return new Promise((resolve, reject) => {
      const upload = v2.uploader.upload_stream(options, (error, result) => {
        if (error) {
          console.log(error);
          return reject(error);
        }
        resolve(result);
      });
      toStream(file.buffer).pipe(upload);
    });
  }
  async delete(
    public_id: string,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      v2.uploader.destroy(public_id, (error, result) => {
        if (error) {
          console.log(error);
          return reject(error);
        }
        resolve(result);
      });
    });
  }
}
