import classnames from 'classnames';
import { Row, Col, InputNumber, Button, Select } from 'antd';
import ColorPicker from '@/components/Form/FormItem/ColorPicker';
import styles from './index.less';

const { Option } = Select;

export default ({ setCurrentData, currentData, handleDelData, handleEditData }) => {
  return (
    <div>
      <div
        style={{
          top: currentData?.contentStyle?.top || 0,
          left: currentData?.contentStyle?.left + currentData?.contentStyle?.width || 0,
        }}
        className={classnames(currentData.isMenuOpen ? styles.contentShow : styles.contentNone)}
      >
        {(() => {
          switch (currentData.type) {
            case 'text':
              return (
                <>
                  <Row className={styles.row}>
                    <Col className={styles.col} span={8}>
                      字体
                    </Col>
                    <Col className={styles.col} span={16}>
                      <Select
                        value={currentData?.css?.fontFamily}
                        style={{ width: 100 }}
                        onChange={val => {
                          setCurrentData({ ...currentData, css: { ...currentData.css, fontFamily: val } });
                          handleEditData({ uid: currentData.uid, css: { fontFamily: val }, type: 'text' });
                        }}
                      >
                        <Option value="Microsoft YaHei">雅黑</Option>
                        <Option value="cursive">草书</Option>
                        <Option value="fangsong">仿宋</Option>
                      </Select>
                    </Col>
                  </Row>
                  <Row className={styles.row}>
                    <Col className={styles.col} span={8}>
                      大小
                    </Col>
                    <Col className={styles.col} span={16}>
                      <InputNumber
                        style={{ width: 100 }}
                        precision={0}
                        step={2}
                        min={8}
                        max={34}
                        value={currentData?.css?.fontSize}
                        placeholder="最小8px"
                        onChange={val => {
                          setCurrentData({ ...currentData, css: { ...currentData.css, fontSize: val } });
                          handleEditData({ uid: currentData.uid, css: { fontSize: val }, type: 'text' });
                        }}
                      />
                    </Col>
                  </Row>
                  <Row className={styles.row}>
                    <Col className={styles.col} span={8}>
                      粗细
                    </Col>
                    <Col className={styles.col} span={16}>
                      <Select
                        style={{ width: 100 }}
                        value={currentData?.css?.fontWeight}
                        onChange={val => {
                          setCurrentData({ ...currentData, css: { ...currentData.css, fontWeight: val } });
                          handleEditData({ uid: currentData.uid, css: { fontWeight: val }, type: 'text' });
                        }}
                      >
                        <Option value="normal">普通</Option>
                        <Option value="lighter">稍细</Option>
                        <Option value="bold">稍粗</Option>
                      </Select>
                    </Col>
                  </Row>
                  <Row className={styles.row}>
                    <Col className={styles.col} span={8}>
                      行高
                    </Col>
                    <Col className={styles.col} span={16}>
                      <Select
                        style={{ width: 100 }}
                        value={currentData?.css?.lineHeight}
                        onChange={val => {
                          setCurrentData({ ...currentData, css: { ...currentData.css, lineHeight: val } });
                          handleEditData({ uid: currentData.uid, css: { lineHeight: val }, type: 'text' });
                        }}
                      >
                        <Option value="1">1</Option>
                        <Option value="1.2">1.2</Option>
                        <Option value="1.5">1.5</Option>
                        <Option value="2">2</Option>
                      </Select>
                    </Col>
                  </Row>
                  <Row className={styles.row}>
                    <Col className={styles.col} span={8}>
                      颜色
                    </Col>
                    <Col className={styles.col} span={16}>
                      <ColorPicker
                        style={{ width: 100 }}
                        value={currentData?.css?.color}
                        onChange={val => {
                          setCurrentData({ ...currentData, css: { ...currentData.css, color: val } });
                          handleEditData({ uid: currentData.uid, css: { color: val }, type: 'text' });
                        }}
                      />
                    </Col>
                  </Row>
                  <Row className={styles.row} gutter={20}>
                    <Col className={styles.col} span={8}>
                      <Button type="danger" size="small" onClick={() => handleDelData(currentData, 'text')}>
                        删除
                      </Button>
                    </Col>
                    <Col className={styles.col} span={8}>
                      <Button
                        size="small"
                        onClick={() => {
                          setCurrentData({ ...currentData, isMenuOpen: false });
                        }}
                      >
                        确认
                      </Button>
                    </Col>
                  </Row>
                </>
              );
            case 'key':
              return (
                <Row className={styles.row}>
                  <Row className={styles.row}>
                    <Col className={styles.col} span={8}>
                      字体
                    </Col>
                    <Col className={styles.col} span={16}>
                      <Select
                        style={{ width: 100 }}
                        value={currentData?.css?.fontFamily}
                        onChange={val => {
                          setCurrentData({ ...currentData, css: { ...currentData.css, fontFamily: val } });
                          handleEditData({ uid: currentData.uid, css: { fontFamily: val }, type: 'key' });
                        }}
                      >
                        <Option value="Microsoft YaHei">雅黑</Option>
                        <Option value="cursive">草书</Option>
                        <Option value="fangsong">仿宋</Option>
                      </Select>
                    </Col>
                  </Row>
                  <Row className={styles.row}>
                    <Col className={styles.col} span={8}>
                      大小
                    </Col>
                    <Col className={styles.col} span={16}>
                      <InputNumber
                        style={{ width: 100 }}
                        precision={0}
                        step={2}
                        min={8}
                        max={34}
                        value={currentData?.css?.fontSize}
                        placeholder="最小8px"
                        onChange={val => {
                          setCurrentData({ ...currentData, css: { ...currentData.css, fontSize: val } });
                          handleEditData({ uid: currentData.uid, css: { fontSize: val }, type: 'key' });
                        }}
                      />
                    </Col>
                  </Row>
                  <Row className={styles.row}>
                    <Col className={styles.col} span={8}>
                      粗细
                    </Col>
                    <Col className={styles.col} span={16}>
                      <Select
                        style={{ width: 100 }}
                        value={currentData?.css?.fontWeight}
                        onChange={val => {
                          setCurrentData({ ...currentData, css: { ...currentData.css, fontWeight: val } });
                          handleEditData({ uid: currentData.uid, css: { fontWeight: val }, type: 'key' });
                        }}
                      >
                        <Option value="normal">普通</Option>
                        <Option value="lighter">稍细</Option>
                        <Option value="bold">稍粗</Option>
                      </Select>
                    </Col>
                  </Row>
                  <Row className={styles.row}>
                    <Col className={styles.col} span={8}>
                      颜色
                    </Col>
                    <Col className={styles.col} span={16}>
                      <ColorPicker
                        style={{ width: 100 }}
                        value={currentData?.css?.color}
                        onChange={val => {
                          setCurrentData({ ...currentData, css: { ...currentData.css, color: val } });
                          handleEditData({ uid: currentData.uid, css: { color: val }, type: 'key' });
                        }}
                      />
                    </Col>
                  </Row>
                  <Row className={styles.row} gutter={20}>
                    <Col className={styles.col} span={8}>
                      <Button type="danger" size="small" onClick={() => handleDelData(currentData, 'key')}>
                        删除
                      </Button>
                    </Col>
                    <Col className={styles.col} span={8}>
                      <Button
                        size="small"
                        onClick={() => {
                          setCurrentData({ ...currentData, isMenuOpen: false });
                        }}
                      >
                        确认
                      </Button>
                    </Col>
                  </Row>
                </Row>
              );
            case 'imgKey':
              return (
                <Row className={styles.row} gutter={20}>
                  <Col className={styles.col} span={8}>
                    <Button type="danger" size="small" onClick={() => handleDelData(currentData, 'imgKey')}>
                      删除
                    </Button>
                  </Col>
                  <Col className={styles.col} span={8}>
                    <Button
                      size="small"
                      onClick={() => {
                        setCurrentData({ ...currentData, isMenuOpen: false });
                      }}
                    >
                      确认
                    </Button>
                  </Col>
                </Row>
              );
            default:
              return (
                <Row className={styles.row} gutter={20}>
                  <Col className={styles.col} span={8}>
                    <Button type="danger" size="small" onClick={() => handleDelData(currentData, 'img')}>
                      删除
                    </Button>
                  </Col>
                  <Col className={styles.col} span={8}>
                    <Button
                      size="small"
                      onClick={() => {
                        setCurrentData({ ...currentData, isMenuOpen: false });
                      }}
                    >
                      确认
                    </Button>
                  </Col>
                </Row>
              );
          }
        })()}
      </div>
    </div>
  );
};
