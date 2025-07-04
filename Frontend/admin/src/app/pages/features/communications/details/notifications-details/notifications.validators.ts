export const ValidationMessages = {
  title: {
    required: 'Header is required'
  },
  body: {
    required: 'Body is required'
  },
};
export let FormErrors = {
  title: '',
  body: ''
};

export interface Notify {
  title: string;
  body: string;
}
