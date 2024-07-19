import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import {  TSuccessResponse, TUploadResponse } from '../interfaces/upload-response';

const base_url = environment.base_url;
type typeSchema = 'users' | 'doctors' | 'hospitals';

@Injectable({providedIn: 'root'})
export class UploadFileService {
    constructor() { }

    async updatePhoto(
        file: File,
        schema: typeSchema,
        id: string
    ): Promise<TUploadResponse> {
        try {
            const url = `${base_url}/upload/${schema}/${id}`;
            const formData = new FormData();
            formData.append('image', file);
    
            const resp = await fetch(url, {
                method: 'PUT',
                headers: {
                    'x-token': localStorage.getItem('token') || ''
                },
                body: formData
            });
    
            if (!resp.ok) {
                throw new Error('Failed to upload image');
            }
    
            const dataResponse: TSuccessResponse = await resp.json();
    
            if (dataResponse.ok && typeof dataResponse.msg === 'string' && typeof dataResponse.nameFile === 'string') {
                return {
                    ok: true,
                    msg: dataResponse.msg,
                    nameFile: dataResponse.nameFile
                };
            } else {
                throw new Error('Invalid response structure');
            }
    
        } catch (error: unknown) {
            console.error('Error updating photo:', error);
    
            let errorMessage = 'Unknown error occurred';
            if (error instanceof Error) {
                errorMessage = error.message;
            }
    
            return {
                ok: false,
                msg: errorMessage
            };
        }
        
    }

   
    
}