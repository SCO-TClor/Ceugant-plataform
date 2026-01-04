type userStatus = 'active' | 'inactive' | 'suspended' | 'banned';

export interface usersDatabase {
    id: number,
    name: string | undefined,
    email: string,
    password_hash: string,
    status: userStatus,
    email_verified: boolean,
    failed_attempts: number,
    locked_until: Date,
    updated_at: Date,
    verification_token: string,
    verification_expires: Date
};