import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
// import { GeotabApiService } from './geotab-api.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { FleetConfig } from './intefaces';

@Injectable({
  providedIn: 'root',
})
export class LmApiService {
  public lmAccessTokenSource = new BehaviorSubject('');
  lmAccessToken = this.lmAccessTokenSource.asObservable();

  private lmUrl = 'https://white-local-dev.lightmetrics.co';

  constructor(
    private httpClient: HttpClient // private geoTab: GeotabApiService
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
      params: {
        fleetId: 'lmfleet003',
        semiProvisioned: true,
      },
    });
  }

  public getAssetDetails(assetId: string, fleetId: string): Observable<any> {
    return this.httpClient.get<any[]>(`${this.lmUrl}/asset-details`, {
      params: {
        fleetId: fleetId,
        assetId: assetId,
      },
    });
  }

  public getDeviceDetails(fleetId: string, deviceId: string): Observable<any> {
    return this.httpClient.get(`${this.lmUrl}/device-details`, {
      params: {
        fleetId: fleetId,
        deviceId: deviceId,
      },
    });
  }

  // public unAssignDevice(device)

  public updateDriverDetails(
    fleetId: string,
    assetId: string,
    defaultDriverId: string | null,
    defaultDriverName: string,
    dutyType: string,
    recurringLivestreamExtraMinutes: number
  ) {
    return this.httpClient.patch(
      `${this.lmUrl}/v2/assets`,
      {
        assets: [
          {
            assetId,
            defaultDriverId,
            defaultDriverName,
            dutyType,
            recurringLivestreamExtraMinutes,
          },
        ],
      },
      {
        params: {
          fleetId,
        },
      }
    );
  }

  // this api endpoint converts the deprovisioned device to semi provisioned
  public semiProvisionDevice(config: FleetConfig) {
    return this.httpClient.post(`${this.lmUrl}/deprovision-device`, config, {
      params: {
        fleetId: config.fleetId,
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
        params: {
          fleetId: 'lmfleet003',
        },
      }
    );
  }
}
