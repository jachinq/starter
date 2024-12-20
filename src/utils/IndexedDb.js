/* 常量定义 */
import Util from "./Util";

/**
 * 数据库名称
 * @type {{BACKUP: string, STARTER: string, SETTING: string}}
 */
const DATABASE = {
    STARTER: 'starter',
    BACKUP: 'backup',
    SETTING: 'setting',
};

/**
 * 数据库版本
 * @type {number}
 */
const VERSION = 1;

class Result {
    /**
     * 封装 promise 对象返回的数据
     * @param success 是否成功，布尔值
     * @param msg 返回消息，字符串
     * @param data 返回内容，对象
     */
    constructor(success, msg, data) {
        this.success = success;
        this.msg = msg;
        this.data = data;
    }
}

/**
 * 数据表
 * @type {{SEARCH_TYPE: string, CATEGORY: string, APPLICATION: string, UI: string}}
 */
const STARTER_TABLE_NAME = {
    SEARCH_TYPE: "searchType", // 搜索
    CATEGORY: "category", // 类别
    APPLICATION: "application", // 应用列表
    HISTORY: "history", // 搜索历史记录
};

const SETTING_TABLE_NAME = {
    SETTING: 'setting',
};
const BACKUP_TABLE_NAME = {
    BACKUP: 'backup',
};

/**
 * 打开/创建数据库
 * @param {string} database 数据库的名字
 * @return {Promise<Result>}
 */
const connect = function (database) {
    return new Promise((resolve, reject) => {
        //  兼容浏览器
        let indexedDB =
            window.indexedDB ||
            // window.mozIndexedDB ||
            // window.webkitIndexedDB ||
            window.msIndexedDB;

        const request = indexedDB.open(database, VERSION);

        request.onsuccess = () => resolve(new Result(true, '连接成功', request.result));
        request.onerror = () => resolve(new Result(false, '连接错误', request.error));
        request.onblocked = (error) => resolve(new Result(false, '阻塞挂起，等待中', error));

        // 创建表和索引
        request.onupgradeneeded = () => {
            // 数据库创建或升级的时候会触发
            let db = request.result; // 数据库对象

            let tableNameObj = {};
            if (database === DATABASE.STARTER) {
                tableNameObj = STARTER_TABLE_NAME;
            } else if (database === DATABASE.SETTING) {
                tableNameObj = SETTING_TABLE_NAME;
            } else if (database === DATABASE.BACKUP) {
                tableNameObj = BACKUP_TABLE_NAME;
            }

            Object.keys(tableNameObj).forEach(storeKey => {
                let storeName = tableNameObj[storeKey];
                if (!db.objectStoreNames.contains(storeName)) {
                    db.createObjectStore(storeName, {keyPath: 'id', autoIncrement: true}); // 创建表
                    console.log('create table', database + "." + storeKey);
                }
            });
            resolve(new Result(true, '连接成功，数据库初始化成功', db));
        }
    }).catch((e) => {console.log('connect', e);})
};

const deleteDatabase = async function (database) {
    return new Promise((resolve, reject) => {
        //  兼容浏览器
        let indexedDB =
            window.indexedDB ||
            // window.mozIndexedDB ||
            // window.webkitIndexedDB ||
            window.msIndexedDB;
        const request = indexedDB.deleteDatabase(database);

        request.onerror = () => {
            console.log('Error deleting database: ', request.error);
            resolve(new Result(false, '数据库删除失败!', request));
        };

        request.onsuccess = () => resolve(new Result(true, '数据库删除成功!', request));
    }).catch((e) => {console.log('deleteDatabase', e);})

};

/**
 * 新增数据
 * @param database
 * @param table
 * @param data
 * @returns {Promise<Result>}
 */
const addData = async function (database, table, data) {
    if (data && data['id']) {
        delete data.id;
    }

    let getDataName = database + "." + table;

    let connectResult = await connect(database).catch(e=>{console.log(e)});
    if (connectResult.success) {
        let conn;
        try {
            conn = connectResult.data;
            return await new Promise((resolve, reject) => {
                if (conn == null) {
                    resolve(new Result(false, '数据库连接成功，但数据库实例为空', null));
                    return
                }

                let request = conn.transaction([table], 'readwrite').objectStore(table) // 仓库对象
                    .add(data);

                request.onsuccess = () => resolve(new Result(true, "添加数据成功：" + getDataName, request.result));

                request.onerror = function (event) {
                    console.log('添加数据失败', getDataName, data, event);
                    resolve(new Result(false, "添加数据失败：" + getDataName, data))
                };
            }).catch((e) => {console.log('addData', e);})

        } catch (e) {
            console.log(getDataName + ' addData exps', e);
        }finally {
            if (conn) {
                conn.close();
            }
        }
    } else {
        return new Promise(((resolve, reject) => resolve(new Result(false, '添加数据失败，原因：数据库连接失败', null)))).catch((e) => {console.log('addData', e);});
    }
};

/**
 * 修改数据
 * @param database
 * @param table
 * @param data
 * @returns {Promise<Result>}
 */
const delData = async function (database, table, data) {
    let getDataName = database + "." + table;

    if(!data || !data.id) return new Promise((resolve, reject) => resolve(new Result(false, "删除失败，数据或数据id为空", data))).catch((e) => {console.log('delData', e);});

    let connectResult = await connect(database).catch(e=>{console.log(e)});
    if (connectResult.success) {
        let conn;
        try {
            conn = connectResult.data;
            return new Promise((resolve, reject) => {
                if (conn == null) {
                    resolve(new Result(false, '数据库连接成功，但数据库实例为空', null));
                    return
                }

                const request = conn
                    .transaction([table], 'readwrite')
                    .objectStore(table).delete(data.id);
                request.onsuccess = () => {
                    resolve(new Result(true, "删除数据成功：" + getDataName, data));
                };
                request.onerror = () => resolve(new Result(false, "删除数据失败：" + getDataName, data));
            }).catch((e) => {console.log('delData', e);})

        } finally {
            if (conn) {
                conn.close();
            }
        }
    } else {
        return new Promise(((resolve, reject) => resolve(new Result(false, '删除数据失败，原因：数据库连接失败', null)))).catch((e) => {console.log('delData', e);});
    }
};

/**
 * 修改数据
 * @param database
 * @param table
 * @param data
 * @returns {Promise<Result>}
 */
const setData = async function (database, table, data) {
    let getDataName = database + "." + table;

    if(!data || !data.id) return new Promise((resolve, reject) => resolve(new Result(false, "更新失败，数据或数据id为空", data))).catch((e) => {console.log('setData', e);});;

    let connectResult = await connect(database).catch(e=>{console.log(e)});
    if (connectResult.success) {
        let conn;
        try {
            conn = connectResult.data;
            return new Promise((resolve, reject) => {
                if (conn == null) {
                    resolve(new Result(false, '数据库连接成功，但数据库实例为空', null));
                    return
                }

                const request = conn
                    .transaction([table], 'readwrite')
                    .objectStore(table).put(data);
                request.onsuccess = () => {
                    resolve(new Result(true, "修改数据成功：" + getDataName, request.result));
                };
                request.onerror = () => resolve(new Result(false, "修改数据失败：" + getDataName, request.error));
            }).catch((e) => {console.log('setData', e);});

        } finally {
            if (conn) {
                conn.close();
            }
        }
    } else {
        return new Promise(((resolve, reject) => resolve(new Result(false, '更新数据失败，原因：数据库连接失败', null)))).catch((e) => {console.log('setData', e);});;
    }
};

/**
 * 获取数据
 * @param database
 * @param table
 * @returns {Promise<Result>}
 */
const getData = async function (database, table) {
    let getDataName = database + "." + table;
    let connectResult = await connect(database).catch(e=>{console.log(e)}); // await 等待异步函数返回结果
    // 连接成功
    if (connectResult.success) {
        let conn;
        try {
            conn = connectResult.data;

            return new Promise((resolve, reject) => {
                if (conn == null) {
                    resolve(new Result(false, '数据库连接成功，但数据库实例为空', null));
                    return
                }

                let storage;
                // 打开游标
                try {
                    storage = conn.transaction([table], 'readonly').objectStore(table);
                } catch (e) {
                    console.log(e);
                }

                if (storage) {
                    const request = storage.openCursor();

                    let list = []; // 存放数据的数组
                    request.onsuccess = function (event) {
                        let cursor = event.target.result;
                        if (cursor) {
                            list.push(cursor.value);
                            cursor.continue();
                        } else { // 必须要等游标完全变为 null 后，再通过一次的 resolve 返回数据
                            if (table === STARTER_TABLE_NAME.HISTORY) {
                                resolve(new Result(true, "获取数据成功：" + getDataName, list.sort(Util.sortDesc)));
                            } else {
                                list.sort(Util.sortAsc);
                                // console.log(getDataName, list.length);
                                resolve(new Result(true, "获取数据成功：" + getDataName, list.sort(Util.sortAsc)));
                            }
                        }
                    };

                    request.onerror = () => resolve(new Result(false, '获取数据失败' + getDataName, request.error));
                } else {
                    resolve(new Result(false, "打开数据表异常", getDataName));
                }
            }).catch((e) => {console.log('getData', e);});

        } finally {
            if (conn) {
                conn.close();
            }
        }
    }
    // 连接失败
    else {
        return new Promise(((resolve, reject) => {
            resolve(new Result(false, '获取数据失败，原因：数据库连接失败', null));
        })).catch((e) => {console.log('getData', e);});;
    }
};


/**
 * 新增 SearchType 数据
 * @param data 新数据，必须带主键/索引 id
 * @returns {Promise<Result>}
 */
const addSearchType = function (data) {
    return addData(DATABASE.STARTER, STARTER_TABLE_NAME.SEARCH_TYPE, data);
};

/**
 * 删除 SearchType 数据
 * @param data 删除的数据，必须带主键/索引 id
 * @returns {Promise<Result>}
 */
const delSearchType = function (data) {
    return delData(DATABASE.STARTER, STARTER_TABLE_NAME.SEARCH_TYPE, data);
};

/**
 * 修改 SearchType 数据
 * @param data 修改的数据，必须带主键/索引 id
 * @returns {Promise<Result>}
 */
const setSearchType = function (data) {
    return setData(DATABASE.STARTER, STARTER_TABLE_NAME.SEARCH_TYPE, data);
};

/**
 * 获取 SearchType 数据
 * @returns {Promise<Result>}
 */
const getSearchType = function () {
    return getData(DATABASE.STARTER, STARTER_TABLE_NAME.SEARCH_TYPE);
};

/**
 * 新增 Category 数据
 * @param data 新数据，必须带主键/索引 id
 * @returns {Promise<Result>}
 */
const addCategory = function (data) {
    return addData(DATABASE.STARTER, STARTER_TABLE_NAME.CATEGORY, data);
};

/**
 * 删除 Category 数据
 * @param data 删除的数据，必须带主键/索引 id
 * @returns {Promise<Result>}
 */
const delCategory = async function (data) {
    let result = await getApplication().catch(e=>{console.log(e)});
    if (result && result.success) {
        for (let item of result.data) {
            if (item === undefined || item === null) {
                continue;
            }
            if (item.category === data.category) {
                console.log('before delCategory,first delApplication', await delApplication(item).catch(e => {console.log(e)}));
            }
        }
    }

    return delData(DATABASE.STARTER, STARTER_TABLE_NAME.CATEGORY, data);
};

/**
 * 修改 Category 数据
 * @param data 修改的数据，必须带主键/索引 id
 * @returns {Promise<Result>}
 */
const setCategory = function (data) {
    return setData(DATABASE.STARTER, STARTER_TABLE_NAME.CATEGORY, data);
};

/**
 * 获取 Category 数据
 * @returns {Promise<Result>}
 */
const getCategory = function () {
    return getData(DATABASE.STARTER, STARTER_TABLE_NAME.CATEGORY);
};

/**
 * 新增 App 数据
 * @param data 新数据，必须带主键/索引 id
 * @returns {Promise<Result>}
 */
const addApplication = function (data) {
    return addData(DATABASE.STARTER, STARTER_TABLE_NAME.APPLICATION, data);
};

/**
 * 删除 App 数据
 * @param data 删除的数据，必须带主键/索引 id
 * @returns {Promise<Result>}
 */
const delApplication = function (data) {
    return delData(DATABASE.STARTER, STARTER_TABLE_NAME.APPLICATION, data);
};

/**
 * 修改 App 数据
 * @param data 修改的数据，必须带主键/索引 id
 * @returns {Promise<Result>}
 */
const setApplication = function (data) {
    return setData(DATABASE.STARTER, STARTER_TABLE_NAME.APPLICATION, data);
};

/**
 * 获取 App 数据
 * @returns {Promise<Result>}
 */
const getApplication = function () {
    return getData(DATABASE.STARTER, STARTER_TABLE_NAME.APPLICATION);
};

/**
 * 新增历史数据
 * @param data 新数据，必须带主键/索引 id
 * @returns {Promise<Result>}
 */
const addHistory = function (data) {
    return addData(DATABASE.STARTER, STARTER_TABLE_NAME.HISTORY, data);
};

/**
 * 删除历史数据
 * @param data 删除的数据，必须带主键/索引 id
 * @returns {Promise<Result>}
 */
const delHistory = function (data) {
    return delData(DATABASE.STARTER, STARTER_TABLE_NAME.HISTORY, data);
};

/**
 * 修改历史数据
 * @param data 修改的数据，必须带主键/索引 id
 * @returns {Promise<Result>}
 */
const setHistory = function (data) {
    return setData(DATABASE.STARTER, STARTER_TABLE_NAME.HISTORY, data);
};

/**
 * 获取历史数据
 * @returns {Promise<Result>}
 */
const getHistory = function () {
    return getData(DATABASE.STARTER, STARTER_TABLE_NAME.HISTORY);
};


/**
 * 新增设置数据
 * @param data 新增数据，必须带主键/索引 id
 * @returns {Promise<Result>}
 */
const addSetting = function (data) {
    return addData(DATABASE.SETTING, SETTING_TABLE_NAME.SETTING, data);
};

/**
 * 删除设置数据
 * @param data 删除的数据，必须带主键/索引 id
 * @returns {Promise<Result>}
 */
const delSetting = function (data) {
    return delData(DATABASE.SETTING, SETTING_TABLE_NAME.SETTING, data);
};

/**
 * 修改设置数据
 * @param data 修改的数据，必须带主键/索引 id
 * @returns {Promise<Result>}
 */
const setSetting = function (data) {
    return setData(DATABASE.SETTING, SETTING_TABLE_NAME.SETTING, data);
};

/**
 * 获取设置数据
 * @returns {Promise<Result>}
 */
const getSetting = function () {
    return getData(DATABASE.SETTING, SETTING_TABLE_NAME.SETTING);
};




/**
 * 新增备份数据
 * @param data 新增数据，必须带主键/索引 id
 * @returns {Promise<Result>}
 */
const addBackup = function (data) {
    return addData(DATABASE.BACKUP, BACKUP_TABLE_NAME.BACKUP, data);
};

/**
 * 删除备份数据
 * @param data 删除的数据，必须带主键/索引 id
 * @returns {Promise<Result>}
 */
const delBackup = function (data) {
    return delData(DATABASE.BACKUP, BACKUP_TABLE_NAME.BACKUP, data);
};

/**
 * 修改备份数据
 * @param data 修改的数据，必须带主键/索引 id
 * @returns {Promise<Result>}
 */
const setBackup = function (data) {
    return setData(DATABASE.BACKUP, BACKUP_TABLE_NAME.BACKUP, data);
};

/**
 * 获取备份数据
 * @returns {Promise<Result>}
 */
const getBackup = function () {
    return getData(DATABASE.BACKUP, BACKUP_TABLE_NAME.BACKUP);
};


export default {
    DATABASE,
    STARTER_TABLE_NAME,
    SETTING_TABLE_NAME,
    BACKUP_TABLE_NAME,
    VERSION,

    deleteDatabase,
    addData,
    getData,

    addSearchType,
    delSearchType,
    setSearchType,
    getSearchType,

    addCategory,
    delCategory,
    setCategory,
    getCategory,

    addApplication,
    delApplication,
    setApplication,
    getApplication,

    addHistory,
    delHistory,
    setHistory,
    getHistory,

    addSetting,
    delSetting,
    setSetting,
    getSetting,

    addBackup,
    delBackup,
    setBackup,
    getBackup,
};
