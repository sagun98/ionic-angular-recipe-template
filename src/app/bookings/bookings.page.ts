import { IonItemSliding, LoadingController } from '@ionic/angular';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Booking } from './booking.modal';
import { BookingsService } from './bookings.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.page.html',
  styleUrls: ['./bookings.page.scss'],
})
export class BookingsPage implements OnInit, OnDestroy {

  loadedBookings: Booking[];
  isLoading = false; 
  private bookingSub: Subscription;
  
  constructor(
    private bookingsService: BookingsService, 
    private loadingCtrl: LoadingController
    ) { }

  ngOnInit() {
    this.bookingsService.bookings.subscribe(bookings => {
      this.loadedBookings = bookings; 
    });
  }

  ionViewWillEnter(){
    this.isLoading = true;
    this.bookingsService.fetchBookings().subscribe(() => {
      this.isLoading = false;
    });
  }

  ngOnDestroy(){
    if (this.bookingSub){
      this.bookingSub.unsubscribe();
    }
  }

  onCancelBooking(bookingId: string, slidingBooking: IonItemSliding){
    slidingBooking.close();
    //cancel booking with Id offerId

    this.loadingCtrl.create({message: 'Cancelling...'}).then(loadingEl => {
      loadingEl.present();
      this.bookingsService.cancelBooking(bookingId).subscribe(()=>{
        loadingEl.dismiss();
      });
    });
  }
}