import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ABibleVersePage } from './a-bible-verse.page';

describe('ABibleVersePage', () => {
  let component: ABibleVersePage;
  let fixture: ComponentFixture<ABibleVersePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ABibleVersePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ABibleVersePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
