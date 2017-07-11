import React, { Component } from 'react';
import {
  PanResponder,
  View,
  Text,
  StyleSheet,
  Platform,
  LayoutAnimation,
  InteractionManager,
  StatusBar,
  UIManager
} from 'react-native';
import timer from 'react-native-timer';

UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);

class LocalNotificationItem extends Component {

  constructor(props) {
    super(props);

    this._panResponder = null;
    this.fullTextHeight = null;
    this.textHeightSetCurrentTouch = false;
    this.startHeight = this.props.startHeight;

    this.state = {
      topMargin: -100,
      textHeight: this.startHeight,
      isShowing: false,
    };

    this.hideNotification = this.hideNotification.bind(this);
  }

  componentDidMount() {
    timer.setTimeout(`duration-${this.props.itemId}`, this.hideNotification, this.props.duration);
  }

  isPress(y, x) {
    return Math.abs(y) < 4 && Math.abs(x) < 4;
  }

  hideNotification() {
    const config = {
      ...LayoutAnimation.Presets.linear,
      duration: 250,
    }
    LayoutAnimation.configureNext(config, () => {
      this.props.onNotificationHide(this.props.itemId);
    });
    this.setState({topMargin: -200});
  }

  componentWillMount() {
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onShouldBlockNativeResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onPanResponderTerminate: (evt, gestureState) => {},
      onMoveShouldSetPanResponderCapture: (evt, gestureState) =>
        Math.abs(gestureState.dx) > 100 || Math.abs(gestureState.dy) > 1,
      onPanResponderGrant: (evt, gestureState) => {
        this.textHeightSetCurrentTouch = false;
        console.log('cancel timeout')
        timer.clearTimeout(`duration-${this.props.itemId}`);
      },
      onPanResponderMove: (evt, gestureState) => {
        if (this.state.textHeight < this.fullTextHeight && gestureState.dy > 0) {
          this.setState({
            textHeight: (gestureState.dy + this.startHeight) > this.fullTextHeight ? this.fullTextHeight : gestureState.dy + this.startHeight,
          });

          this.textHeightSetCurrentTouch = true;
          return;
        }
        else if(gestureState.dy < 110 && this.textHeightSetCurrentTouch) {
          this.setState({
            topMargin: gestureState.dy - (this.state.textHeight - this.startHeight),
          });
        }
        else if (gestureState.dy < 110) {
          this.setState({
            topMargin: gestureState.dy,
          });
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (this.isPress(gestureState.dy, gestureState.dx)) {
          this.props.onNotificationPress(this.props.itemId);
          this.hideNotification();
        }
        else {
          if (this.state.topMargin > 0) {
            LayoutAnimation.easeInEaseOut();
            this.setState({ topMargin: 0 });
          }
          else if (this.state.textHeight < this.fullTextHeight && this.state.topMargin >= 0) {
            LayoutAnimation.easeInEaseOut();
            this.setState({ textHeight: this.fullTextHeight });
          }
          else if (this.state.topMargin < 0){
            this.hideNotification();
          }
        }
      },
    });
  }

  onLayout(e) {
    if (!this.state.isShowing) {

      LayoutAnimation.easeInEaseOut();
      this.setState({
        topMargin: 0,
        isShowing: true,
      });

      this.fullTextHeight = e.nativeEvent.layout.height;
    }
  }

  render() {
    const isdragged = this.state.textHeight > this.startHeight;
    return (
      <View style={styles.wrapper}>
        <View {...this._panResponder.panHandlers} style={[styles.animatedView, {marginTop: -280 + this.state.topMargin + this.state.textHeight}]}>
          <View style={[styles.innerView, this.props.notificationStyle]}>
            <View style={[styles.ellipsizeWrapper,{ opacity: isdragged ? 0 : 1 }]}>
              {this.props.title && (<Text style={[styles.title]} ellipsizeMode="tail" numberOfLines={1}>{this.props.title}</Text>)}
              <Text style={[styles.ellipsizeText,this.props.ellipsizeTextStyle]} ellipsizeMode="tail" numberOfLines={2}>{this.props.text}</Text>
            </View>
            <View style={[styles.textWrapper, {height: (this.state.textHeight + (this.props.title ? 22 : 0)), marginTop: -1 * (this.state.textHeight), opacity: isdragged ? 1 : 0}]}>
              {this.props.title && (<Text style={[styles.title]} ellipsizeMode="tail" numberOfLines={1}>{this.props.title}</Text>)}
              <Text style={[styles.text, this.props.textStyle]} onLayout={(e) => this.onLayout(e)} ellipsizeMode="tail" numberOfLines={5}>{this.props.text}</Text>
            </View>
            <View style={[styles.handle, this.props.handleStyle]} />
          </View>
        </View>
      </View>
    );
  }
}

LocalNotificationItem.propTypes = {
  title: React.PropTypes.string,
  text: React.PropTypes.string.isRequired,
  startHeight: React.PropTypes.number.isRequired,
  duration: React.PropTypes.number.isRequired,
  textStyle: React.PropTypes.object.isRequired,
  handleStyle: React.PropTypes.object.isRequired,
  notificationStyle: React.PropTypes.object.isRequired,
  ellipsizeTextStyle: React.PropTypes.object.isRequired,
}

LocalNotificationItem.defaultProps = {
  title: null,
  text: 'Hello 👋',
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    top: 0,
    left: -1,
    right: -1,
    backgroundColor: 'transparent'
  },
  animatedView: {
    backgroundColor: 'transparent',
    flex: 1,
  },
  innerView: {
    backgroundColor: 'white',
    borderColor: '#ddd',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderRightWidth: StyleSheet.hairlineWidth,
    borderLeftWidth: StyleSheet.hairlineWidth,
    paddingTop: 285,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    justifyContent: 'flex-end'
  },
  title: {
    height: 22,
    color: 'black',
    fontWeight: 'bold',
    paddingHorizontal: 16,
    justifyContent: 'flex-end',
    paddingTop: 4,
    fontSize: 16,
  },
  ellipsizeWrapper: {
    position: 'absolute',
    top: 241,
    left: 0,
    right: 0
  },
  ellipsizeText: {
    fontSize: 16,
    paddingTop: 4,
    paddingBottom: 8,
    paddingHorizontal: 16,
    color: '#333'
  },
  textWrapper: {
    backgroundColor: 'transparent',
    flex: 1,
    overflow: 'hidden',
  },
  text: {
    fontSize: 16,
    paddingTop: 4,
    paddingBottom: 8,
    paddingHorizontal: 16,
    color: '#333'
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 40,
    backgroundColor: 'rgba(0,0,0,.2)',
    marginBottom: 6,
    marginTop: 12,
    alignSelf: 'center'
  }
})


class LocalNotification extends Component {

  constructor(props) {
    super(props);

    this.state = {
      notifications: []
    };

    this.hideNotification = this.hideNotification.bind(this);
    this.onNotificationPress = this.onNotificationPress.bind(this);
  }

  onNotificationPress(id) {
    const index = this.state.notifications.findIndex(item => item.id === id);

    const noti = this.state.notifications[index];
    noti.onPress && noti.onPress(noti);
  }

  hideNotification(id) {
    const index = this.state.notifications.findIndex(item => item.id === id);

    const noti = this.state.notifications[index];
    noti.onHide && noti.onHide(noti);

    const newNotifications = this.state.notifications.slice();
    newNotifications.splice(index, 1);
    this.setState({
      notifications: newNotifications,
    });

    newNotifications.length === 0 && Platform.OS === 'ios' && StatusBar.setHidden(false, true);
  }

  showNotification(notification) {
    const id = Math.floor(Math.random() * 1000) + Date.now();
    this.setState({
      notifications: [
        ...this.state.notifications,
        { ...notification, id }]
    });

    Platform.OS === 'ios' && StatusBar.setHidden(true, false);
  }

  render() {
    const { startHeight, duration, textStyle, handleStyle, notificationStyle, ellipsizeTextStyle } = this.props;

    return (
      <View style={{position: 'absolute', top: 0, left: 0, right: 0}}>
        {this.state.notifications.map((item, i) => (
          <LocalNotificationItem
            key={item.id}
            itemId={item.id}
            title={item.title}
            text={item.text}
            startHeight={startHeight}
            duration={duration}
            textStyle={textStyle}
            handleStyle={handleStyle}
            notificationStyle={notificationStyle}
            ellipsizeTextStyle={ellipsizeTextStyle}
            />
        ))}
      </View>
    );
  }
}

LocalNotification.propTypes = {
  startHeight: React.PropTypes.number.isRequired,
  duration: React.PropTypes.number.isRequired,
  textStyle: React.PropTypes.object.isRequired,
  handleStyle: React.PropTypes.object.isRequired,
  notificationStyle: React.PropTypes.object.isRequired,
  ellipsizeTextStyle: React.PropTypes.object.isRequired,
}

LocalNotification.defaultProps = {
  textStyle: {},
  handleStyle: {},
  notificationStyle: {},
  ellipsizeTextStyle: {},
  startHeight: 44,
  duration: 3500,
};

export default LocalNotification;
