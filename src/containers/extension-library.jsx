import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import VM from 'scratch-vm';
import {defineMessages, injectIntl, intlShape} from 'react-intl';
import log from '../lib/log';

import extensionLibraryContent, {
    galleryError,
    galleryLoading,
    galleryMore
} from '../lib/libraries/extensions/index.jsx';
import extensionTags from '../lib/libraries/tw-extension-tags';

import LibraryComponent from '../components/library/library.jsx';
import extensionIcon from '../components/action-menu/icon--sprite.svg';

const messages = defineMessages({
    extensionTitle: {
        defaultMessage: 'Choose an Extension',
        description: 'Heading for the extension library',
        id: 'gui.extensionLibrary.chooseAnExtension'
    },
    cwExtensionHeader: {
        defaultMessage: 'Scratch Creative World Extensions',
        description: 'Header for Scratch Creative World extensions section',
        id: 'gui.extensionLibrary.cwExtensionHeader'
    },
    cwExtensionDescription: {
        defaultMessage: 'Extensions from Scratch Creative World',
        description: 'Description for Scratch Creative World extensions',
        id: 'gui.extensionLibrary.cwExtensionDescription'
    },
    cwExtensionLoading: {
        defaultMessage: 'Loading Creative World extensions...',
        description: 'Loading message for Creative World extensions',
        id: 'gui.extensionLibrary.cwExtensionLoading'
    },
    cwExtensionError: {
        defaultMessage: 'Failed to load, please check network connection',
        description: 'Error message when Creative World extensions fail to load',
        id: 'gui.extensionLibrary.cwExtensionError'
    }
});

const toLibraryItem = extension => {
    if (typeof extension === 'object') {
        return ({
            rawURL: extension.iconURL || extensionIcon,
            key: extension.extensionId || extension.name, // 确保每个扩展有唯一的键
            ...extension
        });
    }
    return extension;
};

const translateGalleryItem = (extension, locale) => ({
    ...extension,
    name: extension.nameTranslations[locale] || extension.name,
    description: extension.descriptionTranslations[locale] || extension.description
});

let cachedGallery = null;

const fetchLibrary = async () => {
    const res = await fetch('https://extensions.turbowarp.org/generated-metadata/extensions-v0.json');
    if (!res.ok) {
        throw new Error(`HTTP status ${res.status}`);
    }
    const data = await res.json();
    return data.extensions.map(extension => ({
        name: extension.name,
        nameTranslations: extension.nameTranslations || {},
        description: extension.description,
        descriptionTranslations: extension.descriptionTranslations || {},
        extensionId: extension.id,
        extensionURL: `https://extensions.turbowarp.org/${extension.slug}.js`,
        iconURL: `https://extensions.turbowarp.org/${extension.image || 'images/unknown.svg'}`,
        tags: ['tw'],
        credits: [
            ...(extension.original || []),
            ...(extension.by || [])
        ].map(credit => {
            if (credit.link) {
                return (
                    <a
                        href={credit.link}
                        target="_blank"
                        rel="noreferrer"
                        key={credit.name}
                    >
                        {credit.name}
                    </a>
                );
            }
            return credit.name;
        }),
        docsURI: extension.docs ? `https://extensions.turbowarp.org/${extension.slug}` : null,
        samples: extension.samples ? extension.samples.map(sample => ({
            href: `${process.env.ROOT}editor?project_url=https://extensions.turbowarp.org/samples/${encodeURIComponent(sample)}.sb3`,
            text: sample
        })) : null,
        incompatibleWithScratch: !extension.scratchCompatible,
        featured: true
    }));
};

const fetchScratchCWLibrary = async () => {
    try {
        const res = await fetch('https://extensions.scratch-cw.top/generated-metadata/extensions-v0.json');
        if (!res.ok) {
            throw new Error(`HTTP status ${res.status}`);
        }
        const data = await res.json();
        return data.extensions.map(extension => ({
            name: extension.name,
            nameTranslations: extension.nameTranslations || {},
            description: extension.description,
            descriptionTranslations: extension.descriptionTranslations || {},
            extensionId: `cw_${extension.id}`, // 添加前缀避免ID冲突
            extensionURL: `https://extensions.scratch-cw.top/${extension.slug}.js`,
            iconURL: `https://extensions.scratch-cw.top/${extension.image || 'images/unknown.svg'}`,
            tags: ['cw'], // 使用cw标签区分创世界扩展
            credits: [
                ...(extension.original || []),
                ...(extension.by || [])
            ].map(credit => {
                if (credit.link) {
                    return (
                        <a
                            href={credit.link}
                            target="_blank"
                            rel="noreferrer"
                            key={credit.name}
                        >
                            {credit.name}
                        </a>
                    );
                }
                return credit.name;
            }),
            docsURI: extension.docs ? `https://extensions.scratch-cw.top/${extension.slug}` : null,
            samples: extension.samples ? extension.samples.map(sample => ({
                href: `${process.env.ROOT}editor?project_url=https://extensions.scratch-cw.top/samples/${encodeURIComponent(sample)}.sb3`,
                text: sample
            })) : null,
            incompatibleWithScratch: !extension.scratchCompatible,
            featured: false, // 创世界扩展不作为特色扩展
            disabled: false, // 默认启用状态
            hidden: false // 默认显示状态
        }));
    } catch (error) {
        log.error('Failed to fetch Scratch CW extensions:', error);
        return []; // 如果获取失败，返回空数组，不影响主扩展库
    }
};

class ExtensionLibrary extends React.PureComponent {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleItemSelect'
        ]);
        this.state = {
            gallery: cachedGallery,
            galleryError: null,
            galleryTimedOut: false,
            cwGallery: [],
            cwGalleryError: null
        };
    }
    componentDidMount () {
        if (!this.state.gallery) {
            const timeout = setTimeout(() => {
                this.setState({
                    galleryTimedOut: true
                });
            }, 750);

            fetchLibrary()
                .then(gallery => {
                    cachedGallery = gallery;
                    this.setState({
                        gallery
                    });
                    clearTimeout(timeout);
                })
                .catch(error => {
                    log.error(error);
                    this.setState({
                        galleryError: error
                    });
                    clearTimeout(timeout);
                });
        }

        // 暂时禁用创世界扩展库加载，等待CORS配置
        // fetchScratchCWLibrary()
        //     .then(cwGallery => {
        //         this.setState({
        //             cwGallery
        //         });
        //     })
        //     .catch(error => {
        //         log.error('Failed to load Scratch CW extensions:', error);
        //         this.setState({
        //             cwGalleryError: error
        //         });
        //     });
    }
    handleItemSelect (item) {
        if (item.href) {
            return;
        }

        const extensionId = item.extensionId;

        // 跳过创世界扩展的特殊项
        if (extensionId === 'cw_header' || extensionId === 'cw_error' || extensionId === 'cw_loading') {
            return;
        }

        if (extensionId === 'custom_extension') {
            this.props.onOpenCustomExtensionModal();
            return;
        }

        if (extensionId === 'procedures_enable_return') {
            this.props.onEnableProcedureReturns();
            this.props.onCategorySelected('myBlocks');
            return;
        }

        const url = item.extensionURL ? item.extensionURL : extensionId;
        if (!item.disabled) {
            if (this.props.vm.extensionManager.isExtensionLoaded(extensionId)) {
                this.props.onCategorySelected(extensionId);
            } else {
                this.props.vm.extensionManager.loadExtensionURL(url)
                    .then(() => {
                        this.props.onCategorySelected(extensionId);
                    })
                    .catch(err => {
                        log.error(err);
                        // eslint-disable-next-line no-alert
                        alert(err);
                    });
            }
        }
    }
    render () {
        let library = null;
        if (this.state.gallery || this.state.galleryError || this.state.galleryTimedOut) {
            library = extensionLibraryContent.map(toLibraryItem);
            library.push('---');
            if (this.state.gallery) {
                library.push(toLibraryItem(galleryMore));
                const locale = this.props.intl.locale;
                library.push(
                    ...this.state.gallery
                        .map(i => translateGalleryItem(i, locale))
                        .map(toLibraryItem)
                );
            } else if (this.state.galleryError) {
                library.push(toLibraryItem(galleryError));
            } else {
                library.push(toLibraryItem(galleryLoading));
            }
        }

        // 暂时禁用创世界扩展库显示，等待CORS配置
        // 添加创世界扩展库
        // if (this.state.cwGallery && this.state.cwGallery.length > 0) {
        //     if (library) {
        //         library.push('---');
        //     } else {
        //         library = [];
        //     }
        //     // 添加创世界扩展标题项，使用与现有扩展一致的样式
        //     library.push({
        //         name: this.props.intl.formatMessage(messages.cwExtensionHeader),
        //         description: this.props.intl.formatMessage(messages.cwExtensionDescription),
        //         extensionId: 'cw_header',
        //         key: 'cw_header', // 添加唯一键
        //         disabled: true, // 作为标题项，不可点击
        //         iconURL: extensionIcon,
        //         tags: ['cw'],
        //         featured: false // 非特色扩展
        //     });
        //     library.push(...this.state.cwGallery.map(toLibraryItem));
        // } else if (this.state.cwGalleryError) {
        //     // 如果创世界扩展加载失败，显示错误信息
        //     if (library) {
        //         library.push('---');
        //     } else {
        //         library = [];
        //     }
        //     library.push({
        //         name: this.props.intl.formatMessage(messages.cwExtensionHeader),
        //         description: this.props.intl.formatMessage(messages.cwExtensionError),
        //         extensionId: 'cw_error',
        //         key: 'cw_error', // 添加唯一键
        //         disabled: true,
        //         iconURL: extensionIcon,
        //         tags: ['cw'],
        //         featured: false
        //     });
        // } else if (!this.state.cwGallery || this.state.cwGallery.length === 0) {
        //     // 创世界扩展正在加载中
        //     if (library) {
        //         library.push('---');
        //     } else {
        //         library = [];
        //     }
        //     library.push({
        //         name: this.props.intl.formatMessage(messages.cwExtensionHeader),
        //         description: this.props.intl.formatMessage(messages.cwExtensionLoading),
        //         extensionId: 'cw_loading',
        //         key: 'cw_loading', // 添加唯一键
        //         disabled: true,
        //         iconURL: extensionIcon,
        //         tags: ['cw'],
        //         featured: false
        //     });
        // }

        return (
            <LibraryComponent
                data={library}
                filterable
                persistableKey="extensionId"
                id="extensionLibrary"
                tags={extensionTags}
                title={this.props.intl.formatMessage(messages.extensionTitle)}
                visible={this.props.visible}
                onItemSelected={this.handleItemSelect}
                onRequestClose={this.props.onRequestClose}
            />
        );
    }
}

ExtensionLibrary.propTypes = {
    intl: intlShape.isRequired,
    onCategorySelected: PropTypes.func,
    onEnableProcedureReturns: PropTypes.func,
    onOpenCustomExtensionModal: PropTypes.func,
    onRequestClose: PropTypes.func,
    visible: PropTypes.bool,
    vm: PropTypes.instanceOf(VM).isRequired // eslint-disable-line react/no-unused-prop-types
};

export default injectIntl(ExtensionLibrary);
