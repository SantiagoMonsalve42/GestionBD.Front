import { CommonModule } from "@angular/common";
import { Component, OnInit, inject } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { CardModule } from "primeng/card";
import { ButtonModule } from "primeng/button";
import { ToastModule } from "primeng/toast";
import { TooltipModule } from "primeng/tooltip";
import { TagModule } from "primeng/tag";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { MessageService, ConfirmationService } from "primeng/api";
import { ArtefactosService } from "../../services/artefactos.service";
import { EntregablesService } from "../../services/entregables.service";
import { Artefacto, ArtefactoOrder } from '../../types/artefacto.interface';
import { Entregable } from "../../types/entregable.interface";
import { AppBackDirective } from "../../../../shared/directives/back.directive";
import { EstadoEntregaEnum } from '../../../../shared/enum/estadoEntrega.enum';
import { ProcesoService } from '../../services/proceso.service';

@Component({
  selector: 'app-artefactos',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    ToastModule,
    TooltipModule,
    TagModule,
    DragDropModule,
    AppBackDirective,
    ConfirmDialogModule,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './artefactos.component.html',
  styleUrl: './artefactos.component.css'
})
export class ArtefactosComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private artefactosService = inject(ArtefactosService);
  private entregablesService = inject(EntregablesService);
  private messageService = inject(MessageService);
  private procesoService = inject(ProcesoService);
  private confirmationService = inject(ConfirmationService);
  preparacionDisabled:boolean=false;
  predespliegueDisabled:boolean=false;
  despliegueDisabled:boolean=false;
  revisionDisabled:boolean=false;

  artefactos: Artefacto[] = [];
  entregable?: Entregable;
  idEntregable!: number;
  isDragging = false;

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.idEntregable = +params['id'];
      this.loadEntregable();
      this.loadArtefactos();
    });
  }

  loadEntregable(): void {
    this.entregablesService.getEntregableById(this.idEntregable).subscribe({
      next: (data) => {
        this.entregable = data;
        this.validateEntregaStatus();
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar el entregable'
        });
      }
    });
  }

  loadArtefactos(): void {
    this.artefactosService.getArtefactosByEntregable(this.idEntregable).subscribe({
      next: (data) => {
        this.artefactos = data.sort((a, b) => a.ordenEjecucion - b.ordenEjecucion);
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar los artefactos'
        });
      }
    });
  }

  drop(event: CdkDragDrop<Artefacto[]>): void {
    if(this.entregable?.estadoEntregaId == EstadoEntregaEnum.Creado){
        if (event.previousIndex !== event.currentIndex) {
            moveItemInArray(this.artefactos, event.previousIndex, event.currentIndex);
            this.artefactos.forEach((artefacto, index) => {
                artefacto.ordenEjecucion = index + 1;
            });
            this.changeOrder();
        }    
    }else{
        this.messageService.add({
                    severity: 'warn',
                    summary: 'Orden no actualizado',
                    detail: 'El orden de los artefactos solo puede ser modificado cuando esta la entrega esta en estado "Creado"',
                    life: 3000
                });
    }
  }
  getArtefactoOrder(): ArtefactoOrder[]{
    var artefactosOrder : ArtefactoOrder[]=[];
    this.artefactos.forEach(art=>{
        artefactosOrder.push(
                {
                    idArtefacto:art.idArtefacto,
                    ordenEjecucion:art.ordenEjecucion
                });
    });
    return artefactosOrder;
  }
  changeOrder(): void{
    this.artefactosService
        .changeOrder(this.getArtefactoOrder())
        .subscribe({
            next: (_)=>{
                this.loadArtefactos();
                this.messageService.add({
                    severity: 'success',
                    summary: 'Orden actualizado',
                    detail: 'El orden de los artefactos ha sido modificado',
                    life: 3000
                });
            }
        });
  }

  getArtefactoIcon(codificacion: string): string {
    const ext = codificacion.toLowerCase();
    if (ext.includes('sql')) return 'pi-database';
    if (ext.includes('xml')) return 'pi-file';
    if (ext.includes('json')) return 'pi-file-edit';
    return 'pi-file';
  }

  getArtefactoColor(codificacion: string): string {
    const ext = codificacion.toLowerCase();
    if (ext.includes('sql')) return '#2196F3';
    if (ext.includes('xml')) return '#FF9800';
    if (ext.includes('json')) return '#4CAF50';
    return '#607D8B';
  }
  validateEntregaStatus(): void{
    switch(this.entregable?.estadoEntregaId){
        case EstadoEntregaEnum.Cerrado:
        case EstadoEntregaEnum.Revision:
            this.preparacionDisabled=true;
            this.predespliegueDisabled=true;
            this.despliegueDisabled=true;
            this.revisionDisabled=true;
            break;
        case EstadoEntregaEnum.Despliegue:
            this.preparacionDisabled=true;
            this.predespliegueDisabled=true;
            this.despliegueDisabled=true;
            this.revisionDisabled=false;
            break;
        case EstadoEntregaEnum.PreDespliegue:
            this.preparacionDisabled=true;
            this.predespliegueDisabled=true;
            this.despliegueDisabled=false;
            this.revisionDisabled=true;
            break;
        case EstadoEntregaEnum.Creado:
            this.preparacionDisabled=false;
            this.predespliegueDisabled=true;
            this.despliegueDisabled=true;
            this.revisionDisabled=true;
            break;
        case EstadoEntregaEnum.Preparacion:
            this.preparacionDisabled=true;
            this.predespliegueDisabled=false;
            this.despliegueDisabled=true;
            this.revisionDisabled=true;
            break;
    }
  }
  prepararAmbiente():void{
    this.confirmationService.confirm({
      message: '¿Está seguro de que desea ejecutar esta acción?',
      header: 'Confirmar Preparación de Ambiente',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      accept: () => {
        this.procesoService
          .prepararAmbiente(this.idEntregable)
          .subscribe({
            next: ()=>{
              this.loadEntregable();
              this.messageService.add({
                severity: 'success',
                summary: 'Éxito',
                detail: 'Preparación de ambiente ejecutada correctamente'
              });
            },
            error: () => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Error al preparar el ambiente'
              });
            }
          });
      }
    });
  }
  preDeploy():void{
    this.confirmationService.confirm({
      message: '¿Está seguro de que desea ejecutar esta acción?',
      header: 'Confirmar Pre-Despliegue',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      accept: () => {
        this.procesoService
          .preDeploy(this.idEntregable)
          .subscribe({
            next: ()=>{
              this.loadEntregable();
              this.messageService.add({
                severity: 'success',
                summary: 'Éxito',
                detail: 'Pre-despliegue ejecutado correctamente'
              });
            },
            error: () => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Error al ejecutar el pre-despliegue'
              });
            }
          });
      }
    });
  }
  deploy():void{
    this.confirmationService.confirm({
      message: '¿Está seguro de que desea ejecutar esta acción?',
      header: 'Confirmar Despliegue',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      accept: () => {
        this.procesoService
          .deploy(this.idEntregable)
          .subscribe({
            next: ()=>{
              this.loadEntregable();
              this.messageService.add({
                severity: 'success',
                summary: 'Éxito',
                detail: 'Despliegue ejecutado correctamente'
              });
            },
            error: () => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Error al ejecutar el despliegue'
              });
            }
          });
      }
    });
  }
  revision():void{
    this.confirmationService.confirm({
      message: '¿Está seguro de que desea ejecutar esta acción?',
      header: 'Confirmar Envío a Revisión',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      accept: () => {
        this.procesoService
          .enviarRevision(this.idEntregable)
          .subscribe({
            next: ()=>{
              this.loadEntregable();
              this.messageService.add({
                severity: 'success',
                summary: 'Éxito',
                detail: 'Enviado a revisión correctamente'
              });
            },
            error: () => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Error al enviar a revisión'
              });
            }
          });
      }
    });
  }
}
