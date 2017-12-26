import { Validators, FormGroup, FormControl, AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';
import { Injectable } from '@angular/core';

@Injectable()
export class ValidatorExt {
    // static number(prms: any): ValidatorFn {
    //     return (control: FormControl): ValidationErrors => {
    //         if (isPresent(Validators.required(control))) {
    //             return null;
    //         }
    //         const val: number = control.value;
    //         if (isNaN(val) || /\D/.test(val.toString())) {
    //             return { 'number': true };
    //         } else if (!isNaN(prms.min) && !isNaN(prms.max)) {
    //             return val < prms.min || val > prms.max ? { 'number': true } : null;
    //         } else if (!isNaN(prms.min)) {
    //             return val < prms.min ? { 'number': true } : null;
    //         } else if (!isNaN(prms.max)) {
    //             return val > prms.max ? { 'number': true } : null;
    //         } else {
    //             return null;
    //         }
    //     };
    // }
    getValidators(_f) {
        return Object.keys(_f).reduce((a, b) => {
            const v = _f[b][1];
            if (v && (v === Validators.required || v.indexOf(Validators.required) > -1)) {
                if (!a[b]) { a[b] = {}; }
                a[b]['required'] = true;
            }
            return a;
        }, {});
    }
    validateAllFormFields(formGroup: FormGroup) {
        Object.keys(formGroup.controls).forEach(field => {
            const control = formGroup.get(field);
            if (control instanceof FormControl) {
                control.markAsTouched({ onlySelf: true });
            } else if (control instanceof FormGroup) {
                this.validateAllFormFields(control);
            }
        });
    }
    isFieldValid(field: FormControl) {
        return field.valid && field.touched;
    }
    displayFieldCss(field: FormControl) {
        return {
            'has-error': this.isFieldValid(field),
            'has-feedback': this.isFieldValid(field),
            'required': this.hasRequiredField(field)
        };
    }
    hasRequiredField = (abstractControl: AbstractControl): boolean => {
        if (abstractControl.validator) {
            const validator = abstractControl.validator({} as AbstractControl);
            if (validator && validator.required) {
                return true;
            }
        }
        if (abstractControl['controls']) {
            for (const controlName in abstractControl['controls']) {
                if (abstractControl['controls'][controlName]) {
                    if (this.hasRequiredField(abstractControl['controls'][controlName])) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
    getControlName = (abstractControl: AbstractControl): string | null => {
        const formGroup = abstractControl.parent.controls;
        return Object.keys(formGroup).find(name => abstractControl === formGroup[name]) || null;
    }
    remainingCharacters = (abstractControl: AbstractControl, requiredCharacters: number): number | null => {
        const valuelength = abstractControl && abstractControl.value ? abstractControl.value.length : 0;
        return requiredCharacters > valuelength ? requiredCharacters - valuelength : 0 || null;
    }

};
