interface ResponseItem<T = any> {
  code: number;
  message?: string;
  data?: T;
}
