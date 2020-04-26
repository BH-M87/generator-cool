import PropTypes from 'prop-types';
import Taro, { Component } from '@tarojs/taro';
import { View, Button, Text } from '@tarojs/components';
import { observer, inject } from '@tarojs/mobx';
import './index.less';

@inject('counter')
@observer
class Index extends Component {
  config = {
    navigationBarTitleText: '首页',
  };

  componentWillMount() {}

  componentWillReact() {}

  componentDidMount() {}

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  increment = () => {
    const { counter } = this.props;
    counter.increment();
  };

  decrement = () => {
    const { counter } = this.props;
    counter.decrement();
  };

  incrementAsync = () => {
    const { counter } = this.props;
    counter.incrementAsync();
  };

  render() {
    const {
      counter: { counter },
    } = this.props;
    return (
      <View className="index">
        <Button onClick={this.increment}>+</Button>
        <Button onClick={this.decrement}>-</Button>
        <Button onClick={this.incrementAsync}>Add Async</Button>
        <Text>{counter}</Text>
      </View>
    );
  }
}

Index.propTypes = {
  counter: PropTypes.shape({
    counter: PropTypes.number,
    increment: PropTypes.func,
    decrement: PropTypes.number,
    incrementAsync: PropTypes.func,
  }),
};

export default Index;
