import { Actions, ErrorAction } from "./actions";

const makeActionCreator = (type: string, ...argNames: string[]) => (...args: []): Actions => {
    let action: {
        [key: string]: string,
    } = {type};

    argNames.forEach((arg: any, inx: number) => action[argNames[inx]] = args[inx])
    return action as unknown as Actions | ErrorAction;
};


export default makeActionCreator;
