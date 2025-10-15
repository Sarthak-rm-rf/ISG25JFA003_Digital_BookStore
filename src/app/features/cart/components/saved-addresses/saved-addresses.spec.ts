import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavedAddresses } from './saved-addresses';

describe('SavedAddresses', () => {
  let component: SavedAddresses;
  let fixture: ComponentFixture<SavedAddresses>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SavedAddresses]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SavedAddresses);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
