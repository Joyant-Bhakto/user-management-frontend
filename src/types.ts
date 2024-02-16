export type User = {
    id: number;
    email: string;
    username: string;
}

export type LoginResponse = {
    message: string;
    user: User;
}

export type RegisterResponse = {
    message: string;

}

export type RegisterRequest = {

    email: string;
    username: string;
    password: string;
}

export type LoginRequest = {
    email: string;
    password: string;
}


export type UpdateProfileRequest = {
    email?: string | null;
    username?: string | null;
    password?: string | null;
}

export type UpdateProfileResponse = {
    message: string;
    user: User;
}

export type GetUserResponse = {
    data: User[];
    total: number;
    last_page: number;
    current_page: number;
}