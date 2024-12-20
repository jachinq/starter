// 数据结构定义
export const CategoryType = {
    ICON: "icon",
    CARD: "card"
};

export class SearchType {
    constructor(name, url, iconType, icon) {
        this.name = name;
        this.url = url;
        this.iconType  = iconType ? iconType : 1;
        this.icon = icon ? icon : '';
    }
}

export class Category {
    constructor(category, type) {
        this.category = category;
        this.type = type;
    }

}

export class Icon {
    constructor(category, type, name, url, icon, iconType) {
        this.name = name;
        this.url = url;
        this.icon = icon;
        this.iconType = iconType;
        this.category = category;
        this.type = type;
    }
}

export class Card {
    constructor(category, type, name, list) {
        this.category = category;
        this.type = type;
        this.name = name;
        this.list = list;
    }
}

export class History {
    constructor(text, sort) {
        this.text = text;
        this.sort = sort;
    }
}

export class Backup {
    constructor(name, date, content) {
        this.name = name;
        this.date = date;
        this.content = content;
    }
}
