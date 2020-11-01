
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