import { useMemo, useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { goBack, push } from 'connected-react-router';
import { Card, Button, Divider } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import Datatable, { ItemTypes } from '@/components/Datatable';
import FooterToolbar from '@/components/FooterToolbar';
import MarginBar from '@/components/MarginBar';
import { optionsMapper } from '@/commons/lib/models';
import { formatModel } from '@/utils/format';
import styles from './seat.less';

function Seat(props, { checkOpFailed, checkOpFailedAndGoBack }) {
  const dispatch = useDispatch();
  useEffect(() => {
    checkOpFailedAndGoBack();
  }, []);
  if (checkOpFailed()) {
    return null;
  }
  const dealInfo = useSelector(state => state.orderprocessing.dealInfo);

  if (dealInfo == null) {
    return null;
  }
  const saving = useSelector(state => state.loading.effects['ticketselling/seatNextStep']);
  const { SeatStatus } = useSelector(state => state.pubticket);
  const { ContactOrderFields } = useSelector(state => state.contact);
  const [selectedRows, setSelectedRows] = useState([]);
  const [seatDataList, setSeatDataList] = useState([]);
  const { dealTicketList } = dealInfo;
  // const { pushSeat } = deal || {};
  const { scheduleDetailId, salesNum, dealTicketStudyList } = dealTicketList?.[0] || {};

  const handleNextStep = useCallback(() => {
    dispatch({
      type: 'ticketselling/seatNextStep',
      payload: seatDataList,
    }).then(id => {
      dispatch(
        push({
          pathname: './summary',
          search: `id=${id}`,
        })
      );
    });
  }, [seatDataList]);

  const updateSeatInfo = useCallback(
    rows => {
      setSeatDataList(
        // 前面可能没选人这步
        (dealTicketStudyList && dealTicketStudyList.length > 0
          ? dealTicketStudyList
          : Array.from({ length: salesNum }).fill(null)
        ).map((item, i) => {
          const {
            pubStudyId,
            [ContactOrderFields.Mobile.key]: mobile,
            [ContactOrderFields.RealName.key]: realName,
          } = item || {};
          return {
            pubStudyId,
            key: pubStudyId || i,
            mobile,
            realName,
            seatInfo: rows?.[i],
          };
        })
      );
    },
    [dealTicketStudyList, salesNum]
  );

  useEffect(() => {
    updateSeatInfo();
  }, [dealTicketStudyList]);

  const columns = useMemo(
    () => [
      {
        title: '座位状态',
        dataIndex: 'seatState',
        render: value => formatModel(SeatStatus, value),
        width: 90,
      },
      {
        title: '区域名称',
        dataIndex: 'areaCategoryName',
        width: 90,
      },
      {
        title: '排数',
        dataIndex: 'rowsName',
        width: 90,
      },
      {
        title: '座位号',
        key: 'seatName',
        // 不直接使用seatName字段显示座位名称
        render: (_, { seatValue }) => `${seatValue}座`,
        width: 90,
      },
      {
        title: '楼层名称',
        dataIndex: 'floorCategoryName',
        width: 90,
      },
      {
        title: '等级名称',
        dataIndex: 'levelCategoryName',
        width: 90,
      },
      {
        title: '编号',
        dataIndex: 'id',
        width: 90,
      },
      {
        title: '座位说明',
        dataIndex: 'seatDesc',
        width: 250,
      },
      {
        title: '营销中心',
        dataIndex: 'salesName',
        width: 130,
      },
    ],
    []
  );
  const formSearch = useMemo(
    () => ({
      fields: [
        {
          label: '座位状态',
          name: 'seatState',
          options: optionsMapper([SeatStatus.Available, SeatStatus.Disabled]),
          type: ItemTypes.Select,
        },
        {
          label: '座位号',
          name: 'seatName',
        },
        {
          label: '排数',
          name: 'rowsName',
        },
        {
          label: '区域名称',
          name: 'areaCategoryName',
          defHidden: true,
        },
        {
          label: '等级名称',
          name: 'levelCategoryName',
          defHidden: true,
        },
        {
          label: '楼层名称',
          name: 'floorCategoryName',
          defHidden: true,
        },
      ],
    }),
    []
  );

  const allSeatOk = selectedRows?.length === salesNum;
  return (
    <>
      <Card title="请选择座位">
        <Datatable
          personalization={false}
          select="multi"
          url={`/ticket/seatDataList.do?scheduleDetailId=${scheduleDetailId}`}
          rowKey="id"
          hideSelectAll
          columns={columns}
          formSearch={formSearch}
          rowSelection={{
            selectedRows,
            checkboxShouldBeDisable: record => {
              if (selectedRows && selectedRows.includes(record)) {
                return false;
              }
              return allSeatOk;
            },
          }}
          onSelectedChange={(_, rows) => {
            // 置空和单行切换
            if (rows.length === 0 || selectedRows.length === rows.length) {
              updateSeatInfo(rows);
            }
            // 增加
            else if (selectedRows.length < rows.length) {
              const newRows = rows.filter(row => !seatDataList.some(seatData => seatData.seatInfo?.id === row.id));
              updateSeatInfo(
                seatDataList.map(item => {
                  if (item.seatInfo == null) {
                    const row = newRows[0];
                    if (row) {
                      newRows.shift();
                      return row;
                    }
                  }
                  return item.seatInfo;
                })
              );
            }
            // 减少
            else if (selectedRows.length > rows.length) {
              updateSeatInfo(
                seatDataList.map(item => {
                  if (item.seatInfo) {
                    const useRow = rows.find(row => row.id === item.seatInfo.id);
                    if (useRow) {
                      return useRow;
                    }
                  }
                  return null;
                })
              );
            }
            setSelectedRows(rows);
          }}
        />
        <Divider />
        <div>
          {seatDataList.map(({ key, mobile, realName, seatInfo }, i) => (
            <div key={key} className={classNames('text-center', styles.seatTag)}>
              <div className={styles.seatTagLeft}>
                <div>{realName || <>&nbsp;</>}</div>
                <div>{mobile || <>&nbsp;</>}</div>
              </div>
              <div
                className={classNames(styles.seatTagRight, {
                  [styles.seatTagRightFlex]: seatInfo == null,
                })}
              >
                {seatInfo ? (
                  <>
                    <div>
                      {seatInfo.floorCategoryName}-{seatInfo.areaCategoryName}-{seatInfo.rowsName}-{seatInfo.seatName}
                    </div>
                    <div>{seatInfo.levelCategoryName}</div>
                    <span
                      onClick={() => {
                        const removeIds = [];
                        updateSeatInfo(
                          seatDataList.map((item, j) => {
                            if (i === j) {
                              removeIds.push(item.seatInfo.id);
                              return null;
                            }
                            return item.seatInfo;
                          })
                        );
                        setSelectedRows(selectedRows.filter(row => !removeIds.includes(row.id)));
                      }}
                    >
                      x
                    </span>
                  </>
                ) : (
                  '请选择'
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>
      <FooterToolbar>
        <MarginBar left top inline>
          <Button disabled={saving} onClick={() => dispatch(goBack())}>
            返回修改
          </Button>
        </MarginBar>
        <MarginBar left top inline>
          <Button type="danger" disabled={!allSeatOk} loading={saving} onClick={handleNextStep}>
            结算
          </Button>
        </MarginBar>
      </FooterToolbar>
    </>
  );
}

Seat.contextTypes = {
  checkOpFailed: PropTypes.func,
  checkOpFailedAndGoBack: PropTypes.func,
  getNextStepPath: PropTypes.func,
  selectPubStudy: PropTypes.bool,
};

export default Seat;
