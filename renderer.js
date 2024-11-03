const kResultsDivID = "js-result";
const kDocNameDivID = "js-doc-name";
const kTemplatesDivID = "js-templates";
const kFoldersDivID = "js-folders";
const kUrlInputClass = "url-input";

/**
 *
 * @param {string} id element's id
 * @param {string} name element's name
 * @param {'folder' | 'template'} type element's name
 * @returns {HTMLDivElement}
 */
function CreateReadOnlyElements(id, name, type) {
  const editBtn = CreateIcon("bi-pen", {
    className: `pointer col-1 edit-btn ${type}`,
    attrs: [["data-id", id]],
  });
  const nameRadio = CreateRadioGroup(
    /*name=*/ `${type}-id`,
    /*text=*/ name,
    /*value=*/ id,
    /*inputOptions=*/ {
      id: `${id}-name-radio`,
      className: kUrlInputClass,
      checked: true,
    },
    /*labelOptions=*/ {
      id: `${id}-name-label`,
    },
    /*containerOptions=*/ { className: "col-11" }
  );
  const nameRadioBox = CreateDiv([nameRadio], { className: "col-11" });
  return CreateDiv([nameRadioBox, editBtn], { className: "row" });
}

/**
 *
 * @param {string} id element's id
 * @param {string} name element's name
 * @param {'folder' | 'template'} type element's name
 * @returns {HTMLDivElement}
 */
function CreateEditableElements(id, name, type) {
  const deleteBtn = CreateIcon("bi-trash", {
    className: `pointer col-1 delete-btn ${type}`,
    attrs: [
      ["data-id", id],
      ["data-asset-type", type],
    ],
  });
  const editNameInput = CreateTextInput(
    /*name=*/ `${id}-edit-input`,
    /*value=*/ name,
    /*placeholder=*/ "",
    {
      id: `${id}-edit-input`,
      attrs: [["data-id", id]],
    }
  );
  const editNameInputBox = CreateDiv([editNameInput], { className: "col-9" });
  const editSaveBtn = CreateIcon("bi-floppy", {
    className: `pointer col-1 edit-save-btn`,
    attrs: [
      ["data-id", id],
      ["data-asset-type", type],
    ],
  });
  const cancelBtn = CreateIcon("bi-x-lg", {
    className: `pointer col-1 cancel-edit-btn`,
    attrs: [["data-id", id]],
  });
  return CreateDiv([deleteBtn, editNameInputBox, editSaveBtn, cancelBtn], {
    className: "row",
  });
}

/**
 *
 * @param {string} id
 * @param {string} name
 * @param {'folder' | 'template'} type element's name
 * @returns {HTMLElement}
 */
function CreateDriveAssetRow(id, name, type) {
  const showDiv = CreateDiv([CreateReadOnlyElements(id, name, type)], {
    id: `${id}-show-div`,
    className: "col",
  });
  const editDiv = CreateDiv([CreateEditableElements(id, name, type)], {
    id: `${id}-edit-div`,
    className: "col hide",
  });
  return CreateDiv([showDiv, editDiv], {
    id: `${id}-div`,
    className: "row",
  });
}

/**
 *
 * @param {'folder' | 'template'} type element's name
 * @returns
 */
function CreateAddRow(type) {
  const idInput = CreateDiv(
    [
      CreateTextInput(`add-${type}-id-input`, "", "ID", {
        id: `add-${type}-id-input`,
      }),
    ],
    { className: "col-4" }
  );
  const nameInput = CreateDiv(
    [
      CreateTextInput(`add-${type}-name-input`, "", "Name", {
        id: `add-${type}-name-input`,
      }),
    ],
    { className: "col-6" }
  );

  const divId = `add-${type}-div`;
  const saveBtn = CreateIcon("bi-floppy", {
    id: `save-add-btn-${type}`,
    className: `pointer col-1 save-add-btn`,
    attrs: [["data-id", divId]],
  });
  const cancelBtn = CreateIcon("bi-x-lg", {
    className: `pointer col-1 cancel-add-btn`,
    attrs: [["data-id", divId]],
  });

  return CreateDiv([idInput, nameInput, saveBtn, cancelBtn], {
    id: divId,
    className: "row hide",
  });
}

/**
 *
 * @param {DriveAsset} template
 */
function RenderNewTemplate(template) {
  const div = document.getElementById(kTemplatesDivID);
  // Insert before the Add row.
  div.insertBefore(
    CreateDriveAssetRow(template.key, template.name, "template"),
    div.lastChild
  );
}

function RenderTemplates() {
  const div = document.getElementById(kTemplatesDivID);
  templatesStorage.list().forEach((x) => {
    div.appendChild(CreateDriveAssetRow(x.key, x.name, "template"));
  });
  div.appendChild(CreateAddRow("template"));
}
RenderTemplates();

/**
 *
 * @param {DriveAsset} folder
 */
function RenderNewFolder(folder) {
  const div = document.getElementById(kFoldersDivID);
  // Insert before the Add row.
  div.insertBefore(
    CreateDriveAssetRow(folder.key, folder.name, "folder"),
    div.lastChild
  );
}

function RenderFolders() {
  const div = document.getElementById(kFoldersDivID);
  folderStorage.list().forEach((x) => {
    div.appendChild(CreateDriveAssetRow(x.key, x.name, "folder"));
  });
  div.appendChild(CreateAddRow("folder"));
}
RenderFolders();

function CreateDocNameInputDiv() {
  const input = CreateTextInput("doc-name-input", "", "", {
    id: "doc-name-input",
    className: `form-control ${kUrlInputClass}`,
  });
  const span = CreateSpan("Name: ", { className: "input-group-text" });

  return CreateDiv([span, input], { className: "input-group col-12" });
}

function RenderDocNameInput() {
  const div = document.getElementById(kDocNameDivID);
  div.appendChild(CreateDocNameInputDiv());
}
RenderDocNameInput();

/**
 *
 * @param {string} id
 */
function RemoveElement(id) {
  document.getElementById(id).remove();
}

/**
 *
 * @param {HTMLElement} x
 */
function Hide(x) {
  x.classList.add("hide");
}

/**
 *
 * @param {HTMLElement} x
 */
function Show(x) {
  x.classList.remove("hide");
}
