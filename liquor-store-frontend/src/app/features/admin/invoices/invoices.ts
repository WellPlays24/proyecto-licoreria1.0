
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { InvoiceService } from '../../../core/services/invoice';
import { Invoice } from '../../../shared/models/invoice';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { PdfService } from '../../../core/services/pdf';

@Component({
  selector: 'app-invoices',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    MatTooltipModule,
    MatSnackBarModule,
    RouterModule
  ],
  templateUrl: './invoices.html',
  styleUrl: './invoices.css'
})
export class Invoices implements OnInit, AfterViewInit {
  displayedColumns = ['invoice_number', 'customer', 'order_id', 'total', 'issued_at', 'actions'];
  dataSource = new MatTableDataSource<Invoice>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private invoiceService: InvoiceService,
    private snackBar: MatSnackBar,
    private pdfService: PdfService
  ) { }

  ngOnInit(): void {
    this.loadInvoices();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadInvoices(): void {
    this.invoiceService.getAll().subscribe({
      next: (response) => {
        this.dataSource.data = response.invoices;
      },
      error: (error) => {
        console.error('Error loading invoices', error);
        this.snackBar.open('Error al cargar las facturas', 'Cerrar', { duration: 3000 });
      }
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  viewInvoice(invoice: Invoice): void {
    console.log('Ver factura', invoice.id);
    // Aquí podrías implementar un modal o navegación a detalle
  }

  downloadInvoice(invoice: Invoice): void {
    this.invoiceService.getById(invoice.id).subscribe({
      next: (response) => {
        try {
          this.pdfService.generateInvoicePDF(response.invoice);
          this.snackBar.open('Factura descargada correctamente', 'Cerrar', { duration: 3000 });
        } catch (error) {
          console.error('Error al generar PDF:', error);
          this.snackBar.open('Error al generar el PDF', 'Cerrar', { duration: 3000 });
        }
      },
      error: (error) => {
        console.error('Error al obtener detalles de la factura:', error);
        this.snackBar.open('Error al descargar la factura', 'Cerrar', { duration: 3000 });
      }
    });
  }
}

