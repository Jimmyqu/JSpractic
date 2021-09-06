import { isAndorid } from './utils';
import { CommonFileLinkTypes } from './models/commonfile';

export { CommonFileLinkTypes };

export const FileType = {
  IMG: 1,
  DOC: 2,
  AUDIO: 3,
};

export const OpenXMLExcelAccept = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

export const FileAccept = {
  INVOICE: ['image/*', '.pdf', 'application/pdf'].join(', '),
  IMG: 'image/*',
  XLS: '.xls, .xlsx',
  AUDIO: 'audio/*',
  VIDEO: 'video/*',
  DOC: isAndorid()
    ? null
    : [
        '.doc',
        '.docx',
        '.ppt',
        '.pptx',
        '.xls',
        '.xlsx',
        '.pdf',
        'application/vnd.ms-excel',
        'application/msword',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        OpenXMLExcelAccept,
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'application/pdf',
      ].join(', '),
};
