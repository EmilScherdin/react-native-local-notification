# react-native-local-notification

[![npm version](https://badge.fury.io/js/react-native-local-notification.svg)](https://badge.fury.io/js/react-native-local-notification)

`npm install --save react-native-local-notification`

A package for React Native apps to show in-app notifications. Works for both iOS and Android.

# Demo
![local_notification](https://cloud.githubusercontent.com/assets/6998447/22668160/fd930aa2-ecbf-11e6-9a0b-ee03b505ed18.gif)

# Usage
In root component
```
</View>
  [...]
  <LocalNotification ref="localNotification" />
</View>
```

Showing a notification
```
this.refs.localNotification.showNotification({
  title: 'Notification title',
  text: 'This is a short notification',
  onPress: () => alert('hello short'),
  onHide: () => alert('Byeeeee')
});
```

See Example folder for more details.

### Available props on <LocalNotification />

Name | Type | Required | Default
--- | --- | --- | ---
duration | `number` | Yes | 3500
startHeight | `number` | Yes | 46
textStyle | `object` | No | {}
handleStyle | `object` | No | {}
notificationStyle | `object` | No | {}
ellipsizeTextStyle | `object` | No | {}


### Available props on notification object

Name | Type | Required | Default
--- | --- | --- | ---
title | `string` | No | `NULL`
text | `string` | Yes | Hello 👋🏼
onPress | `func` | No | `NULL`
onHide | `func` | No | `NULL`
