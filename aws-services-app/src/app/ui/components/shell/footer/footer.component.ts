import {Component, Input} from '@angular/core';
import {DatePipe} from "@angular/common";

interface Author {
  name: string;
  url: string;
}

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [
    DatePipe
  ],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {

  @Input() authors: Author[] = [];

  current_date = new Date();

}
