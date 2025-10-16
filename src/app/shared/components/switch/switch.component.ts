import { Component, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'z-switch',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './switch.html',
  styleUrls: ['./switch.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ZardSwitchComponent),
      multi: true
    }
  ]
})
export class ZardSwitchComponent implements ControlValueAccessor {
  checked = false;
  disabled = false;

  // These are placeholder functions that Angular will replace
  private onChange = (value: boolean) => {};
  private onTouched = () => {};

  // This method is called by Angular to update the component's value
  writeValue(obj: any): void {
    this.checked = !!obj;
  }

  // This method registers a callback function that should be called when the value changes
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  // This method registers a callback function that should be called when the component is touched
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  // This method is called when the component's disabled state changes
  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  // This is our internal method to handle the click and notify Angular
  toggle() {
    if (!this.disabled) {
      this.checked = !this.checked;
      this.onChange(this.checked);
      this.onTouched();
    }
  }
}

