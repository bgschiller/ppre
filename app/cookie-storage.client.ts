import { StateStorage } from "zustand/middleware/persist";

const HOST =
  window.location.hostname !== "localhost" ? window.location.hostname : null;

const cookieSuffix = `${
  HOST ? `Domain=${HOST}; ` : ""
} SameSite=Strict; Secure; Path=/`;
export const CookieStorage: StateStorage = {
  getItem(name: string): string | null {
    const value = document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${encodeURIComponent(name)}=`))
      ?.split("=")[1];
    if (!value) return null;
    return decodeURIComponent(value);
  },
  setItem(name: string, value: string): void {
    document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(
      value
    )}; ${cookieSuffix}; expires=Fri, 31 Dec 9999 23:59:59 GMT`;
  },
  removeItem(name: string): void {
    document.cookie = `${encodeURIComponent(
      name
    )}=; ${cookieSuffix}; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  },
};
