import { CommonModule } from '@angular/common'
import { Component } from '@angular/core'
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms'
import { ReviewComponent } from '../review/review.component'
import { stepAnimation } from '../../step-animation'
import { DynamicFieldComponent } from '../dynamic-field/dynamic-field.component'
import { FormDataService } from '../../services/form-data.service'
import { LocalStorageService } from '../../services/localstorage.service'
import { USER_DATA_STRING } from '../../constants/db.index'

@Component({
  selector: 'app-multi-step-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DynamicFieldComponent,
    ReviewComponent,
  ],
  providers: [FormDataService, LocalStorageService],
  animations: [stepAnimation],
  templateUrl: './multi-step-form.component.html',
  styleUrl: './multi-step-form.component.css',
})
export class MultiStepFormComponent {
  activeStep = 1
  totalSteps = 4
  form: FormGroup

  fieldGroups: string[]
  fields: { key: string; label: string; type: string; validators: any[] }[][]

  constructor(
    private fb: FormBuilder,
    private fds : FormDataService,
    private ls : LocalStorageService
  ) {
    this.fieldGroups = this.fds.getFieldGroupData()
    this.fields = this.fds.getFieldData()
    this.form = this.generateFormFromFields()
  }

  private generateFormFromFields(): FormGroup {
    const formGroups: { [key: string]: FormGroup } = {}

    this.fields.forEach((stepFields, index) => {
      const stepFormGroup = this.fb.group({})
      stepFields.forEach((field) => {
        stepFormGroup.addControl(
          field.key,
          new FormControl('', field.validators)
        )
      })
      formGroups[this.fieldGroups[index]] = stepFormGroup
    })

    return this.fb.group(formGroups)
  }

  ngAfterViewInit() {
  }

  nextStep() {
    const currentFormGroup = this.getFormGroupForStep()
    if (currentFormGroup.valid) {
      this.saveCurrentStepData(currentFormGroup)
      this.activeStep++
    } else {
      currentFormGroup.markAllAsTouched()
      Object.keys(
        currentFormGroup.controls
      ).forEach((field) => {
        const control = currentFormGroup.get(field)
        if (control instanceof FormControl) {
          control.markAsTouched({ onlySelf: true })
          control.updateValueAndValidity()
        }
      })
      console.error('Form is invalid')
    }
  }

  previousStep() {
    this.activeStep--
  }

  getFormGroupForStep(): FormGroup {
    switch (this.activeStep) {
      case 1:
        return this.form.get('personalInfo') as FormGroup
      case 2:
        return this.form.get('address') as FormGroup
      case 3:
        return this.form.get('contacts') as FormGroup
      case this.totalSteps:
        return this.form

      default:
        throw new Error('Invalid step')
    }
  }

  saveCurrentStepData(formGroup: FormGroup) {
    let userData = this.ls.getItem(USER_DATA_STRING) ? this.ls.getItem<{[key: string] : string}>(USER_DATA_STRING) : {}
    
    userData = {...userData, ...formGroup.value}
    this.ls.setItem(USER_DATA_STRING, userData)

  }

  submitForm() {
    if (!this.form.valid) return
    alert("Data submitted")
  }
}
