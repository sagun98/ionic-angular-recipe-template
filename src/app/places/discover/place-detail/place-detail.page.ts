import { MapModalComponent } from './../../../shared/map-modal/map-modal.component';
import { CreateBookingComponent } from "./../../../bookings/create-booking/create-booking.component";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import {
  ActionSheetController,
  AlertController,
  LoadingController,
  ModalController,
  NavController,
} from "@ionic/angular";
import { Place } from "../../place.model";
import { PlacesService } from "../../places.service";
import { Subscription } from "rxjs";
import { BookingsService } from "src/app/bookings/bookings.service";
import { AuthService } from "src/app/auth/auth.service";

@Component({
  selector: "app-place-detail",
  templateUrl: "./place-detail.page.html",
  styleUrls: ["./place-detail.page.scss"],
})
export class PlaceDetailPage implements OnInit, OnDestroy {
  place: Place;
  isBookable = false;
  private placeSub: Subscription;
  isLoading = false;

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private placesService: PlacesService,
    private modalCtrl: ModalController,
    private actionSheetCtrl: ActionSheetController,
    private bookingsService: BookingsService,
    private loadingCtrl: LoadingController,
    private router: Router,
    private authService: AuthService,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap) => {
      if (!paramMap.has("placeId")) {
        this.navCtrl.navigateBack("places/tabs/discover");
        return;
      }
      this.isLoading = true;
      this.placeSub = this.placesService
        .getPlace(paramMap.get("placeId"))
        .subscribe((place) => {
          this.place = place;
          this.isBookable = place.userId !== this.authService.userId;
          this.isLoading = false;
        }, error => {
            this.alertCtrl.create({
              header: 'An error occured', 
              message: 'Could not load place...',
              buttons: [ {text: 'Okay', handler: () => {
                this.router.navigate(['/places/tabs/discover']);
              }}]
            }).then(alertEl => alertEl.present());
        });
    });
  }

  ngOnDestroy() {
    if (this.placeSub) {
      this.placeSub.unsubscribe();
    }
  }

  onShowFullMap(){
    this.modalCtrl.create({component: MapModalComponent, componentProps: {
      center: {lat: this.place.location.lat,lng: this.place.location.lng},
      selectable: false, 
      closeButtonText: 'Close',
      title: this.place.location.address
    }}).then(modalEl => {
      modalEl.present();
    })
  }

  onBookPlace() {
    this.actionSheetCtrl
      .create({
        header: "Choose an action",
        buttons: [
          {
            text: "Select Date",
            handler: () => {
              this.openBookingModal("select");
            },
          },
          {
            text: " Random Date",
            handler: () => {
              this.openBookingModal("random");
            },
          },
          {
            text: "Cancel",
            role: "destructive",
          },
        ],
      })
      .then((actionSheetEl) => {
        actionSheetEl.present();
      });
  }

  openBookingModal(mode: "select" | "random") {
    console.log(mode);
    this.modalCtrl
      .create({
        component: CreateBookingComponent,
        componentProps: {
          selectedPlace: this.place,
          selectedMode: mode,
        },
      })
      .then((modalEle) => {
        modalEle.present();
        return modalEle.onDidDismiss();
      })
      .then((resultData) => {
        this.loadingCtrl
          .create({
            message: "Booking place...",
          })
          .then((loadingEl) => {
            loadingEl.present();
            console.log(resultData.data, resultData.role);
            if (resultData.role === "confirm") {
              const data = resultData.data.bookingData;
              // Add booking through service
              this.bookingsService
                .addBooking(
                  this.place.id,
                  this.place.title,
                  this.place.imageUrl,
                  data.firstName,
                  data.lastName,
                  data.guestNumber,
                  data.startDate,
                  data.endDate
                )
                .subscribe(() => {
                  loadingEl.dismiss();
                  this.router.navigate(["/bookings"]);
                });
            } else {
              loadingEl.dismiss();
              this.router.navigate(["/places/tabs/discover"]);
            }
          });
      });
  }
}
