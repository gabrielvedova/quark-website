export class EmailInUseError extends Error {
  constructor() {
    super("Email already in use");
    this.name = "EmailInUseError";
  }
}

export class EmailMismatchError extends Error {
  constructor() {
    super("Emails do not match");
    this.name = "EmailMismatchError";
  }
}

export class IncorrectEmailError extends Error {
  constructor() {
    super("Current email is incorrect");
    this.name = "IncorrectEmailError";
  }
}

export class IncorrectEmailOrPasswordError extends Error {
  constructor() {
    super("Email or password incorrect");
    this.name = "IncorrectEmailOrPasswordError";
  }
}

export class IncorrectPasswordError extends Error {
  constructor() {
    super("Current password is incorrect");
    this.name = "IncorrectPasswordError";
  }
}

export class NotFoundError extends Error {
  constructor() {
    super("Not found");
    this.name = "NotFoundError";
  }
}

export class PasswordMismatchError extends Error {
  constructor() {
    super("Passwords do not match");
    this.name = "PasswordMismatchError";
  }
}

export class UnauthorizedError extends Error {
  constructor() {
    super("Unauthorized");
    this.name = "UnauthorizedError";
  }
}
