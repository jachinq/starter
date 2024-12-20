import { createClient } from "webdav/dist/web/index";

let file_path = "collect_vtest.json";
const default_data = {};

const parseConfig = () => {
  const config = localStorage.getItem("serverConfig") || "{}";
  const serverConfig = JSON.parse(config);
  const params = serverConfig.params || "";
  if (params) {
    params.split("&").forEach((param) => {
      const [key, value] = param.split("=");
      serverConfig[key] = value;
    });
  }
  if (serverConfig && serverConfig.filePath) {
    file_path = serverConfig.filePath;
  }

  const webdav_url = serverConfig.serverUrl || "";
  const webdav_user = serverConfig.username || "";
  const webdav_pwd = serverConfig.password || "";

  const clientOptions = {
    url: webdav_url || "",
    user: webdav_user || "",
    pwd: webdav_pwd || ""
  }
  console.log("Parse config", clientOptions)
  return clientOptions
}

const buildClient = () => {
  const { url, user, pwd } = parseConfig();
  if (!url) {
    // console.error("url is null or undefined");
    return null;
  }
  if (!user) {
    // console.error("user is null or undefined");
    return null;
  }
  if (!pwd) {
    // console.error("pwd is null or undefined");
    return null;
  }
  if (!file_path) {
    return null;
  }
  const client = createClient(url, {
    username: user,
    password: pwd
  });
  return client;
}

// 获取目录内容
// const directoryItems = await client.getDirectoryContents("/");
// console.log(directoryItems);


// 测试连接
const testConnection = async (client) => {
  if (!client) {
    // console.log("client is null or undefined");
    return false;
  }
  return await client.exists("/");
};

// 读取数据
const readData = async (client) => {
  if (!client) {
    // console.log("client is null or undefined");
    return default_data;
  }
  const exist = await client.exists(file_path);
  if (exist) {
    const contents = await client.getFileContents(file_path);
    const decoder = new TextDecoder('utf-8');
    let string = decoder.decode(contents);
    if (!string) {
      string = JSON.stringify(default_data);
    }
    const json = JSON.parse(string);
    return json;
  } else { // 创建文件
    const ok = await client.putFileContents(file_path, JSON.stringify(default_data));
    if (!ok) {
      console.error("create default webdav file failed", file_path);
    }
  }
  return default_data;
}

// 新增数据
const syncData = async (client, data) => {
  if (!client) {
    console.log("client is null or undefined");
    return false;
  }
  if (!data) {
    console.log("no data to save");
    return false;
  }

  const ok = await client.putFileContents(file_path, JSON.stringify(data));
  return ok;
}

export default {
  parseConfig,
  buildClient,
  testConnection,
  readData,
  syncData
}