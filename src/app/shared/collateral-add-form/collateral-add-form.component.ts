import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-collateral-add-form',
  templateUrl: './collateral-add-form.component.html',
  styleUrls: ['./collateral-add-form.component.scss']
})
export class CollateralAddFormComponent implements OnInit {
  @Output() submitAdd = new EventEmitter<number>();

  form: FormGroup;

  constructor() {}

  ngOnInit() {
    this.createFormControls();
  }

  /**
   * Create form controls and define values
   */
  createFormControls() {
    this.form = new FormGroup({
      amount: new FormControl(null, [
        Validators.required,
        Validators.min(0)
      ])
    });
  }

  onSubmit(form: FormGroup) {
    const amount = form.value.amount;
    this.submitAdd.emit(amount);
  }
}
