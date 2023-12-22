import { Component, NgZone, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { DialogService } from '@app/core';
import {
  Barcode,
  BarcodeFormat,
  BarcodeScanner,
  LensFacing,
} from '@capacitor-mlkit/barcode-scanning';
import { BarcodeScanningModalComponent } from './barcode-scanning-modal.component';
import { VentaService } from '@app/services/venta.service';
import { AlertController } from '@ionic/angular';
import { VentaInterface } from '@app/interfaces/interface';
import { Router } from '@angular/router';


@Component({
  selector: 'app-barcode-scanning',
  templateUrl: './barcode-scanning.page.html',
  styleUrls: ['./barcode-scanning.page.scss'],
})
export class BarcodeScanningPage implements OnInit {
  public readonly barcodeFormat = BarcodeFormat;
  public readonly lensFacing = LensFacing;

  public formGroup = new UntypedFormGroup({
    formats: new UntypedFormControl([]),
    lensFacing: new UntypedFormControl(LensFacing.Back),
    googleBarcodeScannerModuleInstallState: new UntypedFormControl(0),
    googleBarcodeScannerModuleInstallProgress: new UntypedFormControl(0),
  });
  public barcodes: Barcode[] = [];
  public isSupported = false;
  public isPermissionGranted = false;
  private ventaid ='';

  private readonly GH_URL =
    'https://github.com/capawesome-team/capacitor-barcode-scanning';

  constructor(
    private readonly dialogService: DialogService,
    private readonly ngZone: NgZone,
    private ventaService: VentaService,
    private alertController: AlertController,
    private route: Router
  ) {}

  public ngOnInit(): void {
    BarcodeScanner.isSupported().then((result) => {
      this.isSupported = result.supported;
    });
    BarcodeScanner.checkPermissions().then((result) => {
      this.isPermissionGranted = result.camera === 'granted';
    });
    BarcodeScanner.removeAllListeners().then(() => {
      BarcodeScanner.addListener(
        'googleBarcodeScannerModuleInstallProgress',
        (event) => {
          this.ngZone.run(() => {
            console.log('googleBarcodeScannerModuleInstallProgress', event);
            const { state, progress } = event;
            this.formGroup.patchValue({
              googleBarcodeScannerModuleInstallState: state,
              googleBarcodeScannerModuleInstallProgress: progress,
            });
          });
        }
      );
    });


    this.ventaService.getVentaDetalle()
    .subscribe((resp: VentaInterface) => {
      this.ventaid = resp._id;
    },
    (error) => {
      console.error('Error al hacer la petición de crear venta:', error);
      // Manejar errores aquí
    }
    );
  }

  public async startScan(): Promise<void> {
    const formats = this.formGroup.get('formats')?.value || [];
    const lensFacing =
      this.formGroup.get('lensFacing')?.value || LensFacing.Back;
    const element = await this.dialogService.showModal({
      component: BarcodeScanningModalComponent,
      // Set `visibility` to `visible` to show the modal (see `src/theme/variables.scss`)
      cssClass: 'barcode-scanning-modal',
      showBackdrop: false,
      componentProps: {
        formats: formats,
        lensFacing: lensFacing,
      },
    });
    element.onDidDismiss().then((result) => {
      const barcode: Barcode | undefined = result.data?.barcode;
      if (barcode) {
        this.barcodes.push(barcode);
        let petProductCode = {
          prodescripcion: barcode.rawValue,
          cantidad: 6
        }
          //console.log(petProductCode);
          
        this.ventaService.postVenta_AgregarProducto(petProductCode,this.ventaid)
        .subscribe((resp) => {console.log(resp);
     },
     (error) => {
       console.error('Error al hacer la petición:', error);
     })
      }
    });
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Ingresar Cliente',
      buttons: [{
        text: 'Cancelar',
        role:'cancel',
        cssClass: 'secundary'
      },
      {
        text: 'Aceptar',
        handler:(data:any) => {
          let petCliente = {
            capturista: data[0]
          }

          console.log(petCliente);
          
           this.ventaService.postVentaCapturista(petCliente,this.ventaid)
           .subscribe((resp) => {console.log(resp);
        },
        (error) => {
          console.error('Error al hacer la petición:', error);
          // Manejar errores aquí
        })
      }
    }
        ],
      inputs: [
        {
          placeholder: 'CLiente'
        }
      ],
    });
    await alert.present();
  }

  // async crearVenta(){
  //       this.ventaService.getVentaDetalle()
  //   .subscribe((resp: VentaInterface) => {
  //    // this.ventaid = resp._id;
  //     console.log(this.ventaid);
      
  //   });
  // }

  async crearVenta(){
    this.ventaService.getVentaDetalle()
.subscribe(posts => {
 // this.ventaid = resp._id;
  console.log(posts);
  
},
(error) => {
  console.error('Error al hacer la petición:', error);
  // Manejar errores aquí
}
);
}

regresar(){
  this.route.navigateByUrl('/home', {replaceUrl: true})
}

}
