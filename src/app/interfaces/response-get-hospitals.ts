import { Hospital } from "../models/hospital.model";
import { User } from "../models/user.model";

export interface IResponseDataHospital {
    ok?: boolean;
    total: number;
    hospitals: Hospital[];
}

export interface IResponseDataHospitalById {
    ok?: boolean;
    hospital: Hospital;
}


export interface IResponseBackDataHospital {
    uid: string;
    name: string;
    user: User;
    img: string;
}
