import { NgIf } from '@angular/common';
import { Component, NgZone, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { COUNTRIES, STATES_AND_CITIES } from './location-data'; // Import location data

@Component({
  selector: 'cart-card',
  standalone: true,
  imports: [NgIf, FormsModule],
  templateUrl: './cart-card.html',
  styleUrl: './cart-card.css'
})
export class CartCard {
  // --- Component State ---
  products = [
    { image: 'https://images-na.ssl-images-amazon.com/images/I/81eB+7+CkUL.jpg', author: 'Harper Lee', name: 'To Kill a Mockingbird', quantity: 1, price: 299, rating: 4.8, liked: false },
    { image: 'https://images-na.ssl-images-amazon.com/images/I/91bYsX41DVL.jpg', author: 'George Orwell', name: '1984', quantity: 1, price: 199, rating: 4.7, liked: false },
  ];

  addresses = [
    { id: 1, fullName: 'Rohan Sharma', phone: '9876543210', addressLine1: '101, Marine Drive Apartments', addressLine2: 'Opposite Wankhede Stadium', postalCode: '400020', city: 'Mumbai', state: 'Maharashtra', country: 'India' },
    { id: 2, fullName: 'Priya Patel', phone: '9123456780', addressLine1: 'B-2, Hauz Khas Village', addressLine2: '', postalCode: '110016', city: 'New Delhi', state: 'Delhi', country: 'India' },
  ];

  selectedAddress: any = null;
  isAddressModalVisible = false;
  newAddress: any = this.getEmptyAddress();
  isLoading = false;
  orderDetails: any = {};
  
  // --- Order Summary State ---
  couponCode: string = '';
  discount: number = 0;
  couponApplied: boolean = false;

  // --- Location Dropdown State ---
  private allCountries = COUNTRIES;
  private allStates = STATES_AND_CITIES;
  
  filteredCountries: string[] = [];
  filteredStates: any[] = [];
  filteredCities: string[] = [];

  dropdowns = { country: false, state: false, city: false };

  // --- Lifecycle & Event Handlers ---
  constructor(private zone: NgZone) {
    if (this.addresses.length > 0) {
      this.selectedAddress = this.addresses[0];
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    this.dropdowns.country = false;
    this.dropdowns.state = false;
    this.dropdowns.city = false;
  }

  // --- Cart & Order Methods ---
  placeOrder() {
    if (!this.selectedAddress) {
      alert('Please select a shipping address!');
      return;
    }
    this.isLoading = true;
    setTimeout(() => {
      console.log('Order placed for address:', this.selectedAddress);
      this.isLoading = false;
      const amount = this.getCartTotalPaise();
      const self = this;
      const options = {
        key: 'rzp_test_1DP5mmOlF5G5ag', // Demo key
        amount: amount, // Amount in paise
        currency: 'INR',
        name: 'Bookstore Demo',
        description: 'Test Transaction',
        image: 'https://cdn-icons-png.flaticon.com/512/891/891419.png',
        handler: function (response: any) {
          self.zone.run(() => {
            self.products = [];
            self.orderDetails = {
              paymentId: response.razorpay_payment_id,
              amount: amount / 100,
              date: new Date().toLocaleString()
            };
          });
        },
        prefill: {
          name: 'Demo User',
          email: 'demo.user@example.com',
          contact: '9999999999'
        },
        theme: {
          color: '#d76538ff'
        }
      };
      const rzp = new (window as any).Razorpay(options);
      rzp.open();
      }, 2000);
  }
  
  getCartTotalPaise(): number {
    return Math.round(this.totalAmount() * 100); // Convert final total rupees to paise
  }

  // --- Order Summary Calculations ---
  subtotal(): number {
    return this.products.reduce((acc, product) => acc + product.price * product.quantity, 0);
  }

  gstAmount(): number {
    const amountAfterDiscount = this.subtotal() - this.discount;
    return amountAfterDiscount * 0.18;
  }

  totalAmount(): number {
    return this.subtotal() - this.discount + this.gstAmount();
  }

  applyCoupon() {
    if (this.couponCode.toUpperCase() === 'SALE100' && !this.couponApplied) {
        this.discount = 100.00;
        this.couponApplied = true;
    } else if (this.couponApplied) {
        // You could add a small notification logic here if needed
    } else {
        alert('Invalid coupon code.');
        this.couponCode = '';
    }
  }

  // --- Address Modal Methods ---
  openAddressModal() {
    this.newAddress = this.getEmptyAddress();
    this.isAddressModalVisible = true;
  }

  closeAddressModal() {
    this.isAddressModalVisible = false;
  }

  saveNewAddress() {
    const newId = this.addresses.length > 0 ? Math.max(...this.addresses.map(a => a.id)) + 1 : 1;
    const addressToAdd = { id: newId, ...this.newAddress };
    this.addresses.push(addressToAdd);
    this.selectedAddress = addressToAdd;
    this.closeAddressModal();
  }

  private getEmptyAddress() {
    return { fullName: '', phone: '', addressLine1: '', addressLine2: '', postalCode: '', city: '', state: '', country: '' };
  }

  // --- Searchable Dropdown Logic ---
  filterCountries(searchTerm: string) { if (!searchTerm) { this.filteredCountries = [...this.allCountries]; } else { this.filteredCountries = this.allCountries.filter(c => c.toLowerCase().includes(searchTerm.toLowerCase())); } }
  selectCountry(country: string) { this.newAddress.country = country; this.newAddress.state = ''; this.newAddress.city = ''; this.filteredStates = []; this.filteredCities = []; this.dropdowns.country = false; if (country === 'India') { this.filteredStates = [...this.allStates]; } }
  filterStates(searchTerm: string) { if(this.newAddress.country !== 'India') return; if (!searchTerm) { this.filteredStates = [...this.allStates]; } else { this.filteredStates = this.allStates.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase())); } }
  selectState(stateName: string) { this.newAddress.state = stateName; this.newAddress.city = ''; this.dropdowns.state = false; const selectedState = this.allStates.find(s => s.name === stateName); this.filteredCities = selectedState ? [...selectedState.cities] : []; }
  filterCities(searchTerm: string) { const selectedState = this.allStates.find(s => s.name === this.newAddress.state); if (!selectedState) return; if (!searchTerm) { this.filteredCities = [...selectedState.cities]; } else { this.filteredCities = selectedState.cities.filter(c => c.toLowerCase().includes(searchTerm.toLowerCase())); } }
  selectCity(city: string) { this.newAddress.city = city; this.dropdowns.city = false; }

  // --- Simple Product Methods (Unchanged) ---
  toggleLike(product: any) { product.liked = !product.liked; }
  decreaseQuantity(product: any) { if (product.quantity > 1) product.quantity--; }
  increaseQuantity(product: any) { if (product.quantity < 100) product.quantity++; }
  deleteProduct(index: number) { this.products.splice(index, 1); }
}

