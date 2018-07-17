/*global isNaN*/
import { message } from 'antd';
import stringToDomElement from 'common/stringToDomElement';
import utils from 'common/utils';
import typeShapeMappingConfig from 'config/typeShapeMapping';
import { jsPlumb } from 'jsplumb';
import _ from 'lodash';
import { action, computed, observable, toJS } from 'mobx';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import uuid from 'uuid/v4';
import styles from './ConnectivityCanvas.scss';
import Node from './Node';
import QuickAction from './QuickAction';
import Slider from './Slider';

const PREFIX = 'connectivity-canvas';
const cx = utils.classnames(PREFIX, styles);

const typeShapeMapping = typeShapeMappingConfig || {
  ENTITY: 'CIRCLE',
  ENGINE: 'SQUARE',
};

const CONNECTOR_COLOR = '#c6d5dd';

const NODE_PICKER_CLASSNAME = 'node-picker';

const CONNECTOR_PARAM = {
  filter: `.${NODE_PICKER_CLASSNAME}`,
  connectionType: 'basic',
  extract: {
    action: 'the-action',
  },
  maxConnections: -1,
};

const SIDE_MENU_ID = 'side-menu-container';
const SIDE_SEARCH_BAR_ID = 'side-search-bar-container';
const TOP_BAR_ID = 'edit-model-top-bar';
// const ANT_TABS_BAR = 'ant-tabs-bar';

const NODE_HIGHLIGHT_CLASSNAME = 'node-highlight';
const NODE_STATUS_CLASSNAME = 'node-node-status';
const NODE_RUNNING_STATUS_CLASSNAME = 'node-running';
const NODE_SUCCESS_STATUS_CLASSNAME = 'node-success';
const NODE_FAIL_STATUS_CLASSNAME = 'node-fail';

const CONTAINER_WIDTH = 10000;
const CONTAINER_HEIGHT = 10000;

const generateRandomString = () => {
  const arr = [];
  uuid(null, arr, 0);
  return `r${arr.join('')}`;
};

class ConnectivityCanvasModel {
  drawing = false;

  jsPlumb = null;
  container = null;
  containerZoom = null;
  containerWrap = null;

  get CONTAINER_ZOOM_WIDTH() {
    return this.containerZoom.offsetWidth;
  }
  get CONTAINER_ZOOM_HEIGHT() {
    return this.containerZoom.offsetHeight;
  }
  nodes = [];

  @observable quickActionPosition = null;
  @observable quickActionDagId = null;

  @action
  showQuickAction = (quickActionDagId, quickActionPosition) => {
    this.quickActionPosition = quickActionPosition;
    this.quickActionDagId = quickActionDagId;
  };

  @action
  hideQuickAction = () => {
    this.quickActionPosition = null;
    this.quickActionDagId = null;
  };

  // zoom
  @observable zoom = 1;

  @action
  changeZoom = zoom => {
    this.zoom = zoom;
  };

  // moveable
  @observable offsetPosition = [0, 0];
  @observable isDrag = false;
}

@observer
class ConnectivityCanvas extends Component {
  static propTypes = {
    initNodes: PropTypes.arrayOf(PropTypes.shape({
      dagId: PropTypes.string,
      parentDagIds: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.string), PropTypes.object]),
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      name: PropTypes.string,
      icon: PropTypes.string,
      position: PropTypes.shape({
        x: PropTypes.number,
        y: PropTypes.number,
      }),
      type: PropTypes.oneOf(['ENTITY', 'ENGINE', 'START_NODE']),
    })),
    zoom: PropTypes.number,
    refreshNodes: PropTypes.func, //return nodeInfo back
    className: PropTypes.string,
    jsPlumbClassName: PropTypes.string,
    connectionValidator: PropTypes.func,
    onConnection: PropTypes.func,
    onNodeClick: PropTypes.func,
    showResult: PropTypes.func,
    highlightNodeIds: PropTypes.arrayOf(PropTypes.string),
    isCurrent: PropTypes.bool,
    index: PropTypes.number,
    nodeExecuteStatus: PropTypes.arrayOf(PropTypes.shape({
      dagId: PropTypes.string,
      executeStatus: PropTypes.oneOf(['running', 'success', 'fail', '']),
    })),
  };

  static defaultProps = {
    refreshNodes: (node, processType, nodes) => {
      /* processType enums: 'ADD', 'REMOVE', 'CONECT', 'DISCONNECT', 'DRAGMOVE' */
      console.dir(node, processType, nodes, JSON.stringify(nodes));
    },
    initNodes: [
      // {
      //   dagId: '68ec4696-fb75-4d3e-846f-df599c3c9983',
      //   parentDagIds: [],
      //   id: 'test',
      //   name: 'test',
      //   icon: 'icon',
      //   position: { x: 40, y: 40 },
      //   type: 'ENTITY',
      // },
      // {
      //   dagId: 'a4df9b73-7a6d-43e3-a016-441ed1d133a0',
      //   parentDagIds: ['68ec4696-fb75-4d3e-846f-df599c3c9983'],
      //   id: 'yonggu',
      //   name: 'yonggu',
      //   icon: 'icon',
      //   position: { x: 500, y: 500 },
      //   type: 'ENGINE',
      // },
      // {
      //   dagId: 'e882661c-1b0f-46de-8362-baa3b7dcf47d',
      //   parentDagIds: ['a4df9b73-7a6d-43e3-a016-441ed1d133a0'],
      //   id: 'yongguLongText',
      //   name: 'a very long text description.......',
      //   icon: 'icon',
      //   position: { x: 200, y: 300 },
      //   type: 'ENGINE',
      // },
    ],
    className: '',
    jsPlumbClassName: '',
    connectionValidator: (sourceDagId, targetDagId) => ({ status: true, errMessage: null }),
    onNodeClick: dagId => {
      console.log(dagId);
    },
    onConnection: (dagId, parentDagId, position) => {
      console.log(dagId, parentDagId, position.x, position.y);
    },
    showResult: dagId => {
      console.log(dagId);
    },
    highlightNodeIds: [],
    isCurrent: true,
    index: 0,
    nodeExecuteStatus: [],
  };

  constructor() {
    super();
    this.model = new ConnectivityCanvasModel();
  }

  componentDidMount() {
    this.init();
    this.setInitNodes(toJS(this.props.initNodes));
  }

  componentWillReceiveProps(nextProps) {
    if (!_.isEqual(nextProps.initNodes, this.props.initNodes)) {
      this.setInitNodes(toJS(nextProps.initNodes));
    }

    if (!_.isEqual(nextProps.highlightNodeIds, this.props.highlightNodeIds)) {
      this.highlightNodes(nextProps.highlightNodeIds);
    }

    if (!_.isEqual(nextProps.nodeExecuteStatus, this.props.nodeExecuteStatus)) {
      this.refreshNodeExecuteStatus(nextProps.nodeExecuteStatus);
    }
    if (nextProps.zoom && !nextProps.zoom !== this.props.zoom) {
      this.model.zoom = nextProps.zoom;
      this.setZoom(nextProps.zoom);
    }
  }

  componentDidUpdate() {
    if (this.props.isCurrent && !this.isDropListner) {
      this.model.container.addEventListener('drop', this.onDrop);
      this.model.container.addEventListener('dragover', this.onDragOver);
      this.isDropListner = true;
    } else if (!this.props.isCurrent && this.isDropListner) {
      this.model.container.removeEventListener('drop', this.onDrop);
      this.model.container.removeEventListener('dragover', this.onDragOver);
      this.isDropListner = false;
    }
  }

  refreshNodes = (node, processType, nodes) => {
    const removeContainerOffsetPosition = lNode => {
      const removedNode = lNode;
      const {
        position: { x, y },
      } = lNode;
      removedNode.position = {
        x: x - CONTAINER_WIDTH / 2,
        y: y - CONTAINER_HEIGHT / 2,
      };
      return removedNode;
    };

    // node is an attribute of nodes, process on nodes will affect node
    const removedNodes = nodes.map(item => removeContainerOffsetPosition(item));

    this.props.refreshNodes(node, processType, removedNodes);
  };

  onDragOver = e => {
    e.preventDefault();
  };

  onDrop = e => {
    e.preventDefault();

    const item = JSON.parse(e.dataTransfer.getData('item'));

    // business logic
    if (item) {
      const {
        id, name, iconUrl, type,
      } = item;
      const { clientX, clientY } = e;
      const position = this.calculateXY(clientX, clientY);
      this.addNode(undefined, id, name, iconUrl, position, type);
    }
    // /business login
  };

  setZoom = (zoom, transformOrigin = [0.5, 0.5]) => {
    if (!isNaN(zoom)) {
      const el = this.model.containerZoom;
      const prefix = ['webkit', 'moz', 'ms', 'o'];
      const s = `scale(${zoom})`;
      const oString = `${transformOrigin[0] * 100}% ${transformOrigin[1] * 100}%`;

      for (const p of prefix) {
        el.style[`${p}Transform`] = s;
        el.style[`${p}TransformOrigin`] = oString;
      }

      el.style.transform = s;
      el.style.transformOrigin = oString;

      this.model.jsPlumb.setZoom(zoom);
    }
  };

  setInitNodes = initNodes => {
    if (Array.isArray(initNodes) && initNodes.length > 0) {
      this.drawNodes(initNodes);
    }
  };

  getParentDagIds = dagId => {
    const node = this.model.nodes.find(value => value.dagId === dagId);
    if (node) {
      return node.parentDagIds;
    }
    return [];
  };

  isDropListner = false;

  highlightNodes = (highlightNodeIds = []) => {
    const allNodes = document.getElementsByClassName('node-icon-wrap');
    for (const node of allNodes) {
      node.classList.remove(NODE_HIGHLIGHT_CLASSNAME);
    }

    const highlightNodes = highlightNodeIds.map(item => document.getElementById(item).getElementsByClassName('node-icon-wrap')[0]);

    for (const highlightNode of highlightNodes) {
      highlightNode.classList.add(NODE_HIGHLIGHT_CLASSNAME);
    }
  };

  refreshNodeExecuteStatus = nodeExecuteStatus => {
    const allStatusMarkers = document.getElementsByClassName(NODE_STATUS_CLASSNAME);
    for (const mark of allStatusMarkers) {
      mark.className = NODE_STATUS_CLASSNAME;
    }

    nodeExecuteStatus.forEach(item => {
      const node = document.getElementById(item.dagId);

      if (!node) {
        return;
      }

      switch (item.executeStatus) {
        case 'running':
          node
            .getElementsByClassName(NODE_STATUS_CLASSNAME)[0]
            .classList.add(NODE_RUNNING_STATUS_CLASSNAME);
          break;
        case 'success':
          node
            .getElementsByClassName(NODE_STATUS_CLASSNAME)[0]
            .classList.add(NODE_SUCCESS_STATUS_CLASSNAME);
          break;
        case 'fail':
          node
            .getElementsByClassName(NODE_STATUS_CLASSNAME)[0]
            .classList.add(NODE_FAIL_STATUS_CLASSNAME);
          break;
        default:
          break;
      }
    });
  };

  calculateXY = (originalX, originalY, reverse = false) => {
    const {
      zoom,
      CONTAINER_ZOOM_WIDTH,
      CONTAINER_ZOOM_HEIGHT,
      containerWrap,
      offsetPosition,
    } = this.model;

    const offsetX =
      (document.getElementById(SIDE_MENU_ID)
        ? document.getElementById(SIDE_MENU_ID).offsetWidth
        : 0) +
      (document.getElementById(SIDE_SEARCH_BAR_ID)
        ? document.getElementById(SIDE_SEARCH_BAR_ID).offsetWidth
        : 0) +
      containerWrap.offsetLeft +
      offsetPosition[0];
    const offsetY =
      (document.getElementById(TOP_BAR_ID) ? document.getElementById(TOP_BAR_ID).offsetHeight : 0) +
      containerWrap.offsetTop +
      offsetPosition[1];

    if (reverse) {
      const x = offsetX + originalX;
      const y = offsetY + originalY;
      return { x, y };
    }

    const zoomX = originalX - offsetX;
    const zoomY = originalY - offsetY;

    const x = (zoomX - CONTAINER_ZOOM_WIDTH / 2) / zoom + CONTAINER_ZOOM_WIDTH / 2;
    const y = (zoomY - CONTAINER_ZOOM_HEIGHT / 2) / zoom + CONTAINER_ZOOM_HEIGHT / 2;
    return { x, y };
  };

  isLoop = false;

  checkLoop = (sourceDagId, targetDagId) => {
    this.isLoop = false;
    const parentDagIds = this.getParentDagIds(sourceDagId);
    for (const parentDagId of parentDagIds) {
      if (parentDagId === targetDagId) {
        this.isLoop = true;
        break;
      }
      this.checkLoop(parentDagId, targetDagId);
    }
    return this.isLoop;
  };

  // mousedownFn = null;

  bindNodeEvents = dagId => {
    const element = document.getElementById(dagId);

    // get the center position of the element
    const calculatePosition = lElement => {
      const { style, offsetWidth, offsetHeight } = lElement;
      const { top, left } = style;
      const x = parseInt(left, 10) + offsetWidth / 2;
      const y = parseInt(top, 10) + offsetHeight / 2;
      return { x, y };
    };

    // let nodeClickFn = null;

    element.addEventListener('click', () => {
      // if (nodeClickFn) {
      //   clearTimeout(nodeClickFn);
      // }
      // if (!this.nodeDragging) {
      //   // windows default time interval to judge whether a dblclick is 500 ms
      //   nodeClickFn = setTimeout(() => {
      //     this.props.onNodeClick(dagId);
      //   }, 501);
      // }
      this.props.onNodeClick(dagId);
    });

    element.oncontextmenu = e => {
      if (document.all) {
        // for IE
        window.event.returnValue = false;
      } else {
        e.preventDefault();
      }
      const {
        offsetPosition: [offsetPositionX, offsetPositionY],
        zoom,
        showQuickAction,
        CONTAINER_ZOOM_WIDTH,
        CONTAINER_ZOOM_HEIGHT,
      } = this.model;
      const { x, y } = calculatePosition(element);
      const position = {
        x:
          (x - CONTAINER_WIDTH / 2 + offsetPositionX - CONTAINER_ZOOM_WIDTH / 2) * zoom +
          CONTAINER_ZOOM_WIDTH / 2,
        y:
          (y - CONTAINER_HEIGHT / 2 + offsetPositionY - CONTAINER_ZOOM_HEIGHT / 2) * zoom +
          CONTAINER_ZOOM_HEIGHT / 2,
      };
      showQuickAction(dagId, position);
    };

    // element.addEventListener('mousedown', e => {
    //   if (e.target.classList.contains(NODE_PICKER_CLASSNAME)) {
    //     return;
    //   }
    //   if (!this.nodeDragging) {
    //     // press duration more than xxx ms, show quickAction
    //     this.mousedownFn = setTimeout(() => {
    //       const position = calculatePosition(element);
    //       this.model.showQuickAction(dagId, position);
    //     }, 500);
    //   }
    // });

    // element.addEventListener('mouseup', () => {
    //   if (this.mousedownFn) {
    //     clearTimeout(this.mousedownFn);
    //   }
    // });

    // element.addEventListener('dblclick', () => {
    //   // do not trigger click when dblclick
    //   clearTimeout(nodeClickFn);
    //   nodeClickFn = null;

    //   const position = calculatePosition(element);
    //   this.model.showQuickAction(dagId, position);
    // });
  };

  addNode = (
    dagId = generateRandomString(),
    id,
    name,
    icon,
    position,
    type,
    isNodesRefresh = true,
  ) => {
    let lPosition;
    // if position is not existed, get a random position
    if (!position) {
      lPosition = {
        x: CONTAINER_WIDTH / 2 + Math.random() * (CONTAINER_WIDTH || 800 - 100),
        y: CONTAINER_HEIGHT / 2 + Math.random() * (CONTAINER_HEIGHT || 500 - 100),
      };
    } else {
      lPosition = {
        x: position.x + CONTAINER_WIDTH / 2,
        y: position.y + CONTAINER_HEIGHT / 2,
      };
    }

    const node = {
      dagId,
      parentDagIds: [],
      id,
      name,
      icon,
      position: lPosition,
      type,
    };

    this.model.nodes.push(node);

    const nodeHtml = renderToStaticMarkup(<Node
      id={dagId}
      text={name}
      icon={icon}
      isStartNode={type === 'START_NODE'}
      shape={typeShapeMapping[type]}
      position={lPosition}
    />);

    const nodeElement = stringToDomElement(nodeHtml);

    this.model.container.appendChild(nodeElement);

    this.initNode(nodeElement, dagId);

    if (isNodesRefresh) {
      this.refreshNodes(node, 'ADD', this.model.nodes);
    }

    // add event
    this.bindNodeEvents(dagId);
  };

  removeNode = removeDagId => {
    if (!removeDagId) {
      return;
    }

    const nodeElement = document.getElementById(removeDagId);

    /* in jsplumb 2.4.0
        8th May 2017

        Several methods and parameters have been renamed to better reflect their function:

        jsPlumbInstance
        detachAllConnections renamed to deleteConnectionsForElement

        detach renamed to deleteConnection. detach ({source.., target:...}) can be achieved with select({source:..,target:..}).delete()

        detachEveryConnection renamed to deleteEveryConnection

        connect method: the deleteEndpointsOnDetach parameter is now deleteEndpointsOnEmpty

        getEndpoints method returns empty list when none found now, not null.

        select method: the return value of this now has a delete method, instead of detach.

        selectEndpoints method : the return value of this now has a deleteEveryConnection method, instead of detachAll.

        Endpoint
        detach method removed
        detachAll renamed to deleteEveryConnection
    */
    this.model.jsPlumb.deleteConnectionsForElement(nodeElement);

    nodeElement.parentElement.removeChild(nodeElement);

    // sync data
    this.syncRemoveNodeData(removeDagId);
  };

  syncRemoveNodeData = (removeDagId, isNodesRefresh = true) => {
    const newNodes = [];
    const { nodes } = this.model;

    nodes.forEach(element => {
      const { dagId, parentDagIds } = element;
      if (dagId !== removeDagId) {
        const returnElement = element;

        returnElement.parentDagIds = parentDagIds.filter(value => value !== removeDagId);

        newNodes.push(returnElement);
      }
    });

    this.model.nodes = newNodes;
    if (isNodesRefresh) {
      const node = nodes.find(value => value.dagId === removeDagId);
      this.refreshNodes(node, 'REMOVE', this.model.nodes);
    }
  };

  connectNodes = (sourceDagId, targetDagId) => {
    this.model.jsPlumb.connect({
      source: sourceDagId,
      target: targetDagId,
    });

    this.syncConnectNodesData(sourceDagId, targetDagId, false);
  };

  syncConnectNodesData = (sourceDagId, targetDagId, isNodesRefresh = true) => {
    const index = this.model.nodes.findIndex(value => value.dagId === targetDagId);
    if (index > -1) {
      this.model.nodes[index].parentDagIds.push(sourceDagId);

      if (isNodesRefresh) {
        this.refreshNodes(this.model.nodes[index], 'CONNECT', this.model.nodes);
      }
    }
  };

  // disConnectNodes = () => {};

  syncDisConnectNodesData = (sourceDagId, targetDagId, isNodesRefresh = true) => {
    const index = this.model.nodes.findIndex(value => value.dagId === targetDagId);
    if (index > -1) {
      this.model.nodes[index].parentDagIds = this.model.nodes[index].parentDagIds.filter(value => value !== sourceDagId);
      // save the deleted parent dag id
      this.model.nodes[index].deletedParentDagId = sourceDagId;
      if (isNodesRefresh) {
        this.refreshNodes(this.model.nodes[index], 'DISCONNECT', this.model.nodes);
      }
    }
  };

  drawNodes = nodes => {
    this.model.drawing = true;
    this.model.jsPlumb.batch(() => {
      for (const node of nodes) {
        const {
          dagId, id, name, icon, position, type,
        } = node;
        this.addNode(dagId, id, name, icon, position, type, false);
      }
      for (const node of nodes) {
        const { dagId, parentDagIds } = node;
        if (parentDagIds && parentDagIds.length > 0) {
          for (const parentDagId of parentDagIds) {
            this.connectNodes(parentDagId, dagId);
          }
        }
      }
    });
    this.model.drawing = false;
  };

  updateNodePosition = (dagId, position) => {
    let draggedNode = {};
    this.model.nodes = this.model.nodes.map(node => {
      const returnNode = node;
      if (node.dagId === dagId) {
        returnNode.position = position;
        draggedNode = returnNode;
      }
      return returnNode;
    });

    this.refreshNodes(draggedNode, 'DRAGMOVE', this.model.nodes);
  };

  nodeDragging = false;

  initNode = (el, dagId) => {
    // initialise draggable elements.
    this.model.jsPlumb.draggable(el, {
      containment: false,
      grid: [10, 10], // Add grid to align automatically px,px
      start: () => {
        // clear mousedown event
        if (this.mousedownFn) {
          clearTimeout(this.mousedownFn);
        }
        this.nodeDragging = true;
      },
      stop: ({ finalPos }) => {
        const x = finalPos[0] + el.offsetWidth / 2;
        const y = finalPos[1] + el.offsetHeight / 2;
        this.updateNodePosition(dagId, { x, y });

        // onClick event is after drag stop event
        setTimeout(() => {
          this.nodeDragging = false;
        }, 0);
      },
    });

    // this.model.jsPlumb.addEndpoint(el, {
    //   uuid: dagId,
    //   connectorClass: cx('endpoint'),
    //   maxConnections: -1,
    // });

    this.model.jsPlumb.makeSource(el, CONNECTOR_PARAM);

    this.model.jsPlumb.makeTarget(el, {
      dropOptions: { hoverClass: cx('drag-hover') },
      anchor: 'Continuous',
      allowLoopback: false,
    });
  };

  connectionValidator = (sourceId, targetId) => {
    const errMessage = [];
    // check if there is a loop conection
    if (this.checkLoop(sourceId, targetId)) {
      errMessage.push('节点不能连接成为闭环！');
    }
    if (this.getParentDagIds(targetId).indexOf(sourceId) > -1) {
      errMessage.push('节点不能重复连接！');
    }

    return errMessage;
  };

  bindMoveableEvents = () => {
    const { containerWrap } = this.model;
    let originLeft;
    let originTop;

    const mouseDownEvent = event => {
      this.model.isDrag = true;
      originLeft = event.clientX - this.model.offsetPosition[0];
      originTop = event.clientY - this.model.offsetPosition[1];
    };

    const mouseMoveEvent = event => {
      if (this.model.isDrag) {
        this.model.offsetPosition = [event.clientX - originLeft, event.clientY - originTop];
      }
    };

    const mouseEndEvent = () => {
      if (this.model.isDrag) {
        this.model.isDrag = false;
      }
    };

    containerWrap.addEventListener('mousedown', mouseDownEvent);
    containerWrap.addEventListener('mousemove', mouseMoveEvent);
    containerWrap.addEventListener('mouseout', mouseEndEvent);
    containerWrap.addEventListener('mouseup', mouseEndEvent);
  };

  bindEvents = () => {
    // bind a click listener to each connection; the connection is deleted.
    this.model.jsPlumb.bind('dblclick', this.model.jsPlumb.deleteConnection);

    // bind a connection listener. note that the parameter passed to this function contains more than
    // just the new connection - see the documentation for a full list of what is included in 'info'.
    // this listener sets the connection's internal
    // id as the label overlay's text.
    this.model.jsPlumb.bind('connection', info => {
      if (this.model.drawing) {
        return;
      }
      // sync node data
      const {
        sourceId,
        targetId,
        target: {
          offsetLeft, offsetTop, offsetWidth, offsetHeight,
        },
      } = info;

      this.syncConnectNodesData(sourceId, targetId);

      // get the center position of the node, offsetWidth / 2 or offsetHeight / 2
      const x = offsetLeft - CONTAINER_WIDTH / 2 + this.model.offsetPosition[0] + offsetWidth / 2;
      const y = offsetTop - CONTAINER_HEIGHT / 2 + this.model.offsetPosition[1] + offsetHeight / 2;

      const zoomX =
        (x - this.model.CONTAINER_ZOOM_WIDTH / 2) * this.model.zoom +
        this.model.CONTAINER_ZOOM_WIDTH / 2 -
        this.model.offsetPosition[0];
      const zoomY =
        (y - this.model.CONTAINER_ZOOM_HEIGHT / 2) * this.model.zoom +
        this.model.CONTAINER_ZOOM_HEIGHT / 2 -
        this.model.offsetPosition[1];

      const position = this.calculateXY(zoomX, zoomY, true);

      let side = '';

      if (zoomX + this.model.offsetPosition[0] > this.model.CONTAINER_ZOOM_WIDTH / 2) {
        side = 'left';
      } else {
        side = 'right';
      }

      if (zoomY + this.model.offsetPosition[1] > this.model.CONTAINER_ZOOM_HEIGHT / 2) {
        side = `${side}Top`;
        position.y -= this.model.CONTAINER_ZOOM_HEIGHT;
      } else {
        side = `${side}Bottom`;
      }

      position.side = side;

      this.props.onConnection(targetId, sourceId, position, () => {
        this.model.jsPlumb.deleteConnection(info.connection);
      });
    });

    this.model.jsPlumb.bind('connectionDetached', info => {
      // sync node data
      const { sourceId, targetId } = info;
      this.syncDisConnectNodesData(sourceId, targetId);
    });

    this.model.jsPlumb.bind('connectionMoved', info => {
      // sync node data
      const { originalSourceId, originalTargetId } = info;
      this.syncDisConnectNodesData(originalSourceId, originalTargetId, false);
    });

    this.model.jsPlumb.bind('beforeDrop', info => {
      // If you return false (or nothing) from this callback, the new Connection is aborted and removed from the UI.
      // sync node data
      const { sourceId, targetId } = info;

      let errMessages = this.connectionValidator(sourceId, targetId);

      if (errMessages.length === 0) {
        // return errMessages[]
        const customErrMessages = this.props.connectionValidator(sourceId, targetId);
        if (customErrMessages && customErrMessages.length > 0) {
          errMessages = customErrMessages;
        }
      }

      if (errMessages.length > 0) {
        message.error(errMessages.join('， ') || '该节点不能连接！');
        return false;
      }
      return true;
    });

    this.model.container.addEventListener('click', this.model.hideQuickAction);

    this.bindMoveableEvents();
  };

  init = () => {
    this.model.jsPlumb = jsPlumb.getInstance({
      Anchor: 'Continuous',
      MaxConnections: -1,
      Endpoint: ['Dot', { radius: 4 }],
      DragOptions: { cursor: 'pointer', zIndex: 100 },
      Connector: 'Straight',
      PaintStyle: {
        stroke: CONNECTOR_COLOR,
        strokeWidth: 2,
        outlineStroke: 'transparent',
        outlineWidth: 4,
      },
      // ConnectorStyle: {
      //   stroke: CONNECTOR_COLOR,
      //   strokeWidth: 2,
      //   outlineStroke: 'transparent',
      //   outlineWidth: 4,
      // },
      HoverPaintStyle: { stroke: '#09d0ee', strokeWidth: 2 },
      ConnectionOverlays: [
        [
          'Arrow',
          {
            location: 1,
            visible: true,
            width: 11,
            length: 11,
            id: 'ARROW',
            events: {
              click() {
                // alert('you clicked on the arrow overlay');
              },
            },
          },
        ],
        // [
        //   'Label',
        //   {
        //     location: 0.1,
        //     id: 'label',
        //     cssClass: 'aLabel',
        //     events: {
        //       tap() {
        //         alert('hey');
        //       },
        //     },
        //   },
        // ],
      ],
      Container: `${cx('container')}-${this.props.index}`,
    });

    this.model.jsPlumb.registerConnectionType('basic', {
      anchor: 'Continuous',
      // connector: 'StateMachine',
      connector: 'Straight',
    });

    this.bindEvents();
  };

  render() {
    // three layer of div, used for background -> zoom -> offset
    return (
      <div
        id={`${cx('container-wrap')}-${this.props.index}`}
        className={`${cx('container-wrap', { 'is-drag': this.model.isDrag })} ${
          this.props.className
        }`}
        ref={element => {
          this.model.containerWrap = element;
        }}
      >
        <div
          id={`${cx('container-zoom')}-${this.props.index}`}
          className={cx('container-zoom', { 'is-drag': this.model.isDrag })}
          ref={element => {
            this.model.containerZoom = element;
          }}
        >
          <div
            id={`${cx('container')}-${this.props.index}`}
            className={`${cx('container', { 'is-drag': this.model.isDrag })} ${
              this.props.jsPlumbClassName
            }`}
            style={{
              left: this.model.offsetPosition[0] - CONTAINER_WIDTH / 2,
              top: this.model.offsetPosition[1] - CONTAINER_HEIGHT / 2,
            }}
            ref={element => {
              this.model.container = element;
            }}
            // onDrop={this.onDrop}
            // onDragOver={this.onDragOver}
          />
        </div>
        <QuickAction
          position={this.model.quickActionPosition}
          dagId={this.model.quickActionDagId}
          onDelete={dagId => {
            this.removeNode(dagId);
            this.model.hideQuickAction();
          }}
          onResult={dagId => {
            this.props.showResult(dagId);
            this.model.hideQuickAction();
          }}
          // onCancel={this.model.hideQuickAction}
        />
        <Slider
          value={this.model.zoom}
          onChange={zoom => {
            this.model.changeZoom(zoom);
            this.setZoom(zoom);
          }}
        />
      </div>
    );
  }
}

export default ConnectivityCanvas;
