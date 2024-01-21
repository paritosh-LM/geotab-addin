import { Component } from '@angular/core';
import { GeotabApiService } from './geotab-api.service';
import { LmApiService } from './lm-api.service';

@Component({
  selector: '[app-root]',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'geotab-addin';

  constructor(
    private geotabAPI: GeotabApiService,
    private lmService: LmApiService
  ) {}

  ngOnInit() {
    // dont run this logic again when the page loads, make use of local storage
    this.geotabAPI
      .authenticateGeoTabUser()
      .subscribe({
        next: (resp: any) => {
          const geoTabSessionId = resp['result'].credentials.sessionId;
          this.geotabAPI.updateGeoTabSessionId(geoTabSessionId);
          console.log(geoTabSessionId);
          this.lmService.getAuthenticationToken('lmpresales', geoTabSessionId);
        },
        error: (error) => {
          console.log(error);
        },
      })
      .add();
  }
}
