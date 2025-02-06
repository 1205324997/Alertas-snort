import { Component, OnInit } from '@angular/core';
import { SnortAlertsService } from './snort-alerts.service';

@Component({
  selector: 'app-alerts',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.css']
})
export class AlertsComponent implements OnInit {
  alerts: string[] = [];

  constructor(private alertsService: SnortAlertsService) {}

  ngOnInit(): void {
    this.alertsService.getAlerts().subscribe((data) => {
      this.alerts = data;
    });
  }
}
