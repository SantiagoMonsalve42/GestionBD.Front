import { CommonModule } from "@angular/common";
import { Component, OnInit, inject } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { CardModule } from "primeng/card";
import { TableModule } from "primeng/table";
import { ButtonModule } from "primeng/button";
import { DialogModule } from "primeng/dialog";
import { InputTextModule } from "primeng/inputtext";
import { Select } from "primeng/select";
import { SpeedDial } from "primeng/speeddial";
import { ToastModule } from "primeng/toast";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { TooltipModule } from "primeng/tooltip";
import { MessageService, ConfirmationService, MenuItem } from "primeng/api";
import { EjecucionesService } from "../../services/ejecuciones.service";
import { InstanciasService } from "../../services/instancias.service";
import { Ejecucion } from '../../types/ejecucion.interface';
import { Instancia } from "../../types/instancia.interface";
import { Router } from "@angular/router";

@Component({
  selector: 'app-entregables',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    Select,
    SpeedDial,
    ToastModule,
    ConfirmDialogModule,
    TooltipModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './entregables.component.html',
  styleUrl: './entregables.component.css'
})
export class EntregablesComponent implements OnInit {
  private fb = inject(FormBuilder);
  private ejecucionesService = inject(EjecucionesService);
  private instanciasService = inject(InstanciasService);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);
  private router = inject(Router);
  ejecuciones: Ejecucion[] = [];
  instancias: Instancia[] = [];
  displayDialog = false;
  isEditMode = false;
  ejecucionForm!: FormGroup;
  selectedEjecucionId?: number;
  

  ngOnInit(): void {
    this.initForm();
    this.loadEjecuciones();
    this.loadInstancias();
  }

  initForm(): void {
    this.ejecucionForm = this.fb.group({
      idInstancia: [{ value: null, disabled: false }, [Validators.required]],
      nombreRequerimiento: [{ value: '', disabled: false }, [Validators.required, Validators.maxLength(150)]],
      descripcion: ['', [Validators.required, Validators.maxLength(150)]]
    });
  }

  loadEjecuciones(): void {
    this.ejecucionesService.getEjecuciones().subscribe({
      next: (data) => {
        this.ejecuciones = data;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar las ejecuciones'
        });
      }
    });
  }

  loadInstancias(): void {
    this.instanciasService.getInstancias().subscribe({
      next: (data) => {
        this.instancias = data;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar las instancias'
        });
      }
    });
  }

  openNew(): void {
    this.isEditMode = false;
    this.ejecucionForm.reset();
    this.ejecucionForm.get('idInstancia')?.enable();
    this.ejecucionForm.get('nombreRequerimiento')?.enable();
    this.displayDialog = true;
  }
  redirectArtefactos(ejecucion: Ejecucion): void{
    this.router.navigate(['/core/executions/'+ejecucion.idEjecucion+'/deliverables'])
  }
  editEjecucion(ejecucion: Ejecucion): void {
    this.isEditMode = true;
    this.selectedEjecucionId = ejecucion.idEjecucion;
    this.ejecucionForm.patchValue(ejecucion);
    this.ejecucionForm.get('nombreRequerimiento')?.disable();
    this.displayDialog = true;
  }

  deleteEjecucion(ejecucion: Ejecucion): void {
    this.confirmationService.confirm({
      message: `¿Está seguro de eliminar la ejecución "${ejecucion.nombreRequerimiento}"?`,
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.ejecucionesService.deleteEjecucion(ejecucion.idEjecucion!).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Ejecución eliminada correctamente'
            });
            this.loadEjecuciones();
          },
          error: () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error al eliminar la ejecución'
            });
          }
        });
      }
    });
  }

  saveEjecucion(): void {
    if (this.ejecucionForm.invalid) {
      this.ejecucionForm.markAllAsTouched();
      return;
    }

    // Obtener valores incluyendo los campos deshabilitados
    const ejecucionData: Ejecucion = {
      ...this.ejecucionForm.getRawValue()
    };

    if (this.isEditMode && this.selectedEjecucionId) {
      this.ejecucionesService.updateEjecucion(
            this.selectedEjecucionId, 
            {
                ...ejecucionData,
                idEjecucion:this.selectedEjecucionId
            }
        ).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Ejecución actualizada correctamente'
          });
          this.displayDialog = false;
          this.loadEjecuciones();
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al actualizar la ejecución'
          });
        }
      });
    } else {
      this.ejecucionesService.createEjecucion(ejecucionData).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Ejecución creada correctamente'
          });
          this.displayDialog = false;
          this.loadEjecuciones();
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al crear la ejecución'
          });
        }
      });
    }
  }

  hideDialog(): void {
    this.displayDialog = false;
    this.ejecucionForm.reset();
  }

  getInstanciaNombre(idInstancia: number): string {
    const instancia = this.instancias.find(i => i.idInstancia === idInstancia);
    return instancia ? `${instancia.instancia}:${instancia.puerto}` : '';
  }

  getSpeedDialItems(ejecucion: Ejecucion): MenuItem[] {
    return [
      {
        icon: 'pi pi-pencil',
        command: () => this.editEjecucion(ejecucion),
        tooltipOptions: {
          tooltipLabel: 'Editar',
          tooltipPosition: 'left' as const
        },
        styleClass: 'p-button-warning'
      },
      {
        icon: 'pi pi-trash',
        command: () => this.deleteEjecucion(ejecucion),
        tooltipOptions: {
          tooltipLabel: 'Eliminar',
          tooltipPosition: 'left' as const
        },
        styleClass: 'p-button-danger'
      },
      {
        icon: 'pi pi-eye',
        command: () => this.redirectArtefactos(ejecucion),
        tooltipOptions: {
          tooltipLabel: 'Ver Entregas',
          tooltipPosition: 'left' as const
        },
        styleClass: 'p-button-warning'
      },
    ];
  }
}