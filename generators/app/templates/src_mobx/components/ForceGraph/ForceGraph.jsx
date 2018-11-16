/* eslint no-use-before-define:0 */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { observable, action, toJS } from 'mobx';
import { observer } from 'mobx-react';
import _ from 'lodash';
import * as d3 from 'd3';
import utils from 'common/utils';
import StatusLayer from 'components/StatusLayer';
import styles from './ForceGraph.less';

const PREFIX = 'force-graph';
const cx = utils.classnames(PREFIX, styles);

const AVATAR_SIZE = 36;
const CENTER_AVATAR_SIZE = 48;
const HALF_ARROW_WIDTH = 4;
const ARROW_HEIGHT = 10;
const ARROW_COLOR = '#999';
const LINK_DISTANCE = 100;

@observer
class ForceGraph extends Component {
  static propTypes = {
    nodes: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      x: PropTypes.number,
      y: PropTypes.number,
      vx: PropTypes.number,
      vy: PropTypes.number,
      fx: PropTypes.number,
      fy: PropTypes.number,
      avatar: PropTypes.string,
      nodeElement: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
      type: PropTypes.oneOf(['CENTER', 'FEATURE']),
    })).isRequired,
    links: PropTypes.arrayOf(PropTypes.shape({
      source: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      target: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      showArrow: PropTypes.bool,
    })).isRequired,
    height: PropTypes.number,
    width: PropTypes.number,
    tooltips: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      data: PropTypes.object,
    })),
    // tooltipOverlay is a React elemet, accept at least three props:
    // data from this.props.tooltips, left and top for position
    tooltipOverlay: PropTypes.func,
  };

  static defaultProps = {};

  componentDidMount() {
    this.initDraw();
  }

  componentDidUpdate() {
    this.initDraw();
  }

  @observable loadingStatus = 'loading';
  @action
  initDraw = () => {
    if (this.props.nodes && this.props.nodes.length > 0) {
      this.draw();
      this.loadingStatus = 'normal';
    } else {
      this.loadingStatus = 'empty';
    }
  };

  tooltipOverlay = null;

  draw() {
    const canvas = document.querySelector('canvas');

    if (!canvas) {
      return;
    }

    const { width, height } = canvas;
    const context = canvas.getContext('2d');

    const { nodes, links } = this.props;
    const centerNodeId = (_.find(nodes, { type: 'CENTER' }) || {}).id;

    const simulation = d3
      .forceSimulation(nodes)
      .nodes(nodes)
      .force('charge', d3.forceManyBody().strength(-300))
      .force(
        'link',
        d3
          .forceLink(links)
          .distance(LINK_DISTANCE)
          .strength(1)
          .id(d => d.id),
      )
      .force('x', d3.forceX())
      .force('y', d3.forceY())
      .on('tick', ticked);

    d3.select(canvas)
      .call(d3
        .drag()
        .container(canvas)
        .subject(dragsubject)
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended))
      .on('mousemove', mousemove);

    function ticked() {
      context.clearRect(0, 0, width, height);
      context.save();
      context.translate(width / 2, height / 2);

      context.beginPath();
      links.forEach(drawLink);

      context.beginPath();
      nodes.forEach(drawNode);

      context.restore();
    }

    function dragsubject() {
      return simulation.find(d3.event.x - width / 2, d3.event.y - height / 2);
    }

    function dragstarted() {
      if (!d3.event.active) simulation.alphaTarget(0.3).restart();
      d3.event.subject.fx = d3.event.subject.x;
      d3.event.subject.fy = d3.event.subject.y;
    }

    function dragged() {
      d3.event.subject.fx = d3.event.x;
      d3.event.subject.fy = d3.event.y;
    }

    function dragended() {
      if (!d3.event.active) simulation.alphaTarget(0);
      d3.event.subject.fx = null;
      d3.event.subject.fy = null;
    }

    function drawLink(d) {
      const sourceX = d.source.x;
      const sourceY = d.source.y;
      const targetX = d.target.x;
      const targetY = d.target.y;
      context.save();
      context.moveTo(sourceX, sourceY);
      context.lineTo(targetX, targetY);
      context.strokeStyle = '#aaa';
      context.stroke();
      context.restore();
      if (d.showArrow) {
        drawArrow(d.source, d.target);
      }
    }

    function drawArrow(source, target) {
      const sourceId = source.id;
      const sourceX = source.x;
      const sourceY = source.y;
      const targetId = target.id;
      const targetX = target.x;
      const targetY = target.y;
      const diffX = targetX - sourceX;
      const diffY = targetY - sourceY;
      const angle = Math.atan(diffY / diffX);
      const sourceRadius = sourceId === centerNodeId ? CENTER_AVATAR_SIZE / 2 : AVATAR_SIZE / 2;
      const targetRadius = targetId === centerNodeId ? CENTER_AVATAR_SIZE / 2 : AVATAR_SIZE / 2;

      // const distance = Math.sqrt(Math.pow(diffX, 2) + Math.pow(diffY, 2));

      context.save();
      context.beginPath();
      context.translate(sourceX, sourceY);
      context.rotate(angle);
      const moveToXSource = targetX > sourceX ? sourceRadius : -sourceRadius;
      context.moveTo(moveToXSource, 0);
      const lineToXSource =
        targetX > sourceX ? sourceRadius + ARROW_HEIGHT : -sourceRadius - ARROW_HEIGHT;
      context.lineTo(lineToXSource, HALF_ARROW_WIDTH);
      context.lineTo(lineToXSource, -HALF_ARROW_WIDTH);
      context.closePath();
      context.fillStyle = ARROW_COLOR;
      context.fill();
      context.restore();

      context.save();
      context.beginPath();
      context.translate(targetX, targetY);
      context.rotate(angle);
      const moveToXTarget = targetX > sourceX ? -targetRadius : targetRadius;
      context.moveTo(moveToXTarget, 0);
      const lineToXTarget =
        targetX > sourceX ? -targetRadius - ARROW_HEIGHT : targetRadius + ARROW_HEIGHT;
      context.lineTo(lineToXTarget, HALF_ARROW_WIDTH);
      context.lineTo(lineToXTarget, -HALF_ARROW_WIDTH);
      context.closePath();
      context.fillStyle = ARROW_COLOR;
      context.fill();
      context.restore();
    }

    function drawNode(d) {
      const avatarSize = d.type === 'CENTER' ? CENTER_AVATAR_SIZE : AVATAR_SIZE;
      const avatar = document.getElementById(cx(d.id));
      context.save();
      context.beginPath();
      context.arc(d.x, d.y, avatarSize / 2, 0, 2 * Math.PI);
      context.closePath();
      context.clip();
      context.drawImage(avatar, d.x - avatarSize / 2, d.y - avatarSize / 2, avatarSize, avatarSize);
      context.restore();
    }

    const { tooltips, tooltipOverlay } = this.props;
    let tooltipOverlayElement;

    function mousemove() {
      const [x, y] = d3.mouse(this);
      const node = simulation.find(x - width / 2, y - height / 2, AVATAR_SIZE / 2);
      if (node && !tooltipOverlayElement) {
        const { data } = _.find(tooltips, { id: node.id });
        if (!tooltipOverlayElement) {
          tooltipOverlayElement = React.createElement(tooltipOverlay, {
            data,
            left: x,
            top: y,
          });
        }
        ReactDOM.render(tooltipOverlayElement, this.tooltipOverlay);
      } else if (!node && tooltipOverlayElement) {
        tooltipOverlayElement = undefined;
        ReactDOM.render(<div />, this.tooltipOverlay);
      }
    }
  }

  renderAvatar = () =>
    this.props.nodes.map(item =>
      item.nodeElement || (
      <img
        key={item.id}
        id={cx(item.id)}
        src={item.avatar}
        alt="暂无图片"
        width={AVATAR_SIZE}
        height={AVATAR_SIZE}
      />
      ));

  render() {
    return (
      <StatusLayer status={this.loadingStatus}>
        <div className={cx('container')}>
          <canvas width={this.props.width} height={this.props.height} />
          <div style={{ display: 'none' }}>{this.renderAvatar()}</div>
          <div
            refs={ref => {
              this.tooltipOverlay = ref;
            }}
          />
        </div>
      </StatusLayer>
    );
  }
}

export default ForceGraph;
