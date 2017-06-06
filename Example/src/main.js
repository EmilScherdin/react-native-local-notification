import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import LocalNotification from 'react-native-local-notification';
//import LocalNotification from '../../react-native-local-notification';


class Main extends Component {

  constructor(props) {
    super(props);

    this.state = {
      showNotification: false,
      showNotification2: false,
      notifications: [],
    }

    this.onNotificationHide = this.onNotificationHide.bind(this);

  }

  showNotification() {
    this.setState({
      notifications: [...this.state.notifications, {
        text: 'This is a long notification. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam iaculis, mi ut vehicula hendrerit, neque justo scelerisque mi, sed finibus eros libero sit amet libero. Nam sed facilisis ante.',
      }],
    });
  }

  showNotification2() {
    this.setState({
      notifications: [...this.state.notifications, {
        text: 'A short notification.',
      }],
    });
  }

  onNotificationHide(index) {
    this.setState({
      notifications: this.state.notifications.slice(0, -1),
    });
  }

  render() {

    return (
      <View style={{flex: 1, backgroundColor: '#f5f5f5'}}>
        <Text style={{textAlign:'center', paddingTop: 30}}>Top</Text>
        <View style={styles.container}>
          <Text style={styles.welcome}>Local Notification</Text>
          <TouchableOpacity style={styles.button} onPress={() => this.showNotification()}>
            <Text style={styles.buttonText}>Show long notification</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => this.showNotification2()}>
            <Text style={styles.buttonText}>Show short notification</Text>
          </TouchableOpacity>
        </View>
        {this.state.notifications.map((item, i) => (
          <LocalNotification key={i} text={item.text} onNotificationPress={() => alert('pressed')} onNotificationHide={this.onNotificationHide} onReset={this.onReset} />
        ))}
      </View>
    );

  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 10,
    backgroundColor: 'cornflowerblue',
    marginTop: 16,
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    alignSelf: 'center',
  }
});

export default Main;
