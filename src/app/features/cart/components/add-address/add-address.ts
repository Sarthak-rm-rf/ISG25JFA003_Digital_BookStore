import { Component, Output, EventEmitter, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { COUNTRIES, STATES_AND_CITIES } from '../cart-card/location-data';

@Component({
  selector: 'app-add-address-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-address.html',
  styleUrl: './add-address.css'
})
export class AddAddress {
  @Output() addressSaved = new EventEmitter<any>();
  @Output() closeModal = new EventEmitter<void>();

  newAddress: any = this.getEmptyAddress();

  // Location Dropdown State
  private allCountries = COUNTRIES;
  private allStates = STATES_AND_CITIES;
  filteredCountries: string[] = [];
  filteredStates: any[] = [];
  filteredCities: string[] = [];
  dropdowns = { country: false, state: false, city: false };

  // This listener helps close dropdowns if you click outside of them
  @HostListener('document:click')
  onDocumentClick() {
    this.closeAllDropdowns();
  }

  saveNewAddress() {
    this.addressSaved.emit(this.newAddress);
  }

  closeAllDropdowns() {
    this.dropdowns = { country: false, state: false, city: false };
  }

  getEmptyAddress() {
    return { fullName: '', phone: '', addressLine1: '', addressLine2: '', postalCode: '', city: '', state: '', country: '' };
  }

  // --- Searchable Dropdown Logic ---

  filterCountries(searchTerm: string) {
    this.filteredCountries = !searchTerm 
      ? [...this.allCountries] 
      : this.allCountries.filter(c => c.toLowerCase().includes(searchTerm.toLowerCase()));
  }

  selectCountry(country: string) {
    this.newAddress.country = country;
    this.newAddress.state = ''; // Reset dependent fields
    this.newAddress.city = '';
    this.dropdowns.country = false; // <-- FIX: Close dropdown on selection
    if (country === 'India') {
      this.filteredStates = [...this.allStates];
    } else {
      this.filteredStates = []; // Clear states if not India
    }
  }

  filterStates(searchTerm: string) {
    if (!this.newAddress.country) return;
    this.filteredStates = !searchTerm
      ? [...this.allStates]
      : this.allStates.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }

  selectState(stateName: string) {
    this.newAddress.state = stateName;
    this.newAddress.city = ''; // Reset dependent field
    this.dropdowns.state = false; // <-- FIX: Close dropdown on selection
    const state = this.allStates.find(s => s.name === stateName);
    this.filteredCities = state ? [...state.cities] : [];
  }

  filterCities(searchTerm: string) {
    if (!this.newAddress.state) return;
    const state = this.allStates.find(s => s.name === this.newAddress.state);
    if (!state) return;

    this.filteredCities = !searchTerm
      ? [...state.cities]
      : state.cities.filter(c => c.toLowerCase().includes(searchTerm.toLowerCase()));
  }

  selectCity(city: string) {
    this.newAddress.city = city;
    this.dropdowns.city = false; // <-- FIX: Close dropdown on selection
  }
}