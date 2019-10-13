import { IIndex } from "..";

export interface IGeneratorService {
    generateTres : ( index : IIndex, godotResPath : string, outputTresPath : string ) => void;
}