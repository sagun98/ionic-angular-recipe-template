
### Running the dev server: 
- ionic serve

- ionic cap add android
- update `capacitor.config.json` for the unique domain name
- ionic cap run android
- ionic cap run android -l --external (Live reload)

```
ionic capacitor run 
$ ionic capacitor run android
$ ionic capacitor run android -l --external (Choose this)
$ ionic capacitor run ios --livereload --external (Choose this)
$ ionic capacitor run ios --livereload-url=http://localhost:8100
``` 

### Debugging for Android: 
```
ionic capacitor run android -l --external 
chrome://inspect
```

### Debugging for IOS: 
```
ionic capacitor run ios -l --external 

Goto Safari => Develop => Simulator
```


### Useful Service commands: 
```
ionic generate
ionic generate service places/places
ionic generate service auth/auth
```


### Routing:
- Router Link + outerDirection
```
outerDirection="forward" [routerLink]="['/','places', 'tabs', 'discover', loadedPlaces[0].id]
```

- Back button: 
```
    <ion-buttons slot="start">
      <ion-back-button defaultHref="/places/tabs/discover">
      </ion-back-button>
    </ion-buttons>

    <ion-back-button [defaultHref]="'/places/tabs/offers/'+place.id">
```

- Router Go back or Forward with animation 
```
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.page.html',
  styleUrls: ['./place-detail.page.scss'],
})
export class PlaceDetailPage implements OnInit {

  constructor(private router:Router, private navCtrl:NavController) { }

  ngOnInit() {
  }

  onBookPlace(){
    // this.router.navigateByUrl('/places/tabs/discover');
    this.navCtrl.navigateBack('/places/tabs/discover');
  }
}
```


### Side Drawer: 
- 

### PWA-Elements
`ionic-angular-template sam1389$ npm install --save @ionic/pwa-elements`


### Firebase functions 
` sudo npm install -g firebase-tools`

