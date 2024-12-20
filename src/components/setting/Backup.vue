<template>
    <div>
        <!--<div class="title-box">-->
        <!--<span class="title">重置</span>-->
        <!--</div>-->
        <div class="data-set-item-box">
            <div class="title">重置</div>
            <div class="content">
                <el-popconfirm confirm-button-text='好的' cancel-button-text='不用了' confirm-button-type="danger"
                    icon="el-icon-info" icon-color="red" title="确定删除吗？" @confirm="resetData">
                    <span slot="reference" class="text-button danger" title="重置全部数据为初始数据">重置数据</span>
                </el-popconfirm>

                <el-popconfirm confirm-button-text='好的' cancel-button-text='不用了' confirm-button-type="danger"
                    icon="el-icon-info" icon-color="red" title="确定删除吗？" @confirm="resetStyle">
                    <span slot="reference" class="text-button danger" title="重置样式设置为初始状态">重置样式</span>
                </el-popconfirm>
            </div>
        </div>

        <div class="data-set-item-box">
            <div class="title">备份</div>
            <div class="content">
                <span class="text-button" title="备份至备份记录中" @click="localBackup">本地备份</span>
                <el-upload style="display: inline-block" class="upload-demo" action="alert" :limit="3"
                    :show-file-list="false" :on-change="importBackup">
                    <span class="text-button" title="从外部文件恢复数据">导入备份</span>
                </el-upload>
                <span class="text-button" title="导出当前数据备份到本地电脑" @click="exportBackup(null)">导出备份</span>

                <div class="backup-item" v-for="(item, index) in backupList" :key="index">
                    <span style="font-size: 14px;color: gray;margin-right: 10px">
                        {{ item.name }} ({{ item.date }})
                    </span>
                    <el-popconfirm confirm-button-text='好的' cancel-button-text='不用了' confirm-button-type="danger"
                        icon="el-icon-info" icon-color="red" title="确定删除吗？" @confirm="deleteBackup(item)">
                        <span slot="reference" class="text-button danger">删除</span>
                    </el-popconfirm>

                

                    <el-popconfirm confirm-button-text='好的' cancel-button-text='不用了' confirm-button-type="danger"
                        icon="el-icon-info" title="确定恢复吗？该操作将覆盖当前数据。" @confirm="resumeBackupData(item)">
                        <span slot="reference" class="text-button">恢复</span>
                    </el-popconfirm>
                    <span class="text-button" @click="exportBackup(item)">导出</span>
                </div>
            </div>
        </div>


        <div class="data-set-item-box">
            <div class="title">远程</div>
            <div class="content">
                <el-popconfirm confirm-button-text='好的' cancel-button-text='不用了' confirm-button-type="danger"
                    icon="el-icon-info" icon-color="red" title="确定操作？将会把本地数据同步至云端" @confirm="syncToRemote">
                    <span slot="reference" class="text-button">同步数据至云端</span>
                </el-popconfirm>

                <el-popconfirm confirm-button-text='好的' cancel-button-text='不用了' confirm-button-type="danger"
                    icon="el-icon-info" icon-color="red" title="确定操作？将从云端拉取数据覆盖本地数据" @confirm="restoreFromRemote">
                    <span slot="reference" class="text-button danger" title="重置样式设置为初始状态">从云端拉取数据</span>
                </el-popconfirm>
            </div>
        </div>

        <p>
            <span>配置远程备份地址</span>
        </p>

        <div class="data-set-item-box">
            <div class="title">Url</div>
            <div class="content">
                <cus-input v-model="setting.webdavUrl" placeholder="填写 webdav 备份地址"></cus-input>
            </div>
        </div>
        <div class="data-set-item-box">
            <div class="title">User</div>
            <div class="content">
                <cus-input v-model="setting.webdavUser" placeholder="填写 webdav 用户名"></cus-input>
            </div>
        </div>
        <div class="data-set-item-box">
            <div class="title">User</div>
            <div class="content">
                <cus-input v-model="setting.webdavPwd" placeholder="填写 webdav 用户密码"></cus-input>
            </div>
        </div>
        <div class="data-set-item-box">
            <span class="text-button" title="备份至备份记录中" @click="testWebdavConnect">测试连接</span>
        </div>

    </div>
</template>

<script>
import { createClient } from "webdav/dist/web/index";

import DefaultData from "../../data/DefaultData";
import Util from "../../utils/Util";
import IndexedDb from "../../utils/IndexedDb";
import CusInput from "../formItem/cus-input"

export default {
    name: "Backup",
    data() {
        return {
            backupList: [],
            // dataForm: {},
            setting: {},
        }
    },
    created() {
        this.getBackupList();
        this.getSetting();
    },
    components: {
        CusInput,
    },
    methods: {
        // 从数据库加载本地备份数据
        async getBackupList() {
            let result = await IndexedDb.getBackup().catch(e => { console.log(e) });
            if (result && result.success) {
                this.backupList = result.data.reverse();
            }
        },
        async getSetting() {
            let result = await IndexedDb.getSetting().catch(e => { console.log(e) });
            if (result && result.success && result.data && result.data.length > 0) {
                this.setting = result.data[0];
            }
        },

        // 本地备份
        async localBackup() {
            let backupData = await this.packageBackup().catch(e => { console.log(e) });
            // console.log(backupData);
            this.addBackupData(backupData);
        },
        async addBackupData(backupData) {
            console.log(backupData);

            let result = await IndexedDb.addBackup(backupData).catch(e => { console.log(e) });
            if (result && result.success) {
                this.getBackupList();
            } else {
                console.log(result);
            }
        },

        // 数据交互：删除备份记录
        deleteBackup(item) {
            let that = this;

            IndexedDb.delBackup(item).then(result => {
                if (result && !result.success) {
                    this.$message({ type: 'error', message: '删除备份失败' });
                } else {
                    that.getBackupList();
                }
            }).catch(e => { console.log(e) })
        },

        // 数据交互：重置数据
        async resetData() {
            console.log("resetData");
            let result = await IndexedDb.deleteDatabase(IndexedDb.DATABASE.STARTER).catch(e => { console.log(e) });
            if (result && !result.success) {
                this.$message({ type: 'error', message: '重置失败，请重试' });
                return;
            }
            IndexedDb.getSearchType().catch();

            for (let item of DefaultData.SEARCH_TYPE) {
                if (item) await IndexedDb.addSearchType(item).then().catch(e => { console.log(e) });
            }
            for (let item of DefaultData.CATEGORY) {
                if (item) await IndexedDb.addCategory(item).then().catch(e => { console.log(e) });
            }
            for (let item of DefaultData.APPLICATION) {
                if (item) await IndexedDb.addApplication(item).then().catch(e => { console.log(e) });
            }
            location.reload();
        },
        // 数据交互：重置样式
        async resetStyle() {
            console.log("resetStyle");
            let result = await IndexedDb.deleteDatabase(IndexedDb.DATABASE.SETTING).catch(e => { console.log(e) });
            if (result && !result.success) {
                this.$message({ type: 'error', message: '重置失败，请重试' });
                return;
            }
            IndexedDb.getSetting().catch();

            for (let item of DefaultData.SETTING) {
                if (item) await IndexedDb.addSetting(item).then().catch(e => { console.log(e) });
            }
            location.reload();
        },


        // 导入备份
        importBackup(file, fileList) {
            if (fileList && fileList.length > 0) {
                let file = fileList[0]; // 解析上传的文件
                let reader = new FileReader();
                // abort none 中断读取
                // readAsBinaryString file 将文件读取为二进制码，通常我们将它传送到后端，后端可以通过这段字符串存储文件
                // readAsDataURL file 将文件读取为 DataURL，一段以 data: 开头的字符串，这段字符串的实质就是 Data URL，Data URL是一种将小文件直接嵌入文档的方案。这里的小文件通常是指图像与 html 等格式的文件
                // readAsText file, [encoding] 将文件读取为文本，读取的结果即是这个文本文件中的内容
                reader.readAsText(file.raw);
                // onabort 中断时触发
                // onerror 出错时触发
                // onload 文件读取成功完成时触发
                // onloadend 读取完成触发，无论成功或失败
                // onloadstart 读取开始时触发
                // onprogress 读取中
                reader.onload = (e) => {
                    // 读取文件内容
                    const fileString = e.target.result;
                    // 接下来可对文件内容进行处理
                    try {
                        let backupData = JSON.parse(fileString);
                        this.addBackupData(backupData);
                    } catch (e) {
                        console.log(e);
                        this.$message({ type: 'error', message: '导入数据格式有误' });
                    }
                }
            }
        },
        // 导出备份
        async exportBackup(item) {
            let backupData = item || await this.packageBackup('备份').catch(e => { console.log(e) });
            Util.downloadText('备份', JSON.stringify(backupData));
        },

        // 恢复备份
        async resumeBackupData(backupData) {
            if (!backupData) {
                this.$message({ type: 'error', message: '数据格式有误，数据恢复取消' });
                return;
            }

            if (!backupData.content) {
                this.$message({ type: 'error', message: '数据格式有误，数据恢复取消' });
                return;
            }

            console.log(DefaultData.BACKUP);

            await IndexedDb.deleteDatabase(IndexedDb.DATABASE.STARTER).catch(e => { console.log(e) });
            console.log("del starter end");
            await IndexedDb.deleteDatabase(IndexedDb.DATABASE.SETTING).catch(e => { console.log(e) });
            console.log("del setting end");
            try {
                IndexedDb.getSetting().catch();
                IndexedDb.getSearchType().catch();
            } catch (ignore) { }

            let a = true;
            for (let item of backupData.content) {
                if (!item) {
                    continue;
                }
                let dataList = item.data;
                if (!dataList) {
                    continue;
                }

                let database = item.database;
                let table = item.table;
                // await IndexedDb.getData(database, table).catch(e=>{console.log(e)});

                for (let data of dataList) {
                    if (!data) {
                        continue
                    }
                    // await this.sleep(1).catch(e=>{console.log(e)});

                    try {
                        let result = await IndexedDb.addData(database, table, data).catch(e => { console.log(e) });
                        console.log(database, table, "add ok", result);
                    } catch (e) {
                        console.log(e);
                    }

                    // console.log(data);
                }
            }

            console.log('end', a);
            location.reload();
        },

        // 从当前最新的数据中，组装成备份的数据
        async packageBackup(name, date) {
            let backupData = {
                name: name || '本地备份',
                date: date || new Date().format("yyyy-MM-dd hh:mm:ss"),
                content: []
            };
            let result;

            result = await IndexedDb.getSearchType().catch(e => { console.log(e) });
            if (result && result.success) {
                backupData.content.push({
                    database: IndexedDb.DATABASE.STARTER,
                    table: IndexedDb.STARTER_TABLE_NAME.SEARCH_TYPE,
                    data: result.data
                })
            }
            result = await IndexedDb.getCategory().catch(e => { console.log(e) });
            if (result && result.success) {
                backupData.content.push({
                    database: IndexedDb.DATABASE.STARTER,
                    table: IndexedDb.STARTER_TABLE_NAME.CATEGORY,
                    data: result.data
                })
            }
            result = await IndexedDb.getApplication().catch(e => { console.log(e) });
            if (result && result.success) {
                backupData.content.push({
                    database: IndexedDb.DATABASE.STARTER,
                    table: IndexedDb.STARTER_TABLE_NAME.APPLICATION,
                    data: result.data
                })
            }
            result = await IndexedDb.getSetting().catch(e => { console.log(e) });
            if (result && result.success) {
                backupData.content.push({
                    database: IndexedDb.DATABASE.SETTING,
                    table: IndexedDb.SETTING_TABLE_NAME.SETTING,
                    data: result.data
                })
            }

            return backupData;
        },

        async getWebdavClient() {
            let { webdavUrl = "", webdavUser = "", webdavPwd = "" } = this.setting;
            let message = { title: '参数错误', message: '', type: 'warning', position: 'top-left' };
            if (webdavPwd === null || webdavPwd === "") {
                message.message = "请填写密码";
            }
            if (webdavUser === null || webdavUser === "") {
                message.message = "请填写用户名";
            }
            if (webdavUrl === null || webdavUrl === "") {
                message.message = "请填写URL";
            }
            if (message && message.message != "") {
                this.$notify(message);
                return null;
            }
            const client = createClient(webdavUrl, {
                username: webdavUser,
                password: webdavPwd
            });
            return client;
        },

        // 测试 webdav 连接
        async testWebdavConnect() {
            const client = await this.getWebdavClient();
            if (client == null) {
                return;
            }

            let success = false;
            let connect = { title: '失败', message: '连接失败', type: 'error', position: 'top-left' };
            try {
                let exist = await client.exists("/");
                if (exist) {
                    connect = { title: '成功', message: '连接成功', type: 'success', position: 'top-left' };
                    success = true;
                }
            } catch (e) { }
            this.$notify(connect);

            // 连接成功，则保存设置的连接数据
            if (success) {
                // console.log(this.setting);
                await IndexedDb.setSetting(this.setting).catch(e => { console.log(e) });
            }

        },

        async syncToRemote() {
            const client = await this.getWebdavClient();
            if (client == null) {
                return;
            }

            let file_path = "/starter/latest.json";
            let backupData = await this.packageBackup().catch(e => { console.log(e) });
            let sync = { title: '提示', message: '同步失败', type: 'error', position: 'top-left' };
            let ok = await client.putFileContents(file_path, JSON.stringify(backupData));
            if (ok) {
                sync.message = "同步成功";
                sync.type = "success";
            }
            this.$notify(sync);
        },

        async restoreFromRemote() {
            const client = await this.getWebdavClient();
            if (client == null) {
                return;
            }
            let file_path = "/starter/latest.json";
            let exist = await client.exists(file_path);
            let jsonString = null;
            if (exist) {
                let arrayBuffer = await client.getFileContents(file_path);
                console.log(arrayBuffer);

                // 将 ArrayBuffer 对象转为 Uint8Array 对象
                const uint8Array = new Uint8Array(arrayBuffer);

                // 使用 TextDecoder 对象将 Uint8Array 数组转换为字符串
                const textDecoder = new TextDecoder('utf-8');
                jsonString = textDecoder.decode(uint8Array);
                // 将 Uint8Array 对象转为字符串
                // jsonString = String.fromCharCode.apply(null, uint8Array);
            } else {
                this.$notify({ title: '提示', message: '从云端拉取数据失败，原因：没有远程数据', type: 'error', position: 'top-left' });
                return
            }

            let dataError = { title: '提示', message: '从云端拉取数据失败，原因：远程数据有误', type: 'error', position: 'top-left' };
            if (jsonString == null) {
                this.$notify(dataError);
                return
            }

            let backupData = null;
            try {
                backupData = JSON.parse(jsonString)
            } catch (e) {
                console.log(e);
                this.$notify(dataError);
                return
            }

            console.log(backupData);

            this.resumeBackupData(backupData);
        },
    }
}
</script>

<style scoped>
.data-set-item-box {
    background-color: var(--bg-mask);
    padding: 10px;
    margin-bottom: 10px;
    /*border-radius: 0 5px 5px 5px;*/
    border-radius: 5px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    /*flex-flow: column;*/
    /*flex-shrink: initial;*/
    /*flex-grow: 100px 1fr;*/
}

.title-box {
    display: flex;
}

.title {
    /*padding: 6px 25px 6px 25px;*/
    padding: 6px;
    /*background-color: var(--bg-mask);*/
    width: 80px;
    user-select: none;
    /*box-sizing: border-box;*/
    border-radius: 5px 5px 0 0;
    /*font-weight: 500;*/
    /*border-bottom: 1px solid var(--bg-white-mask);*/
}

/* .content {} */

.backup-item {
    padding: 5px 0;
}

.text-button {
    padding: 0 3px;
}

.text-button.danger {
    color: #ff383a;
}

.text-button:hover {
    /*color: var(--bg-white-mask)*/
    opacity: 0.8;
    /*filter: brightness(100%);*/
}
</style>
