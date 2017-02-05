import React, { Component } from 'react';
import {
  PanResponder,
  View,
  Text,
  StyleSheet,
  LayoutAnimation,
  UIManager
} from 'react-native';

UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);

class LocalNotification extends Component {

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
  }

  isPress(y, x) {
    return Math.abs(y) < 4 && Math.abs(x) < 4;
  }

  hideNotification() {
    const config = {
      ...LayoutAnimation.Presets.linear,
      duration: 200,
    }
    LayoutAnimation.configureNext(config, () => {
      this.props.onNotificationHide && this.props.onNotificationHide();
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
          this.props.onNotificationPress && this.props.onNotificationPress();
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
      this.props.onNotificationWillShow && this.props.onNotificationWillShow();

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
            <Text style={[styles.ellipsizeText,{ opacity: isdragged ? 0 : 1 }, this.props.ellipsizeTextStyle]} ellipsizeMode="tail" numberOfLines={2}>{this.props.text}</Text>
            <View style={[styles.textWrapper, {height: this.state.textHeight, marginTop: -1 * this.state.textHeight, opacity: isdragged ? 1 : 0}]}>
              <Text style={[styles.text, this.props.textStyle]} onLayout={(e) => this.onLayout(e)} ellipsizeMode="tail" numberOfLines={5}>{this.props.text}</Text>
            </View>
            <View style={[styles.handle, this.props.handleStyle]} />
          </View>
        </View>
      </View>
    );
  }
}

LocalNotification.propTypes = {
  text: React.PropTypes.string.isRequired,
  startHeight: React.PropTypes.number.isRequired,
  onNotificationPress: React.PropTypes.func,
  onNotificationWillShow: React.PropTypes.func,
}

LocalNotification.defaultProps = {
  text: 'Hello 👋',
  textStyle: {},
  handleStyle: {},
  notificationStyle: {},
  ellipsizeTextStyle: {},
  startHeight: 46,
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
  ellipsizeText: {
    position: 'absolute',
    top: 254,
    paddingVertical: 8,
    paddingHorizontal: 16,
    left: 0,
    right: 0,
    fontSize: 16
  },
  textWrapper: {
    backgroundColor: 'transparent',
    flex: 1,
    overflow: 'hidden'
  },
  text: {
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
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

export default LocalNotification;
