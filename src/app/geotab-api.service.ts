import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
// import GeotabApi from 'mg-api-js';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GeotabApiService {
  geotab: any;

  private geoTabSessionIdSource = new BehaviorSubject('');

  geoTabSessionId = this.geoTabSessionIdSource.asObservable;

  updateGeoTabSessionId(val: string) {
    this.geoTabSessionIdSource.next(val);
  }

  constructor(private httpClient: HttpClient) {
    // const authentication = {
    //   credentials: {
    //     database: 'lmfleet003',
    //     userName: 'paritosh.k@lightmetrics.co',
    //     password: '3pT%mjuLMtQf#ny', // todo - keep this secret or make the geotab api calls on the intermediate server and then serve the data
    //   },
    //   path: 'my.geotab.com',
    // };
    // this.geotab = new GeotabApi(authentication);
  }

  getDevices(): Observable<any> {
    return this.geotab.call('Get', { typeName: 'Device', resultsLimit: 100 });
  }

  public authenticateGeoTabUser(): Observable<any> {
    const userData = {
      database: 'lmfleet003',
      userName: 'paritosh.k@lightmetrics.co',
      password: 'qwlol40!!',
    };

    const body = {
      method: 'Authenticate',
      params: {
        ...userData,
      },
    };

    console.log('authenticate user');

    return this.httpClient.post('https://my.geotab.com/apiv1', body);
  }

  public getDriverList(): Observable<any> {
    return this.httpClient.post('https://my.geotab.com/apiv1', {
      method: 'Get',
      params: {
        typeName: 'User',
        search: {
          isDriver: true,
        },
        credentials: {
          database: 'lmfleet003',
          userName: 'paritosh.k@lightmetrics.co',
          sessionId: this.geoTabSessionIdSource.getValue(),
        },
      },
    });
  }

  public getDeviceDetails(deviceId: string | null): Observable<any> {
    return this.httpClient.post('https://my.geotab.com/apiv1', {
      method: 'Get',
      params: {
        typeName: 'Device',
        search: {
          id: deviceId,
        },
        credentials: {
          database: 'lmfleet003',
          userName: 'paritosh.k@lightmetrics.co',
          sessionId: this.geoTabSessionIdSource.getValue(),
        },
      },
    });
  }
}
