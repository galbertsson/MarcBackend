import IUser from 'IUser';

export const isAllowedAccess = (user: IUser, resourceOwner: string) => {
    return user._id === resourceOwner;
};