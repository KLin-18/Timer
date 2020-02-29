import React from "react";
import { Audio } from 'expo-av';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TouchableOpacity,
  Dimensions,
  Picker,
  Platform,
  ImageBackground,
} from "react-native";

import Timerwidget from './Components/timerWidget';

const BACKGROUNDIMAGE = "https://images.weserv.nl/?url=i.imgur.com/6QJjYMe.jpg";
const BACKGROUNDMUSIC = "https://www.youtube.com/watch?v=3IdxDjtwdCU&list=RD3IdxDjtwdCU&start_radio=1";

const screen = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    width: screen.width / 2,
    height: screen.width / 2,
    borderRadius: screen.width / 2,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30
  },
  buttonStop: {
    borderColor: "#07121B"
  },
  buttonText: {
    color: "#89AAFF",
    fontSize: 45,
    textShadowColor: '#89ff',
    textShadowOffset: {width: 0, height: 0},
    textShadowRadius: 10,
    fontFamily: "Chalkduster"
  },
  buttonTextStop: {
    color: "#fee",
    textShadowColor: '#FF4444',
    textShadowOffset: {width: 0, height: 0},
    textShadowRadius: 10
  },
  timerText: {
    color: "#fee",
    fontSize: 70,
    textShadowColor: '#FF4444',
    textShadowOffset: {width: 0, height: -40},
    textShadowRadius: 100,
    fontFamily: "Chalkduster",
  },
  picker: {
    width: 50,
    ...Platform.select({
      android: {
        color: "#fff",
        backgroundColor: "#07121B",
        marginLeft: 10
      }
    })
  },
  pickerItem: {
    color: "#fff",
    fontSize: 20,
    fontFamily: "Chalkduster"
  },
  pickerContainer: {
    flexDirection: "row",
    alignItems: "center"
  }
});

const formatNumber = number => `0${number}`.slice(-2);

const getRemaining = time => {
  const minutes = Math.floor(time / 60);
  const seconds = time - minutes * 60;
  return { minutes: formatNumber(minutes), seconds: formatNumber(seconds) };
};

const createArray = length => {
  const arr = [];
  let i = 0;
  while (i < length) {
    arr.push(i.toString());
    i += 1;
  }

  return arr;
};

const AVAILABLE_MINUTES = createArray(10)
const AVAILABLE_SECONDS = createArray(60);

export default class App extends React.Component {
  state = {
    remainingSeconds: 5,
    isRunning: false,
    isActive: false,
    selectedMinutes: "0",
    selectedSeconds: "5"
  };

  interval = null;

  componentDidUpdate(prevProp, prevState) {
    if (this.state.remainingSeconds === 0 && prevState.remainingSeconds !== 0) {
      alert("Times up!")
    }
  }

  componentWillUnmount() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  start = () => {
    this.setState(state => ({
      remainingSeconds:
        parseInt(state.selectedMinutes, 10) * 60 +
        parseInt(state.selectedSeconds, 10),
      isRunning: true
    }));

    this.interval = setInterval(() => {
      if(this.state.remainingSeconds > 0) {
      this.setState(state => ({
        remainingSeconds: state.remainingSeconds - 1,
      }));
    }
    }, 1000);
  };

  stop = () => {
    clearInterval(this.interval);
    this.interval = null;
    this.setState({
      remainingSeconds: 5,
      isRunning: false
    });
  };

  renderPickers = () => (
    <View style={styles.pickerContainer}>
      <Picker
        style={styles.picker}
        itemStyle={styles.pickerItem}
        selectedValue={this.state.selectedMinutes}
        onValueChange={itemValue => {
          this.setState({ selectedMinutes: itemValue });
        }}
        mode="dropdown"
      >
        {AVAILABLE_MINUTES.map(value => (
          <Picker.Item key={value} label={value} value={value} />
        ))}
      </Picker>
      <Text style={styles.pickerItem}>minutes</Text>
      <Picker
        style={styles.picker}
        itemStyle={styles.pickerItem}
        selectedValue={this.state.selectedSeconds}
        onValueChange={itemValue => {
          this.setState({ selectedSeconds: itemValue });
        }}
        mode="dropdown"
      >
        {AVAILABLE_SECONDS.map(value => (
          <Picker.Item key={value} label={value} value={value} />
        ))}
      </Picker>
      <Text style={styles.pickerItem}>seconds</Text>
    </View>
  );

  render() {
    const { minutes, seconds } = getRemaining(this.state.remainingSeconds);

    return (
      <ImageBackground 
      style={styles.container}
      source={{ uri: BACKGROUNDIMAGE }}>
        <StatusBar barStyle="light-content" />
        {this.state.isRunning ? (
          <View>
            <Text style={styles.timerText}>{`${minutes}:${seconds}`}</Text>
          </View>
          ) : (
          this.renderPickers()
        )}
        {this.state.isRunning ? (
            <TouchableOpacity onPress={this.stop} style={[styles.button, styles.buttonStop]}>
              <Timerwidget seconds={this.state.remainingSeconds} />
              <Text style={[styles.buttonText, styles.buttonTextStop]}>Stop</Text>
            </TouchableOpacity>  
        ) : (
          <TouchableOpacity onPress={this.start} style={styles.button}>
            <Text style={styles.buttonText}>Start</Text>
          </TouchableOpacity>
        )}
      </ImageBackground>
    );
  }
}