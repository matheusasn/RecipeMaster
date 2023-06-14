import { UnitinfoModule } from './unitinfo.module';

describe('UnitinfoModule', () => {
  let unitinfoModule: UnitinfoModule;

  beforeEach(() => {
    unitinfoModule = new UnitinfoModule();
  });

  it('should create an instance', () => {
    expect(unitinfoModule).toBeTruthy();
  });
});
