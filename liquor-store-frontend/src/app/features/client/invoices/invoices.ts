import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
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
    MatCardModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './invoices.html',
  styleUrl: './invoices.css'
})
export class Invoices implements OnInit, AfterViewInit {
  displayedColumns = ['invoice_number', 'order_id', 'issued_at', 'total', 'actions'];
  dataSource = new MatTableDataSource<Invoice>();
  loading = false; // ✅ FIX: Inicializar en false para evitar NG0100

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private invoiceService: InvoiceService,
    private snackBar: MatSnackBar,
    private pdfService: PdfService,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadInvoices();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadInvoices(): void {
    // Usamos setTimeout para mover la actualización a la siguiente macrotarea
    setTimeout(() => {
      this.loading = true;
      this.cd.detectChanges();

      this.invoiceService.getMyInvoices().subscribe({
        next: (response) => {
          this.dataSource.data = response.invoices;
          this.loading = false;
          this.cd.detectChanges();
        },
        error: (error) => {
          console.error('Error loading invoices', error);
          this.snackBar.open('Error al cargar las facturas', 'Cerrar', { duration: 3000 });
          this.loading = false;
          this.cd.detectChanges();
        }
      });
    });
  }

  viewInvoice(invoice: Invoice): void {
    this.snackBar.open(`Factura ${invoice.invoice_number} - Total: $${invoice.total}`, 'Cerrar', { duration: 4000 });
  }

  downloadInvoice(invoice: Invoice): void {
    this.loading = true;
    this.cd.detectChanges(); // Forzar actualización para mostrar spinner

    this.invoiceService.getById(invoice.id).subscribe({
      next: (response) => {
        try {
          this.pdfService.generateInvoicePDF(response.invoice);
          this.snackBar.open('Factura descargada correctamente', 'Cerrar', { duration: 3000 });
        } catch (error) {
          console.error('Error al generar PDF:', error);
          this.snackBar.open('Error al generar el PDF', 'Cerrar', { duration: 3000 });
        }
        this.loading = false;
        this.cd.detectChanges();
      },
      error: (error) => {
        console.error('Error al obtener detalles de la factura:', error);
        this.snackBar.open('Error al descargar la factura', 'Cerrar', { duration: 3000 });
        this.loading = false;
        this.cd.detectChanges();
      }
    });
  }
}
