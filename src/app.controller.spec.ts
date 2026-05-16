import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return index page data', () => {
      const mockReq = { session: {} } as any;
      const result = appController.getIndex(mockReq);
      expect(result).toHaveProperty('isAuth');
      expect(result).toHaveProperty('exhibitions');
    });
  });
});