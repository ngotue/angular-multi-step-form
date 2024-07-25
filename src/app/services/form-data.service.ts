import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';

@Injectable()
export class FormDataService {
  fieldGroups: string[] = ['personalInfo', 'address', 'contacts'];

  fields: {
    key: string;
    label: string;
    type: string;
    validators: { [key: string]: boolean | RegExp | number };
  }[][] = [
    [
      {
        key: 'firstName',
        label: 'First Name',
        type: 'text',
        validators: { required: true, minLength: 2 },
      },
      {
        key: 'lastName',
        label: 'Last Name',
        type: 'text',
        validators: { required: true },
      },
    ],
    [
      {
        key: 'streetName',
        label: 'Street name',
        type: 'text',
        validators: { required: true },
      },
      {
        key: 'streetNumber',
        label: 'Street number',
        type: 'number',
        validators: { required: true },
      },
      {
        key: 'city',
        label: 'City',
        type: 'text',
        validators: { required: true },
      },
      {
        key: 'zip',
        label: 'Zip',
        type: 'text',
        validators: { required: true, pattern: /^\d{5}$/ },
      },
    ],
    [
      {
        key: 'email',
        label: 'Email address',
        type: 'email',
        validators: { required: true, email: true },
      },
      {
        key: 'phoneNumber',
        label: 'Phone number',
        type: 'number',
        validators: { required: true, pattern: /^0\d{9}$/ },
      },
    ],
  ];

  getFieldData() {
    return this.fields.map((groups) => {
      return groups.map((field) => {
        const validators: Validators[] = [];
        if(field.validators['required']) validators.push(Validators.required)
        if(field.validators['email']) validators.push(Validators.email)
        if(field.validators['pattern']) validators.push(Validators.pattern(field.validators['pattern'] as RegExp))
        if(field.validators['minLength']) validators.push(Validators.minLength(field.validators['minLength'] as number))
        return {...field, validators}
      });
    });
  }

  getFieldGroupData() {
    return this.fieldGroups;
  }
}
