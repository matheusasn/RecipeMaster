import { PhotoUploadModule } from './photo-upload.module';

describe('PhotoUploadModule', () => {
  let photoUploadModule: PhotoUploadModule;

  beforeEach(() => {
    photoUploadModule = new PhotoUploadModule();
  });

  it('should create an instance', () => {
    expect(photoUploadModule).toBeTruthy();
  });
});
