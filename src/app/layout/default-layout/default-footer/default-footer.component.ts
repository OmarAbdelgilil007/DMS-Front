import { Component } from '@angular/core';
import { FooterComponent } from '@coreui/angular';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-default-footer',
    templateUrl: './default-footer.component.html',
    styleUrls: ['./default-footer.component.scss'],
    standalone: true,
    imports:[TranslateModule]
})
export class DefaultFooterComponent extends FooterComponent {
  constructor() {
    super();
  }
}
