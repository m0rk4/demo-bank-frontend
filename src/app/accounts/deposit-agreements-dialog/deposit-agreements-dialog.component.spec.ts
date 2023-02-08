import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepositAgreementsDialogComponent } from './deposit-agreements-dialog.component';

describe('DepositAgreementsDialogComponent', () => {
  let component: DepositAgreementsDialogComponent;
  let fixture: ComponentFixture<DepositAgreementsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DepositAgreementsDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DepositAgreementsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
