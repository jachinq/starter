// 事件总线定义

export default {

    MouseScroll: "eventMouseScroll",    // 鼠标滚动
    MouseLeftClick: "eventMouseLeftClick", // 鼠标左键单击
    MouseRightClick: "eventRightClick", // 鼠标右键单击

    RefreshApp: "eventRefreshApp", // 刷新App数据
    RefreshCategory: "eventAddCategory", // 刷新分类
    RefreshSearchType: "eventAddSearchType", // 刷新搜索
    RefreshClockFormat: "eventRefreshClockFormat", // 刷新时间日期格式
    RefreshSearchSetting: "eventRefreshSearchSetting", // 刷新搜索历史和搜索建议
    RefreshSetting: "eventRefreshSetting", // 刷新设置数据

    ActiveNav: "eventActiveNav", // 激活导航
    ActiveCategory: "eventActiveCategory", // 激活导航

    OpenDrawSearchType: "eventOpenDrawSearchType", // 打开 SearchType 编辑
    OpenDrawIcon: "eventOpenDrawIcon", // 打开 Icon 编辑
    OpenDrawCard: "eventOpenDrawCard", // 打开 Card 编辑
    OpenDrawCategory: "eventOpenDrawCategory", // 打开 Category 编辑
    OpenDrawCollect: "eventOpenDrawCollect", // 打开设置
    OpenDrawSetting: "eventOpenDrawSetting", // 打开设置
    OpenBackground: "eventOpenBackground", // 打开壁纸

    CloseMenu: "eventCloseMenu", // 关闭菜单
    ClickClock: "eventClickClock", // 点击时钟
    PasteSearchText: "eventPasteSearchText", // 粘贴搜索文本

    RecordEditItem: "eventRecordEditItem", // 记录操作的组件,
    MenuEditApp: "eventMenuEditApp", // 菜单右键编辑应用
    MenuEditCategory: "eventMenuEditCategory", // 菜单右键编辑分类
    MenuEditEngine: "eventMenuEditEngine", // 菜单右键编辑搜索引擎
}
