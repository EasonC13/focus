const request = indexedDB.open("imgs", 3);;
let db;

request.onsuccess = function() {
  db = request.result;
  setTimeout(() => {
      db.close
    }, 1000)
};
request.onupgradeneeded = function() {
    console.log('The database did not previously exist, so create object stores and indexes.')
    const db = request.result;
    const store = db.createObjectStore("imgs", {keyPath: "hash"});
    const imageIndex = store.createIndex("b64", "base_64", {unique: true});
};