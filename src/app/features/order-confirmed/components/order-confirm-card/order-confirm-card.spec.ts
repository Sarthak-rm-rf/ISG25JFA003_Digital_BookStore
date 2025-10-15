import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderConfirmCard } from './order-confirm-card';

describe('OrderConfirmCard', () => {
  let component: OrderConfirmCard;
  let fixture: ComponentFixture<OrderConfirmCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderConfirmCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderConfirmCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
