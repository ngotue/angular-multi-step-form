import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[appFormError]',
  standalone: true
})
export class FormErrorDirective {
  @Input('appFormError') control!: AbstractControl;
  @Input() fieldLabel!: string;

  private errorSpan!: HTMLElement;
  private controlSub? : Subscription

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  ngOnInit() {
    if(this.controlSub) this.controlSub.unsubscribe()
    this.controlSub = this.control.statusChanges.subscribe(() => {
        this.updateErrorMessages();
    });
    this.renderer.listen(this.el.nativeElement, 'blur', () => {
        this.control.markAsTouched();
        this.updateErrorMessages(); 
      });
    this.updateErrorMessages();
  }

  private updateErrorMessages() {
    if (this.errorSpan) {
      this.renderer.removeChild(this.el.nativeElement.parentNode, this.errorSpan);
    }

    if (this.control.invalid && (this.control.dirty || this.control.touched)) {
      this.errorSpan = this.renderer.createElement('div');
      this.renderer.addClass(this.errorSpan, 'error-message');
      
      const errors = this.control.errors as ValidationErrors;
      const firstErrorKey = Object.keys(errors)[0]; 
      const errorMessage = this.getErrorMessage(firstErrorKey, errors); 
      const text = this.renderer.createText(errorMessage);
      this.renderer.appendChild(this.errorSpan, text);

      this.renderer.insertBefore(this.el.nativeElement.parentNode, this.errorSpan, this.el.nativeElement.nextSibling); 
    }
  }

  private getErrorMessage(key: string, errors: ValidationErrors): string {
    switch (key) {
      case 'required':
        return `${this.fieldLabel} is required`;
      case 'minlength':
        return `Minimum length is ${errors['minlength'].requiredLength}`;
      case 'maxlength':
        return `Maximum length is ${errors['maxlength'].requiredLength}`;
      case 'pattern':
        return 'Invalid format';
      case 'email':
        return 'Invalid email address';
      default:
        return 'Invalid input';
    }
  }

  ngOnDestroy(){
    this.controlSub?.unsubscribe()
  }
}