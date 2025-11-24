import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { UserService } from '../../../../core/services/user';
import { User } from '../../../../shared/models/user';

@Component({
    selector: 'app-user-list',
    standalone: true,
    imports: [
        CommonModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatButtonModule,
        MatIconModule,
        MatCardModule,
        MatChipsModule,
        MatProgressSpinnerModule,
        MatSnackBarModule,
        MatTooltipModule,
        RouterModule
    ],
    templateUrl: './user-list.html',
    styleUrl: './user-list.css'
})
export class UserList implements OnInit, AfterViewInit {
    displayedColumns: string[] = ['id', 'name', 'email', 'role', 'actions'];
    dataSource: MatTableDataSource<User>;
    loading = false;

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    constructor(
        private userService: UserService,
        private snackBar: MatSnackBar,
        private cd: ChangeDetectorRef
    ) {
        this.dataSource = new MatTableDataSource();
    }

    ngOnInit(): void {
        this.loadUsers();
    }

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    loadUsers() {
        setTimeout(() => {
            this.loading = true;
            this.cd.detectChanges();

            this.userService.getAll().subscribe({
                next: (response) => {
                    this.dataSource.data = response.users;
                    this.loading = false;
                    this.cd.detectChanges();
                },
                error: (error) => {
                    console.error('Error al cargar usuarios:', error);
                    this.snackBar.open('Error al cargar usuarios', 'Cerrar', { duration: 3000 });
                    this.loading = false;
                    this.cd.detectChanges();
                }
            });
        });
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    deleteUser(user: User) {
        if (confirm(`¿Estás seguro de que deseas eliminar al usuario ${user.name}?`)) {
            this.loading = true;
            this.cd.detectChanges();

            this.userService.delete(user.id).subscribe({
                next: () => {
                    this.snackBar.open('Usuario eliminado correctamente', 'Cerrar', { duration: 3000 });
                    this.loadUsers();
                },
                error: (error) => {
                    console.error('Error al eliminar usuario:', error);
                    this.snackBar.open('Error al eliminar usuario', 'Cerrar', { duration: 3000 });
                    this.loading = false;
                    this.cd.detectChanges();
                }
            });
        }
    }
}
