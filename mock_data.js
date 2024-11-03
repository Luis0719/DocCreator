let foldersJson = JSON.stringify([
  {
    key: "asdf",
    name: "asdf > asdf",
  },
  {
    key: "ioi",
    name: "adsmnfb > kausdf",
  },
]);

let templatesJson = JSON.stringify([
  {
    key: "tpl1",
    name: "Template1",
  },
  {
    key: "tpl2",
    name: "Template2",
  },
]);

let mock_data = {
  [kFoldersStorageKey]: foldersJson,
  [kTemplatesStorageKey]: templatesJson,
};

class FakeLocalStorage {
  getItem(key) {
    console.log(key);
    return mock_data[key];
  }

  setItem(key, data) {
    mock_data[key] = data;
  }
}
