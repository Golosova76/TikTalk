import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatWorkspaceWrapperComponent } from './chat-workspace-wrapper.component';

describe('ChatWorkspaceWrapperComponent', () => {
  let component: ChatWorkspaceWrapperComponent;
  let fixture: ComponentFixture<ChatWorkspaceWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatWorkspaceWrapperComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatWorkspaceWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
