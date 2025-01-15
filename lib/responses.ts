type ConventionalResponseBody =
  | { message: string }
  | { error: any }
  | { data: any };

class UndefinedBodyError extends Error {
  constructor() {
    super("Body is undefined, although it is required for this status code.");
    this.name = "UndefinedBodyError";
  }
}

export class ConventionalResponse extends Response {
  private constructor(status: number, body?: ConventionalResponseBody) {
    const nullBodyCodes = [100, 101, 204, 205, 304];
    if (nullBodyCodes.includes(status)) {
      super(null, { status });
      return;
    }

    if (!body) throw new UndefinedBodyError();

    super(JSON.stringify(body), {
      status,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  public static ok(body: { message: string } | { data: any }) {
    return new this(200, body);
  }

  public static created(body: { message: string } | { data: any }) {
    return new this(201, body);
  }

  public static noContent() {
    return new this(204);
  }

  public static badRequest(body: { error: object }) {
    return new this(400, body);
  }

  public static unauthorized(body?: { message?: string }) {
    const { message } = body || {};
    return new this(401, { message: message || "Não autorizado." });
  }

  public static notFound(body?: { message?: string }) {
    const { message } = body || {};
    return new this(404, { message: message || "Não encontrado." });
  }

  public static conflict(body: { error: object }) {
    return new this(409, body);
  }

  public static tooManyRequests(body?: { message?: string }) {
    const { message } = body || {};
    return new this(429, { message: message || "Muitas requisições." });
  }

  public static internalServerError(body?: { message?: string }) {
    const { message } = body || {};
    return new this(500, { message: message || "Ocorreu um erro." });
  }
}
