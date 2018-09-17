import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Animated,
  StatusBar
} from "react-native";
import { Constants } from 'expo'
import { Screen, ViewLoading } from "../../App";
import { Header } from "react-native-elements";
import { Feather } from '@expo/vector-icons'
import * as api from "../Api";
import { Layout, Colors, Icons } from '../../Utils'

const HERO_HEIGHT = 180;
const AVATAR_SIZE = 84;
const { width } = Layout.window

class ProfileScreen extends React.Component {
  // TODO: create an Animated.Value that starts on 0 called `scrollY

  static navigationOptions = {
    header: null,
  };

  state = {
    user: null,
    loading: true,
  };

  componentDidMount() {
    this.fetchUser();
  }

  fetchUser = () => {
    const userId = this.props.navigation.getParam("userId");
    if (userId) {
      this.props.api
        .fetchUser({ userId })
        .then(user => this.setState({ loading: false, user }));
    } else {
      this.setState({ error: "no user available. please go back" });
    }
  };

  render() {

    const showBack = this.props.navigation.getParam("noBack");
    const { scrollY } = this;

    /*
      create a let value called `opacity` that interpolates `scrollY`
      with the next values:
      {
        inputRange: [0, 60, 100],
        outputRange: [0, 0, 1]
      }
    */
    return (
      <Screen>
        {this.state.loading ? (
          <ViewLoading />
        ) : (
          <ScrollView
            scrollEventThrottle={1}
            /*
              Implements the `onScroll` event that updates `this.scrollY`
              with `NativeEvent.contentOffset.y`.

              Hint: use the "declarative" way...

              documentation: https://facebook.github.io/react-native/docs/animations#tracking-gestures
            */
          >
            <View style={[styles.header]}>
              <Animated.Image
                resizeMode="cover"
                style={[styles.headerCover]}
                source={{ uri: this.state.user.profile_banner_url }}
              />
              <Image
                style={[
                  styles.headerAvatar,
                  {
                    borderColor: `#${this.state.user.profile_background_color}`
                  }
                ]}
                source={{ uri: this.state.user.profile_image_url_https }}
              />
            </View>
            <View style={styles.content}>
              <Text>{JSON.stringify(this.state.user, null, 4)}</Text>
            </View>
          </ScrollView>
        )}

        {/*
          The View above is the one receiving the opacity interpolated value.
          So technically this is the View that will be animated, but its not animating.
          why you think its not working??
        */}
        <View style={{
          opacity,
          position: 'absolute',
          top: 0,
          width
        }}>
        <Header
          outerContainerStyles={{
            paddingTop: Layout.notchHeight + 20,
            borderBottomColor: 'transparent',
            paddingBottom: 8,
            height: Layout.headerHeight
          }}
          leftComponent={!showBack ? <Feather onPress={() => this.props.navigation.goBack()} name={Icons.back} size={24} color={Colors.light} /> : null}
          centerComponent={{ text: this.props.navigation.getParam("name", "User Profile"), style: { color: Colors.light, fontWeight: '600', fontSize: 18 } }}
          backgroundColor={Colors.brand.primary}
        />
        <StatusBar barStyle="light-content" />
        </View>
      </Screen>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    height: HERO_HEIGHT,
    marginBottom: 16
  },
  headerCover: {
    height: HERO_HEIGHT,
    flex: 1
  },
  headerAvatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    backgroundColor: "grey",
    position: "absolute",
    bottom: (AVATAR_SIZE / 2) * -1,
    left: 16,
    borderWidth: 4
  },
  headerContent: {},
  content: {
    padding: 16
  }
});

ProfileScreen.defaultProps = {
  api
};

export default ProfileScreen;
