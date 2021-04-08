import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { AlertController, LoadingController } from "@ionic/angular";
import { Observable } from "rxjs";
import { AuthService, AuthResponseData } from "./auth.service";

@Component({
  selector: "app-auth",
  templateUrl: "./auth.page.html",
  styleUrls: ["./auth.page.scss"],
})
export class AuthPage implements OnInit {
  isLogin = true;

  constructor(
    private authService: AuthService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {}

  authenticate(email: string, password: string) {
    // this.isLoading = true;
    this.loadingCtrl
      .create({ keyboardClose: true, message: " Logging in ..." })
      .then((loadingEl) => {
        loadingEl.present();
        let authObs: Observable<AuthResponseData>;
        if(this.isLogin){
          authObs = this.authService.login(email,password);
        }
        else {
          authObs = this.authService.signup(email,password);
        }
        authObs.subscribe(
          (resData) => {
            loadingEl.dismiss();
            this.router.navigateByUrl("/places/tabs/discover");
          },
          (errRes) => {
            loadingEl.dismiss();
            const code = errRes.error.error.message;
            let message = "Could not sign you up, Please try again.";
            if (code === "EMAIL_EXISTS") {
              message = "This email address already exists";
            }
            else if (code === 'EMAIL_NOT_FOUND'){
              message = 'Email address could not be found';
            }
            else if (code === 'INVALID_PASSWORD'){
              message = 'The credentials are not correct';
            }
            this.showAlert(message);
          }
        );
      });
  }

  onSwitchAuthMode() {
    this.isLogin = !this.isLogin;
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }

    const email = form.value.email;
    const password = form.value.password;
    this.authenticate(email, password);
  }

  private showAlert(message: string) {
    this.alertCtrl
      .create({
        header: "Authentication failed",
        message: message,
        buttons: ["Okay"],
      })
      .then((alertEl) => {
        alertEl.present();
      });
  }
}
