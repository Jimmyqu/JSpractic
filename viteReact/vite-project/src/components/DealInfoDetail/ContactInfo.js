import classNames from 'classnames';
import { formatGender, formatAge } from '@/utils/format';
import styles from './index.less';

export default function ({ selectPubStudy, list, faceFileList }) {
  const files = faceFileList || [];
  return (list || []).map(({ id, realName, mobile, sex, birthday, idcard, pubStudyId }) => {
    const file = files.find(({ linkId }) => linkId === pubStudyId);
    return (
      <div className={styles.contactWrapper} key={id}>
        {selectPubStudy && file && file.url && (
          <img className={classNames('img-max', styles.faceImg)} src={file.url} alt="face img" />
        )}
        <span>
          {realName} {mobile} {formatGender(sex)} {formatAge(birthday)} {idcard}
        </span>
      </div>
    );
  });
}
