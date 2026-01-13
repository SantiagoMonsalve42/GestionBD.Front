import { CommonModule } from "@angular/common";
import { Component, OnInit, inject } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { CardModule } from "primeng/card";
import { TableModule } from "primeng/table";
import { ButtonModule } from "primeng/button";
import { DialogModule } from "primeng/dialog";
import { InputTextModule } from "primeng/inputtext";
import { InputNumberModule } from "primeng/inputnumber";
import { Select } from "primeng/select";
import { ToastModule } from "primeng/toast";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { TooltipModule } from "primeng/tooltip";
import { MessageService, ConfirmationService } from "primeng/api";
import { InstanciasService } from "../../services/instancias.service";
import { Instancia, Motor } from "../../types/instancia.interface";

@Component({
  selector: 'app-conexiones',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    InputNumberModule,
    Select,
    ToastModule,
    ConfirmDialogModule,
    TooltipModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './conexiones.component.html',
  styleUrl: './conexiones.component.css'
})
export class ConexionesComponent implements OnInit {
  private fb = inject(FormBuilder);
  private instanciasService = inject(InstanciasService);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);

  instancias: Instancia[] = [];
  motores: Motor[] = [];
  displayDialog = false;
  isEditMode = false;
  instanciaForm!: FormGroup;
  selectedInstanciaId?: number;

  ngOnInit(): void {
    this.initForm();
    this.loadInstancias();
    this.loadMotores();
  }

  initForm(): void {
    this.instanciaForm = this.fb.group({
      idMotor: [null, [Validators.required]],
      instancia: ['', [Validators.required, Validators.maxLength(150)]],
      puerto: [null, [Validators.required, Validators.min(1), Validators.max(65535)]],
      usuario: ['', [Validators.required, Validators.maxLength(150)]],
      password: ['', [Validators.required, Validators.maxLength(150)]],
      nombreBD: ['', [Validators.required, Validators.maxLength(150)]]
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

  loadMotores(): void {
    this.instanciasService.getMotores().subscribe({
      next: (data) => {
        this.motores = data;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar los motores'
        });
      }
    });
  }

  openNew(): void {
    this.isEditMode = false;
    this.instanciaForm.reset();
    this.displayDialog = true;
  }

  editInstancia(instancia: Instancia): void {
    console.log(instancia);
    this.isEditMode = true;
    this.selectedInstanciaId = instancia.idInstancia;
    this.instanciaForm.patchValue(instancia);
    this.displayDialog = true;
  }

  deleteInstancia(instancia: Instancia): void {
    this.confirmationService.confirm({
      message: `¿Está seguro de eliminar la instancia ${instancia.instancia}?`,
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.instanciasService.deleteInstancia(instancia.idInstancia!).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Instancia eliminada correctamente'
            });
            this.loadInstancias();
          },
          error: () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error al eliminar la instancia'
            });
          }
        });
      }
    });
  }

  saveInstancia(): void {
    if (this.instanciaForm.invalid) {
      this.instanciaForm.markAllAsTouched();
      return;
    }

    const instanciaData: Instancia = this.instanciaForm.value;

    if (this.isEditMode && this.selectedInstanciaId) {
      this.instanciasService.updateInstancia(this.selectedInstanciaId, 
        {
            ...instanciaData,
            idInstancia:this.selectedInstanciaId
        }
    ).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Instancia actualizada correctamente'
          });
          this.displayDialog = false;
          this.loadInstancias();
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al actualizar la instancia'
          });
        }
      });
    } else {
      this.instanciasService.createInstancia(instanciaData).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Instancia creada correctamente'
          });
          this.displayDialog = false;
          this.loadInstancias();
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al crear la instancia'
          });
        }
      });
    }
  }

  hideDialog(): void {
    this.displayDialog = false;
    this.instanciaForm.reset();
  }

  getMotorNombre(idMotor: number): string {
    const motor = this.motores.find(m => m.idMotor === idMotor);
    return motor ? `${motor.nombreMotor} ${motor.versionMotor}` : '';
  }
}