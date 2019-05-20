import React, { Component } from 'react';
import {
  PanResponder,
  View,
  Text,
  StyleSheet,
  Platform,
  LayoutAnimation,
  StatusBar
} from 'react-native';
import PropTypes from 'prop-types';
import timer from 'react-native-timer';

class LocalNotificationItem extends Component {

  constructor(props) {
    super(props);

    this._panResponder = null;
    this.fullTextHeight = null;
    this.textHeightSetCurrentTouch = false;

    this.state = {
      topMargin: -180,
      isShowing: false,
      draggedHeight: 0,
    };

    this.onLayout = this.onLayout.bind(this);
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
      onStartShouldSetPanResponderCapture: () => true,
      onPanResponderTerminationRequest: () => true,
      onStartShouldSetPanResponder: () => true,
      onShouldBlockNativeResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderTerminate: () => {},
      onMoveShouldSetPanResponderCapture: (_evt, gestureState) =>
        Math.abs(gestureState.dx) > 100 || Math.abs(gestureState.dy) > 1,
      onPanResponderGrant: () => {
        this.textHeightSetCurrentTouch = false;
        timer.clearTimeout(`duration-${this.props.itemId}`);
      },
      onPanResponderMove: (_evt, gestureState) => {
        this.setState({
          draggedHeight: gestureState.dy,
        });
      },
      onPanResponderRelease: (_evt, gestureState) => {
        if (this.isPress(gestureState.dy, gestureState.dx)) {
          this.props.onNotificationPress(this.props.itemId);
          this.hideNotification();
        }
        else {
          if (this.state.draggedHeight > 0) {
            LayoutAnimation.easeInEaseOut();
            this.setState({
              draggedHeight: 0,
            });
          }
          if (this.state.draggedHeight < -10){
            this.hideNotification();
          }
          else if (this.state.draggedHeight < 0) {
            LayoutAnimation.easeInEaseOut();
            this.setState({
              draggedHeight: 0,
            });
          }
        }
      },
    });
  }

  onLayout() {
    if (this.state.isShowing)
      return;

    LayoutAnimation.easeInEaseOut();
    this.setState({
      topMargin: 0,
      isShowing: true,
    });
  }

  render() {
    const { draggedHeight, topMargin } = this.state;
    const { title, notificationStyle, titleStyle, textStyle, numberOfTextLines, text, handleStyle } = this.props;

    return (
      <View style={styles.wrapper}>
        <View {...this._panResponder.panHandlers} style={[styles.animatedView, {marginTop: -300 + (draggedHeight < 180 ? draggedHeight : 180) + topMargin}]}>
          <View style={[styles.innerView, notificationStyle]}>
            <View style={[styles.textWrapper]}>
              <View onLayout={this.onLayout}>
                {!!title && (<Text style={[styles.title, titleStyle]} ellipsizeMode="tail" numberOfLines={1}>{title}</Text>)}
                <Text style={[styles.text, textStyle]} ellipsizeMode="tail" numberOfLines={numberOfTextLines}>{text}</Text>
              </View>
            </View>
            <View style={[styles.handle, handleStyle]} />
          </View>
        </View>
      </View>
    );
  }
}

LocalNotificationItem.propTypes = {
  title: PropTypes.string,
  text: PropTypes.string.isRequired,
  duration: PropTypes.number.isRequired,
  textStyle: PropTypes.object.isRequired,
  titleStyle: PropTypes.object.isRequired,
  numberOfTextLines: PropTypes.number.isRequired,
  handleStyle: PropTypes.object.isRequired,
  notificationStyle: PropTypes.object.isRequired,
  onNotificationPress: PropTypes.func.isRequired,
  onNotificationHide: PropTypes.func.isRequired,
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
    paddingTop: 300,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    justifyContent: 'flex-end'
  },
  title: {
    height: 24,
    paddingTop: 6,
    color: 'black',
    fontWeight: 'bold',
    paddingHorizontal: 8,
    justifyContent: 'flex-end',
    fontSize: 16,
  },
  textWrapper: {
    backgroundColor: 'transparent',
    flex: 1,
    overflow: 'hidden',
  },
  text: {
    fontSize: 16,
    paddingTop: 4,
    paddingBottom: 4,
    paddingHorizontal: 8,
    color: '#333'
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 40,
    backgroundColor: 'rgba(0,0,0,.2)',
    marginBottom: 6,
    marginTop: 4,
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
    noti && noti.onPress && noti.onPress(noti);
  }

  hideNotification(id) {
    const index = this.state.notifications.findIndex(item => item.id === id);

    const noti = this.state.notifications[index];
    noti && noti.onHide && noti.onHide(noti);

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
    const { duration, textStyle, titleStyle, handleStyle, notificationStyle, numberOfTextLines } = this.props;

    return (
      <View style={{position: 'absolute', top: 0, left: 0, right: 0}}>
        {this.state.notifications.map((item, i) => (
          <LocalNotificationItem
            key={item.id}
            itemId={item.id}
            title={item.title}
            text={item.text}
            duration={duration}
            textStyle={textStyle}
            titleStyle={titleStyle}
            handleStyle={handleStyle}
            notificationStyle={notificationStyle}
            onNotificationPress={this.onNotificationPress}
            onNotificationHide={this.hideNotification}
            numberOfTextLines={numberOfTextLines}
            />
        ))}
      </View>
    );
  }
}

LocalNotification.propTypes = {
  duration: PropTypes.number.isRequired,
  textStyle: PropTypes.object.isRequired,
  handleStyle: PropTypes.object.isRequired,
  notificationStyle: PropTypes.object.isRequired,
  numberOfTextLines: PropTypes.number.isRequired,
}

LocalNotification.defaultProps = {
  textStyle: {},
  handleStyle: {},
  notificationStyle: {},
  titleStyle: {},
  duration: 3500,
  numberOfTextLines: 2,
};

export default LocalNotification;
