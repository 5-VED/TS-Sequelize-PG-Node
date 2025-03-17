import { IContact } from '@models/Contact';
import { ICompany } from '@models/Facility/Company';
import { IFacility } from '@models/Facility/Facility';
import { IRegion } from '@models/Facility/Region';
import { IAclRole } from '@models/User/AclRole';
import { IRole } from '@models/User/Role';
import { Types } from 'mongoose';
import { IUser } from './IUser';

export interface ITokenUser extends IUser {
    username: string;
    token?: string;
    firstname: string;
    lastname: string;
    userId: string;
    email: string;
    role: IRole;
    Company: ICompany;
    Region: IRegion;
    canLogin: boolean;
    isBlocked: boolean;
    loginAttempts: number;
    parentId: IContact;
    staffId: number;
    blockedTime: Date;
    createdfrom: string;
    createdBy: string;
    lastModified: Date;
    changetable: Array<string>;
    Kioskpin: string;
    Rooms: Array<string>;
    Educators: Array<string>;
    HideFinance: boolean;
    ACLRole: IAclRole;
    auth0MFA: boolean;
    facility: IFacility;
    Facility: Types.ObjectId; // legacy
    impersonateID: string | null;
    loggedInAsSystemAdmin: boolean;
}
