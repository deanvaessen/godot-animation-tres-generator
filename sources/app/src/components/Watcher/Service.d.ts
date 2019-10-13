type init = () => void

export interface IUpdateLog {
    [key :string] : number;
}

export interface IWatcherContainer {
    init : init;
}

export interface IWatcherService {
    init : init;
}