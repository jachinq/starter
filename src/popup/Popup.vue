<template>
  <div class="container" v-if="hasConfig && !showConfig">
    <div class="brand-title">
      Collect
      <a @click="showConfig = true"
       style="color: gray;font-size: 1rem;text-decoration: underline;cursor: pointer;">
        config
      </a>
    </div>
    <div class="inputs">
      <label>网站名称</label>
      <input type="text" placeholder="填写网站名称" v-model="collect.name" />
      <label>链接</label>
      <input type="text" placeholder="填写网站链接" v-model="collect.url"/>
      <label>描述</label>
      <textarea placeholder="填写描述" v-model="collect.description" rows="4"></textarea>
      <label>标签</label>
      <textarea placeholder="填写标签，多个标签用换行分隔" v-model="collect.tags" rows="2"></textarea>

      <button type="submit" @click="saveCollect">保存</button>
    </div>
  </div>
  <div class="container" v-else>
    <div class="brand-title">Server Config</div>
    <div class="inputs">
      <label>服务器地址</label>
      <input type="text" v-model="serverConfig.serverUrl" />
      <label>api接口</label>
      <input type="text" v-model="serverConfig.apiUrl"/>
      <label>鉴权</label>
      <textarea v-model="serverConfig.params" rows="4"></textarea>
      <button type="submit" @click="saveConfig">保存</button>
      <button type="submit" @click="showConfig = false">返回</button>
    </div>
  </div>
</template>

<script>
import helper from './help';

export default {
  name: 'Popup',
  data() {
    return {
      collect: {
        name: '',
        url: '',
        description: '',
        tags: '',
        icon: '',
      },
      serverConfig: {
        serverUrl: '',
        apiUrl: '',
        params: '',
      },
      hasConfig: false,
      showConfig: false,
    }
  },
  async created() {
    const config = helper.getServerConfig();
    if (Object.keys(config).length === 0) {
      console.log('No server config found');
    } else {
      this.hasConfig = true;
      this.serverConfig = {...config};
    }
    
    const pageInfo = await helper.getPageInfo();
    // console.log('Page Info', pageInfo);
    const { title='', url = ''} = pageInfo;

    this.collect.name = title;
    this.collect.url = url;

    // document.addEventListener('DOMContentLoaded', function() {
    var textareas = document.getElementsByTagName('textarea');
    Array.from(textareas).forEach(function(element) {
      // 设置高度为自动，以便可以获取到内容的滚动高度
      element.style.height = 'auto';
      // 根据内容设置新的高度
      element.style.height = (element.scrollHeight) + 'px';
      element.dispatchEvent(new Event('input'));
    });
  },
  methods: {
    async saveCollect() {
      const saveCollect = { ...this.collect, tags: this.collect.tags.split('\n') }
      console.log('Save clicked', saveCollect);
    },
    saveConfig() {
      const config = { ...this.serverConfig }
      console.log('Save Config', config);
      helper.saveServerConfig(config);
      this.hasConfig = true;
    }
  }
}
</script>

<style scoped>
.form-item {
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 10px;
}

input {
  caret-color: red;
}

body {
  margin: 0;
  width: 100vw;
  height: 100vh;
  background: #ecf0f3;
  display: flex;
  align-items: center;
  text-align: center;
  justify-content: center;
  place-items: center;
  overflow: hidden;
  font-family: poppins;
}

.container {
  position: relative;
  max-width: 380px;
  /* height: 500px; */
  border-radius: 20px;
  padding: 40px;
  box-sizing: border-box;
  background: #ecf0f3;
  box-shadow: 14px 14px 20px #cbced1, -14px -14px 20px white;
  scroll-behavior: smooth;
  scrollbar-gutter: stable; /* 防止滚动条抖动 */
}

.brand-title {
  font-weight: 900;
  font-size: 1.8rem;
  color: #1DA1F2;
  letter-spacing: 1px;
}

.inputs {
  text-align: left;
  margin-top: 1rem;
}

label, input, button, textarea {
  display: block;
  width: 100%;
  padding: 0;
  border: none;
  outline: none;
  box-sizing: border-box;
  font-size: 1.4rem;
}
textarea {
  max-width: 300px;
  min-width: 300px;
}

label {
  margin-bottom: 4px;
}

label:nth-of-type(2) {
  margin-top: 12px;
}

input::placeholder, textarea::placeholder {
  color: gray;
}

input, textarea {
  background: #ecf0f3;
  padding: 10px 20px 10px 20px;
  height: 50px;
  font-size: 14px;
  border-radius: 8px;
  box-shadow: inset 6px 6px 6px #cbced1, inset -6px -6px 6px white;
}
textarea {
  padding: 20px;
}

button {
  color: white;
  margin-top: 20px;
  background: #1DA1F2;
  height: 40px;
  border-radius: 20px;
  cursor: pointer;
  font-weight: 900;
  box-shadow: 6px 6px 6px #cbced1, -6px -6px 6px white;
  transition: 0.3s;
}

button:hover {
  box-shadow: none;
}
button:active {
  transform: translateY(2px);
  box-shadow: inset 22px 22px 43px #d9d9d9,
            inset -22px -22px 43px #ffffff;
}

</style>
