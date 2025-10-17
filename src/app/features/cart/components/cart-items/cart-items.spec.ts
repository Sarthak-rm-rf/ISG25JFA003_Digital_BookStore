import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartItemsComponent } from './cart-items';

describe('CartItems', () => {
  let component: CartItemsComponent;
  let fixture: ComponentFixture<CartItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartItemsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CartItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
