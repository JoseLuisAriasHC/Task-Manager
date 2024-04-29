import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnvironmentEventComponent } from './environment-event.component';

describe('EnvironmentEventComponent', () => {
  let component: EnvironmentEventComponent;
  let fixture: ComponentFixture<EnvironmentEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnvironmentEventComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EnvironmentEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
