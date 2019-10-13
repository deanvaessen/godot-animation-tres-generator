import { IJob  } from "..";

export interface IProducerService {
    produce : ( path : string ) => void;
}