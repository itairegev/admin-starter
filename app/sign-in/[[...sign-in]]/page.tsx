import { SignIn } from '@clerk/nextjs';
import styles from '../../auth.module.css';

export default function SignInPage() {
  return (
    <div className={styles.authPage}>
      <SignIn
        appearance={{
          variables: {
            colorPrimary: '#4d6cf5',
            borderRadius: '8px',
          },
          elements: {
            card: { boxShadow: '0 10px 15px -3px rgba(19, 19, 19, 0.06), 0 4px 6px -4px rgba(19, 19, 19, 0.04)' },
          },
        }}
      />
    </div>
  );
}
