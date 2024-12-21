<template>
  <el-drawer title="设置" :visible.sync="showCollect" size="100%" :wrapper-closable="false" :with-header="false"
    direction="ttb">
    <div class="collect-header">
      <div class="btn-group">
        <el-button type="text" @click="showCollect = false" style="padding: 0;">关闭</el-button>
        <div class="collect-sync" title="从云端拉取收藏夹" @click="syncData">
          <i class="el-icon-cloudy"></i>
        </div>
      </div>
      <template v-if="serverData.collectList.length > 0">
        <cus-input style="width: 100%;" placeholder="搜索" v-model="filterText" @input="filterColletList"></cus-input>
        <el-pagination background :current-page.sync="pageInfo.currentPage" :page-size="pageInfo.pageSize"
          :total="pageInfo.total" layout="total, sizes, prev, pager, next, jumper" :page-sizes="[8, 16, 24, 48]"
          @current-change="pageChange" @size-change="sizeChange">
        </el-pagination>
      </template>
    </div>
    <div class="collect-container">
      <div v-if="webdavClient || collectList.length > 0" class="collect-list">
        <template v-if="loading">
          <i class="el-icon-loading"></i>
        </template>
        <template v-else v-for="(item, _index) in collectList">
          <div class="box-card" >
            <div class="card-header" :title="item.name">
              <div @click="openUrl(item)">
                <el-avatar :size="24" :src="getFavicon(item.url)" class="favicon">
                  {{ item.name && item.name.slice(0, 1) }}
                </el-avatar>
              </div>
              <span class="card-title">{{ item.name }}</span>
            </div>
            <div class="card-content">
              <p>{{ item.description || '暂无描述' }}</p>
              <!-- <p>{{ item.description || '暂无描述' }}</p> -->
            </div>
            <div class="card-footer" v-if="item.tags && item.tags.length > 0">
              <div class="tag" v-for="(tag, index) in item.tags" :key="index"
                :style="{ backgroundColor: getTagColor(tag).bgColor, color: getTagColor(tag).fgColor }">{{ tag }}</div>
            </div>
          </div>
        </template>
      </div>
      <template v-else>
        <div>请先在 popup 中配置 WebDAV 服务器</div>
      </template>
    </div>
  </el-drawer>
</template>

<script>
import EventBus from '../data/EventBus';
import help from './help';
import webdavutil from './webdavutil';
import CusInput from "../components/formItem/cus-input";

export default {
  name: 'Collect',
  components: {
    CusInput
  },
  data() {
    return {
      loading: false,
      showCollect: false,
      webdavClient: null,
      serverData: {
        collectList: []
      },
      tagColorMap: {},
      collectList: [],
      pageInfo: {
        currentPage: 1,
        pageSize: 24,
        total: 0
      },
      filterText: ''
    }
  },
  created() {
    const that = this;
    let lastKeyPressTime = 0;
    const doubleClickThreshold = 300; // 双击的阈值时间，单位为毫秒
    document.addEventListener('keydown', function (event) {
      if (event.key === 'c' || event.key === 'C') {
        const currentTime = new Date().getTime();
        if (currentTime - lastKeyPressTime < doubleClickThreshold) {
          // console.log('你按了两次Ctrl键');
          that.openCollect();
        }
        lastKeyPressTime = currentTime;
      }
    });
  },
  mounted() {
    const that = this;
    this.$bus.$on(EventBus.OpenDrawCollect, () => {
      this.openCollect();
    });

    setTimeout(() => {
      const collectData = localStorage.getItem('collectData');
      if (collectData) {
        that.serverData = JSON.parse(collectData);
        that.collectList = that.serverData.collectList || [];
        that.pageInfo.total = that.collectList.length;
        that.pageInfo.currentPage = 1;
      } else {
        that.webdavClient = webdavutil.buildClient();
        that.syncData();
      }

    }, 3000);
  },
  methods: {
    openCollect() {
      this.showCollect = true;
    },
    syncData() {
      if (!this.webdavClient) {
        this.webdavClient = webdavutil.buildClient();
      }
      const that = this;
      that.loading = true;
      webdavutil.readData(that.webdavClient).then(data => {
        console.log('收藏夹', data);
        localStorage.setItem('collectData', JSON.stringify(data));
        that.$nextTick(() => {
          that.serverData = data;
          that.loading = false;
          that.collectList = that.serverData.collectList || [];
          that.pageInfo.total = that.collectList.length;
          that.pageInfo.currentPage = 1;
        });
      });
    },
    getFavicon(url) {
      let faviconUrl = help.removeUrlPath(url);
      if (faviconUrl && faviconUrl !== '') {
        return faviconUrl + '/favicon.ico';
      }
      return 'https://www.google.com/s2/favicons?domain=' + url;
    },
    openUrl(item) {
      if (item && item.url) {
        window.open(item.url, '_blank');
      }
    },
    getTagColor(tag) {
      if (this.tagColorMap[tag]) {
        return this.tagColorMap[tag];
      }
      this.tagColorMap[tag] = help.generateColors();;
      return this.tagColorMap[tag];
    },
    pageChange(currentPage) {
      this.pageInfo.currentPage = currentPage;
      this.collectList = this.serverData.collectList.slice((currentPage - 1) * this.pageInfo.pageSize, currentPage * this.pageInfo.pageSize);
    },
    sizeChange(size) {
      this.pageInfo.pageSize = size;
      this.pageChange(1);
    },
    filterColletList() {
      const that = this;
      let filterText = '';
      if (that.filterText && that.filterText.trim() !== '') {
        filterText = that.filterText.trim().toLowerCase();
      }
      if (filterText === '') {
        that.collectList = that.serverData.collectList;
        that.pageInfo.total = that.collectList.length;
        that.pageInfo.currentPage = 1;
      } else {
        that.collectList = that.serverData.collectList.filter(item => {
          return (item.name && item.name.toLowerCase().includes(filterText)) ||
            (item.description && item.description.toLowerCase().includes(filterText)) ||
            (item.tags && item.tags.some(tag => tag.toLowerCase().includes(filterText))) ||
            (item.url && item.url.toLowerCase().includes(filterText))
            ;
        });
        that.pageInfo.total = that.collectList.length;
        that.pageInfo.currentPage = 1;
      }
    }
  }
}
</script>

<style scoped>
.btn-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.collect-sync {
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  width: 2rem;
  height: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.collect-sync:hover {
  background-color: #5a5a5a;
}

.collect-header {
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.collect-container {
  padding: 0 1rem;
  margin-bottom: 1rem;
}

.collect-list {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
}

.box-card {
  width: 16rem;
  background-color: #282828;
  border-radius: 1rem;
}

.card-header {
  display: flex;
  align-items: center;
  padding: 1rem;
  gap: 0.5rem;
  font-weight: 600;
  font-size: 1.5rem;
  border-bottom: #5a5a5a solid 1px;
}

.favicon {
  cursor: pointer;
}

.card-title {
  /* color: #fff; */
  /* 文字部分超出宽度隐藏 */
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.card-content {
  padding: 0 1rem;
  min-height: 100px;
  max-height: 100px;
  overflow: scroll;
}

.card-footer {
  display: flex;
  /* justify-content: flex-end; */
  padding: 1rem;
  gap: 0.5rem;
}

.tag {
  display: inline-block;
  padding: 0.2rem 0.5rem;
  border-radius: 0.5rem;
  font-size: 0.8rem;
}
</style>