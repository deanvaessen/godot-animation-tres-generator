export interface IAnimationSets {
    [key : string] : number[];
}

export interface IJob {
    output_frames : string;
    output_tres : string;
    godot_res_path : string;
    input_folder : string;
    animations : IAnimationSets;
}