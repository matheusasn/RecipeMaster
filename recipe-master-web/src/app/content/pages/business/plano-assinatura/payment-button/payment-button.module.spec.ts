import { PaymentButtonModule } from './payment-button.module';

describe('PaymentButtonModule', () => {
  let paymentButtonModule: PaymentButtonModule;

  beforeEach(() => {
    paymentButtonModule = new PaymentButtonModule();
  });

  it('should create an instance', () => {
    expect(paymentButtonModule).toBeTruthy();
  });
});
