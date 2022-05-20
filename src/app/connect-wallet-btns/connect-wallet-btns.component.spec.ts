import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectWalletBtnsComponent } from './connect-wallet-btns.component';

describe('ConnectWalletBtnsComponent', () => {
  let component: ConnectWalletBtnsComponent;
  let fixture: ComponentFixture<ConnectWalletBtnsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConnectWalletBtnsComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectWalletBtnsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
