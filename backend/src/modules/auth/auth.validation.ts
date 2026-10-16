import * as yup from 'yup';

export const loginSchema = yup.object({
  identifier: yup.string().required('Email or username is required').trim(),
  password: yup.string().required('Password is required').min(6, 'Password must be at least 6 characters'),
});
