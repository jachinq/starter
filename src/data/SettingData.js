const timeFormatList = [
    'hh:mm:ss',
    'hh:mm',
    'mm:ss',
    // 'hh',
    // 'mm',
    // 'ss',
];

const dateFormatAllList = [
    'yyyy-MM-dd',
    'MM-dd-yyyy',
    'dd-MM-yyyy',
    'yyyy-MM',
    'MM-dd',
    'dd-MM',

    'yyyy/MM/dd',
    'MM/dd/yyyy',
    'dd/MM/yyyy',
    'yyyy/MM',
    'MM/dd',
    'dd/MM',

    'yyyy年MM月dd日',
    'MM月dd日yyyy年',
    'dd日MM月yyyy',
    'yyyy年MM月',
    'MM月dd日',
    'dd日MM月',

    'yyyy-MM-dd EEE',
    'MM-dd-yyyy EEE',
    'dd-MM-yyyy EEE',
    'yyyy-MM EEE',
    'MM-dd EEE',
    'dd-MM EEE',

    'yyyy/MM/dd EEE',
    'MM/dd/yyyy EEE',
    'dd/MM/yyyy EEE',
    'yyyy/MM EEE',
    'MM/dd EEE',
    'dd/MM EEE',

    'yyyy年MM月dd日 EEE',
    'MM月dd日yyyy年 EEE',
    'dd日MM月yyyy EEE',
    'yyyy年MM月 EEE',
    'MM月dd日 EEE',
    'dd日MM月 EEE',

    'yyyy-MM-dd EE',
    'MM-dd-yyyy EE',
    'dd-MM-yyyy EE',
    'yyyy-MM EE',
    'MM-dd EE',
    'dd-MM EE',

    'yyyy/MM/dd EE',
    'MM/dd/yyyy EE',
    'dd/MM/yyyy EE',
    'yyyy/MM EE',
    'MM/dd EE',
    'dd/MM EE',

    'yyyy年MM月dd日 EE',
    'MM月dd日yyyy年 EE',
    'dd日MM月yyyy EE',
    'yyyy年MM月 EE',
    'MM月dd日 EE',
    'dd日MM月 EE',

    'EEE yyyy-MM-dd',
    'EEE MM-dd-yyyy',
    'EEE dd-MM-yyyy',
    'EEE yyyy-MM',
    'EEE MM-dd',
    'EEE dd-MM',

    'EEE yyyy/MM/dd',
    'EEE MM/dd/yyyy',
    'EEE dd/MM/yyyy',
    'EEE yyyy/MM',
    'EEE MM/dd',
    'EEE dd/MM',

    'EEE yyyy年MM月dd日',
    'EEE MM月dd日yyyy年',
    'EEE dd日MM月yyyy',
    'EEE yyyy年MM月',
    'EEE MM月dd日',
    'EEE dd日MM月',

    'EE yyyy-MM-dd',
    'EE MM-dd-yyyy',
    'EE dd-MM-yyyy',
    'EE yyyy-MM',
    'EE MM-dd',
    'EE dd-MM',

    'EE yyyy/MM/dd',
    'EE MM/dd/yyyy',
    'EE dd/MM/yyyy',
    'EE yyyy/MM',
    'EE MM/dd',
    'EE dd/MM',

    'EE yyyy年MM月dd日',
    'EE MM月dd日yyyy年',
    'EE dd日MM月yyyy',
    'EE yyyy年MM月',
    'EE MM月dd日',
    'EE dd日MM月',
];

const dateFormatWeekList = [
    {label: "不显示周/星期几", value: ""},
    {label: "显示在前 周几", value: "EE "},
    {label: "显示在前 星期几", value: "EEE "},
    {label: "显示在后 周几", value: " EE"},
    {label: "显示在后 星期几", value: " EEE"},
];

const dateFormatCascaderList = [
    {
        label: "年月日",
        value: "年月日",
        children: [
            {label: 'yyyy-MM-dd', value: 'yyyy-MM-dd', children: dateFormatWeekList},
            {label: 'MM-dd-yyyy', value: 'MM-dd-yyyy', children: dateFormatWeekList},
            {label: 'dd-MM-yyyy', value: 'dd-MM-yyyy', children: dateFormatWeekList},
            {label: 'yyyy/MM/dd', value: 'yyyy/MM/dd', children: dateFormatWeekList},
            {label: 'MM/dd/yyyy', value: 'MM/dd/yyyy', children: dateFormatWeekList},
            {label: 'dd/MM/yyyy', value: 'dd/MM/yyyy', children: dateFormatWeekList},
            {label: 'yyyy年MM月dd日', value: 'yyyy年MM月dd日', children: dateFormatWeekList},
            {label: 'MM月dd日yyyy年', value: 'MM月dd日yyyy年', children: dateFormatWeekList},
            {label: 'dd日MM月yyyy', value: 'dd日MM月yyyy', children: dateFormatWeekList},
        ],
    },
    {
        label: "月日",
        value: "月日",
        children: [
            {label: 'MM-dd', value: 'MM-dd', children: dateFormatWeekList},
            {label: 'dd-MM', value: 'dd-MM', children: dateFormatWeekList},
            {label: 'MM/dd', value: 'MM/dd', children: dateFormatWeekList},
            {label: 'dd/MM', value: 'dd/MM', children: dateFormatWeekList},
            {label: 'MM月dd日', value: 'MM月dd日', children: dateFormatWeekList},
            {label: 'dd日MM月', value: 'dd日MM月', children: dateFormatWeekList},
        ]
    },
    {
        label: "年月",
        value: "年月",
        children: [
            {label: 'yyyy-MM', value: 'yyyy-MM', children: dateFormatWeekList},
            {label: 'yyyy/MM', value: 'yyyy/MM', children: dateFormatWeekList},
            {label: 'yyyy年MM月', value: 'yyyy年MM月', children: dateFormatWeekList},
        ]
    },
];

const dateFormatConnectorList = [
    {label: '/', value: '/'},
    {label: '-', value: '-'},
    {label: '_', value: '_'},
    {label: ',', value: ','},
    {label: '空格', value: ' '},
    {label: '中文', value: '中文'},
    {label: '无', value: ''},

];


export default {
    timeFormatList,
    // dateFormatList,
    // dateFormatConnectorList,
    dateFormatWeekList,
    dateFormatCascaderList,
}
