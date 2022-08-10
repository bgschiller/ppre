import type { CookieParseOptions, CookieSerializeOptions } from "cookie";
import type { CookieOptions } from "@remix-run/server-runtime";
import { parse, serialize } from "cookie";

export { isCookie } from "@remix-run/server-runtime";

/**
 * A HTTP cookie.
 *
 * Just like remix's Cookie type, but it doesn't serialize to an object.
 *
 * A RawCookie is a logical container for metadata about a HTTP cookie; its name
 * and options. But it doesn't contain a value. Instead, it has `parse()` and
 * `serialize()` methods that allow a single instance to be reused for
 * parsing/encoding multiple different values.
 */
export interface RawCookie {
  /**
   * The name of the cookie, used in the `Cookie` and `Set-Cookie` headers.
   */
  readonly name: string;

  /**
   * True if this cookie uses one or more secrets for verification.
   */
  readonly isSigned: boolean;

  /**
   * The Date this cookie expires.
   *
   * Note: This is calculated at access time using `maxAge` when no `expires`
   * option is provided to `createCookie()`.
   */
  readonly expires?: Date;

  /**
   * Parses a raw `Cookie` header and returns the value of this cookie or
   * `null` if it's not present.
   */
  parse(
    cookieHeader: string | null,
    options?: CookieParseOptions
  ): string | null;

  /**
   * Serializes the given value to a string and returns the `Set-Cookie`
   * header.
   */
  serialize(value: string, options?: CookieSerializeOptions): string;
}

type RawCookieOptions = Omit<CookieOptions, "secrets">;

/**
 * Just like remix's `createCookie`, but without JSON.{parse,stringify} at the
 * boundaries. Instead, we just use encode/decodeURIComponent to protect against
 * chars that would be unsafe in a cookie.
 *
 * This lets us mimic the existing behavior of websites where needed.
 */
export function createRawCookie(
  name: string,
  cookieOptions: RawCookieOptions = {}
): RawCookie {
  let options = {
    path: "/",
    ...cookieOptions,
  };

  return {
    get name() {
      return name;
    },
    get isSigned() {
      // YAGNI. feel free to add this if you need it, but I didn't.
      return false;
    },
    get expires() {
      // Max-Age takes precedence over Expires
      return typeof options.maxAge !== "undefined"
        ? new Date(Date.now() + options.maxAge * 1000)
        : options.expires;
    },
    parse(cookieHeader, parseOptions) {
      if (!cookieHeader) return null;
      let cookies = parse(cookieHeader, { ...options, ...parseOptions });
      if (!(name in cookies) || cookies[name] === "") return "";
      return cookies[name];
    },
    serialize(value, serializeOptions) {
      return serialize(name, value || "", {
        ...options,
        ...serializeOptions,
      });
    },
  };
}
