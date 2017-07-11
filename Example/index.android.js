/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

 import React, { Component } from 'react';
 import {
   AppRegistry,
   StyleSheet,
   View
 } from 'react-native';
 import Main from './src/main';

 export default class localNotification extends Component {
   render() {
     return (
       <View style={styles.container}>
         <Main />
       </View>
     );
   }
 }

 const styles = StyleSheet.create({
   container: {
     flex: 1,
   },
 });

AppRegistry.registerComponent('Example', () => localNotification);
