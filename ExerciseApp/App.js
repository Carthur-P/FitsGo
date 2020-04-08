import React from 'react';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import LoadingScreen from './screens/LoadingScreen';
import HomeScreen from './screens/HomeScreen';
import SignInScreen from './screens/SignInScreen';
import SignUpScreen from './screens/SignUpScreen';
import ProfileScreen from './screens/ProfileScreen';
import MyRecordsScreen from './screens/MyRecordsScreen';
import Icon from './screens/Icon';
import Account from './screens/Account';
import ResetPassword from './screens/ResetPassword';
import PrivacyPolicy from './screens/PrivacyPolicy'

const navigator = createStackNavigator({
  Loading: LoadingScreen,
  SignIn: SignInScreen,
  Home: HomeScreen,
  SignUp: SignUpScreen,
  Profile: ProfileScreen,
  MyRecords: MyRecordsScreen,
  Icon: Icon,
  Account: Account,
  ResetPassword: ResetPassword,
  PrivacyPolicy: PrivacyPolicy
},
  {
    defaultNavigationOptions: {
      headerMode: 'none',
      headerVisible: false,
      header: null,
    },
    navigationOptions: {
      headerMode: 'none',
      headerVisible: false,
      header: null,
    }
  },
);

const App = createAppContainer(navigator);

export default () => {
  return (<App />)
}