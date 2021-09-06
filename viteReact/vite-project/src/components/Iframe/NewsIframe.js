import { baseURL } from '@/utils/utils';
import Iframe from '.';

export default function ({ title, newsId }) {
  if (!newsId) {
    return null;
  }
  return <Iframe title={title} src={`${baseURL}/commonNews/queryDetailById.shtml?newsId=${newsId}`} />;
}
