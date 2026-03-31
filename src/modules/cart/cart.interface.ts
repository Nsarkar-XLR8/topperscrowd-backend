import { Types } from 'mongoose';


export interface ICartItem {
    book: Types.ObjectId;
    quantity: number;
}

export interface ICart {
    user: Types.ObjectId;
    items: ICartItem[];
    totalPrice: number;
}