import { Component, inject } from '@angular/core';
import type { Employee } from './employee-list/employee.model';
import { Header } from './header/header';
import { MatSidenavModule } from '@angular/material/sidenav';
import { Sidebar } from './sidebar/sidebar';
import { Footer } from './footer/footer';
import { EmployeeService } from './services/employee';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [Header,MatSidenavModule,Sidebar,Footer,RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {


}