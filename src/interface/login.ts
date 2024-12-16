export interface User {
    uid: string;
    username: string;
    photo: string | null;  // Assuming photo can be null
    about: string | null;  // Assuming about can be null
    verified: boolean;
    visibility: boolean;   // Modify visibility type as per your actual implementation (e.g., 'public', 'private')
}

// Interface for the response data
interface LoginResponseData {
    token: string;
    user: User;
}

// Interface for the response structure
export interface ApiResponse {
    code: number;
    data: string | LoginResponseData;
}

// Interface for the input parameters
interface LoginControllerParams {
    username: string;
    password: string;
    ip: string;
}
