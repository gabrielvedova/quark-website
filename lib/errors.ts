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

export class IncorrectUsernameOrPasswordError extends Error {
  constructor() {
    super("Incorrect username or password");
    this.name = "IncorrectUsernameOrPasswordError";
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

export class EmailSendingError extends Error {
  constructor() {
    super("Error sending email");
    this.name = "EmailSendingError";
  }
}

export class ImageAccessError extends Error {
  constructor() {
    super("Error accessing image");
    this.name = "ImageAccessError";
  }
}

export class UploadNotAcceptedError extends Error {
  constructor() {
    super("Upload not accepted");
    this.name = "UploadNotAcceptedError";
  }
}
