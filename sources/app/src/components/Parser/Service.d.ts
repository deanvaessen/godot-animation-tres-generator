export interface IIndex {
    summary : IAnimation[];
    files : IFileSummary[];
    orientations : string[];
    animations : string[];
}

export interface IFileSummary {
    i : number;
    path : string;
    name : string;
    fileName : string;
    animation : string;
    orientation : string;
}

export interface IAnimationsPerOrientation {
    animation : string;
    animations : IFileSummary[];
    orientation : string;
}

export interface IAnimation {
    name : string;
    path : string;
    animations : IAnimationsPerOrientation[];
}

export interface IParserService {
    buildIndex : ( path : string ) => Promise<IIndex>;
}