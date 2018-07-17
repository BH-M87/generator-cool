import React, { Component } from 'react';
import utils from 'common/utils';
import List from '.';
import styles from './ListDemo.scss';

const PREFIX = 'list-demo';
const cx = utils.classnames(PREFIX, styles);

class ListDemo extends Component {
  render() {
    console.log('ListDemo');
    const data = {
      dataSource: [
        {
          title: '杭州聚集事件续:村民称秘密开工是导火索',
          source: '微博',
          pubTime: '2017.5.6 10:12:56',
          hazardIndex: 100,
          heat: '200万',
          emotionIndex: -88,
          action: (
            <div className={cx('follow')}>
              <i className="BPO BPO-add" />
              <span>关注</span>
            </div>
          ),
          detail: {
            img: 'https://img.alicdn.com/tps/TB1wcDyMVXXXXbdXpXXXXXXXXXX-200-154.jpg',
            text:
              '诈骗的过程是这样的，联众向消费者推销价格优惠的汽车保险，但需要和联众签订一项分期消费服务，叫“爱车一族服务包代理服务”，总金额38880元。其构成内容是代理申请指,诈骗的过程是这样的，联众向消费者推销价诈骗的过程是这样的，联众向消费者推销价格优诈骗的过程是这样的，联众向消费者推销价格优惠的汽车保险，但需要和联众签订一项分期消费服务，叫“爱车一族服务包代理服务”，总金额38880元。其构成内容是代理申请指,诈骗的过程是这样的，联众向消费者推销价格优惠的汽车保险，但需要和联众签订一项分期消费服务，叫“爱车一族服务包代理服务”，总金额38880元。其构成内容是代理额38880元。其构成内容是代理申请指...',
            textClassName: cx('text'),
          },
        },
        {
          title: '杭州聚集事件续:村民称秘密开工是导火索',
          source: '微博',
          pubTime: '2017.5.6 10:12:56',
          hazardIndex: 100,
          heat: '200万',
          emotionIndex: -88,
          action: (
            <div className={cx('follow')}>
              <i className="BPO BPO-add" />
              <span>关注</span>
            </div>
          ),
          detail: {
            img: 'https://img.alicdn.com/tps/TB1wcDyMVXXXXbdXpXXXXXXXXXX-200-154.jpg',
            text:
              '诈骗的过程是这样的，联众向消费者推销价格优惠的汽车保险，但需要和联众签订一项分期消费服务，叫“爱车一族服务包代理服务”，总金额38880元。其构成内容是代理申请指,诈骗的过程是这样的，联众向消费者推销价诈骗的过程是这样的，联众向消费者推销价格优诈骗的过程是这样的，联众向消费者推销价格优惠的汽车保险，但需要和联众签订一项分期消费服务，叫“爱车一族服务包代理服务”，总金额38880元。其构成内容是代理申请指,诈骗的过程是这样的，联众向消费者推销价格优惠的汽车保险，但需要和联众签订一项分期消费服务，叫“爱车一族服务包代理服务”，总金额38880元。其构成内容是代理额38880元。其构成内容是代理申请指...',
            textClassName: cx('text'),
          },
        },
        {
          title: '杭州聚集事件续:村民称秘密开工是导火索',
          source: '微博',
          pubTime: '2017.5.6 10:12:56',
          hazardIndex: 100,
          heat: '200万',
          emotionIndex: 88,
          action: (
            <div className={cx('followed')}>
              <i className="BPO BPO-dui" />
              <span>已关注</span>
            </div>
          ),
          detail: {
            img: 'https://img.alicdn.com/tps/TB1wcDyMVXXXXbdXpXXXXXXXXXX-200-154.jpg',
            text:
              '诈骗的过程是这样的，联众向消费者推销价格优惠的汽车保险，但需要和联众签订一项分期消费服务，叫“爱车一族服务包代理服务”，总金额38880元。其构成内容是代理申请指,诈骗的过程是这样的，联众向消费者推销价诈骗的过程是这样的，联众向消费者推销价格优诈骗的过程是这样的，联众向消费者推销价格优惠的汽车保险，但需要和联众签订一项分期消费服务，叫“爱车一族服务包代理服务”，总金额38880元。其构成内容是代理申请指,诈骗的过程是这样的，联众向消费者推销价格优惠的汽车保险，但需要和联众签订一项分期消费服务，叫“爱车一族服务包代理服务”，总金额38880元。其构成内容是代理额38880元。其构成内容是代理申请指...',
            textClassName: cx('text'),
          },
        },
        {
          title: '杭州聚集事件续:村民称秘密开工是导火索',
          source: '微博',
          pubTime: '2017.5.6 10:12:56',
          hazardIndex: 100,
          heat: '200万',
          emotionIndex: 0,
          action: (
            <div className={cx('follow')}>
              <i className="BPO BPO-add" />
              <span>关注</span>
            </div>
          ),
        },
      ],
    };
    const options = {
      cols: [
        {
          index: 'title',
          text: '警务关注列表',
          className: cx('title'),
          render(value, index, rowData) {
            return (
              <a href="http://www.taobao.com" target="_blank" rel="noopener noreferrer">
                {value}
              </a>
            );
          },
        },
        {
          index: 'source',
          text: '源头',
          className: cx('source'),
        },
        {
          index: 'pubTime',
          text: '发布时间',
          className: cx('pubTime'),
          sortable: true,
        },
        {
          index: 'hazardIndex',
          text: '危险指数',
          className: cx('hazardIndex'),
          sortable: true,
        },
        {
          index: 'heat',
          text: '热度',
          className: cx('heat'),
          sortable: true,
        },
        {
          index: 'emotionIndex',
          text: '情感指数：',
          className: cx('emotionIndex'),
          filter: {
            options: ['全部', '正面', '中性', '负面'],
            selectedOption: '全部',
          },
        },
        {
          index: 'action',
          className: cx('action'),
          text: '操作',
        },
      ],
      totalCount: 100,
      paginationNo: 5,
      listClassName: cx('list'),
      sortedColumns: ['heat'], // from cols.index
      rowClassName: cx('row'),
      showHeader: true,
      isPagination: true,
    };
    const actions = {
      onSort(index) {
        console.log(`onSort:${index}`);
      },
      onFilter(index, result) {
        console.log(`onFilter:${index}${result}`);
      },
      changePagination() {
        console.log('changePagination');
      },
    };
    return <List data={data} options={options} actions={actions} />;
  }
}

export default ListDemo;
