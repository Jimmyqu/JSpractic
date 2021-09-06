import { useEffect, useState } from 'react';
import { CDN_STATIC_HOST, asyncInjectScript, asyncInjectCSS, createMarkup } from '@/utils/utils';
import styles from './index.less';

const VERTION = '27.0.0';

/**
 * 当脱离编辑器实例来渲染富文本时用这个函数组件
 */
export function HTMLSection({ children }) {
  useEffect(() => {
    asyncInjectCSS(`//cdnstatic.ydmap.cn/static/ckeditor/${VERTION}/build/content-styles.css`);
  }, []);
  // eslint-disable-next-line react/no-danger
  return <div className="ck-content" dangerouslySetInnerHTML={createMarkup(children)} />;
}

// 不支持受控
export default function ({ value, disabled, onChange = () => {} }) {
  const [dom, setDom] = useState();
  const [inited, setInited] = useState(false);
  const [stateInstance, setStateInstance] = useState();

  useEffect(() => {
    if (dom == null || inited) {
      return;
    }
    setInited(true);
    let instance;
    // 直接构建的zh-cn版本
    asyncInjectScript(`${CDN_STATIC_HOST}/static/ckeditor/${VERTION}/build/ckeditor.js`, 'ClassicEditor')
      // .then(async ClassicEditor => {
      //   await asyncInjectScript(`${CDN_STATIC_HOST}/static/ckeditor/17.0.0/build/translations/zh-cn.js`);
      //   return ClassicEditor;
      // })
      .then(ClassicEditor => {
        // console.log(ClassicEditor.builtinPlugins.map(plugin => plugin.pluginName));
        ClassicEditor.create(dom, {
          // language: 'zh-cn',
          fontSize: {
            options: [9, 11, 13, 'default', 17, 19, 21],
          },
          toolbar: ClassicEditor.defaultConfig.toolbar.items.filter(item => !['mediaEmbed'].includes(item)),
        })
          .then(editor => {
            instance = editor;
            instance.isReadOnly = disabled;
            setStateInstance(instance);
            if (value) {
              editor.setData(value);
            }
            editor.model.document.on('change:data', () => {
              // 内容依赖了样式，单独以html形式渲染时记得加载css
              // https://ckeditor.com/docs/ckeditor5/latest/builds/guides/integration/content-styles.html
              // http://cdnstatic.ydmap.cn/static/ckeditor/${VERTION}/build/content-styles.css
              onChange(editor.getData());
            });
          })
          .catch(error => {
            // eslint-disable-next-line no-console
            console.error(error);
          });
      });
    return () => {
      if (instance) {
        instance.destroy();
      }
    };
  }, [dom]);

  useEffect(() => {
    if (stateInstance == null) {
      return;
    }
    stateInstance.isReadOnly = disabled;
  }, [stateInstance, disabled]);

  // 非必要不要使用受控模式，editor内支持值的状态存储，如果要启用，需要考虑光标位置(目前未处理它)以及频繁set的的值产生的html整体替换的性能开销
  useEffect(() => {
    if (stateInstance == null) {
      return;
    }
    stateInstance.setData(value == null ? '' : value);
  }, [stateInstance, value]);

  return <textarea ref={setDom} className={styles.textarea} />;
}
