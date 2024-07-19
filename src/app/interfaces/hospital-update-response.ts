import { IResponseBackDataHospital } from "./response-get-hospitals";

export interface IHospitalUpdateResponse {
  ok: boolean;
  msg: string;
  hospital: IResponseBackDataHospital
}

export interface IDataUpdateHospital {
  name: string;
  uid: string;
}