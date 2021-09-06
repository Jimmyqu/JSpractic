import { useCallback, useState } from 'react';
import { Button, InputNumber, message } from 'antd';
// import classNames from 'classnames';
import MarginBar from '@/components/MarginBar';
import { formatSeatData } from '@/utils/format';
import ToolbarItem from './ToolbarItem';
import BatchNewSeatModal from './BatchNewSeatModal';
import BatchEditSeatModal from './BatchEditSeatModal';
import styles from './index.less';

export default ({
  min,
  width,
  height,
  disabled,
  loading,
  selectedAreaMap,
  targetAreaKey,
  seats2DArray,
  canBack,
  canForward,
  goBack,
  goForward,
  setMatrixSize,
  reset,
  selectHoldOn,
  floorList,
  areaList,
  levelList,
  resetAnyCaseName,
  //
  save,
  updateScreenPosition,
  deleteSeats,
  addNewSeats,
  updateSeats,
}) => {
  const [batchNewVisible, setBatchNewVisible] = useState();
  const [editVisible, setEditVisible] = useState();
  const selectedAreaKeys = selectedAreaMap ? Object.keys(selectedAreaMap) : [];
  const hasSelected = selectedAreaKeys.length > 0;

  const selectedSeats =
    // 加入selectHoldOn判断，提高性能
    !selectHoldOn && hasSelected
      ? seats2DArray.reduce((prev, row, rowIdx) => {
          const list = [];
          selectedAreaKeys.forEach(key => {
            // TODO: 座位有跨行跨列的，待完善
            const { x, y, colspan, rowspan } = selectedAreaMap[key];
            if (rowIdx >= y && rowIdx < y + rowspan) {
              row.forEach((seat, colIdx) => {
                if (seat == null) {
                  return;
                }
                if (colIdx >= x && colIdx < x + colspan) {
                  list.push(seat);
                }
              });
            }
          });
          return [...prev, ...list];
        }, [])
      : [];

  // 判断是否和已有的冲突
  const getConflictingSeat = useCallback(
    seats => {
      let foundSeat;
      seats2DArray.some(row => {
        return row.some(col => {
          if (col == null) {
            return false;
          }
          const conflictingSeat = seats?.find(seat => {
            // isNew 存的uuid,
            if (col.isNew && seat.isNew && col.isNew === seat.isNew) {
              return false;
            }
            if (col.id && seat.id && col.id === seat.id) {
              return false;
            }
            const isSame =
              seat.floorCategoryId === col.floorCategoryId &&
              seat.areaCategoryId === col.areaCategoryId &&
              seat.levelCategoryId === col.levelCategoryId &&
              seat.rowsNum === col.rowsNum &&
              seat.seatValue === col.seatValue;
            return isSame;
          });
          if (conflictingSeat) {
            foundSeat = conflictingSeat;
            return true;
          }
          return false;
        });
      });
      return foundSeat;
    },
    [seats2DArray]
  );

  const targetSelectedArea = selectedAreaMap?.[targetAreaKey];
  return (
    <div className={styles.toolbar}>
      <ToolbarItem>
        <span className={styles.counterLine}>
          行:{targetSelectedArea?.rowspan || 0}, 列:{targetSelectedArea?.colspan || 0}
        </span>
      </ToolbarItem>
      <ToolbarItem>
        <Button
          type="primary"
          icon="undo"
          disabled={disabled || !canBack || loading}
          onClick={() => {
            if (disabled || !canBack || loading) {
              return;
            }
            goBack();
          }}
        >
          上一步
        </Button>
      </ToolbarItem>
      <ToolbarItem>
        <Button
          type="primary"
          icon="redo"
          disabled={disabled || !canForward || loading}
          onClick={() => {
            if (disabled || !canForward || loading) {
              return;
            }
            goForward();
          }}
        >
          下一步
        </Button>
      </ToolbarItem>
      <ToolbarItem>
        横(x)：
        <InputNumber
          precision={0}
          min={min}
          defaultValue={width || min}
          placeholder={`最小${min}`}
          disabled={disabled || loading}
          onChange={val => {
            setMatrixSize(val, height);
          }}
        />
      </ToolbarItem>
      <ToolbarItem>
        纵(y)：
        <InputNumber
          precision={0}
          min={min}
          defaultValue={height || min}
          placeholder={`最小${min}`}
          disabled={disabled || loading}
          onChange={val => {
            setMatrixSize(width, val);
          }}
        />
      </ToolbarItem>
      <ToolbarItem>
        <Button
          type="primary"
          disabled={disabled || !hasSelected || loading || selectedAreaKeys.length !== 1 || selectedSeats.length > 0}
          onClick={() => {
            const { x, y, rowspan, colspan } = selectedAreaMap[selectedAreaKeys[0]];
            updateScreenPosition({
              screenColspan: colspan,
              screenLeft: x,
              screenRowspan: rowspan,
              screenTop: y,
            });
          }}
        >
          设置为屏幕位置
        </Button>
      </ToolbarItem>
      <ToolbarItem>
        <MarginBar inline left={24}>
          <Button
            disabled={
              disabled ||
              loading ||
              // 暂时限制为仅支持单个完整区域
              selectedAreaKeys.length !== 1 ||
              selectedSeats.length > 0
            }
            onClick={() => setBatchNewVisible(true)}
          >
            批量添加座位
          </Button>
        </MarginBar>
      </ToolbarItem>
      <ToolbarItem>
        <Button
          disabled={disabled || !hasSelected || loading || selectedSeats.length === 0}
          onClick={() => {
            setEditVisible(true);
          }}
        >
          批量修改座位参数
        </Button>
      </ToolbarItem>
      <ToolbarItem>
        <Button
          type="danger"
          disabled={disabled || !hasSelected || loading || selectedSeats.length === 0}
          onClick={() => deleteSeats(selectedSeats)}
        >
          删除座位
        </Button>
      </ToolbarItem>
      <ToolbarItem>
        <MarginBar inline left={24}>
          <Button type="primary" disabled={disabled || !canBack} loading={loading} onClick={save}>
            保存
          </Button>
        </MarginBar>
      </ToolbarItem>
      <ToolbarItem>
        <Button disabled={disabled || !canBack || loading} onClick={reset}>
          重置
        </Button>
      </ToolbarItem>
      <BatchNewSeatModal
        floorList={floorList}
        areaList={areaList}
        levelList={levelList}
        resetAnyCaseName={resetAnyCaseName}
        selectedArea={selectedAreaMap[selectedAreaKeys[0]]}
        visible={batchNewVisible}
        onVisibleChange={setBatchNewVisible}
        onOk={seats => {
          const conflictingSeat = getConflictingSeat(seats);
          if (conflictingSeat) {
            message.warn(`座位重复，请检查: ${formatSeatData(conflictingSeat)}`);
            return;
          }
          addNewSeats(seats);
          setBatchNewVisible(false);
        }}
      />
      <BatchEditSeatModal
        selectedSeats={selectedSeats}
        floorList={floorList}
        areaList={areaList}
        levelList={levelList}
        visible={editVisible}
        resetAnyCaseName={resetAnyCaseName}
        onVisibleChange={setEditVisible}
        onOk={seats => {
          const conflictingSeat = getConflictingSeat(seats);
          if (conflictingSeat) {
            message.warn(`座位重复，请检查: ${formatSeatData(conflictingSeat)}`);
            return;
          }
          updateSeats(seats);
          setEditVisible(false);
        }}
      />
    </div>
  );
};
