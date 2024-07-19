import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { IResponseBackDataHospital, IResponseDataHospital, IResponseDataHospitalById } from '../interfaces/response-get-hospitals';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { Hospital } from '../models/hospital.model';
import { IHospitalResponse } from '../interfaces/hospital-register-form';
import { adapterBackResponseHospital } from '../utils/utils';
import { IDataUpdateHospital, IHospitalUpdateResponse } from '../interfaces/hospital-update-response';
import { IHospitalDeleteResponse } from '../interfaces/hospital-user-delete-response';

const base_url = environment.base_url;

@Injectable({ providedIn: 'root' })
export class HospitalService {
  constructor(private http: HttpClient) { }


  get token(): string {
    return localStorage.getItem('token') || '';
  }

  getHospitals(from: number): Observable<IResponseDataHospital> {
    const url = `${base_url}/hospitals?from=${from}`;
    const headers = new HttpHeaders({ 'x-token': this.token });
    return this.http.get<IResponseDataHospital>(url, { headers }).pipe(
      map((resp: IResponseDataHospital) => {
        return this.getHospitalsDataResponse(resp);
      }),
      catchError((error: HttpErrorResponse) => {
        return throwError(() => new Error('Error al Registrar', { cause: error.error.msg }));
      })
    );
  }

  getHospitalById(id: string): Observable<Hospital> {
    const url = `${base_url}/hospitals/detail?id=${id}`;
    const headers = new HttpHeaders({ 'x-token': this.token });

    return this.http.get<IResponseDataHospitalById>(url, { headers }).pipe(
      map((resp: IResponseDataHospitalById) => {
        return this.returnInstaceOfHospital(resp.hospital)
      }),
      catchError((error: HttpErrorResponse) => {
        return throwError(() => new Error('Error al Registrar', { cause: error.error.msg }));
      })
    );
  }

  private returnInstaceOfHospital(hospital: Hospital): Hospital {
    const { name, user, img, uid } = hospital;
    const intanceHospital = new Hospital(name,user, img, uid );
    return intanceHospital;
  }


  private getHospitalsDataResponse(resp: IResponseDataHospital): IResponseDataHospital {    
    const dataResponse: IResponseDataHospital = {
      total: resp.total,
      hospitals: this.returnArrayOfHospital(resp.hospitals)
    };
    
    return dataResponse;
  }

  private returnArrayOfHospital(hospitals: Hospital[]): Hospital[] {
    const responseBackHospital = adapterBackResponseHospital(hospitals);
    // Hacemos esto para obtener la url de la imagen correctamente
    // debido a que al instanciar new User se arma correctamente la url
    return responseBackHospital.map((hospitalData: IResponseBackDataHospital) => new Hospital(
      hospitalData.name,
      hospitalData.user,
      hospitalData.img,
      hospitalData.uid
    ));
  }


  searchHospitalByName(name: string): Observable<Hospital[]> {
    const url = `${base_url}/searches/schema/hospitals/${name}`;
    const headers = new HttpHeaders({ 'x-token': this.token });

    return this.http.get<Hospital[]>(url, { headers }).pipe(
      map((resp: any) => {
        return this.returnArrayOfHospital(resp.results)
      }),
      catchError((error: HttpErrorResponse) => {
        return throwError(() => new Error('Error en busqueda', { cause: error.error.msg }))
      })
    )
  }

  createHospital(formData: IHospitalResponse): Observable<IHospitalResponse> {
    const url = `${base_url}/hospitals`;
    const headers = new HttpHeaders({ 'x-token': this.token });
    return this.http.post<IHospitalResponse>(url, formData, {headers}).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => new Error('Error al Registrar', { cause: error.error.msg }))
      })
    )
  }

  updateHospital(data: IDataUpdateHospital): Observable<IHospitalUpdateResponse> {
    const url = `${base_url}/hospitals/${data.uid}`;
    const headers = new HttpHeaders({ 'x-token': this.token });
    return this.http.put<IHospitalUpdateResponse>(url, data, {
      headers
    }).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => new Error('Error al actualizar', { cause: error.error.msg }))
      })
    )
  }

  deleteUser(uid: string): Observable<IHospitalDeleteResponse> {
    const url = `${base_url}/hospitals/${uid}`;
    const headers = new HttpHeaders({ 'x-token': this.token });

    return this.http.delete<IHospitalDeleteResponse>(url, { headers })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => new Error('Error al borrar hospital', { cause: error.error.msg }))
        })
      );
  }
}