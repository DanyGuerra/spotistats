import { Test, TestingModule } from '@nestjs/testing';
import { HelpController } from './help.controller';

describe('Help controller', () => {
  let controller: HelpController;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HelpController],
    }).compile();

    controller = module.get<HelpController>(HelpController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('[getApiHello]', () => {
    const getApiHelpSpy = jest
      .spyOn(controller, 'getApiHelp')
      .mockImplementation();

    controller.getApiHelp();

    expect(getApiHelpSpy).toHaveBeenCalled();
  });
});
