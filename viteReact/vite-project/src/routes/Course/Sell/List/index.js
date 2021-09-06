import { Component } from 'react';
import classNames from 'classnames';
import { Card, Row, Col, Button, Icon, Popover, Badge } from 'antd';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { Link } from 'react-router-dom';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import Datatable, { ItemTypes } from '@/components/Datatable';
import DateView from '@/components/TimeLineView/TimeLineView';
import MarginBar from '@/components/MarginBar';
import { formatMoney, formatImageUrl } from '@/utils/format';
import { getPageQuery, modelMapToOption } from '@/utils/utils';
import courseImg from '@/assets/images/course.png';
import fixedImg from '@/assets/images/date.png';
import styles from './index.less';

@connect(({ pubcourse, venue }) => ({
  pubcourse,
  venue,
}))
class CourseList extends Component {
  static contextTypes = {
    isMobile: PropTypes.bool,
  };

  state = {
    cardStyle: true,
  };

  columnsCards = [
    {
      title: '课程',
      key: 'id',
      render: (_, { _all }) => {
        const {
          pubcourse: { CourseStatus, CourseTypes },
        } = this.props;
        return (
          <Row gutter={10}>
            {_all.map(
              (
                {
                  courseDataId,
                  converImage,
                  courseName,
                  price,
                  teacherName,
                  bookingNum,
                  referencePrice,
                  courseType,
                  bookingSurplusNum,
                },
                i
              ) => {
                const isFiexdCourse = courseType === CourseTypes.FiexdCourse.key;
                const canSignup = bookingSurplusNum > 0;
                return (
                  <Col sm={24} md={8} lg={6} xl={4} key={courseDataId || i}>
                    <MarginBar
                      top
                      className={styles.course}
                      title={courseName}
                      onClick={e => this.handleSell(e, courseDataId, canSignup, isFiexdCourse)}
                    >
                      <div className={styles.img}>
                        <img
                          src={formatImageUrl(
                            (converImage || {}).url,
                            'img_sales_prew',
                            '//image.ydmap.cn/default_file/default_load_img.jpg@!img_sales_prew'
                          )}
                          alt="course img"
                        />
                        <span>
                          <Link to={`${courseDataId}${isFiexdCourse ? '' : '/pick'}`}>详情</Link>
                        </span>
                      </div>
                      <div className={styles.content}>
                        <div className={classNames('text-overflow-line2', styles.title)}>{courseName}</div>
                        <div>
                          <div className={classNames('text-overflow', styles.subContent)}>
                            <span>
                              <span>&nbsp;¥{formatMoney(price)}&nbsp;</span>&nbsp;¥{formatMoney(referencePrice)}
                            </span>
                          </div>
                          <Row className={styles.descr}>
                            <Col span={8} className="text-overflow">
                              {teacherName}
                            </Col>
                            <Col span={7} className="text-overflow text-center">
                              已报{bookingNum || 0}名
                            </Col>
                            <Col span={9} className="text-overflow text-right">
                              <Button size="small" type={canSignup ? 'primary' : undefined} disabled={!canSignup}>
                                {canSignup ? CourseStatus.Booking.value : CourseStatus.BookFull.value}
                              </Button>
                            </Col>
                          </Row>
                        </div>
                      </div>
                    </MarginBar>
                  </Col>
                );
              }
            )}
          </Row>
        );
      },
    },
  ];

  formSearch = {
    fields: [
      {
        label: '营销中心',
        placeholder: '默认全部营销中心',
        name: 'salesIds',
        mode: 'multiple',
        initialValue: (() => {
          const {
            venue: { currentVenue },
          } = this.props;
          if (currentVenue) {
            return [currentVenue.id];
          }
        })(),
        type: ItemTypes.CascaderVenue,
      },
      {
        label: '课程编号',
        name: 'courseId',
        initialValue: (() => {
          const { courseId } = getPageQuery();
          if (courseId) {
            return +courseId;
          }
        })(),
        defHidden: true,
      },
      {
        label: '课程名称',
        name: 'courseName',
        defHidden: true,
      },
      {
        label: '项目类型',
        name: 'professionalId',
        options: (() => {
          const {
            venue: { ProfessionTypes },
          } = this.props;
          return modelMapToOption(ProfessionTypes);
        })(),
        type: ItemTypes.Select,
      },
      {
        label: '课程类型',
        name: 'courseType',
        options: (() => {
          const {
            pubcourse: { CourseTypes },
          } = this.props;
          return modelMapToOption(CourseTypes);
        })(),
        type: ItemTypes.Select,
      },
      {
        label: '课程状态',
        name: 'courseStatus',
        options: (() => {
          const {
            pubcourse: { CourseStatus },
          } = this.props;
          return modelMapToOption(CourseStatus);
        })(),
        type: ItemTypes.Select,
        defHidden: true,
      },
      {
        label: '行业类型',
        name: 'industryId',
        options: (() => {
          const {
            venue: { Industries },
          } = this.props;
          return modelMapToOption(Industries);
        })(),
        type: ItemTypes.Select,
        defHidden: true,
      },
      [
        {
          label: '课程开始时间',
          name: 'startDate',
          placeholder: '开始',
          type: ItemTypes.DatePickerRangeStart,
          defHidden: true,
        },
        {
          label: '课程结束时间',
          name: 'endDate',
          placeholder: '结束',
          type: ItemTypes.DatePickerRangeEnd,
          defHidden: true,
        },
      ],
    ],
  };

  dateSearch = {
    fields: [
      {
        label: '营销中心',
        name: 'salesId',
        initialValue: (() => {
          const {
            venue: { currentVenue },
          } = this.props;
          if (currentVenue) {
            return currentVenue.id;
          }
        })(),
        type: ItemTypes.CascaderVenue,
        optionAll: false,
      },
      {
        label: '项目类型',
        placeholder: '全部项目类型',
        name: 'professionalId',
        options: (() => {
          const {
            venue: { ProfessionTypes },
          } = this.props;
          return modelMapToOption(ProfessionTypes);
        })(),
        type: ItemTypes.Select,
        optionAll: false,
        allowClear: true,
      },
      {
        label: '课程类型',
        placeholder: '全部课程类型',
        name: 'courseType',
        options: (() => {
          const {
            pubcourse: { CourseTypes },
          } = this.props;
          return modelMapToOption(CourseTypes);
        })(),
        type: ItemTypes.Select,
        optionAll: false,
        allowClear: true,
      },
    ],
  };

  operation = {
    extContentRender: () => {
      const { cardStyle } = this.state;
      return (
        <Button.Group>
          <Button onClick={() => this.switchStyle(false)}>
            <Icon type="ordered-list" />
            日历
          </Button>
          <Button type={cardStyle ? 'primary' : undefined}>
            <Icon type="appstore" />
            卡片
          </Button>
        </Button.Group>
      );
    },
  };

  handleSell = (e, courseDataId, canSignup, isFiexdCourse) => {
    const target = e.nativeEvent.target || e.nativeEvent.srcElement;
    if (target.tagName === 'A') {
      return;
    }
    if (!canSignup) {
      return;
    }
    const { dispatch } = this.props;
    dispatch(push(`./${courseDataId}${isFiexdCourse ? '/schedule' : '/user'}?neworder=1`));
  };

  switchStyle = cardStyle => {
    this.setState({ cardStyle }); // 切换后自动reload()
  };

  handleTableInit = table => {
    this.table = table;
  };

  dataSourceRender = data => {
    const { rows } = data || {};
    if (rows && rows.length > 0) {
      // 合成一行
      return [
        {
          id: Date.now(),
          _all: rows,
        },
      ];
    }
    return [];
  };

  render() {
    const { cardStyle } = this.state;
    const { isMobile } = this.context;
    return (
      <PageHeaderLayout
        helpContent={
          !cardStyle ? (
            <Popover
              placement="bottomRight"
              title="帮助"
              content={
                <Card className="help-content">
                  <Row>
                    <Col span={12}>
                      <Badge color="#b8bdc7" text="已满课程" />
                    </Col>
                    <Col span={12}>
                      <Badge color="#7ed8d0" text="未满课程" />
                    </Col>
                    <Col span={12}>
                      <img src={fixedImg} alt="fixed" className={styles.courseImg} />
                      固定课程
                    </Col>
                    <Col span={12}>
                      <img src={courseImg} alt="course" className={styles.courseImg} />
                      普通课程
                    </Col>
                  </Row>
                </Card>
              }
            >
              帮助 <Icon type="question-circle-o" />
            </Popover>
          ) : undefined
        }
      >
        <Card bordered={false}>
          {cardStyle ? (
            <Datatable
              rowClassName="single-row"
              showHeader={false}
              url="/course/courseListToIcon.do"
              columns={this.columnsCards}
              rowKey="id"
              dataSourceRender={this.dataSourceRender}
              formSearch={this.formSearch}
              operation={this.operation}
              onInit={this.handleTableInit}
              pagination={{
                pageSizeOptions: ['18', '30', '50', '100', '200', '500', '1000'],
              }}
            />
          ) : (
            <DateView isMobile={isMobile} dateSearch={this.dateSearch} switchStyle={this.switchStyle} />
          )}
        </Card>
      </PageHeaderLayout>
    );
  }
}

export default CourseList;
