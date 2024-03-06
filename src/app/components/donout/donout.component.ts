import { Component, Input, OnChanges, OnInit, SimpleChanges, signal } from '@angular/core';
import { ChartData, ChartType } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';

@Component({
  selector: 'app-donout',
  standalone: true,
  imports: [NgChartsModule],
  templateUrl: './donout.component.html',
  styles: ``
})
export class DonoutComponent implements OnChanges {

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['labels']){
      this.doughnutChartData.update(value => ({
        ...value,
        labels: this.labels
      }));
    }

    if(changes['backgroundColors']){
      this.doughnutChartData.update(value => ({
        ...value,
        datasets:[
          {
            data: [...value.datasets[0].data],
            backgroundColor: changes['backgroundColors'].currentValue
          }
        ]
      }));
    }

    if(changes['dataGraphs']){
      this.doughnutChartData.update(value => ({
        ...value,
        datasets:[
          {
            
            data: changes['dataGraphs'].currentValue,
            backgroundColor: [...value.datasets[0].backgroundColor]
          }
        ]
      }));
    }
  }

@Input() title: string = 'Default';

@Input() labels: string[] = [
  'Label 1',
  'Label 2',
  'Label 3',
];

@Input() backgroundColors: string[] = [
  '#6857E6', '#009FEE', '#F02059'
];


@Input() dataGraphs: number[] = [10, 10, 10];

public doughnutChartData = signal({
  labels: this.labels,
  datasets: [
    { 
      data: this.dataGraphs,
      backgroundColor: this.backgroundColors
    },
  ]
});

public doughnutChartType: ChartType = 'doughnut';

}
