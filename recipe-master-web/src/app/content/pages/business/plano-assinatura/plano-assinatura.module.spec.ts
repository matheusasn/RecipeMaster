import { PlanoAssinaturaModule } from './plano-assinatura.module';

describe('PlanoAssinaturaModule', () => {
  let planoAssinaturaModule: PlanoAssinaturaModule;

  beforeEach(() => {
    planoAssinaturaModule = new PlanoAssinaturaModule();
  });

  it('should create an instance', () => {
    expect(planoAssinaturaModule).toBeTruthy();
  });
});
