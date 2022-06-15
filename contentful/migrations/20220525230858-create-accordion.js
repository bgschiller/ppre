module.exports.description = "Create content model for Accordion";

module.exports.up = (migration) => {
  const accordion = migration.createContentType('accordion')
    .name("Accordion")
    .displayField("title")
    .description("An accordion with multiple expandable/collapsible accordion items.");
  
  accordion.createField("title")
    .name("Title")
    .type("Symbol")
    .localized(true);

  accordion.createField("pretext")
    .name("Pretext")
    .type("Symbol")
    .localized(true);

  accordion.createField("accordionItems")
    .name("Accordion Items")
    .type("Array")
    .required(true)
    .items({"type":"Link","validations":[{"linkContentType":["accordionItem"]}],"linkType":"Entry"});

  accordion.changeFieldControl("title", "builtin", "singleLine");
  accordion.changeFieldControl("pretext", "builtin", "singleLine");
  accordion.changeFieldControl("accordionItems", "builtin", "entryLinksEditor");
};

module.exports.down = migration => migration.deleteContentType("accordion");
