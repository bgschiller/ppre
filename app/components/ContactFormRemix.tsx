import { Form, useTransition } from "@remix-run/react";

export type ContactFormProps = {
  className?: string;
  title: string;
};

export const ContactForm = ({ className = "", title }: ContactFormProps) => {
  const transition = useTransition();
  const inputClassName = "border border-gray-300 p-2 my-2 w-full";
  return (
    <div className={`grid gap-10 p-4 lg:grid-cols-3 lg:p-10 ${className}`}>
      <div>
        <h1 className="text-4xl lg:text-5xl">{title}</h1>
      </div>
      <div className="lg:col-span-2">
        {/* TODO: Once Remix supports things inside Storybook better (https://github.com/remix-run/remix/discussions/2481), move this over to `ContactForm` and delete the generic component. */}
        <Form method="post">
          <fieldset className="grid gap-4 md:grid-cols-2">
            <p>
              <label>
                First name
                <br />
                <input
                  className={inputClassName}
                  name="firstName"
                  type="text"
                />
              </label>
            </p>
            <p>
              <label>
                Last name
                <br />
                <input className={inputClassName} name="lastName" type="text" />
              </label>
            </p>
            <p>
              <label>
                Email address
                <br />
                <input className={inputClassName} name="email" type="text" />
              </label>
            </p>
            <p>
              <label>
                Phone
                <br />
                <input className={inputClassName} name="phone" type="text" />
              </label>
            </p>
            <p>
              <label>
                How'd you hear about us?
                <br />
                <input className={inputClassName} name="source" type="text" />
              </label>
            </p>
            <p>
              <label>
                What can we do for you?
                <br />
                <input className={inputClassName} name="subject" type="text" />
              </label>
            </p>
          </fieldset>
          <p>
            <button
              className="mt-2 bg-indigo-600 py-3 px-5 text-white hover:bg-indigo-500"
              type="submit"
            >
              {transition.state === "submitting" ? "Submitting..." : "Submit"}
            </button>
          </p>
        </Form>
      </div>
    </div>
  );
};
