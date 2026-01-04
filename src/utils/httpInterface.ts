type LoginData = {
    email: string,
    password: string
};

type SignUpData = {
    name: string,
    email: string,
    password: string
};

interface JwtData {
    token: string,
    user: {
        id: number,
        name: string | undefined,
        email: string,
        verified: boolean
    }
};
export { LoginData, SignUpData, JwtData };