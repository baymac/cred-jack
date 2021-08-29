import React, { useEffect, useState } from 'react';
import LoginLayout from '../../layouts/LoginLayout';
import { useForm } from 'react-hook-form';
import cn from 'classnames';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import styles from './userlogin.module.css';
import ButtonLoading from '../ButtonLoading/ButtonLoading';
import sendOtp from '../../pages/api/sendOtp';

const LoginSchema = yup.object().shape({
  phone: yup
    .string()
    .required('Mobile Number is required')
    .matches(
      /^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[789]\d{9}$/,
      'Mobile can only contain digits'
    ),
  otp: yup
    .string()
    .required('Otp is required')
    .matches(/^\d{4}$/, 'Otp has 4 digits'),
});

export interface ILoginUserRequest {
  phone: string;
  otp: number;
}

export default function UserLogin() {
  const [loading, setLoading] = useState(false);

  const [otpSent, setOtpSent] = useState(false);

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
    getValues,
    setValue,
  } = useForm<ILoginUserRequest>({
    resolver: yupResolver(LoginSchema),
  });

  useEffect(() => {
    // A hack to prevent otp validation when generating otp
    if (!otpSent) {
      setValue('otp', 1234);
    } else {
      setValue('otp', null);
    }
  }, [otpSent]);

  const [token, setToken] = useState<string | null>(null);

  const onSubmit = async (data: ILoginUserRequest) => {
    setLoading(true);
    if (!otpSent) {
      const res = await fetch('/api/sendOtp', {
        method: 'POST',
        body: JSON.stringify({ phone: data.phone }),
      }).then((res) => res.json());
      setToken(res.token);
      setLoading(false);
      setOtpSent(true);
    } else {
      const res = await fetch('/api/verifyOtp', {
        method: 'POST',
        body: JSON.stringify({ otp: data.otp, token }),
      }).then((res) => res.json());
      const access_token = res.access_token;
      // A check to ensure reset was not clicked during the request being processed
      if (otpSent) {
        console.log(access_token);
      }
      setLoading(false);
      // setOtpSent(false); not req?
    }
  };

  return (
    <LoginLayout>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.input_box}>
          <input
            name="phone"
            type="text"
            placeholder="Mobile no."
            disabled={otpSent}
            {...register('phone')}
          />
          {errors.phone && (
            <p className={styles.error_message}>{errors.phone.message}</p>
          )}
        </div>
        {!otpSent && (
          <div className={cn(styles.input_box)}>Enter mobile number</div>
        )}
        <div className={cn(styles.input_box)}>
          <input
            name="otp"
            type={!otpSent ? 'hidden' : 'text'}
            placeholder="OTP"
            {...register('otp')}
          />
          {errors.otp && (
            <p className={styles.error_message}>{errors.otp.message}</p>
          )}
        </div>
        {otpSent && (
          <div className={cn(styles.input_box, styles.instructions)}>
            <p>Enter otp (for testing enter any 4 digit number)</p>
          </div>
        )}
        <div
          className={cn(styles.input_box, {
            [styles.button_disable]: loading,
          })}
        >
          <button type="submit" disabled={loading}>
            {loading ? <ButtonLoading /> : !otpSent ? 'Send Otp' : 'Login'}
          </button>
        </div>
      </form>
      {otpSent && (
        <div className={cn(styles.reset_input_box)}>
          <button
            onClick={() => {
              setLoading(false);
              setOtpSent(false);
            }}
          >
            Reset
          </button>
        </div>
      )}
    </LoginLayout>
  );
}
