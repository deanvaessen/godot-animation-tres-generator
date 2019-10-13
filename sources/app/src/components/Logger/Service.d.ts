type log = ( level : string, message : string, attachment ?: object ) => void;
type persist = ( level : string, message : string ) => void;

export interface ILoggerService {
    log : log;
    persist : persist;
}