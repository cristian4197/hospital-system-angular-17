import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { UserService } from './user.service';
import { User } from '../models/user.model';

const base_url = environment.base_url;
type typeSchema = 'users' | 'doctors' | 'hospitals';

@Injectable({providedIn: 'root'})
export class UploadFileService {
    private userService!: UserService;
    constructor() { }

    async updatePhoto(
        file: File,
        schema: typeSchema,
        id: string
    ) {
        try {
            const url = `${base_url}/upload/${schema}/${id}`;
            const formData = new FormData();
            formData.append('image', file);

            const resp = await fetch(url, {
                method: 'PUT',
                headers: {
                    'x-token':  localStorage.getItem('token') || ''
                },
                body: formData
            });
            
            
            const dataResponse = await resp.json();
            return dataResponse;
            
            
        } catch (error) {
            return false;
        }
        
    }

   
    
}