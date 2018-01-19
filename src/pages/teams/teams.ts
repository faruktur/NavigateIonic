import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import * as _ from 'lodash';
import { TeamHomePage } from "../team-home/team-home";
import { EliteApi } from "../../shared/elite-api.service";
 
@IonicPage()
@Component({
  selector: 'page-teams',
  templateUrl: 'teams.html',
})
export class TeamsPage {
  private allTeams: any;
  private allTeamDivisions: any;
  queryText: string;
  teams = [];
  /* teams = [
    { id: 1, name: 'Fenerbahçe' },
    { id: 2, name: 'Galatasaray' },
    { id: 3, name: 'Beşiktaş' }
  ] */
  constructor(public navCtrl: NavController, public navParams: NavParams,
    private eliteApi: EliteApi,
    private loadingController: LoadingController
  ) {
  }
 
  ionViewDidLoad() {
    let selectedTourney = this.navParams.data;
    let loader = this.loadingController.create(
      {
        content: 'Geting data..'
      });
    loader.present().then(() => {
      this.eliteApi.getTournamentData(selectedTourney.id)
        .subscribe(data => {
          this.allTeams = data.teams;
          this.allTeamDivisions =
            _.chain(data.teams)
              .groupBy('division')
              .toPairs()
              .map(item => _.zipObject(['divisionName', 'divisionTeams'], item))
              .value();
          this.teams = this.allTeamDivisions;
          console.log('division teams:', this.teams);
          loader.dismiss();
        });
    });
    console.log('ionViewDidLoad TeamsPage');
  }
  itemTapped(event, team) {
    this.navCtrl.push(TeamHomePage, team);
  }
 
  public updateTeams() {
    /* if (this.queryText.length > 3) { */
    let queryTextLower = this.queryText.toLocaleLowerCase();
    let fiteredTeams = [];
    _.forEach(this.allTeamDivisions, td => {
      let teams = _.filter(td.divisionTeams, t => (<any>t).name.toLowerCase().includes(queryTextLower));
      if (teams.length) {
        fiteredTeams.push({ divisionName: td.divisionName, divisionTeams: teams });
      }
    });
    this.teams = fiteredTeams;
    /* } */
  }
}