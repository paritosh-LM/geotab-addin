import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GeotabApiService } from './geotab-api.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LmApiService {
  private lmAccessTokenSource = new BehaviorSubject('');
  lmAccessToken = this.lmAccessTokenSource.asObservable();

  private lmUrl = 'https://white-local-dev.lightmetrics.co';

  constructor(
    private httpClient: HttpClient,
    private geoTab: GeotabApiService
  ) {}

  getAuthenticationToken(tspAccountName: string, sessionId: string) {
    this.httpClient
      .post(`${this.lmUrl}/authenticate-geotab/${tspAccountName}`, {
        userName: 'paritosh.k@lightmetrics.co', // ?? how to get the username that is logged in geotab?
        sessionId: sessionId,
        database: 'lmfleet003',
        geotabBaseUrl: 'https://my.geotab.com',
      })
      .subscribe({
        next: (resp: any) => {
          this.lmAccessTokenSource.next(resp.token);
        },
        error: (error) => console.log(error),
      });
  }

  public getSemiProvisionedDevices(): Observable<any> {
    return this.httpClient.get<any[]>(`${this.lmUrl}/fleet/devices`, {
      headers: {
        'x-access-token': this.lmAccessTokenSource.getValue(),
      },
      params: {
        fleetId: 'lmfleet003',
        semiProvisioned: true,
      },
    });
  }

  assignAssetToDevice(
    assetId: string,
    assetName: string,
    deviceId: string | null,
    fleetId: string,
    dutyType: string,
    defaultDriverId: string | null,
    vendorId: string,
    ridecamPlusPlan: string,
    recurringLivestreamExtraMinutes: number
  ): Observable<any> {
    return this.httpClient.post(
      `${this.lmUrl}/provision-device`,
      {
        assetId,
        assetName,
        dutyType,
        defaultDriverId,
        vendorId,
        deviceId,
        fleetId,
        recurringLivestreamExtraMinutes,
        ridecamPlusPlan,
      },
      {
        headers: {
          'x-access-token': this.lmAccessTokenSource.getValue(),
        },
        params: {
          fleetId: 'lmfleet003',
        },
      }
    );
  }
}
