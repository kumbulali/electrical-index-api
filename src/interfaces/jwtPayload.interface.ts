export default interface JwtPayload {
    id: number,
    email: string,
    sessionId: string,
    iat: number,
    exp: number
}