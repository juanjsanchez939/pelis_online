export class UnauthorizedException extends Error {
  constructor(msg) {
    super(msg || 'No autorizado.');
    this.statusCode = 401;
  }
}