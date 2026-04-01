import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {FooterComponent} from "./components/shell/footer/footer.component";
import {HeaderComponent} from "./components/shell/header/header.component";
import {ThemeService} from "./services/theme.service";
import appConfig from '../../assets/app-config.json';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FooterComponent, HeaderComponent],
  providers: [],
  template: `
    <div [class.dark]="themeService.isDark()">
      <div class="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
        <app-header [appName]="title" [logo]="logo" [repository]="repository"></app-header>
        <main class="pt-12"> 
          <router-outlet></router-outlet>
        </main>
        <app-footer [authors]="authors"></app-footer>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class AppComponent {
  title = appConfig.appName;
  logo = appConfig.appLogo;
  repository = appConfig.repository;
  authors = appConfig.authors;
  themeService = inject(ThemeService);
}