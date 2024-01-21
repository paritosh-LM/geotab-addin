import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetProvisionComponent } from './asset-provision.component';

describe('AssetProvisionComponent', () => {
  let component: AssetProvisionComponent;
  let fixture: ComponentFixture<AssetProvisionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssetProvisionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetProvisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
