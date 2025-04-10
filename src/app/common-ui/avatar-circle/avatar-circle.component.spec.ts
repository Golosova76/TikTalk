import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvatarCircleComponent } from './avatar-circle.component';

describe('AvatarCircleComponent', () => {
  let component: AvatarCircleComponent;
  let fixture: ComponentFixture<AvatarCircleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvatarCircleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AvatarCircleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
