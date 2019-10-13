
import { DEPS } from "../dependencyTypes";
import { IConfig } from "../../config";
import { IJob, IAnimationSets } from "./index.d";


// Babel compatibility issue when running export { x } from "./y",
// solves error: "Cannot re-export a type when the '--isolatedModules' flag is provided."
export type IConfig = IConfig
export type IJob = IJob
export type IAnimationSets = IAnimationSets

export * from "./App";
export * from "./Parser";
export * from "./Generator";
export * from "./Producer";
export * from "./Watcher";
export * from "./Logger";
export { DEPS };