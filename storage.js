class Storage {
  /**
   *
   * @param {window.localStorage} storage
   */
  constructor(storage = undefined) {
    // if (!storage) storage = window.localStorage;
    if (!storage) storage = new FakeLocalStorage();
    this.storage = storage;
  }

  /**
   *
   * @param {string} key
   * @returns {string} JSON data
   */
  getItem(key) {
    return this.storage.getItem(key);
  }

  /**
   *
   * @param {string} key Store as
   * @param {string} value data as string
   */
  storeItem(key, value) {
    this.storage.setItem(key, value);
  }
}

class DriveAsset {
  /**
   * Data class for directories.
   *
   * @param {string} key ID as in drive.
   * @param {string} name Name to display.
   */
  constructor(key, name) {
    this.key = key;
    this.name = name;
  }

  /**
   * Parses a json string into a list of DriveAssets;
   *
   * @param {string} json data as a json string.
   * @returns {[DriveAsset]}
   */
  static fromJson(json) {
    return JSON.parse(json);
  }
}

class DriveStorage extends Storage {
  /**
   * @param {string} storageKey Used to retrive data from storage.
   * @param {window.localStorage} storage
   */
  constructor(storageKey, storage = undefined) {
    super(storage);

    /**
     * Used to retrive data from storage.
     * @type {string}
     */
    this.storageKey = storageKey;

    /**
     * Local copy of DriveAssets.
     * @type {[DriveAsset]}
     */
    this.cache = undefined;
  }

  /**
   * Gets a list of DriveAsset.
   *
   * @returns {[DriveAsset]}
   */
  list() {
    if (!this.cache) {
      const json = this.storage.getItem(this.storageKey);
      this.cache = DriveAsset.fromJson(json);
    }
    return this.cache;
  }

  /**
   * Return a DriveAsset with the given id.
   *
   * @param {string} id to retrive
   * @returns {DriveAsset}
   */
  find(id) {
    return this.cache.find((x) => (x.key = id));
  }

  /**
   * Persists DriveAssets in storage.
   * @returns {undefined}
   */
  persist() {
    this.storage.setItem(this.storageKey, JSON.stringify(this.cache));
  }

  /**
   * Add and save a new DriveAsset.
   *
   * @param {DriveAsset} item
   */
  add(item) {
    this.cache.push(item);
    this.persist();
  }

  /**
   * Saves DriveAssets.
   *
   * @param {[DriveAsset]} items
   */
  store(items) {
    this.cache = items;
    this.persist();
  }

  /**
   * Updates the given DriveAsset.
   *
   * @param {DriveAsset} item
   */
  update(item) {
    this.cache = this.cache.map((x) => {
      if (x.key == item.key) {
        // Replace.
        return item;
      }
      return x;
    });
    this.persist();
  }

  /**
   * Removes a DriveAsset with the given ID.
   *
   * @param {string} id Id to remove.
   */
  delete(id) {
    const removed = this.cache.filter((x) => x.key != id);
    this.store(removed);
  }
}

class FolderStorage extends DriveStorage {
  /**
   *
   * @param {window.localStorage} storage
   */
  constructor(storage = undefined) {
    super(kFoldersStorageKey, storage);
  }
}

class TemplatesStorage extends DriveStorage {
  /**
   *
   * @param {window.localStorage} storage
   */
  constructor(storage = undefined) {
    super(kTemplatesStorageKey, storage);
  }
}

const templatesStorage = new TemplatesStorage();
const folderStorage = new FolderStorage();
