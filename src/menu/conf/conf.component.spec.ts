import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfComponent } from './conf.component';

describe('ConfComponent', () => {
  let component: ConfComponent;
  let fixture: ComponentFixture<ConfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
