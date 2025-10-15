import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import ReactModal from 'react-modal';
import {FormattedMessage} from 'react-intl';

import Box from '../box/box.jsx';
import Button from '../button/button.jsx';
import CloseButton from '../close-button/close-button.jsx';

import backIcon from '../../lib/assets/icon--back.svg';
import helpIcon from '../../lib/assets/icon--help.svg';

import styles from './modal.css';

// 窗口化模态框组件
class WindowedModal extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            position: { x: 0, y: 0 },
            isDragging: false,
            dragOffset: { x: 0, y: 0 }
        };
        this.headerRef = React.createRef();
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
    }

    componentDidMount () {
        if (this.props.windowedModals) {
            document.addEventListener('mousemove', this.handleMouseMove);
            document.addEventListener('mouseup', this.handleMouseUp);
        }
    }

    componentWillUnmount () {
        document.removeEventListener('mousemove', this.handleMouseMove);
        document.removeEventListener('mouseup', this.handleMouseUp);
    }

    handleMouseDown (e) {
        if (!this.props.windowedModals) return;
        
        const headerElement = this.headerRef.current;
        if (!headerElement || !headerElement.contains(e.target)) return;

        this.setState({
            isDragging: true,
            dragOffset: {
                x: e.clientX - this.state.position.x,
                y: e.clientY - this.state.position.y
            }
        });
        e.preventDefault();
    }

    handleMouseMove (e) {
        if (!this.state.isDragging) return;

        this.setState({
            position: {
                x: e.clientX - this.state.dragOffset.x,
                y: e.clientY - this.state.dragOffset.y
            }
        });
    }

    handleMouseUp () {
        this.setState({ isDragging: false });
    }

    render () {
        const { windowedModals, ...props } = this.props;
        const modalStyle = windowedModals ? {
            position: 'absolute',
            left: this.state.position.x,
            top: this.state.position.y,
            margin: 0
        } : {};

        return (
            <ReactModal
                isOpen
                className={classNames(styles.modalContent, props.className, {
                    [styles.fullScreen]: props.fullScreen,
                    [styles.windowed]: windowedModals
                })}
                contentLabel={props.contentLabel}
                overlayClassName={classNames(styles.modalOverlay, {
                    [styles.windowedOverlay]: windowedModals
                })}
                onRequestClose={props.onRequestClose}
                style={{
                    content: modalStyle
                }}
            >
                <Box
                    dir={props.isRtl ? 'rtl' : 'ltr'}
                    direction="column"
                    grow={1}
                >
                    <div 
                        className={classNames(styles.header, props.headerClassName, {
                            [styles.draggable]: windowedModals
                        })}
                        ref={this.headerRef}
                        onMouseDown={this.handleMouseDown}
                    >
                        {props.onHelp ? (
                            <div
                                className={classNames(
                                    styles.headerItem,
                                    styles.headerItemHelp
                                )}
                            >
                                <Button
                                    className={styles.helpButton}
                                    iconSrc={helpIcon}
                                    onClick={props.onHelp}
                                >
                                    <FormattedMessage
                                        defaultMessage="Help"
                                        description="Help button in modal"
                                        id="gui.modal.help"
                                    />
                                </Button>
                            </div>
                        ) : null}
                        <div
                            className={classNames(
                                styles.headerItem,
                                styles.headerItemTitle
                            )}
                        >
                            {props.headerImage ? (
                                <img
                                    className={styles.headerImage}
                                    src={props.headerImage}
                                    draggable={false}
                                />
                            ) : null}
                            {props.contentLabel}
                        </div>
                        <div
                            className={classNames(
                                styles.headerItem,
                                styles.headerItemClose
                            )}
                        >
                            {props.fullScreen ? (
                                <Button
                                    className={styles.backButton}
                                    iconSrc={backIcon}
                                    onClick={props.onRequestClose}
                                >
                                    <FormattedMessage
                                        defaultMessage="Back"
                                        description="Back button in modal"
                                        id="gui.modal.back"
                                    />
                                </Button>
                            ) : (
                                <CloseButton
                                    size={CloseButton.SIZE_LARGE}
                                    onClick={props.onRequestClose}
                                />
                            )}
                        </div>
                    </div>
                    {props.children}
                </Box>
            </ReactModal>
        );
    }
}

const ModalComponent = props => {
    if (props.windowedModals) {
        return <WindowedModal {...props} />;
    }
    
    return (
        <ReactModal
            isOpen
            className={classNames(styles.modalContent, props.className, {
                [styles.fullScreen]: props.fullScreen
            })}
            contentLabel={props.contentLabel}
            overlayClassName={styles.modalOverlay}
            onRequestClose={props.onRequestClose}
        >
            <Box
                dir={props.isRtl ? 'rtl' : 'ltr'}
                direction="column"
                grow={1}
            >
                <div className={classNames(styles.header, props.headerClassName)}>
                    {props.onHelp ? (
                        <div
                            className={classNames(
                                styles.headerItem,
                                styles.headerItemHelp
                            )}
                        >
                            <Button
                                className={styles.helpButton}
                                iconSrc={helpIcon}
                                onClick={props.onHelp}
                            >
                                <FormattedMessage
                                    defaultMessage="Help"
                                    description="Help button in modal"
                                    id="gui.modal.help"
                                />
                            </Button>
                        </div>
                    ) : null}
                    <div
                        className={classNames(
                            styles.headerItem,
                            styles.headerItemTitle
                        )}
                    >
                        {props.headerImage ? (
                            <img
                                className={styles.headerImage}
                                src={props.headerImage}
                                draggable={false}
                            />
                        ) : null}
                        {props.contentLabel}
                    </div>
                    <div
                        className={classNames(
                            styles.headerItem,
                            styles.headerItemClose
                        )}
                    >
                        {props.fullScreen ? (
                            <Button
                                className={styles.backButton}
                                iconSrc={backIcon}
                                onClick={props.onRequestClose}
                            >
                                <FormattedMessage
                                    defaultMessage="Back"
                                    description="Back button in modal"
                                    id="gui.modal.back"
                                />
                            </Button>
                        ) : (
                            <CloseButton
                                size={CloseButton.SIZE_LARGE}
                                onClick={props.onRequestClose}
                            />
                        )}
                    </div>
                </div>
                {props.children}
            </Box>
        </ReactModal>
    );
};

ModalComponent.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    contentLabel: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.object
    ]).isRequired,
    fullScreen: PropTypes.bool,
    headerClassName: PropTypes.string,
    headerImage: PropTypes.string,
    isRtl: PropTypes.bool,
    onHelp: PropTypes.func,
    onRequestClose: PropTypes.func,
    windowedModals: PropTypes.bool
};

export default ModalComponent;
