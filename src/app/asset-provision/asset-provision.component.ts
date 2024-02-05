import { Component, Input, OnInit } from '@angular/core';
import { GeotabApiService } from '../geotab-api.service';
import { FormControl, FormGroup } from '@angular/forms';
import { LmApiService } from '../lm-api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { FleetConfig } from '../intefaces';

export const AVAILABLE_DUTY_TYPES = [
  {
    label: 'Heavy',
    value: 'heavy',
  },
  {
    label: 'Medium',
    value: 'medium',
  },
  {
    label: 'Light',
    value: 'light',
  },
];

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

  @Input()
  deviceId = '';

  // device details
  dutyType = new FormControl('');
  recurringLivestreamExtraMinutes: number = 0;

  myControl = new FormControl();

  fleetDriverList = <any>[];
  filteredOptions: Observable<any[]>;

  public assetForm = new FormGroup({});

  public availableDutyTypes = AVAILABLE_DUTY_TYPES;

  selectedDriver = new FormControl('');

  selectedSemiProvisionedDevice = new FormControl();

  ridecamPlusPlan: string = '';

  vendorId = '';

  @Input()
  driverDetails = {};

  updatingAsset: boolean = false;

  lmSemiProvisionedDevices = <any>[];

  filteredSelectedDevices: Observable<any[]>;

  public customOptions = {
    showAdditionalDisplayProp: true,
    additionalDisplayPropKey: 'driverName',
    appearance: 'outline',
    showLabel: true,
  };

  public driverChanged(defaultDriverId = '') {
    this.assetForm.patchValue({ defaultDriverId });
  }

  semiProvisionedDevice = new FormControl('');

  private subscription = new Subscription();

  data: any;
  constructor(
    private geotabAPI: GeotabApiService,
    private lmService: LmApiService,
    private _snackBar: MatSnackBar
  ) {}

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.fleetDriverList.filter((option) => {
      return option.firstName.toLowerCase().includes(filterValue);
    });
  }

  // private _filterId(value: string): string[] {
  //   const filterValue = value.toLowerCase();

  //   return this.fleetDriverList.filter((option) => {
  //     return option.id.toLowerCase().includes(filterValue);
  //   });
  // }

  ngOnInit(): void {
    // this.filteredOptions = this.myControl.valueChanges.pipe(
    //   startWith(''),
    //   map((value) => this._filter(value || ''))
    // );

    this.selectedSemiProvisionedDevice.valueChanges.subscribe((value) => {
      debugger;
      this.deviceId = value;
      this.updateDeviceDetails();
    });

    this.subscription.add(
      this.lmService.lmAccessToken.subscribe(async (val) => {
        console.log('value of lm accesstoken', val);
        if (val !== '') {
          this.lmService.getSemiProvisionedDevices().subscribe({
            next: (resp) => {
              this.lmSemiProvisionedDevices = resp.devices.map(
                (el: any) => el.deviceId
              );
              // this.filteredSelectedDevices =
              //   this.selectedSemiProvisionedDevice.valueChanges.pipe(
              //     startWith(''),
              //     map((value) =>
              //       typeof value === 'string' ? value : value.id
              //     ),
              //     map((id) =>
              //       id
              //         ? this._filterId(id)
              //         : this.lmSemiProvisionedDevices.slice()
              //     )
              //   );
              console.log(this.lmSemiProvisionedDevices);
            },
          });

          const deviceId = localStorage.getItem('urlId');
          console.log(deviceId);

          this.geotabAPI.getDeviceDetails(deviceId).subscribe({
            next: (resp) => {
              console.log(resp);
              this.serialNumber = resp.result[0].serialNumber;
              this.assetName = resp.result[0].name;
              this.fleetId = 'lmfleet003';

              // asset details will fill duty type and recurring live stream minutes
              this.lmService
                .getAssetDetails(this.serialNumber, this.fleetId)
                .subscribe({
                  next: (resp) => {
                    // this.deviceId = resp.deviceId;
                    this.selectedDriver.setValue(resp.defaultDriverId);

                    if (this.deviceId) this.updateDeviceDetails();
                    this.dutyType.setValue(resp.dutyType);
                    this.selectedSemiProvisionedDevice.setValue(resp.deviceId);
                    this.myControl.setValue(
                      this.fleetDriverList.find(
                        (el: any) => (el.id = resp.defaultDriverId)
                      )
                    );
                    this.ridecamPlusPlan = resp.ridecamPlusPlan;
                    this.recurringLivestreamExtraMinutes =
                      resp.recurringLivestreamExtraMinutes
                        ? resp.recurringLivestreamExtraMinutes
                        : 0;
                    if (this.deviceId)
                      this.lmSemiProvisionedDevices = [
                        this.deviceId,
                        ...this.lmSemiProvisionedDevices,
                      ];
                  },
                });
            },
          });

          this.geotabAPI.getDriverList().subscribe({
            next: (resp: any) => {
              this.fleetDriverList = resp.result;
              this.filteredOptions = this.myControl.valueChanges.pipe(
                startWith(''),
                map((value) =>
                  typeof value === 'string' ? value : value.name
                ),
                map((name) =>
                  name ? this._filter(name) : this.fleetDriverList.slice()
                )
              );
            },
          });
        }
      })
    );
  }

  displayFn(option: any): string {
    return option ? `${option.firstName} ${option.lastName}` : '';
  }

  displayFnDevice(option: any): string {
    return option ? `${option.id}` : '';
  }

  onSubmit() {
    // event.preventDefault();
    console.log('form details');
    console.log(this.selectedDriver.value);
    console.log(this.selectedSemiProvisionedDevice.value);
    this.updatingAsset = true;

    if (
      this.selectedSemiProvisionedDevice.value === '' &&
      this.selectedSemiProvisionedDevice.value !== this.deviceId
    ) {
      alert(`Device ${this.deviceId} will get deprovisioned`);

      const config: FleetConfig = {
        assetId: this.serialNumber,
        fleetId: this.fleetId,
        vendorId: this.vendorId,
        deviceId: this.deviceId,
        retainFleetId: true,
      };
      this.lmService.semiProvisionDevice(config).subscribe({
        next: (resp) => {
          this._snackBar.open('Moved device to semiprovisioned');
        },
        error: (err) => console.error(err),
        complete: () => (this.updatingAsset = false),
      });
    }

    if (this.selectedSemiProvisionedDevice.value !== '')
      this.lmService
        .assignAssetToDevice(
          this.serialNumber,
          this.assetName,
          this.selectedSemiProvisionedDevice.value,
          this.fleetId,
          this.dutyType.value,
          this.selectedDriver.value,
          this.vendorId,
          'STANDARD',
          0
        )
        .subscribe({
          next: (resp) => {
            const driver = this.myControl.value;

            this._snackBar.open('Updated Device');
            this.updatingAsset = false;

            return this.lmService
              .updateDriverDetails(
                this.fleetId,
                this.serialNumber,
                driver.id,
                `${driver.firstName} ${driver.lastName}`,
                this.dutyType.value,
                this.recurringLivestreamExtraMinutes
              )
              .subscribe();
          },

          error: () => this._snackBar.open('Could not update device'),
          complete: () => (this.updatingAsset = false),
        });
  }

  // get device details and store it component
  private updateDeviceDetails() {
    if (this.deviceId)
      this.lmService.getDeviceDetails(this.fleetId, this.deviceId).subscribe({
        next: (resp) => {
          debugger;
          this.vendorId = resp.vendorId;
          this.dutyType.setValue(resp.deviceMetadata.dutyType);

          this.recurringLivestreamExtraMinutes =
            resp.deviceMetadata.recurringLivestreamExtraMinutes;
        },
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
