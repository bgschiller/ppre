import { useActionData } from "@remix-run/react";
import type { ActionFunction } from "@remix-run/server-runtime";
import { useTranslation } from "react-i18next";
import { ContactForm } from "~/components/ContactFormRemix";
import { Hero } from "~/components/Hero";
import { Inset } from "~/components/Inset";

export const handle = {
  i18n: "common",
};

interface ActionData {
  submitted: boolean;
  formData: {
    [k: string]: FormDataEntryValue;
  };
}

export const action: ActionFunction = async ({
  request,
}): Promise<ActionData> => {
  const formData = await request.formData();
  return { submitted: true, formData: Object.fromEntries(formData) };
};

export default function Store() {
  const { t } = useTranslation("common");
  const actionData = useActionData<ActionData>();
  return (
    <main>
      <Hero
        background={{
          url: "heroBackground.png",
        }}
        size="small"
        title={t("Contact Us")}
      />
      <Inset>
        {actionData && actionData.submitted ? (
          t("contactFormThanks", { user: actionData.formData.firstName })
        ) : (
          <ContactForm title={t("Get in touch with us.")} />
        )}
      </Inset>
    </main>
  );
}
