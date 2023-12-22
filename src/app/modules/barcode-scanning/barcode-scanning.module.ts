import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BarcodeScanningRoutingModule } from './barcode-scanning-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BarcodeScanningModalComponent } from './barcode-scanning-modal.component';
import { BarcodeScanningPage } from './barcode-scanning.page';

@NgModule({
  imports: [
    CommonModule,
    BarcodeScanningRoutingModule,
    FormsModule,
    ReactiveFormsModule],
  declarations: [BarcodeScanningPage,FormsModule, ReactiveFormsModule,BarcodeScanningModalComponent]
})
export class BarcodeScanningModule {}
