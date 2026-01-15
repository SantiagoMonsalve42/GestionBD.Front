import { CommonModule } from "@angular/common";
import { Component, OnInit, inject } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { CardModule } from "primeng/card";
import { TableModule } from "primeng/table";
import { ButtonModule } from "primeng/button";
import { DialogModule } from "primeng/dialog";
import { InputTextModule } from "primeng/inputtext";
import { ToastModule } from "primeng/toast";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { TooltipModule } from "primeng/tooltip";
import { FileUploadModule } from "primeng/fileupload";
import { MessageService, ConfirmationService } from "primeng/api";
import { EntregablesService } from "../../services/entregables.service";
import { EjecucionesService } from "../../services/ejecuciones.service";
import { Entregable } from '../../types/entregable.interface';
import { Ejecucion } from "../../types/ejecucion.interface";
import { AppBackDirective } from "../../../../shared/directives/back.directive";
import { EstadoEntregaEnum } from "../../../../shared/enum/estadoEntrega.enum";

@Component({
  selector: 'app-entregas',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    ToastModule,
    ConfirmDialogModule,
    TooltipModule,
    FileUploadModule,
    AppBackDirective
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './entregas.component.html',
  styleUrl: './entregas.component.css'
})
export class EntregasComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private entregablesService = inject(EntregablesService);
  private ejecucionesService = inject(EjecucionesService);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);
  private router = inject(Router);
  estadoCerradoEnum = EstadoEntregaEnum.Cerrado;
  entregables: Entregable[] = [];
  ejecucion?: Ejecucion;
  idEjecucion!: number;
  displayDialog = false;
  isEditMode = false;
  entregableForm!: FormGroup;
  selectedEntregableId?: number;
  selectedFile: File | null = null;
  isDragging = false;

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.idEjecucion = +params['id'];
      this.initForm();
      this.loadEjecucion();
      this.loadEntregables();
    });
  }

  initForm(): void {
    this.entregableForm = this.fb.group({
      descripcionEntregable: ['', [Validators.required, Validators.maxLength(150)]],
      file: [null, [Validators.required]]
    });
  }

  loadEjecucion(): void {
    this.ejecucionesService.getEjecucionById(this.idEjecucion).subscribe({
      next: (data) => {
        this.ejecucion = data;
      }
    });
  }

  loadEntregables(): void {
    this.entregablesService.getEntregables(this.idEjecucion).subscribe({
      next: (data) => {
        this.entregables = data;
      }
    });
  }

  openNew(): void {
    this.isEditMode = false;
    this.selectedFile = null;
    this.entregableForm.reset();
    this.entregableForm.get('file')?.setValidators([Validators.required]);
    this.entregableForm.get('file')?.updateValueAndValidity();
    this.displayDialog = true;
  }

  editEntregable(entregable: Entregable): void {
    this.isEditMode = true;
    this.selectedEntregableId = entregable.idEntregable;
    this.selectedFile = null;
    this.entregableForm.patchValue({
      descripcionEntregable: entregable.descripcionEntregable
    });
    // Remove file validation in edit mode
    this.entregableForm.get('file')?.clearValidators();
    this.entregableForm.get('file')?.updateValueAndValidity();
    this.displayDialog = true;
  }
  comeBack(): void{
    this.router.navigate(['/core/executions']);
  }
  deleteEntregable(entregable: Entregable): void {
    this.confirmationService.confirm({
      message: `¿Está seguro de eliminar el entregable?`,
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      accept: () => {
        if (entregable.idEntregable) {
          this.entregablesService.deleteEntregable(entregable.idEntregable).subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Éxito',
                detail: 'Entregable eliminado correctamente'
              });
              this.loadEntregables();
            }
          });
        }
      }
    });
  }

  saveEntregable(): void {
    if (this.entregableForm.invalid) {
      Object.keys(this.entregableForm.controls).forEach(key => {
        this.entregableForm.get(key)?.markAsTouched();
      });
      return;
    }

    const descripcion = this.entregableForm.value.descripcionEntregable;

    if (this.isEditMode && this.selectedEntregableId) {
      this.entregablesService.updateEntregable(this.selectedEntregableId, descripcion).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Entregable actualizado correctamente'
          });
          this.displayDialog = false;
          this.loadEntregables();
        }
      });
    } else {
      if (!this.selectedFile) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Debe seleccionar un archivo'
        });
        return;
      }

      this.entregablesService.createEntregable(this.idEjecucion, this.selectedFile, descripcion).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Entregable creado correctamente'
          });
          this.displayDialog = false;
          this.loadEntregables();
        }
      });
    }
  }

  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.validateAndSetFile(file);
    }
  }

  onFileDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;

    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      const file = event.dataTransfer.files[0];
      this.validateAndSetFile(file);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  validateAndSetFile(file: File): void {
    if (!file.name.toLowerCase().endsWith('.zip')) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Solo se permiten archivos .zip'
      });
      return;
    }

    this.selectedFile = file;
    this.entregableForm.patchValue({ file: file });
    this.entregableForm.get('file')?.markAsTouched();
  }

  removeFile(): void {
    this.selectedFile = null;
    this.entregableForm.patchValue({ file: null });
    this.entregableForm.get('file')?.markAsTouched();
  }

  hideDialog(): void {
    this.displayDialog = false;
    this.entregableForm.reset();
    this.selectedFile = null;
  }
  redirectToArtifacts(entregable:Entregable){
    this.router.navigate(["/core/deliverables/"+entregable.idEntregable+"/artifacts"]);
  }
}
