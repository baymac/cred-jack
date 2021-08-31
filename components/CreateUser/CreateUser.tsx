import { yupResolver } from '@hookform/resolvers/yup';
import cn from 'classnames';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import fetchJson from '../../lib/fetchJson';
import useUser from '../../lib/useUser';
import rootStyles from '../../styles/root.module.css';
import ButtonLoading from '../ButtonLoading/ButtonLoading';
import styles from './createuser.module.css';

const CreateUserSchema = yup.object().shape({
  first_name: yup
    .string()
    .required('First Name is required')
    .matches(
      /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð]+$/,
      'First Name can only contain characters without space'
    ),
  last_name: yup
    .string()
    .required('Last Name is required')
    .matches(
      /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð]+$/,
      'Last Name can only contain characters without space'
    ),
  email: yup.string().email().required('Email is required'),
  sol_addr: yup.string().required('Solana Address is required'),
});

export interface ICreateUserRequest {
  first_name: string;
  last_name: string;
  email: string;
  sol_addr: string;
  phone: string;
}

export default function CreateUser() {
  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
  } = useForm<ICreateUserRequest>({
    resolver: yupResolver(CreateUserSchema),
  });

  const { mutateUser, user } = useUser({ redirectTo: '/login' });

  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: ICreateUserRequest) => {
    setLoading(true);
    mutateUser(
      await fetchJson('/api/createUser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          phone: data.phone,
          sol_addr: data.sol_addr,
        }),
      })
    );
  };

  useEffect(() => {
    setValue('phone', user.phone);
  }, []);

  return (
    <>
      <section
        className={cn(rootStyles.section, styles.about__section)}
        id="user-create"
      >
        <div
          className={cn(
            rootStyles.container,
            rootStyles.grid,
            styles.about__container
          )}
        >
          <div className={cn(styles.instructions)}>
            <p>Create your profile to proceed</p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className={styles.input_box}>
              <input
                name="first_name"
                type="text"
                placeholder="First Name"
                {...register('first_name')}
              />
              {errors.first_name && (
                <p className={styles.error_message}>
                  {errors.first_name.message}
                </p>
              )}
            </div>
            <div className={styles.input_box}>
              <input
                name="last_name"
                type="text"
                placeholder="Last Name"
                {...register('last_name')}
              />
              {errors.last_name && (
                <p className={styles.error_message}>
                  {errors.last_name.message}
                </p>
              )}
            </div>
            <div className={styles.input_box}>
              <input
                name="phone"
                type="text"
                placeholder="Phone"
                disabled={true}
                {...register('phone')}
              />
              {errors.phone && (
                <p className={styles.error_message}>{errors.phone.message}</p>
              )}
            </div>
            <div className={styles.input_box}>
              <input
                name="email"
                type="text"
                placeholder="Email"
                {...register('email')}
              />
              {errors.email && (
                <p className={styles.error_message}>{errors.email.message}</p>
              )}
            </div>
            <div className={styles.input_box}>
              <input
                name="sol_addr"
                type="text"
                placeholder="Solana Address"
                {...register('sol_addr')}
              />
              {errors.sol_addr && (
                <p className={styles.error_message}>
                  {errors.sol_addr.message}
                </p>
              )}
            </div>

            <div
              className={cn(styles.input_box, {
                [styles.button_disable]: loading,
              })}
            >
              <button type="submit" disabled={loading}>
                {loading ? <ButtonLoading /> : 'Create Profile'}
              </button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}
