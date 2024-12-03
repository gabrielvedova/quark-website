export class UsernameInUseError extends Error {
  constructor() {
    super("Username already in use");
    this.name = "UsernameInUseError";
  }
}

export class UsernameMismatchError extends Error {
  constructor() {
    super("Usernames do not match");
    this.name = "UsernameMismatchError";
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
