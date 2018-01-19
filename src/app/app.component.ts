import { Component, ViewChild } from '@angular/core';
import { Platform, Nav, LoadingController, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
 
import { MyTeamsPage } from '../pages/my-teams/my-teams'
import { UserSettings } from '../shared/user-settings.service'
import { EliteApi } from '../shared/elite-api.service'
import {TeamHomePage} from '../pages/team-home/team-home'
import {TournamentsPage} from '../pages/tournaments/tournaments'
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage: any = MyTeamsPage;
  
  favoriteTeams: any;
  pages: Array<{ title: string, component: any }>;
  constructor(public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    private userSettings: UserSettings,
    private loadingController: LoadingController,
    private eliteApi: EliteApi,
    private events: Events
  ) {


    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      this.refreshFavorites();
      this.events.subscribe("favorites:changed", () => this.refreshFavorites());
    });

  }
  refreshFavorites() {
    this.favoriteTeams = this.userSettings.getAllFavorites();
  }
  goToTeam(favorite) {
    let loader = this.loadingController.create({
      content:'Simdi Geliyoooo...',
      dismissOnPageChange:true
    });
    loader.present();
    this.eliteApi.getTournamentData(favorite.tournamentId).subscribe(res=>this.nav.push(TeamHomePage,favorite.team));
  }
  goHome()
  {
    this.nav.push(MyTeamsPage);
  }
  goTournaments()
  {
    this.nav.push(TournamentsPage);
  }
}
