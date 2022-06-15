import type { ReactElement } from "react";

export function makeTemplate<
  T extends (props: any) => ReactElement<any, any> | null
>(Component: T): T & { args: Parameters<T>[0] } {
  // @ts-ignore
  // eslint-disable-next-line react/display-name
  return (args: Parameters<T>) => <Component {...args} />;
}
