import { Component } from 'react';
import { isElement } from 'react-is';
import { renderToStaticMarkup } from 'react-dom/server';
import { findDOMNode } from 'react-dom';
import { Provider, connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Layout, Spin, Button, message } from 'antd';
import { push } from 'connected-react-router';
import { Switch, Route, Redirect } from 'react-router-dom';
import pathToRegexp from 'path-to-regexp';
import enquireJs from 'enquire.js';
import GlobalHeader from '@/components/GlobalHeader';
import Modal from '@/components/Modal';
import ChangePasswordModal from '@/components/Modal/ChangePasswordModal';
import SpFullWarningModal from '@/components/Modal/SpFullWarningModal';
import ScanHolderModal from '@/components/Modal/ScanHolderModal';
import SiderMenu from '@/components/SiderMenu';
import Audio from '@/components/Audio';
import {
  getRoutes,
  isiOS,
  isWeiXin,
  CDN_IMG_HOST,
  asyncInjectScript,
  downloadByBlob,
  CDN_STATIC_HOST,
  isPDA,
} from '@/utils/utils';
import { formatDateTime, formatDateTimeCompact, formatMoney } from '@/utils/format';
import { add } from '@/commons/lib/math';
import { modal, notification } from '@/utils/feedback';
import Authorized from '@/utils/Authorized';
import { OpenXMLExcelAccept } from '@/utils/upload';
import { connectWS } from '@/commons/lib/websocket';
import NotFound from '@/routes/Exception/404';
import { store } from '@/utils/request';
import { noop } from '@/commons';
import { openScan } from '@/commons/lib/pda';
import { speechSynthesisSpeak } from '@/commons/lib/media';
import { pathFormatter, getMenuData } from '@/common/menu';
import logo from '@/assets/logo.svg';
import style from './BasicLayout.less';

const { Content, Header } = Layout;
const { AuthorizedRoute, check } = Authorized;

/**
 * 根据菜单取得重定向地址.
 */
const getRedirect = (item, redirectData) => {
  if (item?.children?.[0]?.path) {
    redirectData.push({
      from: `${item.path}`,
      to: `${item.children[0].path}`,
    });
    item.children.forEach(children => {
      getRedirect(children, redirectData);
    });
  }
};

/**
 * 获取面包屑映射
 * @param {Object} menuData 菜单配置
 * @param {Object} routerData 路由配置
 */
const getBreadcrumbNameMap = (menuData, routerData) => {
  const result = {};
  const childResult = {};
  // eslint-disable-next-line no-restricted-syntax
  for (const i of menuData) {
    if (!routerData[i.path]) {
      result[i.path] = i;
    }
    if (i.children) {
      Object.assign(childResult, getBreadcrumbNameMap(i.children, routerData));
    }
  }
  return { ...routerData, ...result, ...childResult };
};

const directoryLevelParentId = 300_000; // 底层如果是目录的话，其parentId应该是这个值
const serverDataChildrenKey = 'sysMenuMiniList';

const findMenuByPath = (list, path) => {
  let target;
  (list || []).some(menu => {
    if (menu.path === path) {
      target = menu;
      return true;
    }
    target = findMenuByPath(menu[serverDataChildrenKey], path);
    if (target) {
      return true;
    }
    return false;
  });
  return target;
};

// 查找当前菜单授权按钮类型
const getAuthorizedBtnTypes = (serverMenuData, location) => {
  if (serverMenuData && serverMenuData.length > 0) {
    const currentPath = location.pathname;
    const foundedMenu = findMenuByPath(serverMenuData, currentPath);
    if (foundedMenu) {
      return (foundedMenu.sysMenuBtnList || []).map(item => item.btnType);
    }
  }
  return [];
};

// const query = {
//   'screen-xs': {
//     maxWidth: 575,
//   },
//   'screen-sm': {
//     minWidth: 576,
//     maxWidth: 767,
//   },
//   'screen-md': {
//     minWidth: 768,
//     maxWidth: 991,
//   },
//   'screen-lg': {
//     minWidth: 992,
//     maxWidth: 1199,
//   },
//   'screen-xl': {
//     minWidth: 1200,
//     maxWidth: 1599,
//   },
//   'screen-xxl': {
//     minWidth: 1600,
//   },
// };

function filterMenu(allList, serverList) {
  if (allList == null || allList.length === 0 || serverList == null || serverList.length === 0) {
    return [];
  }
  const list = [];
  allList.forEach(item => {
    const foundedSItem = item.path === '/dashboard' ? item : serverList.find(sItem => item.path === sItem.path);
    if (foundedSItem == null) {
      return;
    }
    list.push({
      ...item,
      name: foundedSItem.name || item.name,
      sysMenuBtnList: foundedSItem.sysMenuBtnList, // 按钮权限复制到菜单数据上
      hideInMenu: foundedSItem.path === '/dashboard' ? false : foundedSItem.status !== 0,
      children: filterMenu(item.children, foundedSItem[serverDataChildrenKey]),
    });
  });
  return list;
}

function getServerMenuList(serverMenuData) {
  if (serverMenuData == null || !Array.isArray(serverMenuData)) {
    return [];
  }
  const serverMenuList = pathFormatter(serverMenuData, serverDataChildrenKey);
  // 遍历第一级
  return serverMenuList.filter(item => {
    return item.parentId === directoryLevelParentId;
  });
}

// getMenuData() 里始终是全部的，通过与服务器对比输出实际有权限的
function getShowMenuData(menuInfo) {
  const allMenu = getMenuData();
  const result = filterMenu(allMenu, menuInfo);
  return result;
}

const markupReg = /<\/?.+?\/?>/g;

class BasicLayout extends Component {
  mediaQuery = 'only screen and (max-width: 767.99px)';

  static childContextTypes = {
    location: PropTypes.object,
    getScopeAuthorizedBtnTypes: PropTypes.func,
    breadcrumbNameMap: PropTypes.object,
    isAuthorized: PropTypes.func,
    weixinConfig: PropTypes.func,
    scanQRCode: PropTypes.func,
    isMobile: PropTypes.bool,
    writeFile: PropTypes.func,
    getTableNavPath: PropTypes.func,
    convertNodeToString: PropTypes.func,
    playPayAudio: PropTypes.func,
    playVerifyAudio: PropTypes.func,
    getCurrentServerTime: PropTypes.func,
    socket: PropTypes.object,
  };

  state = {
    isMobile: false,

    iosWxJsConfigResult: undefined,

    ydmapQRCodeVisible: false,
    spFullWarningData: null,
    // spFullWarningData: {
    //   companyId: 100757,
    //   salesId: 101224,
    //   salesName: '支付测试场馆',
    //   warnTime: 1589335914635,
    //   professionalName: '羽毛球',
    //   companyName: '支付测试单位',
    //   maxPersionNum: 10,
    //   startTime: 1357005600000,
    //   warnPersionNum: 2,
    //   curAccountNum: 3,
    //   endTime: 1357009200000,
    //   professionalId: 200002,
    // },
    ticketChecking: false,

    noticeIconVisible: false,

    changePwdVisible: false,
    // 强制要求必须修改密码
    changePwdForce: false,

    scanHolderVisible: false,
  };

  scanHolderTimer = null;

  getChildContext() {
    const { location, routerData, serverMenuData, currentUser } = this.props;
    const { isMobile: mb } = this.state;
    const serverData = getServerMenuList(serverMenuData);
    const menuData = getShowMenuData(serverData);
    const authorizedBtnTypes = getAuthorizedBtnTypes(serverData, location);
    return {
      socket: this.socket,
      location,
      convertNodeToString: this.convertNodeToString,
      breadcrumbNameMap: getBreadcrumbNameMap(menuData, routerData),
      getScopeAuthorizedBtnTypes: pathname => {
        return getAuthorizedBtnTypes(serverData, { pathname });
      },
      isAuthorized: auth => {
        if (auth == null) {
          return true;
        }
        return authorizedBtnTypes.includes(auth);
      },
      isMobile: mb,
      weixinConfig: this.weixinConfig,
      // 如果能处理则返回true,否则返回false
      scanQRCode: (cb = noop, ticketChecking) => {
        if (isPDA()) {
          if (this.scanHolderTimer) {
            clearTimeout(this.scanHolderTimer);
          }
          this.handleScanHolderVisibleChange(true);
          // pda扫码超时关闭时间是3秒多一点, 但是由于设备动画性能问题打开后关闭都滞后了
          this.scanHolderTimer = setTimeout(this.closeScanHolderModal, 1000 * 3);
          openScan()
            .catch(e => {
              this.closeScanHolderModal();
              message.error(e.message);
            })
            .then(result => {
              if (result == null) {
                return;
              }
              this.closeScanHolderModal();
              // cb可能是耗时操作，所以没有把关闭scanHolder放到finally
              cb(result?.[0]);
            });
          return true;
        }
        this.weixinConfig(
          ['scanQRCode'],
          () => {
            const wx = window.jWeixin;
            wx.scanQRCode({
              needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
              scanType: ['qrCode', 'barCode'], // 可以指定扫二维码还是一维码，默认二者都有
              success: ({ resultStr }) => {
                cb(resultStr);
              },
            });
          },
          ticketChecking
        );
        return isWeiXin();
      },
      playPayAudio: (key, amount) => {
        const { PayPlatform } = this.props;
        if (amount > 0) {
          let payWayName;
          if (key === PayPlatform.Weixin.key) {
            payWayName = PayPlatform.Weixin.value;
          } else if (key === PayPlatform.Zfb.key) {
            payWayName = PayPlatform.Zfb.value;
          }
          if (payWayName && speechSynthesisSpeak(`${payWayName}支付到账${formatMoney(amount)}元`)) {
            return;
          }
        }
        let useAudio;
        if (key === PayPlatform.Weixin.key) {
          useAudio = this.wechatpayAudio;
        } else if (key === PayPlatform.Zfb.key) {
          useAudio = this.alipayAudio;
        }
        if (useAudio) {
          useAudio.play().catch(e => {
            // eslint-disable-next-line no-console
            console.log(e);
          });
        }
      },
      playVerifyAudio: ok => {
        const useAudio = ok ? this.verifySuccess : this.verifyFailed;
        if (useAudio) {
          useAudio.play().catch(e => {
            // eslint-disable-next-line no-console
            console.log(e);
          });
        }
      },
      getCurrentServerTime: () => {
        const { duration } = currentUser;
        return Date.now() - duration;
      },
      /**
       * 写导出的文件
       */
      writeFile: id => {
        const { todoNotices } = this.props;
        const {
          data,
          displayedFieldsStrList,
          startTime,
          endTime,
          fileName,
          sheetName: sname,
          options,
        } = (todoNotices || []).find(item => item.id === id) || {};
        // 没下载完数据
        if (endTime == null) {
          return;
        }
        // excel 不允许sheetname 存在这些字符, blob下载时文件名会替换为下横岗(_), 这里也换成它
        // 但blob下载时文件名会替换的字符是否与sheetname不允许的字符一样，尚不确定。
        // ['\\', '/', '?', ':', '*', '[', ']']
        // https://github.com/amilajack/eslint-plugin-compat/issues/395
        const sheetName = sname.slice(0, 31).replace(/[*/:?[\\\]]/g, '_');
        const { columns, columnSettings, ignoreSum, doRowSpan } = options || {};
        const exportList = [...(data || [])];
        asyncInjectScript(`${CDN_STATIC_HOST}/static/exceljs/4.2.1/dist/exceljs.min.js`, 'ExcelJS')
          .catch(() => {
            message.error(
              '导出功能启用失败：您的浏览器版本过低不支持此操作，请升级到最新版本或更换浏览器重试，推荐使用Chrome浏览器。'
            );
          })
          .then(Excel => {
            if (Excel == null) {
              return;
            }
            message.info('加载完成，正在导出文件，请稍等...');
            const PIXELS_PER_EXCEL_WIDTH_UNIT = 7.5;

            const workbook = new Excel.Workbook();
            const worksheet = workbook.addWorksheet(sheetName, {
              views: [
                {
                  xSplit: 1,
                  ySplit: 1,
                },
              ],
            });

            const tableRowHeight = 32;
            const tableAlignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
            const whileRowAlignment = { horizontal: 'left' };

            // 分组表头二位数组
            const groupHeaderMatrix = [];
            let headDepth = 1;

            const settingsKeys = [];

            const reduceColumns = (columns1, array, level = 1) => {
              groupHeaderMatrix[level - 1] = groupHeaderMatrix[level - 1] || [];
              headDepth = Math.max(headDepth, level);
              if (Array.isArray(columns1)) {
                columns1.forEach(column => {
                  const { title, dataIndex, key, width, children, render, ...col } = column;
                  groupHeaderMatrix[level - 1][array.length] = this.convertNodeToString(title);
                  if (Array.isArray(children) && children.length > 0) {
                    reduceColumns(children, array, level + 1);
                    return;
                  }
                  const indexStr = dataIndex || key;
                  settingsKeys.push(indexStr);
                  const setting = columnSettings[indexStr] || {};
                  const useWidth = setting.width || width;
                  array.push({
                    header: title,
                    key: indexStr,
                    width: useWidth > 0 ? useWidth / PIXELS_PER_EXCEL_WIDTH_UNIT : undefined,
                    style: {
                      alignment: tableAlignment,
                      numFmt: setting.numFmt,
                    },
                    // 其他数据
                    col: {
                      ...col,
                      headDepth: level,
                    },
                  });
                });
              }
            };

            const cs = [];
            reduceColumns(columns, cs);
            worksheet.columns = cs;
            const csLength = exportList.length === 0 ? 12 : cs.length;

            // 如果有数据且collect控制的汇总字段
            const moneyFmtFieldNames = settingsKeys.filter(key => columnSettings[key] && columnSettings[key].collect);
            const addSum = !ignoreSum && exportList.length > 0 && moneyFmtFieldNames.length > 0;
            if (addSum) {
              const row = {
                [cs[0].key]: '合计', // 第一列位置
              };
              moneyFmtFieldNames.forEach(dataIndex => {
                row[dataIndex] = exportList.reduce(
                  // $_ignoreSum 忽略本行的，不合计
                  (prev, current) => {
                    const { noRowSpan } = columnSettings[dataIndex] || {};
                    // collect的列不支持rowSpanByValue
                    // $_rowSpan 本行符合rowspan
                    return current.$_ignoreSum || (current.$_rowSpan && !noRowSpan)
                      ? prev
                      : add(prev, current[dataIndex]);
                  },
                  0
                );
              });
              exportList.push(
                {}, // 空行隔开
                row
              );
            }

            let rowIndex = 0;
            // columns 头虽然占一行但是此时rowIndex是0，后面要往前插入行，所以不一开始设置行高
            // worksheet.lastRow.height = rowHeight;
            rowIndex += 1;

            exportList.forEach(record => {
              worksheet.addRow(record);
              // 临时方案
              worksheet.lastRow.height = tableRowHeight;
            });
            rowIndex += exportList.length;

            const spliceRowsBeforeHeader = [];
            if (displayedFieldsStrList.length > 0) {
              spliceRowsBeforeHeader.push([`#搜索条件| ${displayedFieldsStrList.join('        ')}`]);
            }
            spliceRowsBeforeHeader.push([
              `#--------------------------------------------------${sheetName}--------------------------------------------------`,
            ]);
            const prevHeaderRowLength = spliceRowsBeforeHeader.length;
            if (headDepth > 1) {
              // 多减1是因为最后一层使用worksheet.columns生成
              for (let idx = 0; idx < groupHeaderMatrix.length - 1; idx += 1) {
                const matrixRow = groupHeaderMatrix[idx];
                // console.log(matrixRow)
                spliceRowsBeforeHeader.push(matrixRow);
              }
            }
            // 分割开始
            worksheet.spliceRows(1, 0, ...spliceRowsBeforeHeader);
            rowIndex += spliceRowsBeforeHeader.length;
            let row;
            for (let idx = 0; idx < spliceRowsBeforeHeader.length; idx += 1) {
              const rowIdx = idx + 1;
              row = worksheet.getRow(rowIdx);
              if (rowIdx < prevHeaderRowLength + 1) {
                worksheet.mergeCells(rowIdx, 1, rowIdx, csLength); // top,left,bottom,right
                row.alignment = whileRowAlignment;
                row.height = worksheet.properties.defaultRowHeight; // Default row height
              } else {
                row.alignment = tableAlignment;
                row.height = tableRowHeight; // Default row height

                const matrixRowIdx = rowIdx - prevHeaderRowLength - 1;
                const matrixRow = groupHeaderMatrix[matrixRowIdx];

                // 合并当前行的分组头
                // TODO 暂不支持超过两层的分组头
                // forEach 会忽略empty
                matrixRow.forEach((title, i) => {
                  if (
                    (i === csLength - 1 || matrixRow[i + 1] != null) &&
                    groupHeaderMatrix[matrixRowIdx + 1][i] == null
                  ) {
                    worksheet.mergeCells(rowIdx, i + 1, rowIdx + 1, i + 1); // top,left,bottom,right
                  } else {
                    let end = i;
                    while (end < csLength - 1 && matrixRow[end + 1] == null) {
                      end += 1;
                    }
                    worksheet.mergeCells(rowIdx, i + 1, rowIdx, end + 1); // top,left,bottom,right
                  }
                });
              }

              // 上面插入内容导致数据行style错位，补起来
              const dataRow = worksheet.getRow(rowIndex - idx);
              dataRow.height = tableRowHeight;
            }

            // 添加验证数据，目前只用到dropdown
            const validationsFields = settingsKeys.filter(
              dataIndex => columnSettings[dataIndex] && columnSettings[dataIndex].validations
            );
            if (validationsFields.length > 0) {
              exportList.forEach((record, j) => {
                if (addSum && j < 2) {
                  return;
                }
                validationsFields.forEach(dataIndex => {
                  const valiConfig = columnSettings[dataIndex].validations;
                  if (valiConfig == null) {
                    return;
                  }
                  const items = valiConfig.items || [];
                  if (items.length === 0) {
                    return;
                  }
                  const cellIndex = cs.findIndex(item => item.key === dataIndex);
                  if (cellIndex < 0) {
                    return;
                  }
                  const textList = ['请选择', ...items];
                  const cell = worksheet.getRow(rowIndex - j).getCell(cellIndex + 1);
                  cell.dataValidation = {
                    type: 'list',
                    allowBlank: false,
                    formulae: [`"${textList.join(',')}"`],
                  };
                  if (cell.value == null) {
                    [cell.value] = textList;
                  }
                });
              });
            }

            // 这里的逻辑与表格显示的逻辑要一致，修改这里那边也要修改
            if (doRowSpan) {
              // 排除掉合计填补的数据
              const dataList = addSum ? exportList.slice(0, -2) : exportList;
              // cs里是拉平的所有需要的列，不含有有效children的
              cs.forEach(({ col, key }, colIndex) => {
                const { noRowSpan, headDepth: hd } = col;
                // 只支持第一级列头的rowspan
                if (noRowSpan || hd > 1) {
                  return;
                }
                // 列索引数保存本列累计值相同的计数
                let valueCounter = 0;
                dataList.forEach((record, idx) => {
                  if (idx === 0) {
                    valueCounter = 1;
                    return;
                  }
                  const value = record.$_originValues[key]; // 使用原始值
                  const rsValue = record.$_rsValue;
                  // 上一行
                  const upRow = exportList[idx - 1];
                  const upValue = upRow.$_originValues[key];
                  const upRsValue = upRow.$_rsValue;
                  // 一直合并到最后一行
                  let mergeToEnd = false;
                  // _sp行不和任何行进行rowspan
                  if (!(record.$_sp || upRow.$_sp) && upValue === value && upRsValue === rsValue) {
                    // 值相同
                    valueCounter += 1;
                    // 如果值相同到最后一行，允许去到下面执行合并
                    if (idx < dataList.length - 1) {
                      return;
                    }
                    mergeToEnd = true;
                  }
                  if (valueCounter > 1) {
                    let dataRowIdx = rowIndex - exportList.length + 1 + idx;
                    // 每次合并其实使由下一个差异行执行的，但是如果是最后一行，提前在本行执行就有问题，dataRowIdx需要假设成下一行
                    if (mergeToEnd) {
                      dataRowIdx += 1;
                    }
                    worksheet.mergeCells(dataRowIdx - valueCounter, colIndex + 1, dataRowIdx - 1, colIndex + 1); // top,left,bottom,right
                  }
                  // 相同结束从新计数
                  valueCounter = 1;
                });
              });
            }

            // 分割结束
            rowIndex += 1;
            worksheet.spliceRows(rowIndex, 0, [
              `#--------------------------------------------------${sheetName}--------------------------------------------------`,
            ]);
            worksheet.mergeCells(rowIndex, 1, rowIndex, csLength); // top,left,bottom,right
            row = worksheet.getRow(rowIndex);
            row.alignment = whileRowAlignment;

            // 时间戳
            rowIndex += 1;
            worksheet.spliceRows(rowIndex, 0, [
              `#导出开始时间：[${formatDateTime(startTime)}]    导出完成时间：[${formatDateTime(endTime)}]`,
            ]);
            worksheet.mergeCells(rowIndex, 1, rowIndex, csLength); // top,left,bottom,right
            row = worksheet.getRow(rowIndex);
            row.alignment = whileRowAlignment;

            // workbook.xlsx.writeFile(fileName);
            // eslint-disable-next-line consistent-return
            return workbook.xlsx.writeBuffer().then(buffer => {
              const blob = new Blob([buffer], {
                type: `${OpenXMLExcelAccept};charset=UTF-8`,
              });
              downloadByBlob(blob, `${fileName}_${formatDateTimeCompact(Date.now())}.xlsx`);
            });
          })
          .catch(e => {
            message.error(`文件生成出错: ${e.message}`);
            // eslint-disable-next-line no-console
            console.error(e);
          });
      },
      /**
       * 获得表格路径文本描述
       */
      getTableNavPath: table => {
        if (table == null) {
          return null;
        }
        // 理论上.ant-layout-content 一定有
        const layoutContent = document.querySelector('.ant-layout-content');
        // eslint-disable-next-line react/no-find-dom-node
        const tableDom = findDOMNode(table);
        let tempNode = tableDom;
        const list = [];
        do {
          tempNode = tempNode.parentNode;
          // 如果遇到tabs
          if (tempNode.classList.contains('ant-tabs')) {
            const activeTab = tempNode.querySelector('.ant-tabs .ant-tabs-tab-active');
            if (activeTab) {
              list.unshift(activeTab.textContent || activeTab.innerText);
            }
          }
          if (tempNode === layoutContent) {
            const activeTab = tempNode.querySelector('.page-header-tabs-wrapper .ant-tabs .ant-tabs-tab-active');
            if (activeTab) {
              list.unshift(activeTab.textContent || activeTab.innerText);
            }
            break;
          }
          if (tableDom === document.body) {
            break;
          }
          // eslint-disable-next-line no-constant-condition
        } while (true);
        const breadcrumb = layoutContent.querySelector('.ant-breadcrumb');
        if (breadcrumb) {
          const bcList = breadcrumb.querySelectorAll('.ant-breadcrumb-link');
          if (bcList.length > 0) {
            list.unshift(bcList[bcList.length - 1].textContent || bcList[bcList.length - 1].innerText);
          }
        }
        if (list.length === 0) {
          return null;
        }
        return list.join('_');
      },
    };
  }

  componentDidMount() {
    const wx = window.jWeixin;
    if (wx) {
      // eslint-disable-next-line no-underscore-dangle
      wx.__errorHandler = res => {
        notification.error(res.errMsg);
      };
    }
    window.addEventListener('storage', this.onStorage);
    window.GlobalScanCallback = function () {
      message.info('请从对应的功能页面发起扫码，快速扫码暂不支持');
    };
    enquireJs.register(this.mediaQuery, {
      match: () => {
        this.setState({
          isMobile: true,
        });
      },
      unmatch: () => {
        this.setState({
          isMobile: false,
        });
      },
      destroy: () => {
        this.setState({
          isMobile: false,
        });
      },
    });
    const { dispatch } = this.props;
    dispatch({
      type: 'user/fetchCurrent',
    }).then(result => {
      const { sysUser } = result || {};
      const { changePassword } = sysUser || {};
      if (changePassword) {
        this.setState({
          changePwdVisible: true,
          changePwdForce: true,
        });
        return;
      }
      if (result) {
        this.loadPersonalization();
        dispatch({
          type: 'user/fetchMenu',
        });
        dispatch({
          type: 'venue/fetch',
        });
        this.socket = connectWS('/v3/websocket/socketServer.do'); // 建立websocket连接
        this.wsEventListener(); // 监听websocket message Event
      }
    });
  }

  componentDidUpdate(preProps) {
    document.title = this.getPageTitle();
    const { location } = this.props;
    if (location.pathname !== preProps.location.pathname) {
      this.loadPersonalization();
      window.scrollTo(0, 0);
    }
  }

  componentWillUnmount() {
    window.removeEventListener('storage', this.onStorage);
    enquireJs.unregister(this.mediaQuery);
    this.handleNoticeClear();
    this.clearServerMenuData();
    this.removeWsListener(); // remove websocket message Event
    if (this.socket) {
      this.socket.closeAndDeprecate();
    }
  }

  // 处理其他标签重新登陆， 非自己tab导致的修改才会触发,
  onStorage = ev => {
    const { key, newValue } = ev;
    // ignore other keys
    if (key !== 're-login-flag') {
      return;
    }
    if (!newValue) {
      return;
    }
    const { dispatch } = this.props;
    if (+newValue > 0) {
      modal.confirm('检测到您已重新登陆，将以新的会话身份刷新页面', {
        cancelButtonProps: {
          className: 'hidden',
        },
        onOk() {
          window.location.reload(true);
        },
        onCancel() {
          window.location.reload(true);
        },
      });
      return;
    }
    dispatch(push(`/user/login?redirect=${encodeURIComponent(window.location.href)}`));
  };

  getPageTitle() {
    const { routerData, location } = this.props;
    const { pathname } = location;
    let title = '管理控制台';
    // match params path
    const currRouterData = (Object.entries(routerData).find(([key]) => pathToRegexp(key).test(pathname)) || [])[1];
    if (currRouterData && currRouterData.name) {
      title = `${currRouterData.name} - ${title}`;
    }
    return title;
  }

  /**
   * 微信config,ios只注册一次，其他每次使用都注册一次
   * // iOS微信签名问题:hack
   */
  weixinConfig = (jsApiList, callback, ticketChecking) => {
    if (!isWeiXin()) {
      if (typeof ticketChecking === 'boolean') {
        this.showYdmapQRCode(ticketChecking);
      }
      return;
    }
    const { dispatch } = this.props;
    const { iosWxJsConfigResult } = this.state;
    (iosWxJsConfigResult == null || !isiOS()
      ? dispatch({
          type: 'global/wxJsConfig',
        })
      : Promise.resolve(iosWxJsConfigResult)
    )
      .catch(e => {
        if (e.code === 428) {
          this.showYdmapQRCode();
        } else {
          notification.error(e.message);
        }
      })
      .then(data => {
        if (data == null) {
          notification.error('未能获取到可用的微信配置信息');
          return;
        }
        if (isiOS()) {
          this.setState({
            iosWxJsConfigResult: data,
          });
        }
        const wx = window.jWeixin;
        const { appId, timestamp, nonStr, signature } = data;
        wx.config({
          debug: false,
          appId,
          timestamp,
          nonceStr: nonStr,
          signature,
          jsApiList,
        });

        wx.error(
          // eslint-disable-next-line no-underscore-dangle
          wx.__errorHandler ||
            (res => {
              notification.error(res.errMsg);
            })
        );

        wx.ready(() => {
          callback(data);
        });
      });
  };

  convertNodeToString = any => {
    if (Array.isArray(any)) {
      return any.map(item => this.convertNodeToString(item)).join('');
    }
    if (isElement(any)) {
      try {
        // redux Provider包装避免需要用到store数据的组件，比如会员服务的DataContent
        return renderToStaticMarkup(<Provider store={store}>{any}</Provider>)
          .replace(markupReg, '')
          .trim();
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
        return any.toString();
      }
    }
    return any;
  };

  /**
   * 加载个性化数据配置
   */
  loadPersonalization = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'datatable/fetchPagePersonalization',
    });
  };

  showYdmapQRCode = ticketChecking => {
    this.handleYdmapQRCodeVisible(true, ticketChecking);
  };

  handleYdmapQRCodeVisible = (visible, ticketChecking) => {
    this.setState({
      ydmapQRCodeVisible: visible,
      ticketChecking: !!ticketChecking,
    });
  };

  handleSPFullWarningVisibleChange = visible => {
    if (visible) {
      return;
    }
    this.setState({
      spFullWarningData: null,
    });
  };

  handleChangePwdVisibleChange = visible => {
    this.setState({
      changePwdVisible: visible,
    });
  };

  handleScanHolderVisibleChange = visible => {
    this.setState({
      scanHolderVisible: visible,
    });
  };

  closeScanHolderModal = () => {
    this.setState({
      scanHolderVisible: false,
    });
  };

  handleToTicketChecking = () => {
    this.handleYdmapQRCodeVisible(false);
    const { dispatch } = this.props;
    dispatch(push('/basic/ticket/webchecking'));
  };

  getBaseRedirect = () => {
    // According to the url parameter to redirect
    // 这里是重定向的,重定向到 url 的 redirect 参数所示地址
    const urlParams = new URL(window.location.href);

    const redirect = urlParams.searchParams.get('redirect');
    // Remove the parameters in the url
    if (redirect) {
      urlParams.searchParams.delete('redirect');
      window.history.replaceState(null, 'redirect', urlParams.href);
    } else {
      const { routerData } = this.props;
      // get the first authorized route path in routerData
      const authorizedPath = Object.keys(routerData).find(
        item => check(routerData[item].authority, item) && item !== '/'
      );
      return authorizedPath;
    }
    return redirect;
  };

  handleMenuCollapse = collapsed => {
    const { dispatch } = this.props;
    dispatch({
      type: 'global/changeLayoutCollapsed',
      payload: collapsed,
    });
  };

  handleNoticeVisibleChange = visible => {
    this.setState({
      noticeIconVisible: visible,
    });
  };

  handleMenuClick = ({ key }) => {
    // if (key === 'triggerError') {
    //   this.props.dispatch(push('/exception/trigger'));
    //   return;
    // }
    const { dispatch } = this.props;
    switch (key) {
      case 'logout':
        dispatch({
          type: 'login/logout',
        });
        break;
      case 'changepwd':
        this.setState({
          changePwdVisible: true,
        });
        break;
      default:
    }
  };

  handleNoticeClear = type => {
    // message.success(`清空了${type || '所有提醒'}`);
    const { dispatch } = this.props;
    dispatch({
      type: 'global/clearNotices',
      payload: type,
    });
  };

  clearServerMenuData = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/clearServerMenuData',
    });
  };

  toReceiveNotices = data => {
    if (data == null) {
      return;
    }
    const { dispatch, mute } = this.props;
    dispatch({
      type: 'global/receiveNotices',
      payload: {
        data,
        audioPlay: () => {
          if (mute) {
            return;
          }
          if (this.audio == null) {
            return;
          }
          this.audio.play().catch(e => {
            // eslint-disable-next-line no-console
            console.log(e);
          });
        },
      },
    });
  };

  // websocket message event callback
  wsMessageCb = data => {
    this.toReceiveNotices(data);
  };

  wsSportPlatformFullWarningCb = data => {
    this.setState({
      spFullWarningData: data || {},
    });
  };

  wsEventListener() {
    const { MessageTypes } = this.socket;
    this.socket.addListen(MessageTypes.PUSH_MESSAGE, this.wsMessageCb);
    this.socket.addListen(MessageTypes.PUSH_SPORT_FULL_WARN, this.wsSportPlatformFullWarningCb);
  }

  removeWsListener() {
    if (this.socket == null) {
      return;
    }
    const { MessageTypes } = this.socket;
    this.socket.removeListen(MessageTypes.PUSH_MESSAGE, this.wsMessageCb);
    this.socket.removeListen(MessageTypes.PUSH_SPORT_FULL_WARN, this.wsSportPlatformFullWarningCb);
  }

  render() {
    const { currentUser, collapsed, receivingNotices, routerData, match, location, serverMenuData, itemList } =
      this.props;
    const {
      isMobile: mb,
      ydmapQRCodeVisible,
      ticketChecking,
      spFullWarningData,
      noticeIconVisible,
      changePwdVisible,
      scanHolderVisible,
      changePwdForce,
    } = this.state;

    const redirectData = [];
    const menuData = getShowMenuData(getServerMenuList(serverMenuData));
    menuData.forEach(item => {
      getRedirect(item, redirectData);
    });

    const baseRedirect = this.getBaseRedirect();
    return (
      <Layout>
        <SiderMenu
          logo={logo}
          // 不带Authorized参数的情况下如果没有权限,会强制跳到403界面
          // If you do not have the Authorized parameter
          // you will be forced to jump to the 403 interface without permission
          Authorized={Authorized}
          menuData={menuData}
          collapsed={collapsed}
          location={location}
          isMobile={mb}
          onCollapse={this.handleMenuCollapse}
        />
        <Layout className={style.layout}>
          <Header className={style.header}>
            <>
              <GlobalHeader
                logo={logo}
                currentUser={currentUser}
                receivingNotices={receivingNotices}
                collapsed={collapsed}
                isMobile={mb}
                onNoticeClear={this.handleNoticeClear}
                onCollapse={this.handleMenuCollapse}
                onMenuClick={this.handleMenuClick}
                noticeVisible={noticeIconVisible}
                onNoticeVisibleChange={this.handleNoticeVisibleChange}
              />
              <Audio
                ref={node => {
                  this.audio = node;
                }}
              >
                <Audio.Source src="/static/audio/msg.ogg" />
                <Audio.Source src="/static/audio/msg.mp3" />
              </Audio>
              <Audio
                ref={node => {
                  this.alipayAudio = node;
                }}
              >
                <Audio.Source src="/static/audio/alipay-success.ogg" />
                <Audio.Source src="/static/audio/alipay-success.mp3" />
              </Audio>
              <Audio
                ref={node => {
                  this.wechatpayAudio = node;
                }}
              >
                <Audio.Source src="/static/audio/wechapay-success.ogg" />
                <Audio.Source src="/static/audio/wechapay-success.mp3" />
              </Audio>
              <Audio
                ref={node => {
                  this.verifySuccess = node;
                }}
              >
                <Audio.Source src="/static/audio/verify-success.ogg" />
                <Audio.Source src="/static/audio/verify-success.mp3" />
              </Audio>
              <Audio
                ref={node => {
                  this.verifyFailed = node;
                }}
              >
                <Audio.Source src="/static/audio/verify-failed.ogg" />
                <Audio.Source src="/static/audio/verify-failed.mp3" />
              </Audio>
            </>
          </Header>
          <Content className={style.content}>
            {/* 如果未null认为还没调用成功，为数组则认为调用完成了 */}
            {serverMenuData && itemList ? (
              <Switch>
                {redirectData.map(item => (
                  <Redirect key={item.from} exact from={item.from} to={item.to} />
                ))}
                {getRoutes(match.path, routerData, menuData).map(item => (
                  <AuthorizedRoute
                    key={item.key}
                    path={item.path}
                    component={item.component}
                    exact={item.exact}
                    authority={item.authority}
                    redirectPath="/exception/403"
                  />
                ))}
                <Redirect exact from="/" to={baseRedirect} />
                <Route render={NotFound} />
              </Switch>
            ) : (
              <Spin size="large" className="global-spin" />
            )}
            {/* 全局公众号展示 */}
            <Modal
              visible={ydmapQRCodeVisible}
              onVisibleChange={this.handleYdmapQRCodeVisible}
              footer={[
                ticketChecking ? (
                  <Button size="large" key="Checking" onClick={this.handleToTicketChecking}>
                    在 线 验 票
                  </Button>
                ) : null,
                <Button key="ok" link="ok" size="large">
                  确 定
                </Button>,
              ]}
            >
              <div>该功能需在微信中运行，请关注该微信公众号后，点击右下角“管理登录”！</div>
              <div>
                <img className="img-max" src={`${CDN_IMG_HOST}/srvInfo/ydmap-wx.jpg`} alt="ydmap qrcode img" />
              </div>
            </Modal>
            {/* 全局体育场地满场提醒 */}
            <SpFullWarningModal
              title="预警提醒"
              data={spFullWarningData}
              visible={spFullWarningData != null}
              onVisibleChange={this.handleSPFullWarningVisibleChange}
            />
            <ChangePasswordModal
              visible={changePwdVisible}
              changePwdForce={changePwdForce}
              onVisibleChange={this.handleChangePwdVisibleChange}
            />
            <ScanHolderModal visible={scanHolderVisible} onVisibleChange={this.handleScanHolderVisibleChange} />
          </Content>
        </Layout>
      </Layout>
    );
  }
}

export default connect(({ user, global = {}, venue, loading }) => ({
  serverMenuData: user.serverMenuData,
  currentUser: user.currentUser,
  collapsed: global.collapsed,
  receivingNotices: loading.effects['global/receiveNotices'],
  itemList: venue.itemList,
  mute: global.mute,
  PayPlatform: global.PayPlatform,
  todoNotices:
    global == null || global.NoticeTypes == null || global.notices == null
      ? []
      : global.notices.filter(item => item.type === global.NoticeTypes.Todo.key),
}))(BasicLayout);
