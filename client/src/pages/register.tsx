import { FormEvent } from 'react';
import { UserForm } from '../components/UserForm';
import { useRegisterMutation } from '../generated/generated-types';
import { User } from '../types';

const Register = () => {
  const [mutateFunction, { data, error, loading }] = useRegisterMutation();

  const handleSubmit = (e: FormEvent<HTMLFormElement>, user: User) => {
    e.preventDefault();
    mutateFunction({
      variables: { username: user.username, password: user.password },
    });
  };

  return (
    <UserForm handleSubmit={handleSubmit} name="Register" loading={loading} />
  );
};

export default Register;
