import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';

@Component({
  selector: 'app-beneficiaries',
  templateUrl: './beneficiaries.component.html',
  styleUrls: ['./beneficiaries.component.scss']
})
export class BeneficiariesComponent implements OnInit {

  beneficiaryForm: FormGroup;
  beneficiaries: FormArray;
  percentageSummary: number = 0;

  constructor(
    private fb: FormBuilder
  ) {
    this.beneficiaryForm = this.fb.group({
      beneficiaries: this.fb.array([this.createBeneficiary()])
    });
    console.log(this.beneficiaryForm.value);
   }

  ngOnInit() {
  }


  createBeneficiary(): FormGroup {
    return this.fb.group({
      fullName: ['', Validators.required],
      birthday: ['', Validators.required], 
      type: ['', Validators.required],
      optional: [''],
      relationship: ['', Validators.required],
      percentage: ['', Validators.required]
    });
  }

  addBeneficiary() {
    this.beneficiaries = this.beneficiaryForm.get('beneficiaries') as FormArray;
    this.beneficiaries.push(this.createBeneficiary());
  }

  removeBeneficiary(i: number) {
    this.beneficiaries.removeAt(i);
  }

  get beneficiariesControls() {
    return this.beneficiaryForm.get('beneficiaries')['controls'];
  }

  submitBeneficiaries() {
    console.log('all beneficiaries submitted in JSON', this.beneficiaryForm.value);
  }

}
