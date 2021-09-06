import { Component } from 'react';
import PropTypes from 'prop-types';
import { Carousel, DatePicker } from 'antd';
import classNames from 'classnames';
import Iconfont from '@/components/Icon';
import { formatDate, formatDay } from '@/utils/format';
import { clearHMS, isSameDay } from '@/utils/utils';

import styles from './index.less';

class CarouselDateSwitcher extends Component {
  showSlickItemLength = 7; // 奇数

  defaultSlickItemLength = this.showSlickItemLength * 4; // 偶数倍

  static contextTypes = {
    isMobile: PropTypes.bool,
    getCurrentServerTime: PropTypes.func,
  };

  state = {
    slides: [],
    calendarOpen: false,
    currentSlideIdx: this.defaultSlickItemLength / 2,
  };

  componentDidMount() {
    const { date } = this.props;
    this.init(date);
  }

  componentWillUnmount() {
    this.isUnmounted = true;
  }

  init = date => {
    if (this.isUnmounted) {
      return;
    }
    const { getCurrentServerTime } = this.context;
    const serverNow = getCurrentServerTime();
    const referDate = date || serverNow;
    const slides = Array.from({ length: this.defaultSlickItemLength + 1 }).fill(null);
    const now = clearHMS(referDate);
    // 置中
    const centeredIndex = this.defaultSlickItemLength / 2;
    this.setState(
      () => ({
        currentSlideIdx: centeredIndex, // 置中
        slides: slides.map((item, i) => now.clone().subtract(this.defaultSlickItemLength / 2 - i, 'days')),
      }),
      () => {
        this.goTo(centeredIndex); // 置中
        this.triggerChange();
      }
    );
  };

  /**
   * 向左添加内容;
   * 始终同等数量增减少，避免触发antd封装的逻辑的goTo(https://github.com/ant-design/ant-design/blob/b5f2ea771def4fa520ba911f4736e0285ed75cd4/components/carousel/index.tsx#L76)
   */
  sliderPrepend = callback => {
    if (this.isUnmounted) {
      return;
    }
    const { slides } = this.state;
    // 参考第一个
    const refer = slides[0];
    if (refer == null) {
      return;
    }
    this.setState(
      () => ({
        // 前移
        slides: [
          ...Array.from({ length: this.showSlickItemLength })
            .fill(null)
            .map((item, i) => refer.clone().subtract(this.showSlickItemLength - i, 'days')),
          ...slides.slice(0, slides.length - this.showSlickItemLength),
        ],
      }),
      () => {
        setTimeout(callback, 0);
      }
    );
  };

  /**
   * 向右添加内容;
   * 始终同等数量增减少，避免触发antd封装的逻辑的goTo(https://github.com/ant-design/ant-design/blob/b5f2ea771def4fa520ba911f4736e0285ed75cd4/components/carousel/index.tsx#L76)
   */
  sliderAppand = callback => {
    if (this.isUnmounted) {
      return;
    }
    const { slides } = this.state;
    // 参考最后一个
    const refer = slides[slides.length - 1];
    if (refer == null) {
      return;
    }
    this.setState(
      () => ({
        // 后移
        slides: [
          ...slides.slice(this.showSlickItemLength, slides.length),
          ...Array.from({ length: this.showSlickItemLength })
            .fill(null)
            .map((item, i) => refer.clone().add(i + 1, 'days')),
        ],
      }),
      () => {
        setTimeout(callback, 0);
      }
    );
  };

  goTo = (index, dontAnimate) => {
    const { slides } = this.state;
    if (index >= slides.length - this.showSlickItemLength) {
      // react-slick 中 判断能不能去到某个index(goTo)时，如果index加显示数(slidesToShow)大于等于slides数量(slideCount)返回false
      // https://github.com/akiran/react-slick/pull/1232
      // https://github.com/ant-design/ant-design/issues/16748
      // 所以，如果是这种情况，就先追加项目，除非上游解决
      this.sliderAppand(() => {
        // 修正位置, 完成goTo
        const idx = index - this.showSlickItemLength;
        this.goTo(idx, true);
      });
      return;
    }
    this.slider.slickGoTo(index, dontAnimate);
  };

  focusOnSelect = (e, index) => {
    const { currentSlideIdx } = this.state;
    if (currentSlideIdx === index) {
      this.triggerChange();
      return;
    }
    this.goTo(index);
  };

  /**
   * after是动画执行完毕后才调用的，动画耗时500毫秒
   */
  handleAfterChange = newIdx => {
    // 初始化和点击日期整体重置slider，所以不涉及前后填补
    // 手动切换日期最大可点击是showSlickItemLength + 1，总数保证其滑动一次不至于出现空白，这样就不需要handleBeforeChange做任何事情
    if (this.isUnmounted) {
      return;
    }
    const { slides } = this.state;
    // 向左快要越界，添加内容
    if (newIdx <= this.showSlickItemLength) {
      setTimeout(() => {
        this.sliderPrepend(() => {
          // 修正位置, 完成goTo
          this.goTo(newIdx + this.showSlickItemLength, true);
        });
      }, 0);
      return;
    }
    // 向右快要越界，添加内容
    if (newIdx >= slides.length - this.showSlickItemLength) {
      setTimeout(() => {
        this.sliderAppand(() => {
          // 修正位置, 完成goTo
          this.goTo(newIdx - this.showSlickItemLength, true);
        });
      }, 0);
      return;
    }
    this.handleIndexChange(newIdx);
  };

  handleIndexChange = index => {
    if (this.isUnmounted) {
      return;
    }
    this.setState({
      currentSlideIdx: index,
    });
    const { slides } = this.state;
    const slide = slides[index];
    this.triggerChange(slide.valueOf());
  };

  handleCalendarChange = value => {
    // 初始化和点击日期整体重置slider，所以不涉及前后填补
    this.init(value);
  };

  handleCalendarOpenChange = open => {
    if (this.isUnmounted) {
      return;
    }
    this.setState({
      calendarOpen: open,
    });
  };

  triggerChange = val => {
    const { onChange } = this.props;
    if (typeof onChange === 'function') {
      const { slides, currentSlideIdx } = this.state;
      const slide = slides[currentSlideIdx];
      onChange(val || slide.valueOf());
    }
  };

  render() {
    const { isMobile, getCurrentServerTime } = this.context;
    const now = getCurrentServerTime();
    const { slides, calendarOpen, currentSlideIdx } = this.state;

    const slide = slides[currentSlideIdx];
    return (
      <div className={styles.containerWrapper}>
        <div className={styles.container}>
          <Carousel
            ref={node => {
              this.slider = (node || {}).slick;
            }}
            // beforeChange={this.handleBeforeChange}
            afterChange={this.handleAfterChange}
            centerMode
            initialSlide={currentSlideIdx}
            slidesToShow={this.showSlickItemLength}
            // 响应式slidesToShow设置更小的，不设置更大的，默认 最大的
            responsive={[
              {
                breakpoint: 768,
                settings: {
                  slidesToShow: 3,
                },
              },
              {
                breakpoint: 375,
                settings: {
                  slidesToShow: 1,
                },
              },
            ]}
            dots={false}
            arrows
            // swipeToSlide
            // focusOnSelect // focusOnSelect有bug
            // draggable
            infinite={false}
            prevArrow={<Arrow type="previous" />}
            nextArrow={<Arrow type="next" />}
          >
            {slides.map((item, i) => (
              <Item key={item.valueOf()} now={now} item={item} focusOnSelect={this.focusOnSelect} index={i} />
            ))}
          </Carousel>
          <Iconfont type="date" className={styles.date} onClick={() => this.handleCalendarOpenChange(true)} />
          <DatePicker
            className="hidden"
            dropdownClassName={classNames(styles.dropdown, {
              [styles.dropdownMobile]: isMobile,
            })}
            onOpenChange={this.handleCalendarOpenChange}
            onChange={this.handleCalendarChange}
            value={slide}
            open={calendarOpen}
          />
        </div>
      </div>
    );
  }
}

export default CarouselDateSwitcher;

function Arrow(props) {
  const { currentSlide, slideCount, className, type, ...restProp } = props;
  // slick-arrow slick-prev
  return (
    <Iconfont
      {...restProp}
      type={type}
      className={classNames(className, styles.arrow, {
        [styles.prevArrow]: type === 'previous',
        [styles.nextArrow]: type === 'next',
      })}
    />
  );
}

function Item({ item, focusOnSelect, index, now, ...restProps }) {
  const isToday = isSameDay(item, now);
  return (
    <div onClick={e => focusOnSelect(e, index)} {...restProps}>
      <div
        className={classNames(styles.item, {
          [styles.itemToday]: isToday,
        })}
      >
        <div className={styles.itemDate}>
          <span>{formatDate(item)}</span>
          {isToday && <div>今天</div>}
        </div>
        <div>{formatDay(item, 1)}</div>
      </div>
    </div>
  );
}
