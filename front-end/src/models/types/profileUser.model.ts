export type options = 'basicInfo' | 'phone' | 'password' | 'address';

export type IUserInfo = {
    addresses: Array<IAddress>;
    email: string;
    isVerified: boolean;
    lastname: string;
    name: string;
    phone: string | null;
}

export interface IAddress {
    id: string;
    street: string;
    number: number;
    numDpto: number;
    postalCode: string;
    commune: {id: number, name: string};
}

export type regionCommune = {
    id: number;
    name: string
}