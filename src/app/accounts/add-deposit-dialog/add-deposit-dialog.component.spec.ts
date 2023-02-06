import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDepositDialogComponent } from './add-deposit-dialog.component';

describe('AddDepositDialogComponent', () => {
  let component: AddDepositDialogComponent;
  let fixture: ComponentFixture<AddDepositDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddDepositDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddDepositDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
