import { Component, OnInit, Input, ComponentFactoryResolver, ViewContainerRef, ViewChild } from '@angular/core';
import { TemplateModalService } from 'src/app/_services/Uteis/TemplateModal/templateModal.service';

@Component({
  selector: 'app-template-modal',
  templateUrl: './templateModal.component.html',
  styleUrls: ['./templateModal.component.css']
})

export class TemplateModalComponent implements OnInit {

  @Input() inputs: any;
  @Input() component: any;
  @Input() templateModalService = new TemplateModalService();
  @Input() width: number;
  @Input() titulo = '';

  @ViewChild('container', { read: ViewContainerRef }) container: ViewContainerRef;

  templateEnabled = false;
  constructor(private componentFactoryResolver: ComponentFactoryResolver) { }

  ngOnInit() {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.component);
    this.container.clear();
    const componentRef: any  = this.container.createComponent(componentFactory);
    componentRef.instance = Object.assign(componentRef.instance, this.inputs);
    componentRef.changeDetectorRef.detectChanges();
  }

  abrirTemplate(template: any) {
    if (this.templateEnabled === false) {
      this.templateEnabled = true;
      template.show();
    }
  }

  fecharTemplate(template: any) {
    template.hide();
    this.templateEnabled = false;
    this.templateModalService.setTemplateModalStatus(false);
  }

}
