# react-native-local-notification

A package for React Native apps to show in-app notifications. Only tested on iOS but should work on Android.

# Usage 
```
<LocalNotification 
  text="My awesome notification text"
  onNotificationPress={() => alert('pressed')}
  onNotificationHide={() => alert('hidden')}
/>
```

### Use with RN push notification
Example with use of React Native PushNotificationIOS.
```
onReceiveNotification(notification){
  this.setState({
    notifications: [...this.state.notifications, {
      text: 'My awesome notification text',
      onPress: () => alert('pressed'),
      onHide: this.onNotificationHide,
    }],
  });
}

onNotificationHide() {
  this.setState({
    notifications: this.state.notifications.slice(0, -1),
  });
}

render(){
  return (
    <View>
      {this.state.notifications.map((item, i) => (
          <LocalNotification
            key={i}
            text={item.text}
            onNotificationPress={item.onPress}
            onNotificationHide={item.onHide} />
        ))}
    </View>
  );
}
```

### Available props

Name | Type | Required | Default
--- | --- | --- | ---
Text | `string` | Yes | Hello 👋🏼
startHeight | `number` | Yes | 46
onNotificationPress | `func` | No | `NULL`
onNotificationWillShow | `func` | No | `NULL`
textStyle | `object` | No | {}
handleStyle | `object` | No | {}
notificationStyle | `object` | No | {}
ellipsizeTextStyle | `object` | No | {}
