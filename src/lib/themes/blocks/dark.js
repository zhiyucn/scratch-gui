import {hex2hsv, hsv2hex} from '../../tw-color-utils';

const blockColors = {
    // 现代化的运动块颜色 - 使用更深的蓝色调
    motion: {
        primary: '#0d1a2e',
        secondary: '#2a2a2a',
        tertiary: '#4C97FF',
        quaternary: '#4C97FF'
    },
    // 现代化的外观块颜色 - 使用更深的紫色调
    looks: {
        primary: '#1a1233',
        secondary: '#2a2a2a',
        tertiary: '#9966FF',
        quaternary: '#9966FF'
    },
    // 现代化的声音块颜色 - 使用更深的粉色调
    sounds: {
        primary: '#241224',
        secondary: '#2a2a2a',
        tertiary: '#CF63CF',
        quaternary: '#CF63CF'
    },
    // 现代化的控制块颜色 - 使用更深的橙色调
    control: {
        primary: '#2a1e05',
        secondary: '#2a2a2a',
        tertiary: '#FFAB19',
        quaternary: '#FFAB19'
    },
    // 现代化的事件块颜色 - 使用更深的黄色调
    event: {
        primary: '#2d2200',
        secondary: '#2a2a2a',
        tertiary: '#FFBF00',
        quaternary: '#FFBF00'
    },
    // 现代化的侦测块颜色 - 使用更深的青色调
    sensing: {
        primary: '#0f1f26',
        secondary: '#2a2a2a',
        tertiary: '#5CB1D6',
        quaternary: '#5CB1D6'
    },
    // 现代化的画笔块颜色 - 使用更深的绿色调
    pen: {
        primary: '#022017',
        secondary: '#2a2a2a',
        tertiary: '#0fBD8C',
        quaternary: '#0fBD8C'
    },
    // 现代化的运算块颜色 - 使用更深的绿色调
    operators: {
        primary: '#0d1f0d',
        secondary: '#2a2a2a',
        tertiary: '#59C059',
        quaternary: '#59C059'
    },
    // 现代化的数据块颜色 - 使用更深的橙色调
    data: {
        primary: '#2a1604',
        secondary: '#2a2a2a',
        tertiary: '#FF8C1A',
        quaternary: '#FF8C1A'
    },
    // 现代化的列表块颜色 - 使用更深的红橙色调
    data_lists: {
        primary: '#2a1004',
        secondary: '#2a2a2a',
        tertiary: '#FF661A',
        quaternary: '#FF661A'
    },
    // 现代化的更多块颜色 - 使用更深的粉色调
    more: {
        primary: '#2a0f15',
        secondary: '#2a2a2a',
        tertiary: '#FF6680',
        quaternary: '#FF6680'
    },
    // 现代化的插件块颜色 - 使用更深的青色调
    addons: {
        primary: '#082522',
        secondary: '#2a2a2a',
        tertiary: '#34e4d0',
        quaternary: '#34e4d0'
    },
    // 更现代的文本颜色 - 提高可读性
    text: 'rgba(255, 255, 255, 0.85)',
    textFieldText: '#f0f0f0',
    textField: '#2a2a2a',
    menuHover: 'rgba(255, 255, 255, 0.2)'
};

const extensions = {};

const customExtensionColors = {
    // 现代化的自定义扩展颜色处理 - 更智能的暗色调算法
    primary: primary => {
        const hsv = hex2hsv(primary);
        // 在暗色主题中，我们减少亮度但保持饱和度
        hsv[2] = Math.max(hsv[2] - 60, 15);
        hsv[1] = Math.min(hsv[1] + 10, 100); // 稍微增加饱和度
        return hsv2hex(hsv);
    },
    secondary: () => '#2a2a2a',
    tertiary: primary => primary,
    quaternary: primary => primary,
    categoryIconBackground: primary => customExtensionColors.primary(primary),
    categoryIconBorder: primary => customExtensionColors.tertiary(primary)
};

export {
    blockColors,
    extensions,
    customExtensionColors
};
