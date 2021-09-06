export default class ExportCancelError extends Error {
  constructor(message = 'Export has been canceled') {
    super(message);
    this.name = 'ExportCancel';
  }
}
