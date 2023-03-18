import Dexie from "dexie";

const db = new Dexie('myInsta')
db.version(1).stores({
    bio : ',name,about',
    gallery : '++id,url'
})

export default db;