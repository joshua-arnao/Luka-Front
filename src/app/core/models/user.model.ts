export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  dni: string;
  email: string;
  phoneNumber: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  userId: string;
  firstName: string;
  email: string;
}

export interface UserResponse {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}
