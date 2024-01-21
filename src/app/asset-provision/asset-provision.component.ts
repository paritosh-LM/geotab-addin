import { Component, Input, OnInit } from '@angular/core';
import { GeotabApiService } from '../geotab-api.service';
import { FormControl, FormGroup } from '@angular/forms';
import { LmApiService } from '../lm-api.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-asset-provision',
  templateUrl: './asset-provision.component.html',
  styleUrls: ['./asset-provision.component.css'],
})
export class AssetProvisionComponent implements OnInit {
  @Input()
  tokenReady = '';

  @Input()
  serialNumber = '';

  @Input()
  assetName = '';

  @Input()
  fleetId = '';

  selectedDriver = new FormControl('');
  selectedSemiProvisionedDevice = new FormControl('');

  @Input()
  driverDetails = {};

  @Input()
  lmSemiProvisionedDevices = <any>[];

  @Input()
  drivers = <any>[];

  


  semiProvisionedDevice = new FormControl('');

  private subscription = new Subscription();

  data: any;
  constructor(
    private geotabAPI: GeotabApiService,
    private lmService: LmApiService
  ) {
    this.subscription.add(
      this.lmService.lmAccessToken.subscribe((val) => {
        console.log('value of lm accesstoken', val);
        if (val !== '') {
          this.lmService.getSemiProvisionedDevices().subscribe({
            next: (resp) => {
              this.lmSemiProvisionedDevices = resp.devices.map(
                (el: any) => el.deviceId
              );
            },
          });

          this.geotabAPI.getDeviceDetails('b1').subscribe({
            next: (resp) => {
              this.serialNumber = resp.result[0].serialNumber;
              this.assetName = resp.result[0].name;
              this.fleetId = 'lmfleet003';
            },
          });

          this.geotabAPI.getDriverList().subscribe({
            next: (resp: any) => (this.drivers = resp.result),
          });
        }
      })
    );

    this.selectedDriver.valueChanges.subscribe((value) => console.log(value));
  }

  ngOnInit(): void {}

  onSubmit() {
    // event.preventDefault();
    console.log('form details');
    console.log(this.selectedDriver.value);
    console.log(this.selectedSemiProvisionedDevice.value);

    this.lmService
      .assignAssetToDevice(
        this.serialNumber,
        this.assetName,
        this.selectedSemiProvisionedDevice.value,
        this.fleetId,
        'heavy',
        this.selectedDriver.value,
        'mitac_v',
        'STANDARD',
        0
      )
      .subscribe({
        next: (resp) => console.log(resp),
        error: (err) => console.error(err),
      });
  }

  ngOnChange(changes: any) {
    if (changes['tokenReady']) {
      this.lmService.getSemiProvisionedDevices().subscribe({
        next: (resp) => console.log(resp),
      });
    }
  }
}
