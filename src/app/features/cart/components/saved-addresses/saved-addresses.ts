import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-saved-addresses',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './saved-addresses.html',
  styleUrl: './saved-addresses.css',
})
export class SavedAddressesComponent {
  @Input() addresses: any[] = [];
  @Input() selectedAddress: any;
  @Output() addressSelected = new EventEmitter<any>();
  @Output() addNewAddress = new EventEmitter<void>();

  onAddressChange(address: any) {
    this.addressSelected.emit(address);
  }
}
