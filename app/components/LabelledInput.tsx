import { ExclamationCircleIcon } from "@heroicons/react/solid";

export interface LabelledInputProps {
  label: string;
  name: string;
  error?: string;
  type?: "text" | "email" | "number";
  defaultValue?: string;
  placeholder?: string;
  button?: {
    text: string;
    action: string;
  };
}
export function LabelledInput({
  name,
  label,
  error,
  type,
  placeholder,
  defaultValue,
  button,
}: LabelledInputProps) {
  let errorClasses = error
    ? "border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500"
    : "focus:border-indigo-500 focus:ring-indigo-500";
  let buttonClasses = button ? "rounded-none rounded-l-md" : "rounded-md";
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="mt-1 flex rounded-md shadow-sm">
        <div className="relative flex flex-grow items-stretch focus-within:z-10">
          <input
            type={type || "text"}
            name={name}
            id={name}
            className={`block w-full pr-10 sm:text-sm ${buttonClasses} ${errorClasses}`}
            placeholder={placeholder}
            defaultValue={defaultValue}
            aria-invalid={!!error}
            aria-describedby={error && `${name}-error`}
          />
          {error && (
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <ExclamationCircleIcon
                className="h-5 w-5 text-red-500"
                aria-hidden="true"
              />
            </div>
          )}
        </div>
        {button && (
          <>
            <input type="hidden" name="_action" value={button.action} />
            <button
              type="submit"
              className="relative -ml-px inline-flex items-center space-x-2 rounded-r-md border border-gray-300 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <span>{button.text}</span>
            </button>
          </>
        )}
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600" id={`${name}-error`}>
          {error}
        </p>
      )}
    </div>
  );
}
