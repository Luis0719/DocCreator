/**
 *
 * @param {string} event to listen to
 * @param {[HTMLElement]} elements to add the event listener
 * @param {(e: Event) => void} fn handler
 */
function SetEventListener(event, elements, fn) {
  for (x of elements) {
    x.addEventListener(event, fn);
  }
}

/**
 *
 * @param {[HTMLElement]} elements
 * @param {(e: Event) => void} fn
 */
function SetOnChangeEvent(elements, fn) {
  SetEventListener("change", elements, fn);
}

/**
 *
 * @param {[HTMLElement]} elements
 * @param {(e: Event) => void} fn
 */
function SetOnClickEvent(elements, fn) {
  SetEventListener("click", elements, fn);
}

/**
 *
 * @param {Event} e
 * @returns {string} ID changed
 */
function GetChangedId(e) {
  return e.target.getAttribute("data-id");
}

function GetAssetType(e) {
  return e.target.getAttribute("data-asset-type");
}

/**
 *
 * @param {'template' | 'folder'} type
 * @returns {DriveStorage}
 */
function GetDriveStorage(type) {
  switch (type) {
    case "template":
      return templatesStorage;

    case "folder":
      return folderStorage;

    default:
      throw new Error(`Drive storage for ${type} not found.`);
  }
}

/**
 * @param {Event} e
 */
function OnDeleteClick(e) {
  const id = GetChangedId(e);
  GetDriveStorage(GetAssetType(e)).delete(id);
  RemoveElement(`${id}-div`);
}

/**
 * @param {Event} e
 */
function OnEndEditClick(e) {
  const id = GetChangedId(e);
  Show(document.getElementById(`${id}-show-div`));
  Hide(document.getElementById(`${id}-edit-div`));
}

/**
 *
 * @param {Event} e
 * @returns {undefined}
 */
function OnEditSaveClick(e) {
  const id = GetChangedId(e);
  const assetType = GetAssetType(e);
  const storage = GetDriveStorage(assetType);
  const driveAsset = storage.find(id);
  if (!driveAsset) {
    console.error(`${id} not found for ${assetType}`);
    return;
  }
  const nameInput = document.getElementById(`${id}-edit-input`);
  driveAsset.name = nameInput.value;
  storage.update(driveAsset);

  //   Update UI
  const span = document.getElementById(`${id}-name-label`);
  span.innerText = nameInput.value;
  OnEndEditClick(e);
}

/**
 * @param {Event} e
 */
function OnStartEditClick(e) {
  const id = GetChangedId(e);
  Hide(document.getElementById(`${id}-show-div`));
  Show(document.getElementById(`${id}-edit-div`));
}

function GetRadioValue(radioInputs) {
  for (let i = 0; i < radioInputs.length; i++) {
    if (radioInputs[i].checked) {
      return radioInputs[i].value;
    }
  }
  return null; // Return null if no checkbox is selected
}

/**
 *
 * @returns {string} Doc creator url.
 */
function GetDocUrl() {
  const name = document.getElementById("doc-name-input").value;
  const templateId = GetRadioValue(document.getElementsByName("template-id"));
  const folderId = GetRadioValue(document.getElementsByName("folder-id"));
  return "http://" + name + templateId + folderId;
}

function UpdateDocUrl() {
  const resultDiv = document.getElementById(kResultsDivID);
  resultDiv.innerHTML = "";
  const url = GetDocUrl();
  resultDiv.appendChild(CreateLink(url, url));
}

function OnUrlInputChange(e) {
  UpdateDocUrl();
}

SetEventListener(
  "keydown",
  [document.getElementById("doc-name-input")],
  OnUrlInputChange
);

/**
 * Registers all event listeners for every asset row.
 */
function AddAssetsEventListeners() {
  SetOnClickEvent(document.getElementsByClassName("delete-btn"), OnDeleteClick);
  SetOnClickEvent(
    document.getElementsByClassName("cancel-edit-btn"),
    OnEndEditClick
  );
  SetOnClickEvent(
    document.getElementsByClassName("edit-save-btn"),
    OnEditSaveClick
  );
  SetOnClickEvent(
    document.getElementsByClassName("edit-btn"),
    OnStartEditClick
  );
  SetOnChangeEvent(
    document.getElementsByClassName(kUrlInputClass),
    OnUrlInputChange
  );
}

/**
 *
 * @param {'template' | 'folder'} type
 * @param {DriveStorage} storage
 * @returns {DriveAsset} the created asset.
 */
function AddToStorage(type, storage) {
  const idInput = document.getElementById(`add-${type}-id-input`);
  const nameInput = document.getElementById(`add-${type}-name-input`);
  const asset = new DriveAsset(idInput.value, nameInput.value);
  storage.add(asset);
  idInput.value = "";
  nameInput.value = "";
  return asset;
}

function OnCloseAddForm(e) {
  const id = GetChangedId(e);
  Hide(document.getElementById(id));
}
SetOnClickEvent(
  document.getElementsByClassName("cancel-add-btn"),
  OnCloseAddForm
);

function OnStartAddForm(e) {
  const id = GetChangedId(e);
  Show(document.getElementById(id));
}
SetOnClickEvent(document.getElementsByClassName("add-btn"), OnStartAddForm);

function OnAddTemplateSaveClick(e) {
  const template = AddToStorage("template", templatesStorage);
  RenderNewTemplate(template);
  AddAssetsEventListeners();
  OnCloseAddForm(e);
}
SetOnClickEvent(
  [document.getElementById("save-add-btn-template")],
  OnAddTemplateSaveClick
);

function OnAddFolderSaveClick(e) {
  const folder = AddToStorage("folder", folderStorage);
  RenderNewFolder(folder);
  AddAssetsEventListeners();
  OnCloseAddForm(e);
}
SetOnClickEvent(
  [document.getElementById("save-add-btn-folder")],
  OnAddFolderSaveClick
);

function OnStart() {
  UpdateDocUrl();
  AddAssetsEventListeners();
}
OnStart();
