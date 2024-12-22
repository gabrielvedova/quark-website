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

export class FileKeyAlreadyInUseError extends Error {
  constructor() {
    super("File key already in use");
    this.name = "FileKeyAlreadyInUseError";
  }
}

export class FileUploadError extends Error {
  constructor(message?: string) {
    super(message || "Error uploading file");
    this.name = "UploadError";
  }
}

export class FileNotFoundError extends Error {
  constructor(message?: string) {
    super(message || "File not found");
    this.name = "FileNotFoundError";
  }
}

export class FileMovingError extends Error {
  constructor() {
    super("Error moving file");
    this.name = "FileMoveError";
  }
}

export class FileDeletionError extends Error {
  constructor(message?: string) {
    super(message || "Error deleting file");
    this.name = "FileDeleteError";
  }
}

export class PostImageListingError extends Error {
  constructor() {
    super("Error listing post images");
    this.name = "PostImageListingError";
  }
}
