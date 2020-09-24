import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, FormArray, Validators } from '@angular/forms';

@Component({
  selector: 'app-beneficiaries',
  templateUrl: './beneficiaries.component.html',
  styleUrls: ['./beneficiaries.component.scss']
})
export class BeneficiariesComponent implements OnInit {

  beneficiaryForm: FormGroup;
  beneficiaries: FormArray;
  percentageSummary: number = 0;
  tempPercentageValue: number = 0;
  typesList: any = [
    { id: 0, name: 'SSN' }
  ];
  selectedType: any = [this.typesList[0]];
  relationshipList: any = [
    { id: 0, name: 'Trust' }
  ];
  selectedRelationship: any = [undefined];

  //max amount of beneficiaries per form
  MAX_BENEFICIARIES_AMOUNT = 20;

  constructor(
    private fb: FormBuilder
  ) {
    this.beneficiaryForm = this.fb.group({
      beneficiaries: this.fb.array([this.createBeneficiary()])
    });
    this.onValueChanged();
   }

  ngOnInit() {
  }

  // NEED TO REFACTOR
  onValueChanged(): void {
    this.beneficiariesFormArray.valueChanges.subscribe((data: any) => {
      const allControls = this.beneficiariesFormArray.controls;

      // SUMMARY PERCENTAGE UPDATE
      if (allControls.length == 1) {
        if (data[0].percentage && data[0].percentage > 0) {
          this.tempPercentageValue = data[0].percentage;
        }
      }

      if (allControls.length > 1 && data.length == 1) {
        if (data[0].percentage && data[0].percentage > 0) {
          this.tempPercentageValue = data[0].percentage;
        }
      }

      // MAKE PREVIOUS SUBMITTED FORM ARRAY ITEM DISABLED FOR CHANGES
      if (data.length > 1) {
        const controlIndex = allControls.length - 2;
        const cont = allControls[controlIndex];
        if (data[0].beneficiarySubmitted && cont.get('fullName').status !== 'DISABLED') {
          this.disableControl(cont, data[0]);
          //save summary and reset temp percentage value
          this.savePercentageSummary();
        }
      }

    });
  }


  disableControl(control, value) {
    control.get('fullName').reset({ value: value.fullName, disabled: true });
    control.get('birthday').reset({ value: value.birthday, disabled: true });
    control.get('type').reset({ value: value.type, disabled: true });
    control.get('optional').reset({ value: value.optional, disabled: true });
    control.get('relationship').reset({ value: value.relationship, disabled: true });
    control.get('percentage').reset({ value: value.percentage, disabled: true });
    control.get('beneficiarySubmitted').reset({ value: true, disabled: true });
  }


  resetControl(control) {
    control.get('fullName').reset({ value: '', disabled: false });
    control.get('birthday').reset({ value: '', disabled: false });
    control.get('type').reset({ value: control.get('type').value, disabled: false });
    control.get('optional').reset({ value: '', disabled: false });
    control.get('relationship').reset({ value: '', disabled: false });
    control.get('percentage').reset({ value: '', disabled: false });
    control.get('beneficiarySubmitted').reset({ value: false, disabled: false });
  }

  savePercentageSummary() {
    this.percentageSummary += this.tempPercentageValue;
    this.tempPercentageValue = 0;
  }

  resetPercentages() {
    this.percentageSummary = 0;
    this.tempPercentageValue = 0;
  }



  createBeneficiary(): FormGroup {
    return this.fb.group({
      fullName: ['', Validators.required],
      birthday: ['', Validators.required], 
      type: ['', Validators.required],
      optional: [''],
      relationship: ['', Validators.required],
      percentage: ['', [Validators.required, this.percentageValidation()]],
      beneficiarySubmitted: [false]
    });
  }

  percentageValidation() {
    return (formControl: FormControl) => {
      let valid: boolean = true;
      console.log('percentage validation', formControl.value);

      // DON'T VALIDATE IF AMOUNT OF BENEFICIARIES IS AT MAXIMUM AND 100% NOT ACHIEVED
      if (this.beneficiaries) {
        const amountOfBeneficiaries = this.beneficiaries.controls.length;
        if (amountOfBeneficiaries === this.MAX_BENEFICIARIES_AMOUNT && formControl.value + this.percentageSummary < 100) {
          valid = false;
        }
      }
  
      if (formControl.value <= 0 || formControl.value + this.percentageSummary > 100) {
        valid = false;
      }
      
      return valid ? null : { error: 'Not valid percentage amount' };
    };
  }

  addBeneficiary() {
    this.beneficiaries = this.beneficiariesFormArray;

    let summaryCount = 0;

    for(let control of this.beneficiaries.controls) {
      summaryCount += control.get('percentage').value;
    }

    if (summaryCount < 100) {
      // add selects values for ngModel
      this.selectedType.push(this.typesList[0]);
      this.selectedRelationship.push(undefined);
      
      //add beneficiary
      this.beneficiaries.push(this.createBeneficiary());
    } else {
      const lastControl = this.beneficiaries.controls[this.beneficiaries.length - 1];
      this.disableControl(lastControl, lastControl.value);
      this.savePercentageSummary();
    }
  }

  removeBeneficiary(index: number) {
    const percentageToRemove = this.beneficiaries.controls[index].value.percentage;
    const beneficiariesAmount = this.beneficiaries.length;

    if (beneficiariesAmount == 1) {
      this.resetControl(this.beneficiaries.controls[0]);
      this.resetPercentages();
    } else if(this.percentageSummary == 100 && beneficiariesAmount > 1) {
      this.percentageSummary -= percentageToRemove;
      this.resetControl(this.beneficiaries.controls[this.beneficiaries.length - 1]);
    } else {
      this.percentageSummary -= percentageToRemove;
      this.beneficiaries.removeAt(index);

      this.selectedType.splice(index, 1);
      this.selectedRelationship.splice(index, 1);
    }
    
  }

  get beneficiariesFormArray() {
    return this.beneficiaryForm.get('beneficiaries') as FormArray;
  }

  submitBeneficiaries() {
    console.log('all beneficiaries submitted in JSON', this.beneficiaryForm.value);
  }

}
