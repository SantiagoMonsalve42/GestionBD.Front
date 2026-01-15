import { CommonModule } from "@angular/common";
import { Component, OnInit, inject } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { CardModule } from "primeng/card";
import { ButtonModule } from "primeng/button";
import { ToastModule } from "primeng/toast";
import { TooltipModule } from "primeng/tooltip";
import { TagModule } from "primeng/tag";
import { MessageService } from "primeng/api";
import { ArtefactosService } from "../../services/artefactos.service";
import { EntregablesService } from "../../services/entregables.service";
import { Artefacto } from "../../types/artefacto.interface";
import { Entregable } from "../../types/entregable.interface";
import { AppBackDirective } from "../../../../shared/directives/back.directive";

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
    AppBackDirective
  ],
  providers: [MessageService],
  templateUrl: './artefactos.component.html',
  styleUrl: './artefactos.component.css'
})
export class ArtefactosComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private artefactosService = inject(ArtefactosService);
  private entregablesService = inject(EntregablesService);
  private messageService = inject(MessageService);

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
        // Sort by ordenEjecucion
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
    if (event.previousIndex !== event.currentIndex) {
      moveItemInArray(this.artefactos, event.previousIndex, event.currentIndex);
      
      // Update ordenEjecucion based on new positions
      this.artefactos.forEach((artefacto, index) => {
        artefacto.ordenEjecucion = index + 1;
      });

      this.messageService.add({
        severity: 'success',
        summary: 'Orden actualizado',
        detail: 'El orden de los artefactos ha sido modificado',
        life: 3000
      });
    }
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
}
