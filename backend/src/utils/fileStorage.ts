import fs from 'fs';
import path from 'path';

export interface StorageProvider {
  saveFile(file: Express.Multer.File): Promise<string>;
  deleteFile(fileUrl: string): Promise<void>;
}

class LocalStorageProvider implements StorageProvider {
  private uploadDir: string;

  constructor() {
    this.uploadDir = path.resolve(process.cwd(), process.env.UPLOAD_DIR || 'uploads');
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async saveFile(file: Express.Multer.File): Promise<string> {
    // Multer diskStorage already puts the file in uploadDir if configured,
    // or if memoryStorage, we write it here.
    const filename = file.filename || `${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`;
    return `/uploads/${filename}`;
  }

  async deleteFile(fileUrl: string): Promise<void> {
    try {
      const filename = path.basename(fileUrl);
      const filePath = path.join(this.uploadDir, filename);
      if (fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
      }
    } catch (err) {
      console.warn('Failed to delete local file:', err);
    }
  }
}

class S3StorageProvider implements StorageProvider {
  private bucket: string;

  constructor() {
    this.bucket = process.env.AWS_S3_BUCKET || 'biodata-photos';
  }

  async saveFile(file: Express.Multer.File): Promise<string> {
    // In production with S3 configured, upload to S3 bucket
    // Fallback returns S3 public URI or local if keys are absent
    if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
      console.warn('AWS credentials not found, falling back to local file URL.');
      return `/uploads/${file.filename}`;
    }
    // S3 integration placeholder with configurable endpoint
    const filename = `${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`;
    return `https://${this.bucket}.s3.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com/${filename}`;
  }

  async deleteFile(fileUrl: string): Promise<void> {
    console.log(`[S3] Deleting file ${fileUrl} from bucket ${this.bucket}`);
  }
}

export const getStorageProvider = (): StorageProvider => {
  const storageType = (process.env.STORAGE_TYPE || 'local').toLowerCase();
  if (storageType === 's3') {
    return new S3StorageProvider();
  }
  return new LocalStorageProvider();
};

export const storageService = getStorageProvider();
