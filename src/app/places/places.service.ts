import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, of } from "rxjs";
import { take, map, tap, delay, switchMap } from "rxjs/operators";
import { AuthService } from "../auth/auth.service";
import { PlaceLocation } from "./location.model";
import { Place } from "./place.model";

// new Place(
//   "p1",
//   "Charles River Esplanade",
//   "Fine Art America Bostons Skyline from the Charles River Esplanade",
//   "https://images.fineartamerica.com/images/artworkimages/mediumlarge/2/bostons-skyline-from-the-charles-river-esplanade-kristen-wilkinson.jpg",
//   1500.99,
//   new Date("2019-01-1"),
//   new Date("2019-12-31"),
//   "abc"
// ),
// new Place(
//   "p2",
//   "Spot Pond",
//   "The pond is within the Middlesex Fells Reservation, a Massachusetts state park.",
//   "https://digitalheritage.noblenet.org/melrose/files/original/Melrose_Postcard_Collection/934/mel_pc_116_a.jpg",
//   400.99,
//   new Date("2019-01-1"),
//   new Date("2020-12-31"),
//   "abc"
// ),
// new Place(
//   "p3",
//   "Museum of Sciences",
//   "Science museum and indoor zoo in Boston, Massachusetts, located in Science Park, a plot of land spanning the Charles River.",
//   "https://calendar.artsboston.org/wp-content/uploads/sites/calendar.artsboston.org/images/venue/598/museumofscience2.jpg",
//   29.99,
//   new Date("2019-01-1"),
//   new Date("2021-12-31"),
//   "asa"
// ),

interface PlaceData {
  availableFrom: string;
  availableTo: string;
  description: string;
  imageUrl: string;
  price: number;
  title: string;
  userId: string;
  location: PlaceLocation;
}
@Injectable({
  providedIn: "root",
})
export class PlacesService {
  private _places = new BehaviorSubject<Place[]>([]);

  fetchPlaces() {
    return this.httpClient
      .get<{ [key: string]: PlaceData }>(
        "https://ionic-angular-pairbnb-5c401.firebaseio.com/offered-places.json"
      )
      .pipe(
        map((resData) => {
          const places = [];
          for (const key in resData) {
            if (resData.hasOwnProperty(key)) {
              places.push(
                new Place(
                  key,
                  resData[key].title,
                  resData[key].description,
                  resData[key].imageUrl,
                  resData[key].price,
                  new Date(resData[key].availableFrom),
                  new Date(resData[key].availableTo),
                  resData[key].userId,
                  resData[key].location
                )
              );
            }
          }
          return places;
        }),
        tap((places) => {
          this._places.next(places);
        })
      );
  }

  get places() {
    return this._places.asObservable();
  }

  getPlace(id: string) {
    return this.httpClient
      .get<PlaceData>(
        `https://ionic-angular-pairbnb-5c401.firebaseio.com/offered-places/${id}.json`
      )
      .pipe(
        map((placeData) => {
          return new Place(
            id,
            placeData.title,
            placeData.description,
            placeData.imageUrl,
            placeData.price,
            new Date(placeData.availableFrom),
            new Date(placeData.availableTo),
            placeData.userId,
            placeData.location
          );
        })
      );
  }

  addPlace(
    title: string,
    description: string,
    price: number,
    dateFrom: Date,
    dateTo: Date,
    location: PlaceLocation,
    imageUrl: string
  ) {
    let generatedId: string;
    const newPlace = new Place(
      Math.random().toString(),
      title,
      description,
      imageUrl,
      price,
      dateFrom,
      dateTo,
      this.authService.userId,
      location
    );

    return this.httpClient
      .post<{ name: string }>(
        "https://ionic-angular-pairbnb-5c401.firebaseio.com/offered-places.json",
        {
          ...newPlace,
          id: null,
        }
      )
      .pipe(
        switchMap((resData) => {
          generatedId = resData.name;
          return this.places;
        }),
        take(1),
        tap((places) => {
          newPlace.id = generatedId;
          this._places.next(places.concat(newPlace));
        })
      );
  }

  uploadImage(image: File) {
    const uploadData = new FormData();
    uploadData.append("image", image);

    return this.httpClient.post<{ imageUrl: string; imagePath: string }>(
      "https://us-central1-ionic-angular-pairbnb-5c401.cloudfunctions.net/storeImage",
      uploadData
    );
  }

  updatePlace(placeId: string, title: string, description: string) {
    let updatedPlaces: Place[];
    return this.places.pipe(
      take(1),
      switchMap((places) => {
        if (!places || places.length <= 0) {
          return this.fetchPlaces();
        } else {
          return of(places);
        }
      }),
      switchMap((places) => {
        const updatedPlaceIndex = places.findIndex((pl) => pl.id === placeId);
        const updatedPlaces = [...places];
        const oldPlace = updatedPlaces[updatedPlaceIndex];
        updatedPlaces[updatedPlaceIndex] = new Place(
          oldPlace.id,
          title,
          description,
          oldPlace.imageUrl,
          oldPlace.price,
          oldPlace.availableFrom,
          oldPlace.availableTo,
          oldPlace.userId,
          oldPlace.location
        );
        return this.httpClient.put(
          `https://ionic-angular-pairbnb-5c401.firebaseio.com/offered-places/${placeId}.json`,
          { ...updatedPlaces[updatedPlaceIndex], id: null }
        );
      }),
      tap(() => {
        this._places.next(updatedPlaces);
      })
    );
  }

  constructor(
    private authService: AuthService,
    private httpClient: HttpClient
  ) {}
}
