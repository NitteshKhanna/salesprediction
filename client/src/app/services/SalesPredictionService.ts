import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SalesPredictionService {
  private apiUrl = 'http://localhost:5000'; // Update with the Flask server URL

  constructor(private http: HttpClient) {}

  predictSalesForecasting(data: FormData) {
    return this.http.post(this.apiUrl, data);
  }
}
