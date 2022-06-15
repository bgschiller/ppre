export type ContactFormProps = {
  className?: string;
  title: string;
};

export const ContactForm = ({ className = "", title }: ContactFormProps) => {
  const inputClassName = "border border-gray-300 p-2 my-2 w-full";
  return (
    <div className={`grid gap-10 p-4 lg:grid-cols-3 lg:p-10 ${className}`}>
      <div>
        <h1 className="text-4xl lg:text-5xl">{title}</h1>
      </div>
      <div className="lg:col-span-2">
        {/* TODO: Remix is working on native support to stub out the context required for <Form> to work (https://github.com/remix-run/remix/discussions/2481).
            Since it's not there yet, this is a basic version of this component that doesn't rely on Remix.
            See `ContactFormRemix` for the more useful version.
        */}
        <form method="post">
          <fieldset className="grid gap-4 md:grid-cols-2">
            <p>
              <label>
                Field title
                <br />
                <input className={inputClassName} name="field" type="text" />
              </label>
            </p>
            <p>
              <label>
                Field title
                <br />
                <input className={inputClassName} name="field" type="text" />
              </label>
            </p>
            <p>
              <label>
                Field title
                <br />
                <input className={inputClassName} name="field" type="text" />
              </label>
            </p>
            <p>
              <label>
                Field title
                <br />
                <input className={inputClassName} name="field" type="text" />
              </label>
            </p>
            <p>
              <label>
                Field title
                <br />
                <input className={inputClassName} name="field" type="text" />
              </label>
            </p>
            <p>
              <label>
                Field title
                <br />
                <input className={inputClassName} name="field" type="text" />
              </label>
            </p>
            <p>
              <label>
                Field title
                <br />
                <input className={inputClassName} name="field" type="text" />
              </label>
            </p>
            <p>
              <label>
                Field title
                <br />
                <input className={inputClassName} name="field" type="text" />
              </label>
            </p>
          </fieldset>
          <p className="my-4">
            <label>
              <input name="field" type="checkbox" /> Checkbox example
            </label>
          </p>
          <p>
            <button
              className="mt-2 bg-indigo-600 py-3 px-5 text-white hover:bg-indigo-500"
              type="submit"
            >
              Submit
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};
