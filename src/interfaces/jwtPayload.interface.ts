export interface JwtPayload {
    id: number,
    email: string,
    sessionId: string,
    iat: number,
    exp: number
}