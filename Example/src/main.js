import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import LocalNotification from 'react-native-local-notification';

class Main extends Component {

  constructor(props) {
    super(props);
  }

  showLongNotification() {
    this.refs.localNotification.showNotification({
      title: 'Notification title',
      text: 'This is a long notification. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam iaculis, mi ut vehicula hendrerit, neque justo scelerisque mi, sed finibus eros libero sit amet libero. Nam sed facilisis ante.',
      onPress: () => alert('hello long'),
      onHide: () =>  alert('Byeeee'),
    });
  }

  showShortNotification() {
    this.refs.localNotification.showNotification({
      title: 'Notification title',
      text: 'A short notification.',
      onPress: () => alert('hello short'),
    });
  }

  render() {
    return (
      <View style={{flex: 1, backgroundColor: '#f5f5f5'}}>
        <Text style={{textAlign:'center', paddingTop: 30}}>Top</Text>
        <View style={styles.container}>
          <Text style={styles.welcome}>Local Notification</Text>
          <TouchableOpacity style={styles.button} onPress={() => this.showLongNotification()}>
            <Text style={styles.buttonText}>Show long notification</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => this.showShortNotification()}>
            <Text style={styles.buttonText}>Show short notification</Text>
          </TouchableOpacity>
        </View>
        <LocalNotification ref="localNotification" />
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
