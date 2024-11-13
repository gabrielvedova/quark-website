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

/**
 * A class that extends the native Response class to provide a more conventional
 * way of returning responses.
 */
export class ConventionalResponse extends Response {
  /**
   * Creates a new ConventionalResponse instance.
   *
   * @param status The status code of the response.
   * @param body The body of the response.
   */
  constructor(status: number, body?: ConventionalResponseBody) {
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

  /**
   * Returns a 200 OK response.
   *
   * @param body.message The return message if this is not a data response.
   * @param body.data The data to be returned if this is a data response.
   */
  public static ok(body: { message: string } | { data: any }) {
    return new this(200, body);
  }

  /**
   * Returns a 201 Created response.
   *
   * @param body.message The return message if this is not a data response.
   * @param body.data The data to be returned if this is a data response.
   */
  public static created(body: { message: string } | { data: any }) {
    return new this(201, body);
  }

  /**
   * Returns a 204 No Content response.
   */
  public static noContent() {
    return new this(204);
  }

  /**
   * Returns a 400 Bad Request response.
   *
   * @param body The body.error The errors that occurred during the request.
   */
  public static badRequest(body: { error: object }) {
    return new this(400, body);
  }

  /**
   * Returns a 401 Unauthorized response.
   *
   * @param body.message The message to be returned. Defaults to "Não autorizado."
   */
  public static unauthorized(body?: { message?: string }) {
    const { message } = body || {};
    return new this(401, { message: message || "Não autorizado." });
  }

  /**
   * Returns a 404 Not Found response.
   *
   * @param body.message The message to be returned. Defaults to "Não encontrado."
   */
  public static notFound(body?: { message?: string }) {
    const { message } = body || {};
    return new this(404, { message: message || "Não encontrado." });
  }

  /**
   * Returns a 409 Conflict response.
   *
   * @param body.error The errors that occurred during the request.
   */
  public static conflict(body: { error: object }) {
    return new this(409, body);
  }

  /**
   * Returns a 500 Internal Server Error response.
   *
   * @param body.message The message to be returned. Defaults to "Ocorreu um erro."
   */
  public static internalServerError(body?: { message?: string }) {
    const { message } = body || {};
    return new this(500, { message: message || "Ocorreu um erro." });
  }
}
