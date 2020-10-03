export interface Actions {
    type: string,
    payload?: any,
}

export interface ErrorAction extends Actions {
    type: string,
    error: Error,
}
