import { IResponseBackDataUser } from "../interfaces/reponse-get-user";
import { IResponseBackDataHospital } from "../interfaces/response-get-hospitals";
import { Hospital } from "../models/hospital.model";
import { User } from "../models/user.model";

export const adapterBackResponseHospital = (hospitals: Hospital[]) => {
  

  return hospitals.map((hospital: Hospital) => {
    const { uid, name, user, img  } = hospital;
    const response: IResponseBackDataHospital = {
      uid: uid as string,
      name,
      user,
      img: img as string
    };
  
    return response;
  })
  
};

export const adapterBackResponseUser = (users: User[]) => {
  return users.map((user: User) => {
    const { name, email, img, google, role, uid  } = user;
    const response: IResponseBackDataUser = {
      name,
      email,
      role: role as string,
      google: google as boolean,
      img: img as string,
      uid: uid as string
    };
  
    return response;
  })
  
};