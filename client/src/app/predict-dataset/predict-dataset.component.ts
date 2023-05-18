import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { SalesPredictionService } from '../services/SalesPredictionService';
import { Route, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import axios from 'axios';
import { Chart } from 'angular-highcharts';

@Component({
  selector: 'app-predict-dataset',
  templateUrl: './predict-dataset.component.html',
  styleUrls: ['./predict-dataset.component.css']
})
export class PredictDatasetComponent implements OnInit{
submitData() {
  let dict={}
  console.log(this.dic)
  dict["title"]=this.dic['title']
  dict["data"]=this.dic['data']

  if(this.dic['periodicity']=='Yearly')
  dict["days"]=365*+this.dic['numericalValue']
  if(this.dic['periodicity']=='Monthly')
  dict["days"]=30*+this.dic['numericalValue']
  if(this.dic['periodicity']=='Weekly')
  dict["days"]=7*+this.dic['numericalValue']
  if(this.dic['periodicity']=='Day-wise')
  dict["days"]=+this.dic['numericalValue']

  console.log(dict)
  axios.post("http://localhost:5000/predict",dict).then((res) =>{
    console.log(res.data)
    this.actual=res.data["actual"]
    this.predicted=res.data["predicted"]
    this.actualChart = new Chart({
      chart: {
        type: 'line'
      },
      title: {
        text: 'Actual'
      },
      credits: {
        enabled: false
      },
      series: [
        {
          name: 'Line 1',
          data: this.actual
        } as any
      ]
    });
  
  
    this.predictedChart = new Chart({
      chart: {
        type: 'line'
      },
      title: {
        text: 'Predicted'
      },
      credits: {
        enabled: false
      },
      series: [
        {
          name: 'Line 1',
          data: this.predicted
        } as any
      ]
    });
  
    this.completed=true
  })
}
  file: File | any;
  periodicity: string="";
  numericValue: string ="";
  actual=[]
  predicted=[]
  predictForm : any;
  submitted : any;
  form: any;
  dic={}
  completed=false
  actualChart
  predictedChart
  
  constructor(private readonly http: HttpClient, private router : Router) {}
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  onFileChange(event: any) {
    const file: File = event.target.files[0];
    
    const fileReader: FileReader = new FileReader();
    fileReader.onload = (e: any) => {
      const csv: any = e.target.result;
      this.dic["data"]=csv
    };
    fileReader.readAsText(file);
  
  }

   data(id)
   {
    let data;
    if(id=='periodicity'||id=='predictColumn')
    {
     data=(<HTMLSelectElement>document.getElementById(id)).value
    }
    else
    data =(<HTMLInputElement>document.getElementById(id)).value;

    this.dic[id]=data
    console.log(data)
   }
}
