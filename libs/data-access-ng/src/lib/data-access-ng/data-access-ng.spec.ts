import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DataAccessNg } from './data-access-ng';

describe('DataAccessNg', () => {
  let component: DataAccessNg;
  let fixture: ComponentFixture<DataAccessNg>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataAccessNg],
    }).compileComponents();

    fixture = TestBed.createComponent(DataAccessNg);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
