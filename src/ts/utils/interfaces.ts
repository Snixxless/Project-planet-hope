export interface ILandTransaction{
    amount  : number,
    cost    : number,
    error   : boolean
}

export interface IFoodTransaction{
    amount  : number,
    cost    : number,
    error   : boolean
}

export interface IResource{
    amount  : number,
    maximum : number,
}

export interface IInfoBarObj{
    credits ?: number,
    food    ?: IResource,
    land    ?: IResource,
    citizen ?: IResource,
    year    ?: number    
}